import {betterAuth} from "better-auth";
import {emailOTP} from "better-auth/plugins";
import type {Pool} from "pg";
import type {AuthMailTransport} from "../types.ts";

export type VpsIdentityRuntime={
 origin:string;
 secret:string;
 pool:Pool;
 google?:{clientId:string;clientSecret:string};
 github?:{clientId:string;clientSecret:string};
 mail?:AuthMailTransport;
};
/**
 * One lightweight Node/Next process and an ordinary PostgreSQL pool.
 * This factory contains no Supabase, Cloudflare or other hosted-auth SDK.
 */
export function createVpsIdentityAuth(config:VpsIdentityRuntime){
 return betterAuth({
  appName:"Athena Studio",
  baseURL:config.origin,
  basePath:"/api/identity",
  secret:config.secret,
  trustedOrigins:[config.origin],
  database:config.pool,
  emailAndPassword:{enabled:false},
  advanced:{
   useSecureCookies:config.origin.startsWith("https://"),
   database:{joins:true},
   // Only trust this when Caddy overwrites X-Real-IP at the edge.
   ipAddress:{ipAddressHeaders:["x-real-ip"]}
  },
  session:{
   expiresIn:60*60*24*7,
   updateAge:60*60,
   cookieCache:{enabled:false}
  },
  rateLimit:{enabled:true,window:60,max:10,storage:"database"},
  account:{accountLinking:{enabled:false}},
  socialProviders:{
   ...(config.google?{google:{
    clientId:config.google.clientId,clientSecret:config.google.clientSecret,
    requireEmailVerification:true
   }}:{}),
   ...(config.github?{github:{
    clientId:config.github.clientId,clientSecret:config.github.clientSecret,
    requireEmailVerification:true
   }}:{})
  },
  plugins:config.mail?[emailOTP({
   otpLength:6,
   expiresIn:300,
   allowedAttempts:3,
   storeOTP:"hashed",
   disableSignUp:false,
   sendVerificationOnSignUp:true,
   async sendVerificationOTP({email,otp,type}){
    await config.mail!.send(email,otp,type);
   }
  })]:[]
 });
}
