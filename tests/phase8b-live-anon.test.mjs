import test from "node:test";
import assert from "node:assert/strict";
import {validateLiveTarget,runLiveAnonReadOnly,PROTECTED_TABLES} from "../scripts/phase8b-live-anon-readonly.mjs";

const env=()=>({
 ATHENA_STAGING_PROJECT_REF:"vsykqdlfmtndjwnfmfph",
 NEXT_PUBLIC_SUPABASE_URL:"https://vsykqdlfmtndjwnfmfph.supabase.co",
 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_NONLIVE_FOR_UNIT_TESTS",
 NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"false",
 NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED:"false",
 ATHENA_OPERATIONS_ENABLED:"false",
 ATHENA_SITEPULSE_ENABLED:"false"
});
test("Live preflight only targets the explicitly named staging project",()=>{
 assert.equal(validateLiveTarget(env()).ref,"vsykqdlfmtndjwnfmfph");
 for(const changes of [
  {ATHENA_STAGING_PROJECT_REF:""},
  {NEXT_PUBLIC_SUPABASE_URL:"https://phamofficial.com"},
  {NEXT_PUBLIC_SUPABASE_URL:"https://otherproject.supabase.co"},
  {NEXT_PUBLIC_SUPABASE_URL:"http://vsykqdlfmtndjwnfmfph.supabase.co"},
  {NEXT_PUBLIC_SUPABASE_URL:"https://vsykqdlfmtndjwnfmfph.supabase.co/"},
  {NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_secret_FORBIDDEN"},
  {NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"true"},
  {ATHENA_OPERATIONS_ENABLED:"true"}
 ])assert.throws(()=>validateLiveTarget({...env(),...changes}));
});
test("All protected Athena tables are probed using GET and publishable apikey only",async()=>{
 const calls=[];
 const mock=async(url,opts)=>{
  calls.push({url,opts});
  return {status:403};
 };
 const result=await runLiveAnonReadOnly(env(),mock);
 assert.equal(PROTECTED_TABLES.length,11);
 assert.equal(result.checkedResources,11);
 assert.equal(result.blockedResources,11);
 assert.equal(result.pass,true);
 assert.equal(result.realJwtABIsolationTested,false);
 assert.equal(result.writesPerformed,false);
 assert.ok(calls.every(x=>x.opts.method==="GET"));
 assert.ok(calls.every(x=>x.opts.headers.apikey===env().NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY));
 assert.ok(calls.every(x=>!Object.keys(x.opts.headers).includes("Authorization")));
 assert.ok(calls.every(x=>x.url.startsWith(env().NEXT_PUBLIC_SUPABASE_URL+"/rest/v1/athena_")));
 assert.doesNotMatch(JSON.stringify(result),/sb_publishable_NONLIVE/);
});
test("HTTP 200 even with an empty DB is NO-GO, and timeout is not PASS",async()=>{
 const ok=await runLiveAnonReadOnly(env(),async()=>({status:200}));
 assert.equal(ok.pass,false);
 const unavailable=await runLiveAnonReadOnly(env(),async()=>{throw Error("private details omitted");});
 assert.equal(unavailable.pass,false);
 assert.equal(unavailable.results[0].status,"network_error");
 assert.doesNotMatch(JSON.stringify(unavailable),/private details omitted/);
});
test("401, 403 and non-exposed 404 count as anonymous denial, never as JWT A/B validation",async()=>{
 let i=0;
 const res=await runLiveAnonReadOnly(env(),async()=>({status:[401,403,404][(i++)%3]}));
 assert.equal(res.pass,true);
 assert.equal(res.realJwtABIsolationTested,false);
});
