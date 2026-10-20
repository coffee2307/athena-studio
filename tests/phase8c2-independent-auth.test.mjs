import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {DatabaseSync} from "node:sqlite";
import {getMigrations} from "better-auth/db/migration";
import {standaloneIdentityConfig} from "../lib/identity/gate.ts";
import {createStandaloneAuth} from "../lib/identity/factory.ts";
import {readFile} from "node:fs/promises";

function env(){
 return {
  ATHENA_INDEPENDENT_AUTH_ENABLED:"true",
  ATHENA_IDENTITY_LOCAL_ONLY:"true",
  NODE_ENV:"development",
  NEXT_PUBLIC_SITE_URL:"http://localhost:3000",
  BETTER_AUTH_SECRET:randomBytes(32).toString("base64url"),
  ATHENA_IDENTITY_DB_PATH:".qa/local-test.sqlite",
  ATHENA_GOOGLE_OAUTH_CLIENT_ID:"google-client-id",
  ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:"google-client-secret"
 };
}
function createIdentity(mail=null,providers={}){
 const database=new DatabaseSync(":memory:");
 database.exec("PRAGMA foreign_keys=ON");
 const auth=createStandaloneAuth({
  origin:"http://localhost:3000",
  secret:randomBytes(32).toString("base64url"),
  database,mail,...providers
 });
 return {auth,database};
}
async function initialize(auth){
 const plan=await getMigrations(auth.options);
 assert.deepEqual(plan.unsafeChanges,[]);
 assert.deepEqual(plan.schemaProblems,[]);
 const sql=await plan.compileMigrations();
 await plan.runMigrations();
 return sql;
}
test("Independent Auth blocks production/CI/nonlocal origins and missing explicit opt-in",()=>{
 const base=env();
 assert.ok(standaloneIdentityConfig(base));
 for(const [key,value] of [
  ["ATHENA_INDEPENDENT_AUTH_ENABLED","false"],
  ["ATHENA_IDENTITY_LOCAL_ONLY","false"],
  ["NODE_ENV","production"],
  ["NODE_ENV","test"],
  ["CI","true"],
  ["NEXT_PUBLIC_SITE_URL","https://production.example"],
  ["NEXT_PUBLIC_SITE_URL","http://evil.example"],
  ["NEXT_PUBLIC_SITE_URL","http://localhost:3000/path"],
  ["BETTER_AUTH_SECRET","short"],
  ["ATHENA_IDENTITY_DB_PATH","../../data.sqlite"],
  ["ATHENA_IDENTITY_DB_PATH","/tmp/data.sqlite"],
  ["ATHENA_GOOGLE_OAUTH_CLIENT_SECRET",""]
 ]){
  assert.equal(standaloneIdentityConfig({...base,[key]:value}),null,key);
 }
 assert.equal(standaloneIdentityConfig({...base,
  ATHENA_GOOGLE_OAUTH_CLIENT_ID:"",ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:""
 }),null);
});
test("GitHub and Google are optional identity providers; neither receives repository privileges",()=>{
 const base=env();
 const github=standaloneIdentityConfig({
  ...base,ATHENA_GOOGLE_OAUTH_CLIENT_ID:"",
  ATHENA_GOOGLE_OAUTH_CLIENT_SECRET:"",
  ATHENA_GITHUB_OAUTH_CLIENT_ID:"github-client-id",
  ATHENA_GITHUB_OAUTH_CLIENT_SECRET:"github-client-secret"
 });
 assert.ok(github?.github);
 assert.equal(github.google,undefined);
 const {auth,database}=createIdentity(null,{github:github.github});
 assert.ok(auth.options.socialProviders.github);
 assert.equal(auth.options.socialProviders.google,undefined);
 assert.equal(auth.options.account.accountLinking.enabled,false);
 assert.equal(auth.options.emailAndPassword.enabled,false);
 assert.doesNotMatch(JSON.stringify(auth.options.socialProviders),/supabase|repo|contents/i);
 database.close();
});
test("Real hashed 6-digit OTP flow creates verified Athena user/session and rejects wrong OTP or replay",async()=>{
 const outgoing=[];
 const {auth,database}=createIdentity({async send(email,otp,purpose){
  outgoing.push({email,otp,purpose});
 }});
 const sql=await initialize(auth);
 for(const name of ["user","session","account","verification","rateLimit"]){
  assert.ok(sql.includes('"'+name+'"'),name);
 }
 const email="identity-local@example.org";
 assert.equal(database.prepare('select count(*) as n from "user"').get().n,0);
 const sent=await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}});
 assert.equal(sent.success,true);
 assert.equal(outgoing.length,1);
 assert.equal(outgoing[0].email,email);
 assert.equal(outgoing[0].purpose,"sign-in");
 assert.match(outgoing[0].otp,/^\d{6}$/);
 assert.equal(database.prepare('select count(*) as n from "user"').get().n,0);
 const stored=database.prepare('select value from "verification"').all();
 assert.ok(stored.length>=1);
 assert.ok(stored.every(row=>!row.value.includes(outgoing[0].otp)));
 const wrong=outgoing[0].otp==="000000"?"999999":"000000";
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:wrong}}));
 const accepted=await auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}});
 assert.equal(accepted.user.email,email);
 assert.equal(accepted.user.emailVerified,true);
 assert.ok(accepted.user.id);
 assert.ok(accepted.token);
 assert.equal(database.prepare('select count(*) as n from "user"').get().n,1);
 assert.equal(database.prepare('select count(*) as n from "session"').get().n,1);
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}}));
 database.close();
});
test("No mail sender removes OTP endpoints and cannot create local user/session",async()=>{
 const {auth,database}=createIdentity();
 await initialize(auth);
 assert.equal(typeof auth.api.sendVerificationOTP,"undefined");
 assert.equal(database.prepare('select count(*) as n from "session"').get().n,0);
 assert.equal(database.prepare('select count(*) as n from "user"').get().n,0);
 database.close();
});
test("Public release settings remain OFF; OTP/session engine does not depend on Supabase Auth",async()=>{
 const example=await readFile(new URL("../.env.example",import.meta.url),"utf8");
 const route=await readFile(new URL("../app/api/identity/[...all]/route.ts",import.meta.url),"utf8");
 const factory=await readFile(new URL("../lib/identity/factory.ts",import.meta.url),"utf8");
 const server=await readFile(new URL("../lib/identity/server.ts",import.meta.url),"utf8");
 const preview=await readFile(new URL("../app/identity-lab/page.tsx",import.meta.url),"utf8");
 for(const setting of ["ATHENA_INDEPENDENT_AUTH_ENABLED=false",
  "ATHENA_IDENTITY_LOCAL_ONLY=false","ATHENA_GMAIL_SENDER_ENABLED=false",
  "BETTER_AUTH_SECRET="]){
  assert.ok(example.split(/\r?\n/).includes(setting),setting);
 }
 assert.doesNotMatch(factory,/supabase|service[_-]?role|repo(_access|contents)/i);
 assert.match(factory,/storeOTP:"hashed"/);
 assert.match(factory,/accountLinking:\{enabled:false\}/);
 assert.match(route,/status:503/);
 assert.match(server,/DatabaseSync/);
 assert.doesNotMatch(server,/SUPABASE_/);
 assert.match(preview,/notFound\(\)/);
 assert.match(preview,/gmailSecretsFromEnv/);
});
