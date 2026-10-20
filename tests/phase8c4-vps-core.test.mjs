import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {randomBytes} from "node:crypto";
import {createServer} from "node:net";
import {PGlite} from "@electric-sql/pglite";
import {PGLiteSocketServer} from "@electric-sql/pglite-socket";
import {Pool} from "pg";
import {getMigrations} from "better-auth/db/migration";
import {createVpsIdentityAuth} from "../lib/identity/vps/factory.ts";
import {parseVpsIdentityConfig} from "../lib/identity/vps/config.ts";
import {listOwnedWorkspaces} from "../lib/identity/vps/workspace.ts";

const base=()=>({
 ATHENA_VPS_IDENTITY_ENABLED:"true",
 ATHENA_VPS_RELEASE_APPROVED:"true",
 NODE_ENV:"production",
 NEXT_PUBLIC_SITE_URL:"https://athena.test",
 NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"false",
 ATHENA_INDEPENDENT_AUTH_ENABLED:"false",
 ATHENA_VPS_AUTH_ORIGIN:"https://athena.test",
 ATHENA_VPS_PG_HOST:"postgres",
 ATHENA_VPS_PG_PORT:"5432",
 ATHENA_VPS_PG_DATABASE:"athena_identity",
 ATHENA_VPS_PG_USER:"athena_app",
 ATHENA_VPS_PG_PASSWORD_FILE:"/run/secrets/athena_pg_password",
 BETTER_AUTH_SECRET_FILE:"/run/secrets/athena_auth_secret",
 ATHENA_GOOGLE_OAUTH_CLIENT_ID:"google-client-qa",
 ATHENA_GOOGLE_OAUTH_CLIENT_SECRET_FILE:"/run/secrets/athena_google_secret"
});
async function portAvailable(){
 const server=createServer();
 await new Promise((resolve,reject)=>{
  server.once("error",reject);
  server.listen(0,"127.0.0.1",resolve);
 });
 const address=server.address();
 assert.ok(address&&typeof address!=="string");
 await new Promise(resolve=>server.close(resolve));
 return address.port;
}
async function pgHarness(t){
 const db=await PGlite.create();
 const port=await portAvailable();
 const socket=new PGLiteSocketServer({db,host:"127.0.0.1",port,maxConnections:4});
 let pool;
 try{
  await db.exec("CREATE ROLE athena_app;");
  await db.exec(await readFile(new URL("../deploy/vps/migrations/001_better_auth.sql",import.meta.url),"utf8"));
  await db.exec(await readFile(new URL("../deploy/vps/migrations/002_workspace.sql",import.meta.url),"utf8"));
  await socket.start();
  pool=new Pool({host:"127.0.0.1",port,user:"postgres",database:"postgres",password:"local-test-only",max:2});
  const testQuery=await pool.query("SELECT COUNT(*)::int AS total FROM information_schema.tables WHERE table_schema='public'");
  assert.ok(testQuery.rows[0].total>=7);
 }catch(error){
  await pool?.end().catch(()=>{});
  await socket.stop().catch(()=>{});
  await db.close().catch(()=>{});
  throw error;
 }
 t.after(async()=>{
  await pool.end();
  await socket.stop();
  await db.close();
 });
 return {pool};
}
test("VPS identity gates require two explicit approvals, matching HTTPS origin and secret file paths",()=>{
 const config=parseVpsIdentityConfig(base());
 assert.equal(config?.origin,"https://athena.test");
 assert.equal(config?.database.user,"athena_app");
 for(const [key,value] of [
  ["ATHENA_VPS_IDENTITY_ENABLED","false"],
  ["ATHENA_VPS_RELEASE_APPROVED","false"],
  ["NODE_ENV","development"],
  ["NEXT_PUBLIC_SITE_URL","https://other.test"],
  ["NEXT_PUBLIC_ATHENA_AUTH_ENABLED","true"],
  ["ATHENA_INDEPENDENT_AUTH_ENABLED","true"],
  ["ATHENA_VPS_AUTH_ORIGIN","http://athena.test"],
  ["ATHENA_VPS_AUTH_ORIGIN","https://athena.test/path"],
  ["ATHENA_VPS_AUTH_ORIGIN","https://attacker.test"],
  ["ATHENA_VPS_PG_HOST","db.attacker.test"],
  ["ATHENA_VPS_PG_USER","postgres"],
  ["ATHENA_VPS_PG_PASSWORD_FILE","/tmp/secret"],
  ["BETTER_AUTH_SECRET_FILE","/tmp/secret"],
  ["ATHENA_GOOGLE_OAUTH_CLIENT_SECRET_FILE","/tmp/google_secret"]
 ]){
  assert.equal(parseVpsIdentityConfig({...base(),[key]:value}),null,key);
 }
 const missing={...base()};
 delete missing.ATHENA_GOOGLE_OAUTH_CLIENT_ID;
 delete missing.ATHENA_GOOGLE_OAUTH_CLIENT_SECRET_FILE;
 assert.equal(parseVpsIdentityConfig(missing),null);
 const local={...base(),NODE_ENV:"development",ATHENA_VPS_LOCAL_TEST:"true",
  NEXT_PUBLIC_SITE_URL:"http://127.0.0.1:3000",ATHENA_VPS_AUTH_ORIGIN:"http://127.0.0.1:3000"};
 assert.ok(parseVpsIdentityConfig(local));
 assert.equal(parseVpsIdentityConfig({...local,ATHENA_VPS_LOCAL_TEST:"false"}),null);
});
test("Actual PostgreSQL-compatible engine verifies OTP and creates an Athena-owned session",async t=>{
 const {pool}=await pgHarness(t);
 const outgoing=[];
 const auth=createVpsIdentityAuth({
  origin:"http://127.0.0.1:3000",
  secret:randomBytes(32).toString("base64url"),
  pool,
  mail:{async send(email,otp,type){outgoing.push({email,otp,type});}}
 });
 const drift=await getMigrations(auth.options);
 assert.deepEqual(drift.toBeCreated,[]);
 assert.deepEqual(drift.toBeAdded,[]);
 const email="person-a@example.test";
 const otpRequest=await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}});
 assert.equal(otpRequest.success,true);
 assert.match(outgoing[0].otp,/^\d{6}$/);
 const v=await pool.query('SELECT value FROM "verification"');
 assert.ok(v.rows.every(row=>!row.value.includes(outgoing[0].otp)));
 const wrong=outgoing[0].otp==="000000"?"111111":"000000";
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:wrong}}));
 const logged=await auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}});
 assert.equal(logged.user.email,email);
 assert.equal(logged.user.emailVerified,true);
 assert.ok(logged.token);
 await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:outgoing[0].otp}}));
 const userRows=await pool.query('SELECT id FROM "user" WHERE email=$1',[email]);
 assert.equal(userRows.rows.length,1);
 const sessionRows=await pool.query('SELECT id FROM "session" WHERE "userId"=$1',[logged.user.id]);
 assert.equal(sessionRows.rows.length,1);
});
test("PostgreSQL authorization only reads the current tenant and runtime role cannot change membership",async t=>{
 const {pool}=await pgHarness(t);
 const users=[["user-a","Client A","a@example.test"],["user-b","Client B","b@example.test"]];
 for(const [id,name,email] of users){
  await pool.query('INSERT INTO "user" (id,name,email,"emailVerified") VALUES ($1,$2,$3,true)',[id,name,email]);
 }
 for(const [id,title] of [["workspace-a","Tenant A"],["workspace-b","Tenant B"]]){
  await pool.query("INSERT INTO athena_workspace(id,title,kind) VALUES ($1,$2,'client')",[id,title]);
 }
 await pool.query("INSERT INTO athena_membership (id,workspace_id,user_id,role) VALUES ($1,$2,$3,'client'),($4,$5,$6,'client')",
  ["membership-a","workspace-a","user-a","membership-b","workspace-b","user-b"]);
 assert.deepEqual((await listOwnedWorkspaces(pool,"user-a")).map(row=>row.id),["workspace-a"]);
 assert.deepEqual((await listOwnedWorkspaces(pool,"user-b")).map(row=>row.id),["workspace-b"]);
 assert.deepEqual(await listOwnedWorkspaces(pool,"no-such-user"),[]);
 await assert.rejects(listOwnedWorkspaces(pool,"user-a\nmalformed"),/INVALID_IDENTITY_SUBJECT/);
 await assert.rejects(pool.query("INSERT INTO athena_membership (id,workspace_id,user_id,role) VALUES ('x','workspace-a','user-a','owner')"));
 await assert.rejects(pool.query("INSERT INTO athena_membership (id,workspace_id,user_id,role) VALUES ('membership-c','workspace-a','user-a','admin')"));
 const client=await pool.connect();
 try{
  await client.query("SET ROLE athena_app");
  const allowed=await client.query("SELECT * FROM athena_membership WHERE user_id=$1",["user-a"]);
  assert.equal(allowed.rows.length,1);
  await assert.rejects(client.query("UPDATE athena_membership SET role='admin' WHERE id='membership-a'"));
 }finally{
  await client.query("RESET ROLE");
  client.release();
 }
});
test("VPS deployments remain locked by default: no public Postgres port or committed secret material",async()=>{
 const env=await readFile(new URL("../.env.example",import.meta.url),"utf8");
 const compose=await readFile(new URL("../deploy/vps/compose.yaml",import.meta.url),"utf8");
 const docker=await readFile(new URL("../deploy/vps/Dockerfile",import.meta.url),"utf8");
 const ignore=await readFile(new URL("../.dockerignore",import.meta.url),"utf8");
 const backup=await readFile(new URL("../deploy/vps/scripts/backup.sh",import.meta.url),"utf8");
 const restore=await readFile(new URL("../deploy/vps/scripts/restore-drill.sh",import.meta.url),"utf8");
 for(const setting of [
  "ATHENA_VPS_IDENTITY_ENABLED=false",
  "ATHENA_VPS_RELEASE_APPROVED=false",
  "ATHENA_VPS_AUTH_ORIGIN="
 ])assert.ok(env.split(/\r?\n/).includes(setting));
 assert.match(compose,/ATHENA_VPS_IDENTITY_ENABLED:\s+\$\{ATHENA_VPS_IDENTITY_ENABLED:-false\}/);
 assert.match(compose,/ATHENA_VPS_RELEASE_APPROVED:\s+\$\{ATHENA_VPS_RELEASE_APPROVED:-false\}/);
 assert.match(compose,/read_only: true/);
 assert.match(compose,/internal: true/);
 assert.doesNotMatch(compose,/5432:5432|3000:3000/);
 assert.match(compose,/athena_pg_admin_password/);
 assert.match(docker,/ATHENA_VPS_STANDALONE_BUILD=true/);
 assert.match(docker,/USER athena/);
 assert.match(ignore,/\.env\*/);
 assert.match(backup,/age --encrypt/);
 assert.match(backup,/ATHENA_BACKUP_OFFSITE_ACK/);
 assert.match(restore,/--drill/);
 assert.match(restore,/athena_restore_drill_/);
});
