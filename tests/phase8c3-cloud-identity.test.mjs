import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {readFile,readdir} from "node:fs/promises";
import {getPlatformProxy} from "wrangler";
import {createCloudIdentity} from "../workers/identity/src/auth.ts";
import {resolveWorkerIdentityConfig} from "../workers/identity/src/gate.ts";
import {handleIdentityRequest} from "../workers/identity/src/index.ts";

/** LOCAL ONLY: emulated Cloudflare D1; no Cloudflare account, network mail or paid service. */
const ORIGIN="http://127.0.0.1:8799";
const freshSecret=()=>randomBytes(32).toString("base64url");
const fakeOAuth={clientId:"local-oauth-client",clientSecret:"local-oauth-secret"};
function enabledEnv(db,secret){
 return {
  ATHENA_IDENTITY_DB:db,ATHENA_CLOUD_IDENTITY_ENABLED:"true",
  ATHENA_AUTH_ORIGIN:ORIGIN,ATHENA_CLOUD_LOCAL_DEV:"true",
  BETTER_AUTH_SECRET:secret,
  ATHENA_GOOGLE_OAUTH_CLIENT_ID:fakeOAuth.clientId,
  ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:fakeOAuth.clientSecret
 };
}
async function isolatedDatabase(t){
 const proxy=await getPlatformProxy({
  configPath:"workers/identity/wrangler.toml",
  remoteBindings:false,persist:false
 });
 t.after(async()=>{await proxy.dispose();});
 const db=proxy.env.ATHENA_IDENTITY_DB;
 assert.ok(db);
 const migrationDir=new URL("../workers/identity/migrations/",import.meta.url);
 const sqlFiles=(await readdir(migrationDir)).filter(name=>/^\d+_[\w-]+\.sql$/.test(name));
 assert.equal(sqlFiles.length,1,"One baseline D1 schema migration is expected");
 const script=await readFile(new URL(sqlFiles[0],migrationDir),"utf8");
 for(const statement of script.split("--> statement-breakpoint").map(s=>s.trim()).filter(Boolean)){
  await db.prepare(statement).run();
 }
 return db;
}
test("Cloud gate rejects disabled, missing DB, weak secrets, remote-origin spoof and invalid OAuth",async()=>{
 const db={prepare:()=>{}};
 const base=enabledEnv(db,freshSecret());
 assert.ok(resolveWorkerIdentityConfig(base,ORIGIN+"/api/identity/get-session"));
 for(const props of [
  {ATHENA_CLOUD_IDENTITY_ENABLED:"false"},
  {ATHENA_IDENTITY_DB:undefined},
  {BETTER_AUTH_SECRET:"weak"},
  {ATHENA_AUTH_ORIGIN:""},
  {ATHENA_AUTH_ORIGIN:"https://example.com"},
  {ATHENA_CLOUD_LOCAL_DEV:"false"},
  {ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:""},
  {ATHENA_GOOGLE_OAUTH_CLIENT_ID:"",ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:""},
  {ATHENA_GMAIL_SENDER_ENABLED:"true",ATHENA_GMAIL_REFRESH_TOKEN:""},
  {ATHENA_AUTH_ORIGIN:"http://evil.example"}
 ]){
  assert.equal(resolveWorkerIdentityConfig({...base,...props},ORIGIN+"/api/identity/get-session"),null,JSON.stringify(props));
 }
 assert.equal(resolveWorkerIdentityConfig(base,"http://127.0.0.1:10000/api/identity/get-session"),null);
 assert.equal(resolveWorkerIdentityConfig(base,"https://evil.example/api/identity/get-session"),null);
});
test("Wrangler D1 migration contains all Auth + workspace tables and enforces role integrity",async t=>{
 const db=await isolatedDatabase(t);
 const rows=await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
 const names=new Set(rows.results.map(row=>row.name));
 for(const item of ["user","session","account","verification","rateLimit","athena_workspace","athena_membership"])assert.ok(names.has(item),item);
 const stamp=Date.now();
 await db.prepare('INSERT INTO "user" ("id","name","email","emailVerified","createdAt","updatedAt") VALUES (?,?,?,?,?,?)')
  .bind("u-a","Client A","client-a@local.test",1,stamp,stamp).run();
 await db.prepare('INSERT INTO "user" ("id","name","email","emailVerified","createdAt","updatedAt") VALUES (?,?,?,?,?,?)')
  .bind("u-b","Client B","client-b@local.test",1,stamp,stamp).run();
 for(const [id,title] of [["w-a","Tenant A"],["w-b","Tenant B"]]){
  await db.prepare('INSERT INTO "athena_workspace" ("id","title","kind","createdAt") VALUES (?,?,?,?)').bind(id,title,"client",stamp).run();
 }
 for(const [id,work,user] of [["m-a","w-a","u-a"],["m-b","w-b","u-b"]]){
  await db.prepare('INSERT INTO "athena_membership" ("id","workspaceId","userId","role","createdAt") VALUES (?,?,?,?,?)')
   .bind(id,work,user,"client",stamp).run();
 }
 const scoped=async user=>(await db.prepare(
  'SELECT w.id FROM "athena_membership" m JOIN "athena_workspace" w ON m.workspaceId=w.id WHERE m.userId=?'
 ).bind(user).all()).results.map(row=>row.id);
 assert.deepEqual(await scoped("u-a"),["w-a"]);
 assert.deepEqual(await scoped("u-b"),["w-b"]);
 await assert.rejects(db.prepare(
  'INSERT INTO "athena_membership" ("id","workspaceId","userId","role","createdAt") VALUES (?,?,?,?,?)'
 ).bind("m-fake","w-a","u-a","admin",stamp).run());
 await assert.rejects(db.prepare(
  'INSERT INTO "athena_membership" ("id","workspaceId","userId","role","createdAt") VALUES (?,?,?,?,?)'
 ).bind("m-invalid","w-a","u-b","superuser",stamp).run());
 await assert.rejects(db.prepare(
  'INSERT INTO "athena_workspace" ("id","title","kind","createdAt") VALUES (?,?,?,?)'
 ).bind("w-invalid","Unknown","operator",stamp).run());
});
test("Independent Better Auth on REAL emulated D1 stores hashed OTP, verifies it, and refuses replay",async t=>{
 const db=await isolatedDatabase(t);
 const secret=freshSecret(),config=resolveWorkerIdentityConfig(enabledEnv(db,secret),ORIGIN+"/api/identity/get-session");
 assert.ok(config);
 const outgoing=[];
 const {auth}=createCloudIdentity(config,{async send(email,otp,type){outgoing.push({email,otp,type});}});
 const email="cloud-otp@local.test";
 assert.deepEqual(await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}}),{success:true});
 assert.equal(outgoing.length,1);
 assert.equal(outgoing[0].email,email);
 assert.match(outgoing[0].otp,/^\d{6}$/);
 const stored=(await db.prepare('SELECT value FROM "verification"').all()).results;
 assert.ok(stored.length>0);
 assert.ok(stored.every(r=>!r.value.includes(outgoing[0].otp)));
 const wrong=outgoing[0].otp==="000000"?"111111":"000000";
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:wrong}}));
 const result=await auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}});
 assert.ok(result.token);
 assert.equal(result.user.email,email);
 assert.equal(result.user.emailVerified,true);
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}}));
 const users=await db.prepare('SELECT id FROM "user" WHERE email=?').bind(email).all();
 assert.equal(users.results.length,1);
 const sessions=await db.prepare('SELECT id FROM "session" WHERE userId=?').bind(result.user.id).all();
 assert.equal(sessions.results.length,1);
});
test("Disabled Worker endpoints, cross-origin POSTs and unknown routes fail closed",async t=>{
 const db=await isolatedDatabase(t);
 const secret=freshSecret();
 const env=enabledEnv(db,secret);
 const blocked=await handleIdentityRequest(new Request(ORIGIN+"/api/identity/get-session"),{...env,ATHENA_CLOUD_IDENTITY_ENABLED:"false"});
 assert.equal(blocked.status,503);
 const data=await blocked.json();
 assert.equal(data.ok,false);
 assert.ok(!JSON.stringify(data).includes(secret));
 const unknown=await handleIdentityRequest(new Request(ORIGIN+"/debug/secrets"),env);
 assert.equal(unknown.status,404);
 const cross=await handleIdentityRequest(new Request(ORIGIN+"/api/identity/sign-in/social",{
  method:"POST",headers:{origin:"https://attacker.example","content-type":"application/json"},
  body:JSON.stringify({provider:"google"})
 }),env);
 assert.equal(cross.status,403);
 const unauth=await handleIdentityRequest(new Request(ORIGIN+"/api/workspaces"),env);
 assert.equal(unauth.status,401);
});


