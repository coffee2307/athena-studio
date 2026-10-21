import {readFile} from "node:fs/promises";
import {summarize} from "../lib/sitepulse/core.mjs";
import {privateReportPath} from "./sitepulse-check.mjs";
if(process.env.ATHENA_SITEPULSE_ENABLED!=="true"){
 console.log("SitePulse chưa kích hoạt; không có dữ liệu giám sát.");
}else{
 const report=privateReportPath(process.env.ATHENA_SITEPULSE_REPORT_FILE);
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
