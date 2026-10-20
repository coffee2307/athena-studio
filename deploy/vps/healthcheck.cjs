#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS probe runs in standalone Node */
"use strict";
/**
 * Container-only readiness probe. A healthy HTTP listener is not sufficient:
 * a database outage makes logins unusable, even while public pages render.
 *
 * No credentials or user/session data are written to logs.
 * Runs from inside the existing non-root Next.js container.
 */
const {readFileSync}=require("node:fs");
const {Client}=require("pg");
const timeoutMs=2500;
async function run(){
 const root=process.env;
 const secretFile=root.ATHENA_VPS_PG_PASSWORD_FILE;
 if(secretFile!=="/run/secrets/athena_pg_password")return false;
 let password;
 try{
  password=readFileSync(secretFile,"utf8").trimEnd();
  if(password.length<20)return false;
 }catch{return false;}
 const client=new Client({
  host:root.ATHENA_VPS_PG_HOST||"postgres",
  port:Number(root.ATHENA_VPS_PG_PORT)||5432,
  database:root.ATHENA_VPS_PG_DATABASE||"athena_identity",
  user:root.ATHENA_VPS_PG_USER||"athena_app",
  password,
  connectionTimeoutMillis:timeoutMs,
  query_timeout:timeoutMs,
  statement_timeout:timeoutMs,
  application_name:"athena-container-readiness"
 });
 try{
  const site=await fetch("http://127.0.0.1:3000/api/health",{signal:AbortSignal.timeout(timeoutMs)});
  if(!site.ok)return false;
  await client.connect();
  const result=await client.query("SELECT 1 AS ready");
  return result.rows.length===1&&result.rows[0].ready===1;
 }catch{return false;}
 finally{
  await client.end().catch(()=>{});
 }
}
run().then(ok=>{
 if(!ok)process.stderr.write("Athena readiness check failed (details withheld)\n");
 process.exitCode=ok?0:1;
}).catch(()=>{
 process.stderr.write("Athena readiness check failed (details withheld)\n");
 process.exitCode=1;
});
