import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {execFileSync,spawnSync} from "node:child_process";
import {localBenchmarkOrigin,percentile,benchmarkSummary} from "../scripts/phase8c5-benchmark-core.mjs";

test("Bounded local benchmark rejects all production, external and credential-bearing URLs",()=>{
 assert.equal(localBenchmarkOrigin("http://127.0.0.1:3000"),"http://127.0.0.1:3000");
 assert.equal(localBenchmarkOrigin("http://localhost:3000"),"http://localhost:3000");
 for(const url of [
  "https://localhost:3000","https://athena-studio.com","http://private.example",
  "http://169.254.169.254","http://127.0.0.1:3000/api/identity",
  "http://127.0.0.1:3000/?secret=x","http://user:pass@localhost:3000",
  "ftp://localhost:3000","http://0.0.0.0:3000"
 ])assert.equal(localBenchmarkOrigin(url),null,url);
 assert.equal(percentile([12,4,8,3,10],0.95),12);
 assert.equal(percentile([],0.95),null);
 assert.deepEqual(benchmarkSummary([
  {duration:10,status:200},{duration:20,status:503},{duration:5,status:0}
 ],0.5),{
  requests:3,passed:1,failed:2,httpErrors:1,networkErrors:1,
  p50Ms:10,p95Ms:20,p99Ms:20,throughputRps:6
 });
});
test("Benchmark never accesses public providers without explicit local-only opt-in",()=>{
 const result=spawnSync(process.execPath,[
  "scripts/phase8c5-benchmark.mjs","--run-local",
  "--origin","https://example.com","--requests","1"
 ],{encoding:"utf8",timeout:8000});
 assert.equal(result.status,2);
 assert.match(result.stderr,/Safe usage/);
 const missing=spawnSync(process.execPath,[
  "scripts/phase8c5-benchmark.mjs","--origin","http://127.0.0.1:3000"
 ],{encoding:"utf8",timeout:8000});
 assert.equal(missing.status,2);
});
test("Next container health requires both HTTP and database, no accidental public server details",async()=>{
 const dockerfile=await readFile(new URL("../deploy/vps/Dockerfile",import.meta.url),"utf8");
 const health=await readFile(new URL("../deploy/vps/healthcheck.cjs",import.meta.url),"utf8");
 assert.match(dockerfile,/HEALTHCHECK/);
 assert.match(dockerfile,/healthcheck\.cjs/);
 assert.match(health,/SELECT 1 AS ready/);
 assert.match(health,/\/api\/health/);
 assert.match(health,/connectionTimeoutMillis/);
 assert.doesNotMatch(health,/console\.log\(.+password/);
 const failure=spawnSync(process.execPath,["deploy/vps/healthcheck.cjs"],{
  env:{...process.env,ATHENA_VPS_PG_PASSWORD_FILE:"/run/secrets/athena_pg_password"},
  encoding:"utf8",timeout:8000
 });
 assert.equal(failure.status,1);
 assert.match(failure.stderr,/readiness check failed/);
 assert.doesNotMatch(failure.stderr,/postgres:|password|secret.*=|[a-f0-9]{64}/i);
});
test("All backup artifacts are encrypted before being written, with offsite verification and atomic publication",async()=>{
 const backup=await readFile(new URL("../deploy/vps/scripts/backup.sh",import.meta.url),"utf8");
 const restore=await readFile(new URL("../deploy/vps/scripts/restore-drill.sh",import.meta.url),"utf8");
 assert.match(backup,/set -Eeuo pipefail/);
 assert.match(backup,/mountpoint -q/);
 assert.match(backup,/age --encrypt --recipient/);
 assert.match(backup,/age\.part/);
 assert.match(backup,/sha256sum/);
 assert.doesNotMatch(backup,/mktemp.*pgdump|pg_dump.*>.*tmp|age --decrypt/);
 assert.match(restore,/sha256sum -c/);
 assert.match(restore,/age --decrypt/);
 assert.match(restore,/athena_restore_drill_/);
 assert.doesNotMatch(restore,/mktemp|--dbname athena_identity\s+<|pg_restore.+--dbname athena_identity/);
 if(process.platform==="win32"){
  const gitBash="C:\\Program Files\\Git\\bin\\bash.exe";
  const syntax=spawnSync(gitBash,["-n",
   "deploy/vps/scripts/backup.sh","deploy/vps/scripts/restore-drill.sh",
   "deploy/vps/scripts/migrate.sh","deploy/vps/init/01-roles.sh"
  ],{encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr);
 }else{
  execFileSync("bash",["-n",
   "deploy/vps/scripts/backup.sh","deploy/vps/scripts/restore-drill.sh",
   "deploy/vps/scripts/migrate.sh","deploy/vps/init/01-roles.sh"
  ]);
 }
});
test("Migration ledger prevents repeated schema operations and detects modified SQL",async()=>{
 const migration=await readFile(new URL("../deploy/vps/scripts/migrate.sh",import.meta.url),"utf8");
 const sql=await readFile(new URL("../deploy/vps/migrations/002_workspace.sql",import.meta.url),"utf8");
 assert.match(migration,/athena_schema_migrations/);
 assert.match(migration,/checksum_sha256/);
 assert.match(migration,/flock -n/);
 assert.match(migration,/BEGIN;/);
 assert.match(migration,/COMMIT;/);
 assert.match(migration,/checksum drift/i);
 assert.doesNotMatch(sql,/^\s*(BEGIN|COMMIT);\s*$/im);
});
