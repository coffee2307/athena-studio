"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import type {Template} from "@/lib/templates";

export function TemplateDemoModal({template,onClose}:{template:Template|null;onClose:()=>void}){
 const dialogRef=useRef<HTMLDialogElement>(null);
 const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
 useEffect(()=>{
  const dialog=dialogRef.current;
  if(!dialog)return;
  if(template&&!dialog.open){setDevice("desktop");dialog.showModal();}
  if(!template&&dialog.open)dialog.close();
  const cancel=(event:Event)=>{event.preventDefault();onClose();};
  dialog.addEventListener("cancel",cancel);
  return()=>dialog.removeEventListener("cancel",cancel);
 },[template,onClose]);
 const realSite=template?.slug==="digital-creators"?"/immersive/digital-creators/index.html":template?.demoPath;
 const embeddedSite=template?.slug==="digital-creators"?realSite:realSite+"?embed=1";
 const inquiry=template?"/contact?service=web-development&template="+encodeURIComponent(template.slug):"/contact";
 return <dialog ref={dialogRef} className="template-demo-modal template-revamp-dialog" aria-labelledby={template?"template-demo-title":undefined} onClick={event=>{if(event.target===dialogRef.current)onClose();}} onClose={onClose}>
 {template&&<div className="template-demo-window">
  <section className="template-demo-stage" aria-label={"Bản trải nghiệm website "+template.title}>
   <div className="template-demo-toolbar"><div className="template-demo-lights" aria-hidden="true"><i/><i/><i/></div><span className="template-demo-url">{realSite}</span><div className="template-demo-toolbar-actions">
    <button type="button" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")}>Desktop</button><button type="button" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")}>Mobile</button>
    <a href={realSite} target="_blank" rel="noopener noreferrer">Mở tab mới </a><button className="template-demo-close" type="button" onClick={onClose} aria-label="Đóng bản xem trước">×</button>
   </div></div>
   <div className={"template-demo-viewport template-demo-viewport-"+device}>
    <iframe key={template.slug} title={"Website demo "+template.title} src={embeddedSite} loading="eager" referrerPolicy="same-origin" />
   </div>
  </section>
  <aside className="template-demo-info">
   <p className="template-demo-eyebrow">ATHENA STUDIO / DEMO LIBRARY</p><span className="template-demo-index">{template.industry.toUpperCase()} / {template.style}</span>
   <h2 id="template-demo-title">{template.title}<span>.</span></h2>
   <p className="template-demo-description">{template.description}</p>
   <div className="template-demo-price"><span>CHI PHÍ DỰ KIẾN</span><strong>{template.estimatedPrice}</strong><small>Ước tính sơ bộ, chưa phải báo giá chính thức.</small></div>
   <div className="template-demo-quality"><span>ĐỊNH HƯỚNG CHẤT LƯỢNG</span><strong>{template.qualityTier}</strong><small>Thiết kế riêng · Responsive · Kiểm thử trước bàn giao</small></div>
   <div className="template-demo-scope"><h3>Cấu trúc dự kiến</h3><ul>{template.pages.map(page=><li key={page}>{page}</li>)}</ul></div>
   <div className="template-demo-info-actions"><Link href={inquiry} className="template-demo-contact" onClick={onClose}>Tùy biến mẫu này <span aria-hidden="true"></span></Link><a className="template-demo-open" href={realSite} target="_blank" rel="noopener noreferrer">Xem demo toàn màn hình </a></div>
   <p className="template-demo-note">Đây là bản trình diễn. Giỏ hàng, đặt lịch và biểu mẫu chỉ mô phỏng; không tạo đơn hàng hoặc gửi dữ liệu thật.</p>
  </aside>
 </div>}
 </dialog>;
}
