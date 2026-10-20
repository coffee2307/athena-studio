import test from "node:test";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {loadDraft,previewPhamPilot,PHAM_TARGETS} from "../scripts/sitepulse-pham-plan.mjs";
import {validatePilotAuthorization} from "../lib/sitepulse/consent.mjs";

test("PHAM pilot draft remains deliberately unapproved and has only the proposed root URL",async()=>{
 const draft=await loadDraft();
 assert.equal(draft.operatorAcknowledged,false);
 assert.equal(draft.approvedAt,null);
 assert.equal(draft.expiresAt,null);
 assert.deepEqual(draft.targets,[{id:"pham-home",url:"https://phamofficial.com/"}]);
 assert.equal(PHAM_TARGETS.length,1);
 assert.throws(()=>validatePilotAuthorization(draft,PHAM_TARGETS),/chưa được xác nhận/);
 const report=previewPhamPilot(draft);
 assert.equal(report.canProbe,false);
 assert.equal(report.authorized,false);
 assert.equal(report.target,"https://phamofficial.com/");
 assert.equal(report.mode,"OFFLINE_ONLY_NO_NETWORK");
 assert.equal(report.minIntervalMinutes,15);
 assert.equal(report.maxDailyChecks,8);
});
test("PHAM proposal CLI is read-only even when called from Node",()=>{
 const run=spawnSync(process.execPath,["scripts/sitepulse-pham-plan.mjs"],{
  cwd:process.cwd(),encoding:"utf8",timeout:10000,
  env:{...process.env,ATHENA_SITEPULSE_ENABLED:"false"}
 });
 assert.equal(run.status,0,run.stderr);
 const data=JSON.parse(run.stdout);
 assert.equal(data.canProbe,false);
 assert.equal(data.mode,"OFFLINE_ONLY_NO_NETWORK");
});
