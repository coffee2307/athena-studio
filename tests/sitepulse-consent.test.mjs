import test from "node:test";
import assert from "node:assert/strict";
import {validatePilotAuthorization,eligibleForManualCheck} from "../lib/sitepulse/consent.mjs";
import {run,privateReportPath} from "../scripts/sitepulse-check.mjs";

const stamp="2026-10-20T08:00:00Z",now=new Date("2026-10-20T12:00:00Z");
const targets=[{id:"pham-home",label:"PHAM owned web",url:"https://authorized.test/"}];
const valid={
 schemaVersion:1,pilotId:"research-one",operatorAcknowledged:true,
 authorizationReference:"signed-approval-001",
 approvedAt:stamp,expiresAt:"2026-10-26T08:00:00Z",
 minimumIntervalMinutes:15,maxChecksPerTargetPerDay:6,
 targets:[{id:"pham-home",url:"https://authorized.test/"}]
};
test("Pilot authorization is explicit, scoped, time limited and never inferred from hostname alone",()=>{
 const g=validatePilotAuthorization(valid,targets,now);
 assert.equal(g.pilotId,"research-one");assert.equal(g.minimumIntervalMinutes,15);
 const edits=[
  {...valid,operatorAcknowledged:false},
  {...valid,authorizationReference:""},
  {...valid,expiresAt:"2026-11-20T08:00:00Z"},
  {...valid,approvedAt:"2026-10-21T08:00:00Z"},
  {...valid,expiresAt:"2026-10-20T11:59:59Z"},
  {...valid,targets:[{id:"pham-home",url:"https://authorized.test/sneaky"}]},
  {...valid,minimumIntervalMinutes:1},
  {...valid,maxChecksPerTargetPerDay:500},
 ];
 for(const x of edits)assert.throws(()=>validatePilotAuthorization(x,targets,now),undefined,JSON.stringify(x));
 assert.throws(()=>validatePilotAuthorization(valid,[...targets, {...targets[0],id:"other"}],now));
});
test("Past checks enforce minimum interval and 24-hour per-target budget",()=>{
 const auth=validatePilotAuthorization(valid,targets,now);
 assert.deepEqual(eligibleForManualCheck({targetId:"pham-home",history:[],authorization:auth,now}),{allowed:true,reason:"approved_manual"});
 const latest=[{id:"pham-home",pilotId:"research-one",checkedAt:"2026-10-20T11:55:00Z"}];
 assert.equal(eligibleForManualCheck({targetId:"pham-home",history:latest,authorization:auth,now}).reason,"minimum_interval");
 const daily=Array.from({length:6},(_,i)=>({id:"pham-home",pilotId:"research-one",checkedAt:"2026-10-20T08:0"+i+":00Z"}));
 assert.equal(eligibleForManualCheck({targetId:"pham-home",history:daily,authorization:auth,now}).reason,"daily_limit");
 // Checks from a different pilot or a different target do not spend this pilot budget.
 assert.equal(eligibleForManualCheck({targetId:"pham-home",history:daily.map(x=>({...x,pilotId:"older-pilot"})),authorization:auth,now}).allowed,true);
});
test("Operator run refuses absent/mismatched/expired permission before any HTTP activity",async()=>{
 const env={ATHENA_SITEPULSE_ENABLED:"true",ATHENA_SITEPULSE_TARGETS_JSON:JSON.stringify(targets),
  ATHENA_SITEPULSE_APPROVED_HOSTS:"authorized.test",
  ATHENA_SITEPULSE_CONSENT_FILE:".qa/private-owner-approval.json"};
 let probes=0;
 const opts={env,probe:async()=>{probes++;throw Error("SHOULD NEVER PROBE");},
  historyLoader:async()=>[],writer:async()=>{},clock:()=>now,lockEnabled:false};
 await assert.rejects(run({...opts,authorizationLoader:async()=>({...valid,expiresAt:"2026-10-19T00:00:00Z"})}),/hiệu lực/);
 await assert.rejects(run({...opts,authorizationLoader:async()=>({...valid,targets:[{id:"pham-home",url:"https://evil.test/"}]})}),/khớp/);
 await assert.rejects(run({...opts,authorizationLoader:async()=>{throw Error("permission file missing");}}),/permission file missing/);
 assert.equal(probes,0);
});
test("Operator run enforces rate limits and stores pilot scope with no response bodies",async()=>{
 const env={ATHENA_SITEPULSE_ENABLED:"true",ATHENA_SITEPULSE_TARGETS_JSON:JSON.stringify(targets),
  ATHENA_SITEPULSE_APPROVED_HOSTS:"authorized.test",ATHENA_SITEPULSE_REPORT_FILE:".qa/sitepulse-results-test.jsonl"};
 const history=[{pilotId:"research-one",id:"pham-home",checkedAt:"2026-10-20T11:58:00Z",state:"down"}];
 let count=0,writes=[];
 const base={env,authorizationLoader:async()=>valid,historyLoader:async()=>history,
  clock:()=>now,lockEnabled:false,probe:async()=>{count++;return {checkedAt:"2026-10-20T12:00:00Z",state:"up",httpStatus:200,responseMs:120,ttfbMs:90,detail:"http_success",body:"SECRET BODY"};},
  writer:async(_f,data)=>writes.push(JSON.parse(data))};
 const blocked=await run(base);
 assert.equal(blocked.skipped.length,1);assert.equal(blocked.skipped[0].reason,"minimum_interval");
 assert.equal(count,0);
 const result=await run({...base,historyLoader:async()=>[]});
 assert.equal(result.checks.length,1);assert.equal(count,1);assert.equal(writes.length,1);
 assert.equal(writes[0].pilotId,"research-one");
 assert.equal(writes[0].body,undefined);
 assert.equal(writes[0].schemaVersion,2);
});
test("Evidence path is restricted to the ignored local .qa folder",()=>{
 assert.ok(privateReportPath(".qa/sitepulse-results.jsonl").endsWith("sitepulse-results.jsonl"));
 for(const p of ["../outside.jsonl","report.jsonl",".qa/../outside.jsonl",".qa/exploit.txt"]){
  assert.throws(()=>privateReportPath(p));
 }
});
