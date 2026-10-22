import "server-only";
import {createHmac,createSign,randomBytes,randomUUID,timingSafeEqual} from "node:crypto";
import {DatabaseSync} from "node:sqlite";
import path from "node:path";
import {standaloneAuth} from "@/lib/identity/server";
import {standaloneIdentityConfig} from "@/lib/identity/gate";

export type GitHubRepository={id:number;name:string;fullName:string;private:boolean;defaultBranch:string;description:string|null;updatedAt:string|null;size:number;shared:boolean};
type AppConfig={id:string;slug:string;privateKey:string};
type Identity=NonNullable<ReturnType<typeof standaloneIdentityConfig>>;
type User={id:string;email:string;name:string};
type Installation={userId:string;installationId:string;accountLogin:string;accountType:string};
const INSTALL_COOKIE="athena_github_install_state";
const API="https://api.github.com";
const MAX_ARCHIVE_BYTES=50*1024*1024;

export function githubAppConfig():AppConfig|null{
 const id=process.env.ATHENA_GITHUB_APP_ID||"";
 const slug=process.env.ATHENA_GITHUB_APP_SLUG||"";
 const privateKey=(process.env.ATHENA_GITHUB_APP_PRIVATE_KEY||"").replace(/\\n/g,"\n");
 if(!/^[0-9]{1,20}$/.test(id)||!/^[a-z0-9-]{2,100}$/i.test(slug)||!privateKey.includes("BEGIN"))return null;
 return {id,slug,privateKey};
}
export function githubInstallCookieName(){return INSTALL_COOKIE;}
export function createGitHubInstallState(userId:string,secret:string,now=Date.now()){
 const state=randomBytes(24).toString("base64url");
 const payload=Buffer.from(JSON.stringify({userId,state,createdAt:now})).toString("base64url");
 const signature=createHmac("sha256",secret).update(payload).digest("base64url");
 return {state,cookie:payload+"."+signature};
}
export function verifyGitHubInstallState(cookie:string|undefined,state:string|undefined,secret:string,now=Date.now()){
 if(!cookie||!state)return null;
 const parts=cookie.split(".");
 if(parts.length!==2)return null;
 const expected=createHmac("sha256",secret).update(parts[0]).digest();
 let actual:Buffer;
 try{actual=Buffer.from(parts[1],"base64url");}catch{return null;}
 if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
 try{
  const value=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8")) as {userId?:string;state?:string;createdAt?:number};
  if(typeof value.userId!=="string"||value.state!==state||typeof value.createdAt!=="number")return null;
  if(now-value.createdAt>10*60*1000||value.createdAt>now+30*1000)return null;
  return {userId:value.userId};
 }catch{return null;}
}
export async function githubSession(headers:Headers):Promise<{identity:Identity;user:User}|null>{
 const identity=standaloneIdentityConfig();
 const auth=standaloneAuth();
 if(!identity||!auth)return null;
 const session=await auth.api.getSession({headers});
 if(!session?.user)return null;
 return {identity,user:{id:session.user.id,email:session.user.email,name:session.user.name}};
}
function database(identity:Identity){
 const db=new DatabaseSync(path.resolve(process.cwd(),identity.databaseFile));
 db.exec("PRAGMA foreign_keys=ON;");
 db.exec("CREATE TABLE IF NOT EXISTS athena_github_installations (user_id TEXT PRIMARY KEY, installation_id TEXT NOT NULL UNIQUE, account_login TEXT NOT NULL, account_type TEXT NOT NULL, permissions_json TEXT NOT NULL, connected_at INTEGER NOT NULL);");
 db.exec("CREATE TABLE IF NOT EXISTS athena_github_shares (share_id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES athena_github_installations(user_id) ON DELETE CASCADE, repository_id INTEGER NOT NULL, full_name TEXT NOT NULL, private INTEGER NOT NULL CHECK(private IN (0,1)), default_branch TEXT NOT NULL, repository_size_kb INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, UNIQUE(user_id,repository_id));");
 return db;
}
function appJwt(config:AppConfig){
 const now=Math.floor(Date.now()/1000);
 const header=Buffer.from(JSON.stringify({alg:"RS256",typ:"JWT"})).toString("base64url");
 const payload=Buffer.from(JSON.stringify({iat:now-30,exp:now+8*60,iss:config.id})).toString("base64url");
 const message=header+"."+payload;
 const signer=createSign("RSA-SHA256");
 signer.update(message);signer.end();
 return message+"."+signer.sign(config.privateKey).toString("base64url");
}
async function appRequest(config:AppConfig,pathName:string,method="GET",body?:unknown){
 const response=await fetch(API+pathName,{method,headers:{"accept":"application/vnd.github+json","authorization":"Bearer "+appJwt(config),"x-github-api-version":"2022-11-28",...(body?{"content-type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});
 if(!response.ok)throw new Error("GitHub App request failed");
 return response.json() as Promise<Record<string,unknown>>;
}
async function installationToken(config:AppConfig,installationId:string){
 const result=await appRequest(config,"/app/installations/"+encodeURIComponent(installationId)+"/access_tokens","POST",{});
 if(typeof result.token!=="string"||!result.token)throw new Error("GitHub installation token unavailable");
 return result.token as string;
}
async function installationRequest(token:string,pathName:string){
 const response=await fetch(API+pathName,{headers:{"accept":"application/vnd.github+json","authorization":"Bearer "+token,"x-github-api-version":"2022-11-28"}});
 if(!response.ok)throw new Error("GitHub repository request failed");
 return response.json() as Promise<Record<string,unknown>>;
}
function findInstallation(identity:Identity,userId:string):Installation|null{
 const db=database(identity);
 try{
  const row=db.prepare("SELECT user_id,installation_id,account_login,account_type FROM athena_github_installations WHERE user_id=?").get(userId) as {user_id:string;installation_id:string;account_login:string;account_type:string}|undefined;
  return row?{userId:row.user_id,installationId:row.installation_id,accountLogin:row.account_login,accountType:row.account_type}:null;
 }finally{db.close();}
}
function persistInstallation(identity:Identity,userId:string,installationId:string,accountLogin:string,accountType:string,permissions:unknown){
 const db=database(identity);const now=Date.now();
 try{
  db.prepare("INSERT INTO athena_github_installations(user_id,installation_id,account_login,account_type,permissions_json,connected_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET installation_id=excluded.installation_id,account_login=excluded.account_login,account_type=excluded.account_type,permissions_json=excluded.permissions_json,connected_at=excluded.connected_at").run(userId,installationId,accountLogin,accountType,JSON.stringify(permissions||{}),now);
 }finally{db.close();}
}
function storedShares(identity:Identity,userId:string){
 const db=database(identity);
 try{
  const rows=db.prepare("SELECT repository_id FROM athena_github_shares WHERE user_id=?").all(userId) as {repository_id:number}[];
  return new Set(rows.map(row=>Number(row.repository_id)));
 }finally{db.close();}
}
async function repositoriesForInstallation(installationId:string){
 const config=githubAppConfig();if(!config)throw new Error("GitHub App is not configured");
 const token=await installationToken(config,installationId);
 const output:GitHubRepository[]=[];
 for(let page=1;page<=10;page++){
  const result=await installationRequest(token,"/installation/repositories?per_page=100&page="+page);
  const rows=Array.isArray(result.repositories)?result.repositories:[];
  for(const repo of rows){
   if(!Number.isSafeInteger(repo.id)||typeof repo.full_name!=="string")continue;
   output.push({id:repo.id,name:String(repo.name||""),fullName:repo.full_name,private:repo.private===true,defaultBranch:String(repo.default_branch||""),description:typeof repo.description==="string"?repo.description:null,updatedAt:typeof repo.updated_at==="string"?repo.updated_at:null,size:Number.isFinite(repo.size)?repo.size:0,shared:false});
  }
  if(rows.length<100)break;
 }
 return output;
}
export async function listUserRepositories(identity:Identity,userId:string){
 const installation=findInstallation(identity,userId);
 if(!installation)return {connected:false as const,accountLogin:null,repositories:[] as GitHubRepository[]};
 const shared=storedShares(identity,userId);
 const repositories=await repositoriesForInstallation(installation.installationId);
 for(const repository of repositories)repository.shared=shared.has(repository.id);
 return {connected:true as const,accountLogin:installation.accountLogin,accountType:installation.accountType,repositories};
}
export async function connectGitHubInstallation(identity:Identity,userId:string,installationId:string){
 const config=githubAppConfig();if(!config)throw new Error("GitHub App is not configured");
 if(!/^[0-9]{1,20}$/.test(installationId))throw new Error("Invalid GitHub installation");
 const result=await appRequest(config,"/app/installations/"+encodeURIComponent(installationId));
 const account=result.account as {login?:string;type?:string}|undefined;
 if(typeof account?.login!=="string"||!account.login)throw new Error("GitHub installation account unavailable");
 const permissions=(result.permissions||{}) as Record<string,unknown>;
 if(permissions.metadata!=="read"||permissions.contents!=="read")throw new Error("GitHub App must have read-only Metadata and Contents permissions");
 persistInstallation(identity,userId,installationId,account.login,typeof account.type==="string"?account.type:"User",permissions);
}
export async function shareGitHubRepository(identity:Identity,userId:string,repositoryId:number){
 if(!Number.isSafeInteger(repositoryId)||repositoryId<1)throw new Error("Invalid repository");
 const installation=findInstallation(identity,userId);
 if(!installation)throw new Error("GitHub is not connected");
 const repositories=await repositoriesForInstallation(installation.installationId);
 const repository=repositories.find(item=>item.id===repositoryId);
 if(!repository)throw new Error("Repository is not available to this installation");
 if(repository.size>51200)throw new Error("Repository vượt giới hạn 50 MB cho bản chia sẻ hiện tại.");
 const db=database(identity);
 try{
  db.prepare("INSERT OR IGNORE INTO athena_github_shares(share_id,user_id,repository_id,full_name,private,default_branch,repository_size_kb,created_at) VALUES(?,?,?,?,?,?,?,?)").run(randomUUID(),userId,repository.id,repository.fullName,repository.private?1:0,repository.defaultBranch,repository.size,Date.now());
 }finally{db.close();}
}
export function revokeGitHubRepository(identity:Identity,userId:string,repositoryId:number){
 const db=database(identity);
 try{db.prepare("DELETE FROM athena_github_shares WHERE user_id=? AND repository_id=?").run(userId,repositoryId);}finally{db.close();}
}
export function disconnectGitHubInstallation(identity:Identity,userId:string){
 const db=database(identity);try{db.prepare("DELETE FROM athena_github_installations WHERE user_id=?").run(userId);}finally{db.close();}
}
export function isGitHubShareAdmin(email:string){
 const allowlist=(process.env.ATHENA_GITHUB_SHARE_ADMIN_EMAILS||"").split(",").map(item=>item.trim().toLowerCase()).filter(Boolean);
 return allowlist.includes(email.toLowerCase());
}
export function listGitHubShares(identity:Identity){
 const db=database(identity);
 try{return db.prepare("SELECT s.share_id,s.user_id,u.email,s.full_name,s.private,s.default_branch,s.repository_size_kb,s.created_at,i.installation_id FROM athena_github_shares s JOIN user u ON u.id=s.user_id JOIN athena_github_installations i ON i.user_id=s.user_id ORDER BY s.created_at DESC").all() as {share_id:string;user_id:string;email:string;full_name:string;private:number;default_branch:string;repository_size_kb:number;created_at:number;installation_id:string}[];}finally{db.close();}
}
export function getGitHubShare(identity:Identity,shareId:string){
 const db=database(identity);
 try{return db.prepare("SELECT s.share_id,s.user_id,s.full_name,s.private,s.default_branch,s.repository_size_kb,s.created_at,i.installation_id FROM athena_github_shares s JOIN athena_github_installations i ON i.user_id=s.user_id WHERE s.share_id=?").get(shareId) as {share_id:string;user_id:string;full_name:string;private:number;default_branch:string;repository_size_kb:number;created_at:number;installation_id:string}|undefined;}finally{db.close();}
}
export async function downloadSharedRepositoryArchive(identity:Identity,shareId:string){
 const config=githubAppConfig();if(!config)throw new Error("GitHub App is not configured");
 const share=getGitHubShare(identity,shareId);if(!share)throw new Error("Shared repository not found");
 if(share.repository_size_kb>51200)throw new Error("Repository exceeds the archive size policy");
 const parts=share.full_name.split("/");
 if(parts.length!==2||parts.some(part=>!/^[A-Za-z0-9_.-]+$/.test(part)))throw new Error("Invalid repository record");
 const token=await installationToken(config,share.installation_id);
 const url=API+"/repos/"+encodeURIComponent(parts[0])+"/"+encodeURIComponent(parts[1])+"/tarball/"+encodeURIComponent(share.default_branch);
 const response=await fetch(url,{headers:{"accept":"application/vnd.github+json","authorization":"Bearer "+token,"x-github-api-version":"2022-11-28"},redirect:"follow"});
 if(!response.ok||!response.body)throw new Error("Repository archive is unavailable");
 const length=Number(response.headers.get("content-length")||0);
 if(length>MAX_ARCHIVE_BYTES)throw new Error("Repository archive exceeds the 50 MB limit");
 let received=0;
 const body=response.body.pipeThrough(new TransformStream<Uint8Array,Uint8Array>({transform(chunk,controller){received+=chunk.byteLength;if(received>MAX_ARCHIVE_BYTES){controller.error(new Error("Repository archive exceeds the 50 MB limit"));return;}controller.enqueue(chunk);}}));
 return {response:{body},filename:parts[1]+"-shared.tar.gz"};
}
