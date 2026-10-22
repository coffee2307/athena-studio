import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,mkdir,writeFile,symlink,rm} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {createHash} from "node:crypto";
import {inspectBackupDirectory} from "../deploy/vps/scripts/backup-status.mjs";

const now=Date.parse("2026-10-22T12:00:00Z");
const filename="athena-identity-20261022T110000Z-test123.age";
async function fixture(t){
 const root=await mkdtemp(path.join(os.tmpdir(),"athena-backup-status-"));
 const dir=path.join(root,"offsite");await mkdir(dir);
 t.after(()=>rm(root,{recursive:true,force:true}));
 const content=Buffer.from("encrypted-fixture");
 await writeFile(path.join(dir,filename),content);
 await writeFile(path.join(dir,filename+".sha256"),createHash("sha256").update(content).digest("hex")+"  "+filename+"\n");
 return dir;
}
test("backup status accepts a fresh encrypted archive with its matching checksum",async t=>{
 const dir=await fixture(t);
 assert.deepEqual(await inspectBackupDirectory(dir,{now}),{
  status:"ok",validArchives:1,unverifiedArchives:0,latestAgeHours:1,partialArchive:false,stale:false
 });
});
test("backup status fails closed when no fresh integrity-checked archive exists",async t=>{
 const dir=await fixture(t);
 await writeFile(path.join(dir,filename+".sha256"),"0".repeat(64)+"  "+filename+"\n");
 const result=await inspectBackupDirectory(dir,{now});
 assert.equal(result.status,"attention");assert.equal(result.validArchives,0);assert.equal(result.stale,true);
});
test("backup status flags interrupted partial archives even when an older valid backup exists",async t=>{
 const dir=await fixture(t);
 await writeFile(path.join(dir,"athena-identity-20261022T115900Z-half.age.part"),"partial");
 const result=await inspectBackupDirectory(dir,{now});
 assert.equal(result.status,"attention");assert.equal(result.partialArchive,true);
});
test("backup status rejects stale archives, symlinks and invalid freshness thresholds",async t=>{
 const dir=await fixture(t);
 assert.equal((await inspectBackupDirectory(dir,{now:now+37*60*60*1000})).stale,true);
 const other=path.join(path.dirname(dir),"outside.age");
 await writeFile(other,"secret");
 await symlink(other,path.join(dir,"athena-identity-20261022T115000Z-link1.age"));
 const result=await inspectBackupDirectory(dir,{now});
 assert.equal(result.validArchives,1);
 await assert.rejects(()=>inspectBackupDirectory(dir,{maxAgeHours:0}),/maximum backup age/);
});
test("backup status rejects malformed calendar timestamps",async t=>{
 const dir=await fixture(t);
 const invalid="athena-identity-20260231T110000Z-bad123.age";
 await writeFile(path.join(dir,invalid),"fixture");
 await writeFile(path.join(dir,invalid+".sha256"),createHash("sha256").update("fixture").digest("hex")+"  "+invalid+"\n");
 const result=await inspectBackupDirectory(dir,{now});
 assert.equal(result.validArchives,1);
 assert.equal(result.latestAgeHours,1);
});
test("restore drill is isolated from the running Compose database and verifies archive identity",async()=>{
 const restore=await (await import("node:fs/promises")).readFile(new URL("../deploy/vps/scripts/restore-drill.sh",import.meta.url),"utf8");
 assert.match(restore,/docker create --name "\$drill" --network none/);
 assert.match(restore,/postgres:17-alpine/);
 assert.match(restore,/athena_recovery/);
 assert.match(restore,/sha256sum -c/);
 assert.match(restore,/productionRestored":false/);
 assert.doesNotMatch(restore,/docker compose|ATHENA_COMPOSE_CONFIG/);
 assert.ok(restore.includes("athena-identity-[0-9]{8}T[0-9]{6}Z"));
});

test("backup status does not hide a newer archive with a missing checksum behind an older valid copy",async t=>{
 const dir=await fixture(t);
 await writeFile(path.join(dir,"athena-identity-20261022T115900Z-new000.age"),"new archive");
 const result=await inspectBackupDirectory(dir,{now});
 assert.equal(result.status,"attention");
 assert.equal(result.validArchives,1);
 assert.equal(result.unverifiedArchives,1);
});
