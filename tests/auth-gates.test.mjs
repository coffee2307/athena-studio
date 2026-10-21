import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {authSettings,allowedDestination} from "../lib/auth/config.ts";
test("Auth is disabled without explicit owner opt-in",()=>{
 const restore={...process.env};
 try{
  delete process.env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  assert.equal(authSettings().enabled,false);
  process.env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED="true";
  assert.equal(authSettings().enabled,false);
 }finally{
  for(const key of ["NEXT_PUBLIC_ATHENA_AUTH_ENABLED","NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]){
   if(restore[key]===undefined)delete process.env[key];else process.env[key]=restore[key];
  }
 }
});
test("Auth requires validated HTTPS Supabase and site origin",()=>{
 const keys=["NEXT_PUBLIC_ATHENA_AUTH_ENABLED","NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","NEXT_PUBLIC_SITE_URL"];
 const prior=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try{
  Object.assign(process.env,{NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"true",NEXT_PUBLIC_SUPABASE_URL:"https://example.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_long_demo_only_nonsecret",NEXT_PUBLIC_SITE_URL:"http://localhost:3000"});
  assert.equal(authSettings().enabled,true);
  process.env.NEXT_PUBLIC_SUPABASE_URL="http://example.supabase.co";
  assert.equal(authSettings().enabled,false);
  process.env.NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co";
  process.env.NEXT_PUBLIC_SITE_URL="http://evil-host.example";
  assert.equal(authSettings().enabled,false);
 }finally{for(const k of keys){if(prior[k]===undefined)delete process.env[k];else process.env[k]=prior[k];}}
});
test("Redirect allowlist blocks open redirects, protocol relative URLs, and role spoofing",()=>{
 for(const path of ["/account","/account/change-password","/admin"])assert.equal(allowedDestination(path),path);
 for(const path of ["https://evil.test","//evil.test","/\\evil.test","/%2Fevil","/api/inquiry","/auth/callback","/admin?admin=true","javascript:alert(1)"])assert.equal(allowedDestination(path),"/account");
});
test("Identity SQL uses owner-scoped RLS and disallows browser role writes",async()=>{
 const sql=await readFile(new URL("../docs/db/phase5_identity.sql",import.meta.url),"utf8");
 for(const table of ["athena_profiles","athena_workspaces","athena_memberships"]){
  assert.match(sql,new RegExp("alter table public\\."+table+" enable row level security","i"));
  assert.match(sql,new RegExp("revoke all on public\\."+table+" from anon,authenticated","i"));
 }
 assert.match(sql,/grant update \(display_name\) on public\.athena_profiles to authenticated/i);
 assert.doesNotMatch(sql,/grant\s+(?:insert|update|delete|all).*athena_memberships\s+to\s+authenticated/i);
 assert.match(sql,/\(select auth\.uid\(\)\)=user_id/);
 assert.match(sql,/security definer set search_path=''/);
 assert.doesNotMatch(sql,/role\s*=\s*'admin'\s*\).*where.*raw_user_meta_data/i);
});