test("Real D1 sessions enforce workspace isolation at Athena Worker API (A/B tenants)",async t=>{
 const db=await isolatedDatabase(t);
 const secret=freshSecret(), env=enabledEnv(db,secret);
 const config=resolveWorkerIdentityConfig(env,ORIGIN+"/api/identity/get-session");
 assert.ok(config);
 const outgoing=[];
 const {auth}=createCloudIdentity(config,{async send(email,otp,type){outgoing.push({email,otp,type});}});
 async function signIn(email){
  await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}});
  const code=outgoing.findLast(x=>x.email===email)?.otp;
  assert.match(code,/^\d{6}$/);
  const response=await auth.handler(new Request(ORIGIN+"/api/identity/sign-in/email-otp",{
   method:"POST",headers:{"content-type":"application/json","origin":ORIGIN,"cf-connecting-ip":"198.51.100.20"},
   body:JSON.stringify({email,otp:code})
  }));
  assert.equal(response.status,200);
  const cookies=response.headers.get("set-cookie");
  assert.ok(cookies);
  const cookie=cookies.split(";")[0];
  assert.match(cookie,/session_token/);
  const identity=await db.prepare('SELECT id FROM "user" WHERE email=?').bind(email).first();
  assert.ok(identity?.id);
  return {cookie,userId:identity.id};
 }
 const alice=await signIn("client-a@local.test");
 const bob=await signIn("client-b@local.test");
 assert.notEqual(alice.userId,bob.userId);
 const stamp=Date.now();
 for(const [id,title] of [["workspace-a","Tenant A"],["workspace-b","Tenant B"]]){
  await db.prepare('INSERT INTO "athena_workspace" ("id","title","kind","createdAt") VALUES (?,?,?,?)')
   .bind(id,title,"client",stamp).run();
 }
 for(const [id,workspaceId,person] of [["membership-a","workspace-a",alice],["membership-b","workspace-b",bob]]){
  await db.prepare('INSERT INTO "athena_membership" ("id","workspaceId","userId","role","createdAt") VALUES (?,?,?,?,?)')
   .bind(id,workspaceId,person.userId,"client",stamp).run();
 }
 async function list(cookie){
  const response=await handleIdentityRequest(new Request(ORIGIN+"/api/workspaces",{
   headers:{"cookie":cookie}
  }),env);
  return {status:response.status,body:await response.json()};
 }
 const a=await list(alice.cookie),b=await list(bob.cookie);
 assert.equal(a.status,200);
 assert.equal(b.status,200);
 assert.deepEqual(a.body.workspaces.map(item=>item.workspaceId),["workspace-a"]);
 assert.deepEqual(b.body.workspaces.map(item=>item.workspaceId),["workspace-b"]);
 assert.ok(a.body.workspaces.every(item=>item.role==="client"));
 assert.ok(b.body.workspaces.every(item=>item.role==="client"));
 assert.equal((await list("better-auth.session_token=forged")).status,401);
 const forbiddenPost=await handleIdentityRequest(new Request(ORIGIN+"/api/workspaces",{
  method:"POST",headers:{"origin":ORIGIN,"content-type":"application/json"},body:"{}"
 }),env);
 assert.equal(forbiddenPost.status,405);
 // Revoking an account's verification must not leave its old browser session privileged.
 await db.prepare('UPDATE "user" SET "emailVerified"=0 WHERE id=?').bind(alice.userId).run();
 assert.equal((await list(alice.cookie)).status,401);
 assert.equal((await list(bob.cookie)).status,200);
});


