"use client";
import {useState} from "react";
import type {Template} from "@/lib/templates";
import {TemplatePreview} from "@/components/templates/TemplatePreview";
export function TemplatePreviewControls({template}:{template:Template}){
 const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
 return <div className="template-live-preview">
  <div className="template-preview-controls" role="group" aria-label="Kích thước bản xem trước">
   <span>BẢN DỰNG GIAO DIỆN</span>
   <button type="button" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")}>Máy tính</button>
   <button type="button" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")}>Điện thoại</button>
  </div>
  <TemplatePreview template={template} device={device}/>
 </div>;
}
