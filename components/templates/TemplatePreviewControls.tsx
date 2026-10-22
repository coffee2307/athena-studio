"use client";
import {useState} from "react";
import type {Template} from "@/lib/templates";
export function TemplatePreviewControls({template}:{template:Template}){
 const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
 return <div className="template-live-preview">
  <div className="template-preview-controls" role="group" aria-label="Kích thước bản xem trước">
   <span>DEMO WEBSITE TƯƠNG TÁC</span>
   <button type="button" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")}>Máy tính</button>
   <button type="button" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")}>Điện thoại</button>
   <a href={template.demoPath} target="_blank" rel="noopener noreferrer">Mở toàn trang ↗</a>
  </div>
  <div className={"template-detail-iframe template-detail-iframe-"+device}>
   <iframe src={template.demoPath+"?embed=1"} title={"Website demo: "+template.title} loading="lazy"/>
  </div>
 </div>;
}
