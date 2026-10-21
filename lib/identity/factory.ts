import {betterAuth} from "better-auth";
import {emailOTP} from "better-auth/plugins";
import type {DatabaseSync} from "node:sqlite";
import type {AuthMailTransport} from "./types.ts";
import type {IndependentIdentityConfig} from "./gate.ts";

type FactoryConfig=IndependentIdentityConfig & {
 database:DatabaseSync;
 mail:AuthMailTransport|null;
};
/**
 * Real Athena-managed identity: credentials/sessions/hashed OTP in Athena DB.
 * Google/GitHub validate external identity only. GitHub repository access
 * requires a separate GitHub App installation consent, not login OAuth.
 */
export function createStandaloneAuth(settings:FactoryConfig){
 return betterAuth({
  appName:"Athena Studio",
  baseURL:settings.origin,
  basePath:"/api/identity",
  secret:settings.secret,
  database:settings.database,
  trustedOrigins:[settings.origin],
  emailAndPassword:{enabled:settings.localPassword===true,minPasswordLength:12,requireEmailVerification:false},
  session:{expiresIn:60*60*24*7,updateAge:60*60,cookieCache:{enabled:false}},
  rateLimit:{enabled:true,window:60,max:10,storage:"database"},
  account:{accountLinking:{enabled:false}},
  socialProviders:{
   ...(settings.google?{google:{
    clientId:settings.google.clientId,clientSecret:settings.google.clientSecret,
    requireEmailVerification:true
   }}:{}),
   ...(settings.github?{github:{
    clientId:settings.github.clientId,clientSecret:settings.github.clientSecret,
    requireEmailVerification:true
   }}:{})
  },
  plugins:settings.mail?[emailOTP({
   otpLength:6,expiresIn:300,allowedAttempts:3,
   storeOTP:"hashed",
   disableSignUp:false,
   sendVerificationOnSignUp:true,
   async sendVerificationOTP({email,otp,type}){
    await settings.mail!.send(email,otp,type);
   }
  })]:[]
 });
}
