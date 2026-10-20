import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
 classifyIdentityFailure,cappedCooldown,runIdentityAction
} from "../lib/core/auth/core.ts";

const cases=[
 ["signup",{code:"over_email_send_rate_limit",status:429},"email_quota",90],
 ["forgot",{code:"over_email_send_rate_limit",status:429},"email_quota",90],
 ["signup",{status:429},"email_quota",90],
 ["forgot",{status:429},"email_quota",90],
 ["login",{status:429},"throttled",90],
 ["signup",{code:"over_request_rate_limit",status:429},"throttled",90],
 ["login",{code:"invalid_credentials",status:400},"invalid_credentials",0],
 ["login",{code:"email_not_confirmed",status:400},"email_unverified",0],
 ["signup",{code:"weak_password",status:422},"weak_password",0],
 ["signup",{code:"signup_disabled",status:400},"provider_disabled",0],
 ["google",{code:"identity_policy_block"},"provider_disabled",0],
 ["google",{name:"AuthRetryableFetchError"},"network",0],
 ["login",{name:"TypeError"},"network",0],
 ["login",{status:503},"unavailable",0],
 ["signup",{status:400,code:"user_already_exists"},"unknown",0],
 ["forgot",{code:"invalid_credentials",status:400},"unknown",0]
];
test("Athena classifies provider failures without confusing email quotas with general throttling",()=>{
 for(const [action,providerError,kind,cooldownSeconds] of cases){
  const result=classifyIdentityFailure(providerError,action);
  assert.equal(result.kind,kind,action+" "+JSON.stringify(providerError));
  assert.equal(result.cooldownSeconds,cooldownSeconds);
  assert.ok(result.message.length>15);
  assert.doesNotMatch(result.message,/supabase|HTTP 429|over_email_send_rate_limit|user_already_exists|token|JWT/i);
 }
});
test("Provider error messages, emails, tokens and stacks are never rendered to customers",()=>{
 const secrets=["someone-private@example.com","jwt.secret.value","service_role_private_secret"];
 for(const value of secrets){
  for(const action of ["login","signup","forgot","password","google"]){
   const result=classifyIdentityFailure({message:value,stack:value,status:400,code:"not_an_expected_code"},action);
   assert.equal(result.kind,"unknown");
   assert.ok(!result.message.includes(value));
  }
 }
});
test("Invalid/malformed provider errors fail closed and never crash rendering",()=>{
 for(const err of [null,undefined,"auth timeout",42,{}, {status:"429",code:99},{status:NaN},{status:503,name:123}]){
  const result=classifyIdentityFailure(err,"signup");
  assert.ok(["unknown","unavailable"].includes(result.kind));
 }
});
test("Cooldown is bounded, explicit and never treated as server-side quota reset",()=>{
 assert.equal(cappedCooldown(90),90);
 assert.equal(cappedCooldown(999999),300);
 assert.equal(cappedCooldown(-1),0);
 assert.equal(cappedCooldown(Number.POSITIVE_INFINITY),0);
 assert.equal(cappedCooldown(0.2),1);
});
function fakePort(calls,broken=""){
 const log=(name)=>async(...args)=>{calls.push([name,...args]);if(name===broken)throw {code:"over_email_send_rate_limit",status:429};};
 return {login:log("login"),signup:log("signup"),forgot:log("forgot"),password:log("password"),google:log("google")};
}
test("Core routes all workflows through the injected provider without importing Supabase",async()=>{
 const actions=[
  {kind:"login",email:"foo@example.test",password:"password"},
  {kind:"signup",email:"foo@example.test",password:"password",fullName:"Test User",redirectTo:"https://athena.test/auth/callback"},
  {kind:"forgot",email:"foo@example.test",redirectTo:"https://athena.test/auth/callback"},
  {kind:"password",password:"password"},
  {kind:"google",redirectTo:"https://athena.test/auth/callback"}
 ];
 for(const action of actions){
  const calls=[];
  const result=await runIdentityAction(fakePort(calls),action);
  assert.deepEqual(result,{ok:true,action:action.kind});
  assert.equal(calls.length,1);
  assert.equal(calls[0][0],action.kind);
 }
});
test("Mail provider 429 is not retried, replaced with Google, or reported as success",async()=>{
 const calls=[];
 const result=await runIdentityAction(fakePort(calls,"signup"),{
  kind:"signup",email:"foo@example.test",password:"longpassphrase",fullName:"Test User",redirectTo:"https://athena.test/auth/callback"
 });
 assert.equal(result.ok,false);
 assert.equal(result.failure.kind,"email_quota");
 assert.equal(calls.length,1);
 assert.equal(calls[0][0],"signup");
});
test("Unverified login from the provider cannot become a successful Athena session",async()=>{
 const calls=[];
 const port=fakePort(calls);
 port.login=async()=>{calls.push(["login"]);throw {code:"email_not_confirmed"};};
 const result=await runIdentityAction(port,{kind:"login",email:"unverified@example.test",password:"test"});
 assert.equal(result.ok,false);
 assert.equal(result.failure.kind,"email_unverified");
 assert.deepEqual(calls,[["login"]]);
});
test("Google failure cannot silently issue a session or switch auth providers",async()=>{
 const calls=[];
 const result=await runIdentityAction(fakePort(calls,"google"),{kind:"google",redirectTo:"https://athena.test/auth/callback"});
 assert.equal(result.ok,false);
 assert.deepEqual(calls.map(([name])=>name),["google"]);
});
test("UI uses Athena identity boundary; existing public provider gates stay fail closed",async()=>{
 const ui=await readFile(new URL("../components/auth/AuthPanel.tsx",import.meta.url),"utf8");
 const adapter=await readFile(new URL("../lib/auth/provider-adapter.ts",import.meta.url),"utf8");
 const core=await readFile(new URL("../lib/core/auth/core.ts",import.meta.url),"utf8");
 for(const marker of ["runIdentityAction","supabaseIdentityAdapter","aria-busy","auth-recovery","cappedCooldown"]){
  assert.ok(ui.includes(marker),marker);
 }
 assert.doesNotMatch(ui,/\.auth\.(signUp|signInWithPassword|resetPasswordForEmail)/);
 assert.match(ui,/disabled=\{!googleEnabled\|\|pending\}/);
 assert.match(ui,/disabled=\{pending\|\|cooldown>0\}/);
 assert.match(adapter,/email_confirmed_at/);
 assert.match(adapter,/signOut\(\{scope:"local"\}\)/);
 assert.doesNotMatch(core,/from ["']@supabase\//);
});
