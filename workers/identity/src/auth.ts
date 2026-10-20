import {betterAuth} from "better-auth/minimal";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {emailOTP} from "better-auth/plugins";
import {drizzle} from "drizzle-orm/d1";
import * as schema from "./schema.ts";
import type {WorkerIdentityConfig} from "./gate.ts";
import {gmailOtpTransport} from "../../../lib/identity/gmail-core.ts";
import type {AuthMailTransport} from "../../../lib/identity/types.ts";

/**
 * Cloudflare D1 holds Athena identities, hashed verification codes, sessions
 * and rate limits. This does NOT use Supabase Auth or node:sqlite.
 */
export function createCloudIdentity(config:WorkerIdentityConfig,mailOverride?:AuthMailTransport){
 const database=drizzle(config.db,{schema});
 // Explicit in-memory sender override is only passed by offline integration tests.
 const transport=mailOverride??(config.gmail?gmailOtpTransport(config.gmail):null);
 const auth=betterAuth({
  appName:"Athena Studio",
  baseURL:config.origin,
  basePath:"/api/identity",
  secret:config.secret,
  trustedOrigins:[config.origin],
  advanced:{
   useSecureCookies:config.origin.startsWith("https://"),
   // Cloudflare overwrites this header at its edge; do not trust arbitrary X-Forwarded-For.
   ipAddress:{ipAddressHeaders:["cf-connecting-ip"]}
  },
  database:drizzleAdapter(database,{provider:"sqlite",schema}),
  emailAndPassword:{enabled:false},
  session:{
   expiresIn:60*60*24*7,
   updateAge:60*60,
   cookieCache:{enabled:false}
  },
  rateLimit:{enabled:true,window:60,max:10,storage:"database"},
  account:{accountLinking:{enabled:false}},
  socialProviders:{
   ...(config.google?{google:{
    clientId:config.google.clientId,
    clientSecret:config.google.clientSecret,
    requireEmailVerification:true
   }}:{}),
   ...(config.github?{github:{
    clientId:config.github.clientId,
    clientSecret:config.github.clientSecret,
    requireEmailVerification:true
   }}:{})
  },
  plugins:transport?[emailOTP({
   otpLength:6,
   expiresIn:300,
   allowedAttempts:3,
   storeOTP:"hashed",
   disableSignUp:false,
   sendVerificationOnSignUp:true,
   async sendVerificationOTP({email,otp,type}){
    await transport.send(email,otp,type);
   }
  })]:[]
 });
 return {auth,database};
}
