import "server-only";
import {readFileSync} from "node:fs";
import {Pool} from "pg";
import {createVpsIdentityAuth} from "./factory.ts";
import {parseVpsIdentityConfig} from "./config.ts";
import {gmailOtpTransport} from "../gmail-core.ts";
import {smtpOtpTransport} from "../smtp-core.ts";
import {resilientOtpTransport} from "../mail-resilience.ts";

function secret(file:string,minLength=16):string|null{
 try{
  const value=readFileSync(file,"utf8").trimEnd();
  if(value.length<minLength||value.length>4096||/[\u0000-\u001f\u007f]/.test(value))return null;
  return value;
 }catch{return null;}
}
type ActiveVpsAuth={
 auth:ReturnType<typeof createVpsIdentityAuth>;
 pool:Pool;
};
let singleton:ActiveVpsAuth|null=null;

/**
 * Runs in the existing Next.js Node process. No separate identity microservice,
 * hosted Auth subscription, Redis, or long-running laptop is necessary.
 */
export function activeVpsAuth():ActiveVpsAuth|null{
 const config=parseVpsIdentityConfig();
 if(!config)return null;
 if(singleton)return singleton;
 const authSecret=secret(config.authSecretFile,32);
 const pgPassword=secret(config.database.passwordFile,20);
 if(!authSecret||!pgPassword)return null;
 const google=config.google?secret(config.google.clientSecretFile):null;
 const github=config.github?secret(config.github.clientSecretFile):null;
 const mailSecret=config.gmail?secret(config.gmail.clientSecretFile):null;
 const mailRefresh=config.gmail?secret(config.gmail.refreshTokenFile):null;
 const smtpPassword=config.smtp?secret(config.smtp.passwordFile):null;
 if((config.google&&!google)||(config.github&&!github)||
   (config.gmail&&(!mailSecret||!mailRefresh))||
   (config.smtp&&!smtpPassword))return null;
 const pool=new Pool({
  host:config.database.host,
  port:config.database.port,
  database:config.database.name,
  user:config.database.user,
  password:pgPassword,
  max:5,
  idleTimeoutMillis:15_000,
  connectionTimeoutMillis:2_000,
  // A missing index or runaway query cannot monopolize a tiny VPS.
  statement_timeout:5_000,
  query_timeout:6_000,
  application_name:"athena-identity"
 });
 const gmail=config.gmail&&mailSecret&&mailRefresh?
  gmailOtpTransport({
   sender:config.gmail.sender,
   clientId:config.gmail.clientId,
   clientSecret:mailSecret,
   refreshToken:mailRefresh
  }):undefined;
 const smtp=config.smtp&&smtpPassword?smtpOtpTransport({
  host:config.smtp.host,port:config.smtp.port,sender:config.smtp.sender,
  username:config.smtp.username,password:smtpPassword
 }):undefined;
 const mail=(gmail||smtp)?resilientOtpTransport(gmail,smtp):undefined;
 const auth=createVpsIdentityAuth({
  origin:config.origin,secret:authSecret,pool,
  ...(config.google&&google?{google:{clientId:config.google.clientId,clientSecret:google}}:{}),
  ...(config.github&&github?{github:{clientId:config.github.clientId,clientSecret:github}}:{}),
  ...(mail?{mail}:{})
 });
 singleton={pool,auth};
 return singleton;
}
