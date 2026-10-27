#!/usr/bin/env node
/**
 * Athena production-A preflight. Read-only: no deployment, DNS, DB, secrets,
 * paid services or provider changes. Exit 0 means automated checks passed,
 * NOT that launch has been authorized or external evidence has been reviewed.
 */
import {execFileSync} from "node:child_process";
import {existsSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {publicReleaseDecision} from "../lib/release/public.ts";
import {modelPublicationRights} from "../lib/release/model-rights.mjs";

const production=process.argv.includes("--production");
const root=resolve(import.meta.dirname,"..");
const checks=[];
const check=(id,passed,detail)=>checks.push({id,status:passed?"PASS":"FAIL",detail});
const git=(...args)=>{
 try{return execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();}
 catch{return "";}
};
const read=(path)=>readFileSync(resolve(root,path),"utf8");
const origin=publicReleaseDecision(process.env);
const branch=git("branch","--show-current");
const sha=git("rev-parse","HEAD");
const clean=git("status","--porcelain")==="";
const expected=git("rev-parse","origin/main");
const layout=read("app/layout.tsx");
check("source_sha",/^[a-f0-9]{40}$/.test(sha),"Commit must be identifiable");
check("single_theme_import",(layout.match(/import "@\/app\/athena-monochrome\.css";/g)||[]).length===1,
 "Monochrome styles must be imported exactly once");
check("preview_proxy_is_read_only",read("scripts/preview-readonly.mjs").includes("req.method!==\"GET\"&&req.method!==\"HEAD\""),
 "Authenticated mobile preview must reject mutation methods");
check("preview_api_blocked",read("scripts/preview-readonly.mjs").includes('pathname.startsWith("/api/")'),
 "Private preview must not expose identity or business APIs");
if(production){
 check("branch_is_main",branch==="main","Deploy from merged main, never a feature branch");
 check("main_matches_remote",!!expected&&sha===expected,"Fetch origin/main and verify exact release SHA");
 check("clean_worktree",clean,"No unstaged or untracked sources in release");
 check("owner_approved_indexing",origin.approved,
  "Explicit owner-approved indexing plus exact HTTPS canonical origin required");
 check("not_preview",process.env.NEXT_PUBLIC_ATHENA_READ_ONLY_PREVIEW!=="true",
  "A preview build is not a production release");
 check("marketing_without_unverified_identity",
  process.env.ATHENA_VPS_IDENTITY_ENABLED!=="true"&&
  process.env.ATHENA_VPS_RELEASE_APPROVED!=="true"&&
  process.env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED!=="true",
  "Production A must not activate unverified customer accounts");
 check("production_build_exists",existsSync(resolve(root,".next","BUILD_ID")),
  "Reviewed Next.js production build must exist");
 const modelPath=resolve(root,"public/models/mclaren.glb");
 const attributionPath=resolve(root,"public/models/ATTRIBUTION.md");
 const modelRights=modelPublicationRights({
  asset:existsSync(modelPath)?readFileSync(modelPath):null,
  attribution:existsSync(attributionPath)?readFileSync(attributionPath,"utf8"):"",
  ownerApproved:process.env.ATHENA_OWNER_MODEL_RIGHTS_APPROVED==="true"
 });
 check("immersive_model_rights",modelRights.allowed,
  "Model hash, rights holder, public redistribution basis, evidence reference and separate owner approval are required");
 for(const [id,key] of [
  ["legal_review","ATHENA_OWNER_LEGAL_REVIEWED"],
  ["portfolio_permissions","ATHENA_OWNER_PORTFOLIO_APPROVED"],
  ["contact_channel_test","ATHENA_OWNER_CONTACT_VERIFIED"],
  ["offsite_restore_drill","ATHENA_OWNER_RESTORE_VERIFIED"],
  ["release_sha_approval","ATHENA_OWNER_PRODUCTION_GO"]
 ]){
  check(id,process.env[key]==="true",
   "External evidence and explicit owner sign-off required; this env attestation alone is not evidence");
 }
}else{
 check("candidate_remains_noindex",!origin.approved,
  "Unapproved staging and CI must stay noindex");
 check("production_requires_separate_go",process.env.ATHENA_OWNER_PRODUCTION_GO!=="true",
  "No production approval should be active in the candidate build");
}
const report={
 mode:production?"production_A":"candidate",
 commit:sha||null,
 branch:branch||"detached",
 release_origin:origin.approved?origin.origin:null,
 checks,
 manual_evidence_notice:"CI cannot prove real DNS/TLS, live customer contact, legal permissions, offsite restore, field CWV or owner approval.",
 verdict:checks.every(x=>x.status==="PASS")?"AUTOMATED_CHECKS_PASS_NOT_DEPLOYED":"NO_GO"
};
console.log(JSON.stringify(report,null,2));
if(report.verdict==="NO_GO")process.exitCode=1;
