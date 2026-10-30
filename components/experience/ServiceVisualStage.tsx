"use client";
import {useState} from "react";
type Mode="web-development"|"website-care"|"ai-integration";
const cases:Record<Mode,{label:string,description:string}[]>={
 "web-development":[{label:"Thương hiệu",description:"Thiết kế theo bản sắc riêng"},{label:"Bán hàng",description:"Sản phẩm và hành động rõ ràng"},{label:"Trải nghiệm",description:"Dễ sử dụng trên mọi thiết bị"}],
 "website-care":[{label:"Kiểm tra",description:"Xác định tình trạng và lỗi ưu tiên"},{label:"Xử lý",description:"Theo dõi thay đổi và đối chiếu"},{label:"Bàn giao",description:"Tóm tắt công việc đã kiểm chứng"}],
 "ai-integration":[{label:"Tra cứu",description:"Tìm câu trả lời từ nguồn được duyệt"},{label:"Tự động",description:"Giảm những tác vụ lặp lại"},{label:"Phê duyệt",description:"Con người kiểm tra kết quả"}]
};
export function ServiceVisualStage({slug}:{slug:string}){
 const mode=(slug in cases?slug:"web-development") as Mode;
 const [active,setActive]=useState(0);
 const data=cases[mode];
 return <div className={"dna03-service-stage dna03-stage-"+mode}>
  <div className="dna03-stage-header"><span>ATHENA / INTERACTIVE CONCEPT</span><span>0{active+1} / 03</span></div>
  {mode==="web-development"?<div className="dna03-browser" aria-hidden="true">
   <div className="dna03-browser-head"><span>● ● ●</span><span>concept.website / preview</span></div>
   <div className="dna03-browser-hero"><small>CREATIVE ENGINEERING</small><strong>{["Own your story.","Shop your way.","Designed to move."][active]}</strong><span className="dna03-browser-chip">EXPLORE</span></div>
   <div className="dna03-browser-tiles"><i/><i/><i/></div>
  </div>:mode==="website-care"?<div className="dna03-monitor" aria-hidden="true">
   <small>WEBSITE CARE / SIMULATED STATUS</small><strong>{["DIAGNOSE","RESOLVE","VERIFY"][active]}</strong>
   <div className="dna03-monitor-progress"><span style={{width:((active+1)/3*100)+"%"}}/></div>
   <div className="dna03-monitor-bars"><i/><i/><i/></div>
  </div>:<div className="dna03-ai-flow" aria-hidden="true">
   <span className="dna03-ai-node">INPUT</span><i/><span className="dna03-ai-node is-key">AI</span><i/><span className="dna03-ai-node">REVIEW</span>
   <small>{["KNOWLEDGE","WORKFLOW","HUMAN IN CONTROL"][active]}</small>
  </div>}
  <div className="dna03-stage-choices" role="group" aria-label="Chọn trường hợp minh họa">
   {data.map((item,i)=><button type="button" key={item.label} aria-pressed={active===i} onClick={()=>setActive(i)}>{item.label}</button>)}
  </div>
  <p className="dna03-stage-caption" aria-live="polite">{data[active].description}</p>
  <small className="dna03-stage-note">Mô phỏng giao diện; không sử dụng dữ liệu khách hàng hoặc kết nối hệ thống thật.</small>
 </div>;
}