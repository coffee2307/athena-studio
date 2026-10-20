/**
 * Manually invoked only. Each external target must have a dated, narrowly
 * scoped local authorization record, plus the explicit enabled flag.
 * No public URL input, unattended scheduler, customer or payment integration.
 */
import {appendFile,mkdir,readFile,open,unlink} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {checkTarget,parseTargets} from "../lib/sitepulse/core.mjs";
import {eligibleForManualCheck,loadPilotAuthorization,validatePilotAuthorization} from "../lib/sitepulse/consent.mjs";

const privateRoot=path.resolve(".qa");
export function privateReportPath(value){
 const resolved=path.resolve(value||".qa/sitepulse-results.jsonl");
 if(!resolved.startsWith(privateRoot+path.sep)||!resolved.endsWith(".jsonl"))
  throw Error("Nhật ký giám sát phải là tệp JSONL nằm trong .qa/ của dự án");
 return resolved;
}
async function historyFromFile(report){
 try{
  const raw=await readFile(report,"utf8");
  if(raw.length>2_000_000)throw Error("Nhật ký vượt giới hạn pilot; cần lưu trữ và xoay vòng");
  return raw.split(/\r?\n/).filter(Boolean).map((line,i)=>{
   try{return JSON.parse(line);}
   catch{throw Error("Nhật ký bị lỗi định dạng tại dòng "+(i+1)+"; dừng để đối soát");}
  });
 }catch(err){if(err?.code==="ENOENT")return [];throw err;}
}
export async function run({env=process.env,probe=checkTarget,writer=appendFile,
 authorizationLoader=loadPilotAuthorization,historyLoader=historyFromFile,
 clock=()=>new Date(),lockEnabled=true}={}){
 if(env.ATHENA_SITEPULSE_ENABLED!=="true")
  return {enabled:false,targets:0,checks:[],reason:"disabled"};
 const targets=parseTargets(env.ATHENA_SITEPULSE_TARGETS_JSON,env.ATHENA_SITEPULSE_APPROVED_HOSTS,true);
 // Do NOT interpret a reference string as proof of authorization. The operator
 // must independently review and retain the owner's approval outside Git.
 const manifest=await authorizationLoader(env.ATHENA_SITEPULSE_CONSENT_FILE);
 const approved=validatePilotAuthorization(manifest,targets,clock());
 const report=privateReportPath(env.ATHENA_SITEPULSE_REPORT_FILE);
 await mkdir(path.dirname(report),{recursive:true});
 let lock;
 const lockFile=path.join(privateRoot,"sitepulse-run.lock");
 try{
  if(lockEnabled){
   try{lock=await open(lockFile,"wx",0o600);}
   catch(err){if(err?.code==="EEXIST")throw Error("SitePulse đang có phiên kiểm tra khác hoặc cần đối soát tệp khóa");throw err;}
  }
  const history=await historyLoader(report);
  const results=[],skipped=[];
  for(const target of targets){
   // Authorization expires even during multi-target/manual operation.
   validatePilotAuthorization(manifest,targets,clock());
   const eligibility=eligibleForManualCheck({targetId:target.id,history,
    authorization:approved,now:clock()});
   if(!eligibility.allowed){skipped.push({id:target.id,reason:eligibility.reason});continue;}
   const check=await probe(target);
   const record={
    schemaVersion:2,pilotId:approved.pilotId,
    id:target.id,label:target.label,
    checkedAt:check.checkedAt,state:check.state,httpStatus:check.httpStatus,
    responseMs:check.responseMs??null,ttfbMs:check.ttfbMs??null,
    detail:check.detail
   };
   // No raw request/response body or customer credentials persisted.
   results.push(record);
   await writer(report,JSON.stringify(record)+"\n",{encoding:"utf8",flag:"a",mode:0o600});
   history.push(record);
  }
  return {enabled:true,pilotId:approved.pilotId,targets:targets.length,checks:results,skipped,report};
 }finally{
  if(lock){await lock.close();await unlink(lockFile);}
 }
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{
  const results=await run();
  if(!results.enabled)console.log("SitePulse chưa kích hoạt. Không có request mạng nào được thực hiện.");
  else{
   for(const r of results.checks)console.log([r.id,r.state,r.httpStatus??"-",r.ttfbMs??"-",r.detail].join("\t"));
   for(const r of results.skipped)console.log("Bỏ qua "+r.id+": "+r.reason);
   console.log("Đã lưu "+results.checks.length+" phép đo vào kho cục bộ riêng tư; không phải SLA.");
  }
 }catch(err){
  console.error("SitePulse:",err instanceof Error?err.message:"Lỗi pilot");
  process.exitCode=1;
 }
}
