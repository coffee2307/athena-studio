import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {createServer} from "node:net";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
import {PGLiteSocketServer} from "@electric-sql/pglite-socket";
import {Pool} from "pg";
import {createVpsIdentityAuth} from "../lib/identity/vps/factory.ts";

const ORIGIN="https://athena-qa.example.invalid";
test("VPS HTTPS session requires a valid cookie, can sign out and rejects forged/revoked sessions",async()=>{
 const server=createServer();
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const port=server.address().port;
 await new Promise(resolve=>server.close(resolve));
 const db=await PGlite.create();
 const wire=new PGLiteSocketServer({db,host:"127.0.0.1",port,maxConnections:4});
 let pool;
 try{
  await db.exec("CREATE ROLE athena_app");
  for(const file of ["001_better_auth.sql","002_workspace.sql"])
   await db.exec(await readFile(new URL("../deploy/vps/migrations/"+file,import.meta.url),"utf8"));
  await wire.start();
  pool=new Pool({host:"127.0.0.1",port,user:"postgres",database:"postgres",password:"local",max:2});
  const outgoing=[];
  const auth=createVpsIdentityAuth({
   origin:ORIGIN,secret:randomBytes(48).toString("base64url"),
   pool,mail:{async send(email,otp){outgoing.push({email,otp});}}
  });
  const email="session-check@example.invalid";
  await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}});
  assert.equal(outgoing.length,1);
  const response=await auth.handler(new Request(ORIGIN+"/api/identity/sign-in/email-otp",{
   method:"POST",headers:{origin:ORIGIN,"content-type":"application/json","x-real-ip":"198.51.100.35"},
   body:JSON.stringify({email,otp:outgoing[0].otp})
  }));
  assert.equal(response.status,200);
  const cookie=response.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie?.includes("session_token"),"secure HTTP-only Better Auth session cookie");
  const session=await auth.api.getSession({headers:new Headers({cookie})});
  assert.equal(session?.user.email,email);
  assert.equal(session?.user.emailVerified,true);
  assert.equal(await auth.api.getSession({headers:new Headers({cookie:"better-auth.session_token=fake"})}),null);
  const signedOut=await auth.handler(new Request(ORIGIN+"/api/identity/sign-out",{
   method:"POST",
   headers:{"origin":ORIGIN,"content-type":"application/json","cookie":cookie},
   body:"{}"
  }));
  assert.equal(signedOut.status,200);
  assert.equal(await auth.api.getSession({headers:new Headers({cookie})}),null);
 }finally{
  if(pool)await pool.end();
  await wire.stop();
  await db.close();
 }
});
