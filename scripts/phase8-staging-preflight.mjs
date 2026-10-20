/**
 * Athena Phase 8B — offline staging configuration preflight.
 * This DOES NOT contact Supabase, Google, email, Redis, Turnstile or hosting.
 * It never prints a credential value and never mutates customer data.
 */
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export const REQUIRED_MIGRATIONS=Object.freeze([
 "docs/db/phase3_inquiries.sql",
 "docs/db/phase5_identity.sql",
 "docs/db/phase6_operations.sql",
 "docs/db/phase6_storage.sql",
 "docs/db/phase8b_security_hardening.sql"
]);
export const PRIVATE_ENV=Object.freeze([
 "SUPABASE_SERVICE_ROLE_KEY","RESEND_API_KEY","UPSTASH_REDIS_REST_TOKEN",
 "INQUIRY_RATE_SALT","TURNSTILE_SECRET_KEY"
]);
const isConfigured=e=>typeof e==="string"&&e.trim().length>0;
const privateUrl=value=>{
 try{
  const u=new URL(value||"");
  return u.protocol==="https:"&&!u.username&&!u.password&&!u.search&&!u.hash;
 }catch{return false;}
};
export function stageHostIsolated(site,declaredOrigin){
 try{
  const url=new URL(site||"");
  if(url.protocol!=="https:"||url.username||url.password||
   url.port||url.search||url.hash||url.pathname!=="/")return false;
  const host=url.hostname.toLowerCase();
  if(host==="localhost"||host==="127.0.0.1"||host.endsWith(".local")||
   host.endsWith(".test")||host.endsWith(".example")||
   host==="phamofficial.com"||host.endsWith(".phamofficial.com")||
   !host.includes(".")||site!==url.origin+"/")return false;
  return site===declaredOrigin;
 }catch{return false;}
}
export function stagingReadiness(env,files=[]){
 const e={...env};
 const publicOrigin=e.NEXT_PUBLIC_SITE_URL||"";
 const marker=e.ATHENA_STAGING_ORIGIN||"";
 const dbUrl=e.SUPABASE_URL||"";
 const browserUrl=e.NEXT_PUBLIC_SUPABASE_URL||"";
 const conditions=[
  ["owner_approved_staging",e.ATHENA_STAGING_APPROVED==="true"],
  ["isolated_https_origin",stageHostIsolated(publicOrigin,marker)],
  ["supabase_api_https",privateUrl(dbUrl)&&privateUrl(browserUrl)&&dbUrl===browserUrl],
  ["supabase_publishable",isConfigured(e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)&&
    e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.length>=21],
  ["supabase_secret",isConfigured(e.SUPABASE_SERVICE_ROLE_KEY)],
  ["email_sender_recipient",isConfigured(e.CONTACT_FROM_EMAIL)&&isConfigured(e.CONTACT_EMAIL)],
  ["resend_key",isConfigured(e.RESEND_API_KEY)],
  ["redis_https",privateUrl(e.UPSTASH_REDIS_REST_URL)],
  ["redis_token",isConfigured(e.UPSTASH_REDIS_REST_TOKEN)],
  ["rate_salt",isConfigured(e.INQUIRY_RATE_SALT)&&e.INQUIRY_RATE_SALT.length>=24],
  ["turnstile_pair",isConfigured(e.TURNSTILE_SECRET_KEY)&&isConfigured(e.NEXT_PUBLIC_TURNSTILE_SITE_KEY)],
  ["staging_project_reference",isConfigured(e.ATHENA_STAGING_PROJECT_REF)],
  ["public_features_disabled_before_acceptance",
   e.NEXT_PUBLIC_ATHENA_AUTH_ENABLED!=="true"&&
   e.NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED!=="true"&&
   e.ATHENA_OPERATIONS_ENABLED!=="true"&&
   e.ATHENA_SITEPULSE_ENABLED!=="true"],
  ["migration_files_present",REQUIRED_MIGRATIONS.every(f=>files.some(x=>x.path===f&&/^[a-f0-9]{64}$/.test(x.sha256)))]
 ];
 const missing=conditions.filter(([,ready])=>!ready).map(([id])=>id);
 return {
  track:"phase8b-staging-configuration-only",
  readyForProviderIntegration:missing.length===0,
  missingChecks:missing,
  passedChecks:conditions.length-missing.length,
  totalChecks:conditions.length,
  migrationFiles:files,
  neverPrintCredentials:true,
  realProviderIntegrationTested:false,
  realTenantIsolationTested:false,
  productionGo:false,
  stagingGo:false,
  note:"Only a configuration inventory. Requires human-authorized real-provider validation and A/B database tests."
 };
}
export function migrationsWithSha256(read=readFileSync){
 return REQUIRED_MIGRATIONS.map(f=>({
  path:f,sha256:createHash("sha256").update(read(path.join(repo,f))).digest("hex")
 }));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=stagingReadiness(process.env,migrationsWithSha256());
 console.log(JSON.stringify(report,null,2));
 if(process.argv.includes("--require-configuration")&&!report.readyForProviderIntegration)process.exitCode=2;
}
