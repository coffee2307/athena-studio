/** Operator-facing markdown export from already measured local JSONL results. */
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {summarize} from "../lib/sitepulse/core.mjs";

export function formatPilotReport(rows){
 const metrics=summarize(rows);
 const lines=[
  "# SitePulse — Báo cáo quan sát nội bộ",
  "",
  "**Lưu ý:** Đây là số liệu các lần kiểm tra thủ công, KHÔNG phải cam kết thời gian hoạt động (SLA), giám sát 24/7 hoặc dữ liệu toàn bộ người truy cập.",
  "",
  "Thời gian tham chiếu: các mốc kiểm tra đã được ghi trong nhật ký (UTC).",
  ""
 ];
 if(!metrics.length)return [...lines,"Chưa có kết quả kiểm tra hợp lệ.",""].join("\n");
 lines.push("| Mã mục tiêu | Số lượt kiểm tra | Thành công | Tỷ lệ quan sát | Sự cố 2 lần DOWN | Trạng thái cuối |","|---|---:|---:|---:|---:|---|");
 for(const m of metrics){
  const ratio=m.observedSuccessRatio===null?"—":(m.observedSuccessRatio*100).toFixed(1)+"%";
  const state={up:"Có phản hồi HTTP 2xx",attention:"Cần xem xét",down:"Không đạt kiểm tra"}[m.lastState]||"Không rõ";
  lines.push("| "+m.id+" | "+m.checks+" | "+m.successfulChecks+" | "+ratio+" | "+m.confirmedIncidents+" | "+state+" |");
 }
 lines.push("","**Đề nghị:** Nhân sự Website Care kiểm tra bằng trình duyệt và một nguồn độc lập trước khi kết luận sự cố. Không tự động gửi thông báo tới khách hàng chỉ dựa trên một lượt kiểm tra.","");
 return lines.join("\n");
}
export async function exportPilotReport(env=process.env){
 if(env.ATHENA_SITEPULSE_ENABLED!=="true")return {enabled:false};
 const input=path.resolve(env.ATHENA_SITEPULSE_REPORT_FILE||".qa/sitepulse-results.jsonl");
 const output=path.resolve(env.ATHENA_SITEPULSE_MARKDOWN_FILE||".qa/sitepulse-report.md");
 let raw="";
 try{raw=await readFile(input,"utf8");}
 catch(e){if(e?.code!=="ENOENT")throw e;}
 const rows=raw.split(/\r?\n/).filter(Boolean).flatMap(line=>{try{return [JSON.parse(line)];}catch{return [];}});
 await mkdir(path.dirname(output),{recursive:true});
 await writeFile(output,formatPilotReport(rows),{encoding:"utf8",mode:0o600});
 return {enabled:true,output,validSamples:rows.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=await exportPilotReport();
 console.log(result.enabled?"Báo cáo SitePulse nội bộ đã tạo; chưa phải báo cáo SLA.":"SitePulse chưa kích hoạt.");
}
