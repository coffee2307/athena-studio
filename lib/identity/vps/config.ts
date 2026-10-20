/**
 * Phase 8C.4: provider-neutral, fail-closed VPS identity configuration.
 * This module never reads files or touches the network, so it can be audited offline.
 */
export type VpsOAuth={clientId:string;clientSecretFile:string};
export type VpsIdentityConfig={
 origin:string;
 database:{host:string;port:number;name:string;user:string;passwordFile:string};
 authSecretFile:string;
 google?:VpsOAuth;
 github?:VpsOAuth;
 gmail?:{
  sender:string;clientId:string;clientSecretFile:string;refreshTokenFile:string;
 };
};
const AUTH_SECRET="/run/secrets/athena_auth_secret";
const PG_SECRET="/run/secrets/athena_pg_password";
const SECRET_FILES={
 google:"/run/secrets/athena_google_secret",
 github:"/run/secrets/athena_github_secret",
 gmailClient:"/run/secrets/athena_gmail_secret",
 gmailRefresh:"/run/secrets/athena_gmail_refresh"
} as const;
function pair(env:NodeJS.ProcessEnv,which:"GOOGLE"|"GITHUB",path:string):VpsOAuth|null|undefined{
 const id=env["ATHENA_"+which+"_OAUTH_CLIENT_ID"]||"";
 const file=env["ATHENA_"+which+"_OAUTH_CLIENT_SECRET_FILE"]||"";
 if(!id&&!file)return undefined;
 if(id.length<6||id.length>250||file!==path)return null;
 return {clientId:id,clientSecretFile:file};
}
export function parseVpsIdentityConfig(env:NodeJS.ProcessEnv=process.env):VpsIdentityConfig|null{
 if(env.ATHENA_VPS_IDENTITY_ENABLED!=="true"||env.ATHENA_VPS_RELEASE_APPROVED!=="true")return null;
 // The existing Supabase Auth and local-only proof-of-concept must stay separate.
 if(env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED!=="false"||
  env.ATHENA_INDEPENDENT_AUTH_ENABLED==="true")return null;
 const origin=env.ATHENA_VPS_AUTH_ORIGIN||"";
 if(!origin||origin!==env.NEXT_PUBLIC_SITE_URL)return null;
 let url:URL;
 try{url=new URL(origin);}catch{return null;}
 if(url.origin!==origin||url.username||url.password||url.pathname!=="/"||url.search||url.hash)
  return null;
 const local=env.NODE_ENV==="development"&&env.ATHENA_VPS_LOCAL_TEST==="true"&&
  url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname);
 if(!local&&!(env.NODE_ENV==="production"&&url.protocol==="https:"))return null;
 const dbHost=env.ATHENA_VPS_PG_HOST||"";
 const dbName=env.ATHENA_VPS_PG_DATABASE||"";
 const dbUser=env.ATHENA_VPS_PG_USER||"";
 const port=Number(env.ATHENA_VPS_PG_PORT||"");
 if(!["postgres","localhost","127.0.0.1"].includes(dbHost)||
  dbName!=="athena_identity"||dbUser!=="athena_app"||
  !Number.isInteger(port)||port<1||port>65535||
  env.ATHENA_VPS_PG_PASSWORD_FILE!==PG_SECRET||
  env.BETTER_AUTH_SECRET_FILE!==AUTH_SECRET)return null;
 const google=pair(env,"GOOGLE",SECRET_FILES.google);
 const github=pair(env,"GITHUB",SECRET_FILES.github);
 if(google===null||github===null)return null;
 let gmail:VpsIdentityConfig["gmail"];
 if(env.ATHENA_GMAIL_SENDER_ENABLED==="true"){
  const sender=env.ATHENA_GMAIL_SENDER||"";
  const clientId=env.ATHENA_GMAIL_CLIENT_ID||"";
  if(!/^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/.test(sender)||sender.length>254||
   clientId.length<6||clientId.length>250||
   env.ATHENA_GMAIL_CLIENT_SECRET_FILE!==SECRET_FILES.gmailClient||
   env.ATHENA_GMAIL_REFRESH_TOKEN_FILE!==SECRET_FILES.gmailRefresh)return null;
  gmail={sender,clientId,clientSecretFile:SECRET_FILES.gmailClient,
   refreshTokenFile:SECRET_FILES.gmailRefresh};
 }
 // No active Google/GitHub/mail configuration = no login routes.
 if(!google&&!github&&!gmail)return null;
 return {
  origin,
  authSecretFile:AUTH_SECRET,
  database:{host:dbHost,port,name:dbName,user:dbUser,passwordFile:PG_SECRET},
  ...(google?{google}:{}),...(github?{github}:{}),...(gmail?{gmail}:{})
 };
}
