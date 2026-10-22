import {strict as assert} from "node:assert";
import {test} from "node:test";
import {publicReleaseDecision} from "../lib/release/public.ts";

const env=(patch={})=>({
 NEXT_PUBLIC_SITE_URL:"https://athenastudio.com",
 ATHENA_PUBLIC_SITE_RELEASE_APPROVED:"true",
 ...patch
});
test("Public indexing must be owner-approved, even with an HTTPS site URL",()=>{
 assert.deepEqual(publicReleaseDecision(env({ATHENA_PUBLIC_SITE_RELEASE_APPROVED:"false"})),{
  approved:false,reason:"not_approved",origin:null
 });
 assert.equal(publicReleaseDecision(env({ATHENA_PUBLIC_SITE_RELEASE_APPROVED:undefined})).approved,false);
});
test("Read-only preview always stays noindex, regardless of a mistaken release flag",()=>{
 const result=publicReleaseDecision(env({NEXT_PUBLIC_ATHENA_READ_ONLY_PREVIEW:"true"}));
 assert.equal(result.approved,false);
 assert.equal(result.reason,"preview_mode");
});
test("A strictly validated HTTPS canonical origin may pass the public-indexing gate",()=>{
 assert.deepEqual(publicReleaseDecision(env()),{
  approved:true,reason:"approved",origin:"https://athenastudio.com"
 });
 assert.equal(publicReleaseDecision(env({NEXT_PUBLIC_SITE_URL:"https://www.exampleagency.vn"})).approved,true);
});
test("Reject localhost, temporary tunnels, invalid URLs and credential-bearing URLs",()=>{
 for(const origin of [
  "", "https:/bad","http://athenastudio.com","http://127.0.0.1:3182",
  "https://localhost","https://127.0.0.1","https://athena.trycloudflare.com",
  "https://demo.local","https://example.invalid","https://athenastudio.com/",
  "https://athenastudio.com/path","https://athenastudio.com?foo=bar",
  "https://alice:password@athenastudio.com","https://athenastudio.com/#frag",
  "https://[::1]"
 ]){
  assert.equal(publicReleaseDecision(env({NEXT_PUBLIC_SITE_URL:origin})).approved,false,origin);
 }
});
test("Public release decision does not enable VPS identity or any customer feature",()=>{
 const result=publicReleaseDecision(env({ATHENA_VPS_IDENTITY_ENABLED:"false"}));
 assert.equal(result.approved,true);
 assert.equal("authEnabled" in result,false);
});
