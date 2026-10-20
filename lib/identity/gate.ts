/**
 * Standalone Athena identity: no Supabase Auth and no frontend provider secrets.
 * Phase 8C.2 is LOCAL-ONLY. Production explicitly fails closed until persistent
 * database/host migrations, security tests and owner approval are complete.
 */
export interface IndependentIdentityConfig{
 origin:string;secret:string;databaseFile:string;
 google?:{clientId:string;clientSecret:string};
 github?:{clientId:string;clientSecret:string};
}
function provider(id:string,secret:string){
 if(!id&&!secret)return undefined;
 if(id.length<6||secret.length<8)return null;
 return {clientId:id,clientSecret:secret};
}
export function standaloneIdentityConfig(env:NodeJS.ProcessEnv=process.env):IndependentIdentityConfig|null{
 if(env.ATHENA_INDEPENDENT_AUTH_ENABLED!=="true"||env.ATHENA_IDENTITY_LOCAL_ONLY!=="true")return null;
 if(env.NODE_ENV!=="development"||env.CI==="true")return null;
 const origin=env.NEXT_PUBLIC_SITE_URL||"";
 let url:URL;
 try{url=new URL(origin);}catch{return null;}
 if(url.origin!==origin||url.protocol!=="http:"||!["localhost","127.0.0.1"].includes(url.hostname))return null;
 const secret=env.BETTER_AUTH_SECRET||"";
 if(secret.length<32||secret.length>512)return null;
 const databaseFile=env.ATHENA_IDENTITY_DB_PATH||"";
 if(!/^\.qa\/[a-z0-9_-]+\.sqlite$/i.test(databaseFile))return null;
 const google=provider(env.ATHENA_GOOGLE_OAUTH_CLIENT_ID||"",env.ATHENA_GOOGLE_OAUTH_CLIENT_SECRET||"");
 const github=provider(env.ATHENA_GITHUB_OAUTH_CLIENT_ID||"",env.ATHENA_GITHUB_OAUTH_CLIENT_SECRET||"");
 if(google===null||github===null)return null;
 // At least one delivery channel must be explicitly configured before login becomes usable.
 const hasMail=env.ATHENA_GMAIL_SENDER_ENABLED==="true"&&
  !!env.ATHENA_GMAIL_CLIENT_ID&&!!env.ATHENA_GMAIL_CLIENT_SECRET&&
  !!env.ATHENA_GMAIL_REFRESH_TOKEN&&!!env.ATHENA_GMAIL_SENDER;
 if(!google&&!github&&!hasMail)return null;
 return {origin,secret,databaseFile,...(google?{google}:{}),...(github?{github}:{})};
}
