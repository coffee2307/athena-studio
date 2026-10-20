import test from "node:test";
import assert from "node:assert/strict";
import {stageHostIsolated,stagingReadiness,migrationsWithSha256,REQUIRED_MIGRATIONS} from "../scripts/phase8-staging-preflight.mjs";
const good=()=>{
 const env={
  ATHENA_STAGING_APPROVED:"true",
  ATHENA_STAGING_ORIGIN:"https://staging.athena-studio.dev/",
  NEXT_PUBLIC_SITE_URL:"https://staging.athena-studio.dev/",
  SUPABASE_URL:"https://staging-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_URL:"https://staging-project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY:"PLACEHOLDER_PRIVATE_NOT_REAL",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"PLACEHOLDER_PUBLIC_NONLIVE_KEY_VALUE",
  CONTACT_FROM_EMAIL:"hello@athena-studio.dev",
  CONTACT_EMAIL:"owner@example.net",
  RESEND_API_KEY:"PLACEHOLDER_SECRET",
  UPSTASH_REDIS_REST_URL:"https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN:"PLACEHOLDER_SECRET",
  INQUIRY_RATE_SALT:"PRETEND_LENGTH_SALT_1234567890",
  TURNSTILE_SECRET_KEY:"PLACEHOLDER_SECRET",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY:"PLACEHOLDER_SITE_KEY",
  ATHENA_STAGING_PROJECT_REF:"isolated-only-test-ref",
  NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"false",
  NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED:"false",
  ATHENA_OPERATIONS_ENABLED:"false",
  ATHENA_SITEPULSE_ENABLED:"false"
 };
 return env;
};
test("Staging preflight blocks local hosts, PHAM production and non-HTTPS origins",()=>{
 for(const host of ["http://staging.athena-studio.dev/","http://localhost:3000/",
  "https://localhost/","https://phamofficial.com/","https://www.phamofficial.com/",
  "https://staging.athena-studio.dev:8443/","https://staging.example/",
  "https://user:pass@staging.athena-studio.dev/"]){
  assert.equal(stageHostIsolated(host,host),false,host);
 }
 assert.equal(stageHostIsolated("https://staging.athena-studio.dev/","https://staging.athena-studio.dev/"),true);
 assert.equal(stageHostIsolated("https://staging.athena-studio.dev/","https://other.example.org/"),false);
});
test("No provider connections means NO-GO; real integration is always a separate gate",()=>{
 const empty=stagingReadiness({},migrationsWithSha256());
 assert.equal(empty.readyForProviderIntegration,false);
 assert.equal(empty.productionGo,false);
 assert.equal(empty.realProviderIntegrationTested,false);
 assert.ok(empty.missingChecks.includes("owner_approved_staging"));
 assert.ok(empty.missingChecks.includes("supabase_secret"));
 assert.equal(empty.totalChecks,14);
 const full=stagingReadiness(good(),migrationsWithSha256());
 assert.equal(full.readyForProviderIntegration,true);
 assert.equal(full.productionGo,false);
 assert.equal(full.stagingGo,false);
 assert.equal(full.realProviderIntegrationTested,false);
});
test("No secrets in inventory JSON; missing/invalid provider values are reported only as flags",()=>{
 const env=good();
 const report=stagingReadiness(env,migrationsWithSha256());
 const out=JSON.stringify(report);
 assert.doesNotMatch(out,/PLACEHOLDER_PRIVATE_NOT_REAL|PLACEHOLDER_SECRET|PRETEND_LENGTH_SALT|owner@example.net/);
 assert.equal(report.neverPrintCredentials,true);
 for(const key of ["SUPABASE_SERVICE_ROLE_KEY","RESEND_API_KEY","INQUIRY_RATE_SALT"]){
  const modified={...env,[key]:""};
  assert.equal(stagingReadiness(modified,migrationsWithSha256()).readyForProviderIntegration,false);
 }
 assert.equal(stagingReadiness({...env,ATHENA_OPERATIONS_ENABLED:"true"},migrationsWithSha256()).readyForProviderIntegration,false);
});
test("Ordered migration inventory hashes real source; altered list fails preflight",()=>{
 const m=migrationsWithSha256();
 assert.deepEqual(m.map(x=>x.path),REQUIRED_MIGRATIONS);
 assert.ok(m.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)));
 assert.equal(stagingReadiness(good(),m.slice(1)).readyForProviderIntegration,false);
});