test("Cloud Worker default configuration cannot expose a live identity endpoint",async()=>{
 const config=await readFile(new URL("../workers/identity/wrangler.toml",import.meta.url),"utf8");
 assert.match(config,/workers_dev\s*=\s*false/);
 assert.match(config,/ATHENA_CLOUD_IDENTITY_ENABLED\s*=\s*"false"/);
 assert.match(config,/ATHENA_AUTH_ORIGIN\s*=\s*""/);
 assert.match(config,/database_id\s*=\s*"00000000-0000-0000-0000-000000000000"/);
 assert.doesNotMatch(config,/BETTER_AUTH_SECRET\s*=/);
 assert.doesNotMatch(config,/routes?\s*=/);
});
test("Worker refuses oversized bodies and unsafe methods before any authentication dispatch",async t=>{
 const db=await isolatedDatabase(t);
 const env=enabledEnv(db,freshSecret());
 const oversized=await handleIdentityRequest(new Request(ORIGIN+"/api/identity/sign-in/social",{
  method:"POST",headers:{"origin":ORIGIN,"content-type":"application/json"},
  body:JSON.stringify({email:"x".repeat(17000)})
 }),env);
 assert.equal(oversized.status,413);
 const missingOrigin=await handleIdentityRequest(new Request(ORIGIN+"/api/identity/sign-in/social",{
  method:"POST",headers:{"content-type":"application/json"},body:"{}"
 }),env);
 assert.equal(missingOrigin.status,403);
 const rejected=await handleIdentityRequest(new Request(ORIGIN+"/api/identity/get-session",{
  method:"DELETE"
 }),env);
 assert.equal(rejected.status,405);
});
