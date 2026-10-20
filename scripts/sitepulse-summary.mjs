import {readFile} from "node:fs/promises";
import path from "node:path";
import {summarize} from "../lib/sitepulse/core.mjs";
if(process.env.ATHENA_SITEPULSE_ENABLED!=="true"){
 console.log("SitePulse chưa kích hoạt; không có dữ liệu giám sát.");
}else{
 const report=path.resolve(process.env.ATHENA_SITEPULSE_REPORT_FILE||".qa/sitepulse-results.jsonl");
 let raw="";
 try{raw=await readFile(report,"utf8");}
 catch(e){if(e.code!=="ENOENT")throw e;}
 const rows=raw.split(/\r?\n/).filter(Boolean).flatMap(s=>{try{return [JSON.parse(s)];}catch{return [];}});
 console.log(JSON.stringify({
  source:"operator_only_local_checks",
  note:"Tỉ lệ thành công là quan sát trong các lần chạy, không phải uptime SLA hoặc số liệu khách hàng thật.",
  monitors:summarize(rows)
 },null,2));
}
