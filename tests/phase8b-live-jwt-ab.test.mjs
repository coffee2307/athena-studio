import test from "node:test";
import assert from "node:assert/strict";
import {runJwtABReadOnly} from "../scripts/phase8b-live-jwt-ab.mjs";
const A="11111111-1111-4111-8111-111111111111";
const B="22222222-2222-4222-8222-222222222222";
const WA="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const WB="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PA="cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const PB="dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const jwtA="header.payload.signature_with_nonlive_dummy_A";
const jwtB="header.payload.signature_with_nonlive_dummy_B";
const env=()=>({
 ATHENA_STAGING_PROJECT_REF:"vsykqdlfmtndjwnfmfph",
 NEXT_PUBLIC_SUPABASE_URL:"https://vsykqdlfmtndjwnfmfph.supabase.co",
 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_NONLIVE_UNIT_TEST_ONLY",
 ATHENA_A_JWT:jwtA,ATHENA_B_JWT:jwtB,
 ATHENA_A_USER_ID:A,ATHENA_B_USER_ID:B,
 ATHENA_A_WORKSPACE_ID:WA,ATHENA_B_WORKSPACE_ID:WB,
 ATHENA_A_PROJECT_ID:PA,ATHENA_B_PROJECT_ID:PB
});
function mockProvider({leak=false,unverified=false}={}){
 const calls=[];
 const fetcher=async(url,opts)=>{
  calls.push({url,opts});
  const a=opts.headers.Authorization===`Bearer ${jwtA}`;
  const current=a?{id:A,workspace:WA,project:PA}:{id:B,workspace:WB,project:PB};
  if(url.endsWith("/auth/v1/user"))return {status:200,json:async()=>({id:current.id,email_confirmed_at:unverified?null:"2026-10-20T00:00:00Z"})};
  const id=new URL(url).searchParams.get("id").slice(3);
  const rows=(leak||id===current.workspace||id===current.project)?[{id}]:[];
  return {status:200,json:async()=>rows};
 };
 return {fetcher,calls};
}
test("Real A/B verifier checks Auth subjects, own records and invisible cross-tenant records",async()=>{
 const {fetcher,calls}=mockProvider();
 const r=await runJwtABReadOnly(env(),fetcher);
 assert.equal(r.pass,true);
 assert.equal(r.verifiedWorkspaceReads,4);
 assert.equal(r.verifiedProjectReads,4);
 assert.equal(r.projectRowIsolationTested,true);
 assert.equal(r.writesPerformed,false);
 assert.ok(calls.every(x=>x.opts.method==="GET"));
 assert.ok(calls.every(x=>x.opts.headers.apikey===env().NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY));
 assert.doesNotMatch(JSON.stringify(r),/header.payload|signature_with_nonlive/);
});
test("Verifier fails closed when tenant data leaks or accounts are not configured",async()=>{
 const {fetcher}=mockProvider({leak:true});
 await assert.rejects(()=>runJwtABReadOnly(env(),fetcher),/tenant_read_isolation_failed/);
 await assert.rejects(()=>runJwtABReadOnly({...env(),ATHENA_A_JWT:""},fetcher),/verified_test_jwts_required/);
 await assert.rejects(()=>runJwtABReadOnly(env(),mockProvider({unverified:true}).fetcher),/auth_email_unverified/);
 await assert.rejects(()=>runJwtABReadOnly({...env(),ATHENA_B_USER_ID:A},fetcher),/A_and_B_must_be_distinct/);
 await assert.rejects(()=>runJwtABReadOnly({...env(),NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"true"},fetcher),/public_features_must_remain_disabled/);
 await assert.rejects(()=>runJwtABReadOnly({...env(),ATHENA_B_PROJECT_ID:""},fetcher),/both_project_ids_required_or_neither/);
});
test("Workspace-only result cannot claim project row or storage testing",async()=>{
 const e=env();delete e.ATHENA_A_PROJECT_ID;delete e.ATHENA_B_PROJECT_ID;
 const {fetcher}=mockProvider();
 const result=await runJwtABReadOnly(e,fetcher);
 assert.equal(result.pass,true);
 assert.equal(result.projectRowIsolationTested,false);
 assert.equal(result.verifiedProjectReads,0);
 assert.equal(result.storageIsolationTested,false);
});
