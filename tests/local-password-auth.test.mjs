import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {DatabaseSync} from "node:sqlite";
import {getMigrations} from "better-auth/db/migration";
import {standaloneIdentityConfig} from "../lib/identity/gate.ts";
import {createStandaloneAuth} from "../lib/identity/factory.ts";

test("Local password mode requires explicit localhost development opt-in",()=>{
 const env={
  NODE_ENV:"development",ATHENA_INDEPENDENT_AUTH_ENABLED:"true",
  ATHENA_IDENTITY_LOCAL_ONLY:"true",ATHENA_LOCAL_PASSWORD_AUTH_ENABLED:"true",
  NEXT_PUBLIC_SITE_URL:"http://127.0.0.1:3182",
  BETTER_AUTH_SECRET:randomBytes(48).toString("base64url"),
  ATHENA_IDENTITY_DB_PATH:".qa/local-password-test.sqlite"
 };
 assert.equal(standaloneIdentityConfig(env)?.localPassword,true);
 for(const [key,val] of [["NODE_ENV","production"],["CI","true"],["ATHENA_IDENTITY_LOCAL_ONLY","false"],
  ["ATHENA_LOCAL_PASSWORD_AUTH_ENABLED","false"],["NEXT_PUBLIC_SITE_URL","https://athena.example"]]){
  assert.equal(standaloneIdentityConfig({...env,[key]:val}),null,key);
 }
});
test("Better Auth local password signup persists hashed credentials, session and rejects wrong password",async()=>{
 const db=new DatabaseSync(":memory:");
 try{
  const auth=createStandaloneAuth({
   origin:"http://localhost:3182",secret:randomBytes(48).toString("base64url"),
   database:db,mail:null,localPassword:true,databaseFile:".qa/test.sqlite"
  });
  const m=await getMigrations(auth.options);assert.equal(m.unsafeChanges.length,0);await m.runMigrations();
  const signup=await auth.api.signUpEmail({body:{name:"Athena Local Test",email:"auth-qa@example.test",password:"S3cur3-local-QA-passphrase-2026"}});
  assert.ok(signup.user.id);
  assert.ok(signup.token);
  const account=db.prepare('SELECT password FROM "account" WHERE userId = ?').get(signup.user.id);
  assert.ok(account?.password);
  assert.ok(!account.password.includes("S3cur3-local-QA-passphrase-2026"));
  await assert.rejects(auth.api.signInEmail({body:{email:"auth-qa@example.test",password:"wrong-password-00000"}}));
  const result=await auth.api.signInEmail({body:{email:"auth-qa@example.test",password:"S3cur3-local-QA-passphrase-2026"}});
  assert.equal(result.user.email,"auth-qa@example.test");assert.ok(result.token);
  assert.equal(db.prepare('SELECT count(*) as c FROM "session"').get().c>=1,true);
 }finally{db.close();}
});
