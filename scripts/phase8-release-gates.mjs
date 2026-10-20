/**
 * Phase 8A: purely local release integrity check.
 * No provider access, Git mutations, DNS, payment, production or migrations.
 */
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

export const MILESTONES=Object.freeze([
 ["REBUILD","3468535"],
 ["PHASE0","807f256"],
 ["PHASE1","9345872"],
 ["PHASE2","752a4ff"],
 ["PHASE3","1224e33"],
 ["PHASE4","3918e4e"],
 ["PHASE5","d8ae1e5"],
 ["PHASE6","46fc89e"],
 ["PHASE7","d31c0cd"],
 ["PHASE7_1","4b47b0c"],
 ["PHASE7_2","9ecd078"],
 ["PHASE7_3","da79356"],
 ["PHASE8_PROPOSAL","f37c6b8"]
]);
export const REQUIRED_DISABLED=Object.freeze([
 "NEXT_PUBLIC_ATHENA_AUTH_ENABLED",
 "NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED",
 "ATHENA_OPERATIONS_ENABLED",
 "ATHENA_SITEPULSE_ENABLED",
 "ATHENA_INDEPENDENT_AUTH_ENABLED",
 "ATHENA_IDENTITY_LOCAL_ONLY",
 "ATHENA_GMAIL_SENDER_ENABLED",
 "ATHENA_VPS_IDENTITY_ENABLED",
 "ATHENA_VPS_RELEASE_APPROVED"
]);
export const REQUIRED_UNSET=Object.freeze([
 "NEXT_PUBLIC_SUPABASE_URL",
 "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
 "SUPABASE_URL",
 "SUPABASE_SERVICE_ROLE_KEY",
 "RESEND_API_KEY",
 "CONTACT_FROM_EMAIL",
 "UPSTASH_REDIS_REST_URL",
 "UPSTASH_REDIS_REST_TOKEN",
 "INQUIRY_RATE_SALT",
 "TURNSTILE_SECRET_KEY",
 "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
 "BETTER_AUTH_SECRET",
 "ATHENA_IDENTITY_DB_PATH",
 "ATHENA_GOOGLE_OAUTH_CLIENT_ID",
 "ATHENA_GOOGLE_OAUTH_CLIENT_SECRET",
 "ATHENA_GITHUB_OAUTH_CLIENT_ID",
 "ATHENA_GITHUB_OAUTH_CLIENT_SECRET",
 "ATHENA_GMAIL_CLIENT_ID",
 "ATHENA_GMAIL_CLIENT_SECRET",
 "ATHENA_GMAIL_REFRESH_TOKEN",
 "ATHENA_GMAIL_SENDER",
 "ATHENA_VPS_AUTH_ORIGIN"
]);
export function assertSafeExampleEnv(raw){
 const vars=new Map();
 for(const line of raw.split(/\r?\n/)){
  const clean=line.trim();
  if(!clean||clean.startsWith("#"))continue;
  const match=/^([A-Z][A-Z0-9_]*)=(.*)$/.exec(clean);
  if(!match)throw Error("Unrecognized environment example line");
  if(vars.has(match[1]))throw Error("Duplicate environment key: "+match[1]);
  vars.set(match[1],match[2]);
 }
 for(const name of REQUIRED_DISABLED)
  if(vars.get(name)!=="false")throw Error("Release gate requires "+name+"=false by default");
 for(const name of REQUIRED_UNSET)
  if(vars.get(name)!=="")throw Error("Release gate requires "+name+" blank");
 if(vars.get("NEXT_PUBLIC_SITE_URL")!=="http://localhost:3000")
  throw Error("Example site must remain local until hosting owner review");
 const unknownPublic=[...vars.keys()].filter(k=>k.startsWith("NEXT_PUBLIC_")&&
  !["NEXT_PUBLIC_SITE_URL","NEXT_PUBLIC_ATHENA_AUTH_ENABLED",
   "NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED","NEXT_PUBLIC_SUPABASE_URL",
   "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","NEXT_PUBLIC_TURNSTILE_SITE_KEY"].includes(k));
 if(unknownPublic.length)throw Error("New public variable needs explicit security review: "+unknownPublic.join(","));
 return {flagsDisabled:REQUIRED_DISABLED.length,providerValuesBlank:REQUIRED_UNSET.length,checkedVariables:vars.size};
}
export function assertNoSensitiveTrackedFiles(files){
 const blocked=files.filter(f=>
  /(^|\/)\.qa\//i.test(f)||
  /(^|\/)deploy\/vps\/(?:secrets|backups)\//i.test(f)||
  /(^|\/)deploy\/vps\/(?:config\.local|compose\.override\.yaml)$/i.test(f)||
  /\.(?:age|dump|backup)$/i.test(f)||
  /(^|\/)\.wrangler\//i.test(f)||
  /(^|\/)\.dev\.vars(?:\.|$)/i.test(f)||
  /\.(?:sqlite|sqlite3|db)(?:-wal|-shm|-journal)?$/i.test(f)||
  /(^|\/)\.env\.(?!example$)/i.test(f)||
  /\.(?:pem|p12|pfx|key)$/i.test(f)||
  /(?:^|\/)sitepulse-results.*\.(?:jsonl|json)$/i.test(f)
 );
 if(blocked.length)throw Error("Potential sensitive files are tracked: "+blocked.join(", "));
 return files.length;
}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const git=(args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim();
const isAncestor=(parent,child)=>{
 try{execFileSync("git",["merge-base","--is-ancestor",parent,child],{cwd:root,stdio:"ignore"});return true;}
 catch{return false;}
};
export function createReleaseEvidence({head,base,ancestry,env,trackedCount}){
 return {
  releaseTrack:"athena-phase8a-integration-candidate",
  codeStatus:"candidate-not-production-approved",
  baseMain:base,head,verifiedAncestry:ancestry,
  defaultFlagsOff:env.flagsDisabled,defaultProviderValuesBlank:env.providerValuesBlank,
  trackedFileCount:trackedCount,
  holds:["no-merge-main","no-production-deploy","no-DNS-change",
    "no-real-provider-or-customer-migration","no-paid-service-activation",
    "sitepulse-commercial-validation-pending"],
  notes:["Programmatic ancestry and config checks are necessary but not sufficient for secure release.",
    "A CI pass is not equivalent to Supabase/Auth, SMTP, Storage, backup or business acceptance."]
 };
}
export function assertSafeCloudWorkerConfig(raw){
 if(!/^workers_dev\s*=\s*false\s*$/m.test(raw))throw Error("Cloud identity worker must default to private");
 if(!/^ATHENA_CLOUD_IDENTITY_ENABLED\s*=\s*"false"\s*$/m.test(raw))
  throw Error("Cloud identity worker must be OFF in tracked configuration");
 if(!/^ATHENA_AUTH_ORIGIN\s*=\s*""\s*$/m.test(raw))
  throw Error("Cloud identity public origin requires independent review");
 if(!/^database_id\s*=\s*"00000000-0000-0000-0000-000000000000"\s*$/m.test(raw))
  throw Error("Cloud D1 must have placeholder binding until explicit approval");
 if(/^\s*routes?\s*=/m.test(raw)||/BETTER_AUTH_SECRET\s*=/.test(raw))
  throw Error("Cloud worker routes or credentials must not appear in tracked config");
 return true;
}
export function assertSafeVpsDeploymentTemplate(compose,configExample,dockerignore){
 const required=["ATHENA_VPS_IDENTITY_ENABLED=false","ATHENA_VPS_RELEASE_APPROVED=false"];
 for(const line of required)
  if(!configExample.split(/\r?\n/).includes(line))
   throw Error("VPS identity template is enabled by default: "+line);
 for(const flag of ["ATHENA_VPS_IDENTITY_ENABLED","ATHENA_VPS_RELEASE_APPROVED"])
  if(!compose.includes("$"+"{"+flag+":-false}"))
   throw Error("VPS deployment must default "+flag+" to false");
 if(!compose.includes("internal: true")||!compose.includes("read_only: true")||
  !compose.includes("no-new-privileges:true")||!compose.includes("ATHENA_VPS_PG_PASSWORD_FILE"))
  throw Error("VPS isolation requirement missing");
 if(/(?:5432|3000)\s*:\s*(?:5432|3000)/.test(compose))
  throw Error("VPS must never publish DB or internal Next port");
 if(!dockerignore.includes(".env*")||!dockerignore.includes("deploy/vps/secrets/"))
  throw Error("VPS container could include local credentials");
 return true;
}
export function verifyRelease(){
 const main="cc3be136de11d748cc71bbb0f2895fe494d35d17";
 const head=git(["rev-parse","HEAD"]);
 if(!isAncestor(main,head))throw Error("Base main commit absent from integration branch");
 let prev=main;
 for(const [phase,sha] of MILESTONES){
  if(!isAncestor(prev,sha)||!isAncestor(sha,head))
   throw Error("Missing or reordered milestone "+phase+": "+sha);
  prev=sha;
 }
 const env=assertSafeExampleEnv(readFileSync(path.join(root,".env.example"),"utf8"));
 assertSafeCloudWorkerConfig(readFileSync(path.join(root,"workers/identity/wrangler.toml"),"utf8"));
 assertSafeVpsDeploymentTemplate(
  readFileSync(path.join(root,"deploy/vps/compose.yaml"),"utf8"),
  readFileSync(path.join(root,"deploy/vps/config.example"),"utf8"),
  readFileSync(path.join(root,".dockerignore"),"utf8")
 );
 const tracked=git(["ls-files","-z"]).split("\0").filter(Boolean);
 const count=assertNoSensitiveTrackedFiles(tracked);
 const required=[
  "docs/ATHENA_MASTER_ROADMAP.md","docs/PHASE8_PROPOSAL.md",
  "docs/PHASE8_ACCEPTANCE_MATRIX.md",
  "docs/db/phase3_inquiries.sql","docs/db/phase5_identity.sql",
  "docs/db/phase6_operations.sql","docs/db/phase6_storage.sql",
  "docs/db/phase8b_security_hardening.sql",
  "app/san-pham/sitepulse/page.tsx","tests/operations-rls.test.mjs",
  "tests/sitepulse-consent.test.mjs"
 ];
 for(const f of required)if(!tracked.includes(f))throw Error("Missing required tracked file: "+f);
 return createReleaseEvidence({head,baseMain:main,base:main,
  ancestry:MILESTONES.map(([phase,sha])=>({phase,sha})),env,trackedCount:count});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const result=verifyRelease();
  console.log(JSON.stringify(result,null,2));
 }catch(err){
  console.error("Release integrity gate FAILED:",err?.message||"unknown");
  process.exitCode=1;
 }
}
