"use client";
import {useState} from "react";
const modes=[
 {label:"Chưa kiểm tra",code:"—",latency:"—",desc:"Chưa có dữ liệu",tone:"idle"},
 {label:"Phản hồi tốt",code:"200",latency:"185ms",desc:"Tình huống giả lập: phản hồi thành công",tone:"good"},
 {label:"Cần xác minh",code:"503",latency:"1.8s",desc:"Tình huống giả lập: máy chủ không sẵn sàng",tone:"alert"}
] as const;
export function SitePulseDemo(){
 const [index,setIndex]=useState(0);
 const mode=modes[index];
 return <div className={"dna02-pulse "+mode.tone}>
  <div className="dna02-pulse-modes" role="group" aria-label="Chọn trạng thái mô phỏng của SitePulse">{modes.map((m,i)=><button type="button" key={m.label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{m.label}</button>)}</div>
  <div className="athena-product-window" aria-label="Bảng điều khiển SitePulse mô phỏng, không thực hiện yêu cầu mạng">
   <div className="athena-product-window-top"><span><i/><i/><i/></span><span>SITEPULSE / INTERACTIVE CONCEPT</span><span>V0.1 / DEMO</span></div>
   <div className="athena-product-window-body">
    <div className="athena-product-window-label">SIMULATION / KHÔNG PHẢI PHÉP ĐO THỰC TẾ</div>
    <h3>Overview<span>.</span></h3>
    <div className="athena-product-sample"><span>WEBSITE MINH HỌA</span><strong>example.com</strong><span>KHÔNG GỬI YÊU CẦU HTTP</span></div>
    <div className="athena-product-mini-grid"><div><span>HTTP RESPONSE / GIẢ LẬP</span><strong>{mode.code}</strong><small>{mode.desc}</small></div><div><span>LATENCY / GIẢ LẬP</span><strong>{mode.latency}</strong><small>Chỉ minh họa trạng thái giao diện</small></div></div>
    <div className="athena-product-window-bottom"><span>DEMO MODE</span><span>Chọn kịch bản → Quan sát trạng thái → Tìm hiểu cách xử lý</span></div>
   </div>
  </div>
  <p className="dna02-pulse-disclosure">Minh họa tương tác — không đo, lưu hay giám sát bất kỳ website nào.</p>
 </div>;
}
