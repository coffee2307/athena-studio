"use client";
import {useState} from "react";
import type {Template} from "@/lib/templates";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";
export function TemplatePreviewControls({template}:{template:Template}){
 const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
 const {language}=useAthenaLanguage();
 const excluded=["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"];
 const demo=template.demoPath+(excluded.includes(template.slug)?"":"?lang="+language);
 return <div className="template-live-preview">
  <div className="template-preview-controls" role="group" aria-label="Kích thước bản xem trước">
   <span>DEMO WEBSITE TƯƠNG TÁC</span>
   <button type="button" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")}>Máy tính</button>
   <button type="button" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")}>Điện thoại</button>
   <a href={demo} target="_blank" rel="noopener noreferrer">Mở toàn trang </a>
  </div>
  <div className={"template-detail-iframe template-detail-iframe-"+device}>
   <iframe key={template.slug+"-"+language} src={demo+(demo.includes("?")?"&":"?")+"embed=1"} title={"Website demo: "+template.title} loading="lazy"/>
  </div>
 </div>;
}
