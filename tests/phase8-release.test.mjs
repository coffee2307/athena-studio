import test from "node:test";
import assert from "node:assert/strict";
import {MILESTONES,REQUIRED_DISABLED,REQUIRED_UNSET,
 assertSafeExampleEnv,assertNoSensitiveTrackedFiles,createReleaseEvidence,
 verifyRelease} from "../scripts/phase8-release-gates.mjs";
const fixture=()=>{
 return [...REQUIRED_DISABLED.map(k=>k+"=false"),
 ...REQUIRED_UNSET.map(k=>k+"="),"NEXT_PUBLIC_SITE_URL=http://localhost:3000"].join("\n")+"\n";
};
test("Phase 8A enforces fail-closed account, operations and SitePulse flags",()=>{
 const base=fixture();
 assert.equal(assertSafeExampleEnv(base).flagsDisabled,7);
 for(const key of REQUIRED_DISABLED){
  assert.throws(()=>assertSafeExampleEnv(base.replace(key+"=false",key+"=true")),new RegExp(key));
  assert.throws(()=>assertSafeExampleEnv(base.replace(key+"=false","")),new RegExp(key));
 }
 for(const key of REQUIRED_UNSET)assert.throws(()=>assertSafeExampleEnv(
  base.replace(key+"=",key+"=forbidden-secret")),new RegExp(key));
 assert.throws(()=>assertSafeExampleEnv(base+"NEXT_PUBLIC_SITE_URL=http://new-origin.test\n"),/Duplicate/);
 assert.throws(()=>assertSafeExampleEnv(base+"NEXT_PUBLIC_UNREVIEWED_PUBLIC_KEY=x\n"),/security review/);
});
test("No approval or private data are silently packaged into a tracked release",()=>{
 assert.equal(assertNoSensitiveTrackedFiles(["README.md","docs/PHASE8_PROPOSAL.md",".env.example"]),3);
 for(const name of [".qa/sitepulse-consent.json",".env.local","subdir/.env.production",
  "cert.pem","keys/client.key",".qa/sitepulse-pham-pilot-01.jsonl"]){
  assert.throws(()=>assertNoSensitiveTrackedFiles(["README.md",name]),/sensitive/);
 }
});
test("Release candidate manifest communicates held gates without falsely claiming production",()=>{
 const doc=createReleaseEvidence({head:"a",base:"b",ancestry:[{phase:"Phase7",sha:"def"}],
  env:{flagsDisabled:7,providerValuesBlank:21},trackedCount:200});
 assert.equal(doc.codeStatus,"candidate-not-production-approved");
 assert.ok(doc.holds.includes("no-production-deploy"));
 assert.ok(doc.notes.some(s=>s.includes("CI pass")));
 assert.equal(MILESTONES.length,13);
});
test("Actual local ancestry and provider defaults pass on Phase 8A integration branch",()=>{
 const result=verifyRelease();
 assert.equal(result.baseMain,"cc3be136de11d748cc71bbb0f2895fe494d35d17");
 assert.equal(result.verifiedAncestry.length,13);
 assert.ok(result.trackedFileCount>100);
 assert.equal(result.defaultFlagsOff,7);
});
