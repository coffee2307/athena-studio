/** Cloudflare Worker identity activation: fail-closed, per-deployment and per-origin. */
import type {D1Database} from "@cloudflare/workers-types";

export type AthenaWorkerEnv={
 ATHENA_IDENTITY_DB?:D1Database;
 ATHENA_CLOUD_IDENTITY_ENABLED?:string;
 ATHENA_AUTH_ORIGIN?:string;
 ATHENA_CLOUD_LOCAL_DEV?:string;
 BETTER_AUTH_SECRET?:string;
 ATHENA_GOOGLE_OAUTH_CLIENT_ID?:string;
 ATHENA_GOOGLE_OAUTH_CLIENT_SECRET?:string;
 ATHENA_GITHUB_OAUTH_CLIENT_ID?:string;
 ATHENA_GITHUB_OAUTH_CLIENT_SECRET?:string;
 ATHENA_GMAIL_SENDER_ENABLED?:string;
 ATHENA_GMAIL_SENDER?:string;
 ATHENA_GMAIL_CLIENT_ID?:string;
 ATHENA_GMAIL_CLIENT_SECRET?:string;
 ATHENA_GMAIL_REFRESH_TOKEN?:string;
};
type OAuthPair={clientId:string;clientSecret:string};
export type WorkerIdentityConfig={
 origin:string;secret:string;db:D1Database;
 google?:OAuthPair;github?:OAuthPair;
 gmail?:{sender:string;clientId:string;clientSecret:string;refreshToken:string};
};
function oauth(id:string|undefined,secret:string|undefined):OAuthPair|undefined|null{
 if(!id&&!secret)return undefined;
 if(!id||!secret||id.length<6||secret.length<8)return null;
 return {clientId:id,clientSecret:secret};
}
export function resolveWorkerIdentityConfig(env:AthenaWorkerEnv,requestURL:string):WorkerIdentityConfig|null{
 if(env.ATHENA_CLOUD_IDENTITY_ENABLED!=="true"||!env.ATHENA_IDENTITY_DB)return null;
 const origin=env.ATHENA_AUTH_ORIGIN||"",secret=env.BETTER_AUTH_SECRET||"";
 if(secret.length<32||secret.length>512)return null;
 let requested:URL,url:URL;
 try{url=new URL(origin);requested=new URL(requestURL);}catch{return null;}
 if(url.origin!==origin||url.username||url.password||url.pathname!=="/"||url.search||url.hash||
  requested.origin!==origin)return null;
 const local=env.ATHENA_CLOUD_LOCAL_DEV==="true"&&
  ["localhost","127.0.0.1"].includes(url.hostname)&&url.protocol==="http:";
 if(url.protocol!=="https:"&&!local)return null;
 // Worker must never trust a wildcard OAuth origin.
 const google=oauth(env.ATHENA_GOOGLE_OAUTH_CLIENT_ID,env.ATHENA_GOOGLE_OAUTH_CLIENT_SECRET);
 const github=oauth(env.ATHENA_GITHUB_OAUTH_CLIENT_ID,env.ATHENA_GITHUB_OAUTH_CLIENT_SECRET);
 if(google===null||github===null)return null;
 let gmail:WorkerIdentityConfig["gmail"];
 if(env.ATHENA_GMAIL_SENDER_ENABLED==="true"){
  const sender=env.ATHENA_GMAIL_SENDER||"";
  const clientId=env.ATHENA_GMAIL_CLIENT_ID||"";
  const clientSecret=env.ATHENA_GMAIL_CLIENT_SECRET||"";
  const refreshToken=env.ATHENA_GMAIL_REFRESH_TOKEN||"";
  if(!/^[^\s@<>]+@[^\s@<>]+\.[a-zA-Z]{2,}$/.test(sender)||
   sender.length>254||!clientId||!clientSecret||!refreshToken)return null;
  gmail={sender,clientId,clientSecret,refreshToken};
 }
 if(!google&&!github&&!gmail)return null;
 return {origin,secret,db:env.ATHENA_IDENTITY_DB,
  ...(google?{google}:{}),...(github?{github}:{}),...(gmail?{gmail}:{})};
}
