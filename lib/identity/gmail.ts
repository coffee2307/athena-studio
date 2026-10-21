import "server-only";
import {gmailOtpTransport} from "./gmail-core.ts";
export {gmailOtpTransport};
export type {GmailSecrets} from "./gmail-core.ts";
export function gmailSecretsFromEnv(env:NodeJS.ProcessEnv=process.env){
 if(env.ATHENA_GMAIL_SENDER_ENABLED!=="true")return null;
 const sender=env.ATHENA_GMAIL_SENDER||"";
 const clientId=env.ATHENA_GMAIL_CLIENT_ID||"";
 const clientSecret=env.ATHENA_GMAIL_CLIENT_SECRET||"";
 const refreshToken=env.ATHENA_GMAIL_REFRESH_TOKEN||"";
 if(!/^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/.test(sender)||sender.length>254||
    !clientId||!clientSecret||!refreshToken)return null;
 return {sender,clientId,clientSecret,refreshToken};
}