import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {randomBytes} from "node:crypto";
import {Pool} from "pg";
import {createVpsIdentityAuth} from "../lib/identity/vps/factory.ts";
import {listOwnedWorkspaces} from "../lib/identity/vps/workspace.ts";
import {getMigrations} from "better-auth/db/migration";

/**
 * CI must opt in to an EPHEMERAL, local-only PostgreSQL test database.
 * Deliberately refuses the production database name or non-loopback host.
 * No migration is applied to user's local/staging/production data.
 */
const enabled=process.env.ATHENA_CI_REAL_POSTGRES==="true"&&
 process.env.ATHENA_CI_PG_HOST==="127.0.0.1"&&
 process.env.ATHENA_CI_PG_DATABASE==="athena_ci"&&
 process.env.CI==="true";
test("Linux PostgreSQL 17 integration: real OTP, session, schema and tenant isolation",{
 skip:!enabled?"Requires isolated loopback CI PostgreSQL":undefined
},async()=>{
 const pool=new Pool({
  host:"127.0.0.1",port:5432,
  database:"athena_ci",user:"postgres",
  password:process.env.ATHENA_CI_PG_PASSWORD||"",
  max:3,connectionTimeoutMillis:3000
 });
 try{
  const existing=await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  assert.equal(existing.rows.length,0,"CI database must be EMPTY; no destructive migration");
  await pool.query("CREATE ROLE athena_app NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION");
  for(const name of ["001_better_auth.sql","002_workspace.sql"]){
   const sql=await readFile(new URL("../deploy/vps/migrations/"+name,import.meta.url),"utf8");
   await pool.query(sql);
  }
  const outgoing=[];
  const auth=createVpsIdentityAuth({
   origin:"https://athena-ci.example.invalid",
   secret:randomBytes(48).toString("base64url"),
   pool,
   mail:{async send(email,otp,type){outgoing.push({email,otp,type});}}
  });
  const drift=await getMigrations(auth.options);
  assert.deepEqual(drift.toBeCreated,[]);
  assert.deepEqual(drift.toBeAdded,[]);
  const people=[
   {email:"ci-alice@example.invalid",name:"Client A",workspace:"tenant-alice"},
   {email:"ci-bob@example.invalid",name:"Client B",workspace:"tenant-bob"}
  ];
  for(const person of people){
   const start=await auth.api.sendVerificationOTP({body:{email:person.email,type:"sign-in"}});
   assert.equal(start.success,true);
   const code=outgoing.findLast(x=>x.email===person.email)?.otp;
   assert.match(code,/^\d{6}$/);
   const saved=await pool.query('SELECT value FROM "verification" WHERE identifier LIKE $1',["%"+person.email+"%"]);
   assert.ok(saved.rows.every(x=>!String(x.value).includes(code)));
   const bad=code==="000000"?"111111":"000000";
   await assert.rejects(auth.api.signInEmailOTP({body:{email:person.email,otp:bad}}));
   const success=await auth.api.signInEmailOTP({body:{email:person.email,otp:code}});
   assert.ok(success.token);
   assert.equal(success.user.emailVerified,true);
   await assert.rejects(auth.api.signInEmailOTP({body:{email:person.email,otp:code}}));
   person.id=success.user.id;
   await pool.query("INSERT INTO athena_workspace(id,title,kind) VALUES ($1,$2,'client')",
    [person.workspace,person.name]);
   await pool.query("INSERT INTO athena_membership(id,workspace_id,user_id,role) VALUES ($1,$2,$3,'client')",
    ["membership-"+person.workspace,person.workspace,person.id]);
  }
  assert.deepEqual((await listOwnedWorkspaces(pool,people[0].id)).map(x=>x.id),[people[0].workspace]);
  assert.deepEqual((await listOwnedWorkspaces(pool,people[1].id)).map(x=>x.id),[people[1].workspace]);
  const client=await pool.connect();
  try{
   await client.query("SET ROLE athena_app");
   const allowed=await client.query("SELECT id FROM athena_membership WHERE user_id=$1",[people[0].id]);
   assert.equal(allowed.rows.length,1);
   await assert.rejects(client.query("UPDATE athena_membership SET role='admin'"));
   // A failed statement aborts a transaction only inside an explicit BEGIN.
   await assert.rejects(client.query("CREATE TABLE auth_privilege_bypass(id int)"));
  }finally{
   await client.query("RESET ROLE");
   client.release();
  }
 }finally{await pool.end();}
});
