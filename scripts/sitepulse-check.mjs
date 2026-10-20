/** Run manually by authorized operator. No cron, external alerts, billing or production flags. */
import {appendFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {checkTarget,parseTargets} from "../lib/sitepulse/core.mjs";

export async function run({env=process.env,probe=checkTarget,writer=appendFile}={}){
 if(env.ATHENA_SITEPULSE_ENABLED!=="true"){
  return {enabled:false,targets:0,checks:[],reason:"disabled"};
 }
 const targets=parseTargets(env.ATHENA_SITEPULSE_TARGETS_JSON,env.ATHENA_SITEPULSE_APPROVED_HOSTS,true);
 const report=path.resolve(env.ATHENA_SITEPULSE_REPORT_FILE||".qa/sitepulse-results.jsonl");
 // Only run using a local operator, never user-controlled HTTP parameters.
 await mkdir(path.dirname(report),{recursive:true});
 const results=[];
 for(const target of targets){
  const check=await probe(target);
  results.push(check);
  await writer(report,JSON.stringify(check)+"\n",{encoding:"utf8",flag:"a",mode:0o600});
 }
 return {enabled:true,targets:targets.length,checks:results,report};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{
  const results=await run();
  if(!results.enabled){
   console.log("SitePulse chưa kích hoạt. Không có request mạng nào được thực hiện.");
  }else{
   for(const r of results.checks)console.log([r.id,r.state,r.httpStatus??"-",r.ttfbMs??"-",r.detail].join("\t"));
   console.log("Báo cáo riêng tư đã được lưu trong thư mục vận hành của máy.");
  }
 }catch(err){
  console.error("SitePulse:",err instanceof Error?err.message:"Lỗi cấu hình");
  process.exitCode=1;
 }
}
