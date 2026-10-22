"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import type {Template} from "@/lib/templates";
import {DemoWebsite} from "@/components/templates/DemoWebsite";

export function TemplateDemoModal({template,onClose}:{template:Template|null;onClose:()=>void}){
 const dialogRef=useRef<HTMLDialogElement>(null);
 const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
 useEffect(()=>{
  const dialog=dialogRef.current;
  if(!dialog)return;
  if(template&&!dialog.open)dialog.showModal();
  if(!template&&dialog.open)dialog.close();
  const onCancel=(event:Event)=>{event.preventDefault();onClose();};
  dialog.addEventListener("cancel",onCancel);
  return()=>dialog.removeEventListener("cancel",onCancel);
 },[template,onClose]);
 if(!template)return <dialog ref={dialogRef} className="template-demo-modal"/>;
 const requestUrl="/contact?service=web-development&template="+encodeURIComponent(template.slug);
 return <dialog ref={dialogRef} className="template-demo-modal" aria-labelledby="template-demo-title"
  onClick={event=>{if(event.target===dialogRef.current)onClose();}}
  onClose={onClose}>
  <div className="template-demo-window">
   <div className="template-demo-stage">
    <div className="template-demo-toolbar">
     <div className="template-demo-lights" aria-hidden="true"><i/><i/><i/></div>
     <span className="template-demo-url">athena.studio{template.demoPath}</span>
     <div className="template-demo-toolbar-actions">
      <button type="button" aria-label="Xem trên máy tính" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")}>Máy tính</button>
      <button type="button" aria-label="Xem trên điện thoại" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")}>Điện thoại</button>
      <a href={template.demoPath} target="_blank" rel="noopener noreferrer">Mở toàn trang ↗</a>
      <button className="template-demo-close" type="button" aria-label="Đóng bản demo" onClick={onClose}>×</button>
     </div>
    </div>
    <div className={"template-demo-viewport template-demo-viewport-"+device}>
     <DemoWebsite slug={template.slug} embedded/>
    </div>
   </div>
   <aside className="template-demo-info">
    <p className="template-demo-eyebrow">ATHENA / WEBSITE DEMO / 2026</p>
    <button className="template-demo-info-close" type="button" aria-label="Đóng" onClick={onClose}>×</button>
    <p className="template-demo-index">WEBSITE DEMO / {template.category.toLocaleUpperCase("vi")}</p>
    <h2 id="template-demo-title">{template.title}<span>.</span></h2>
    <p className="template-demo-description">{template.description}</p>
    <div className="template-demo-price">
     <span>NGÂN SÁCH THAM KHẢO</span><strong>{template.estimatedPrice}</strong>
     <small>Ước tính theo phạm vi mẫu; báo giá chính thức sau khi thống nhất nội dung, tích hợp và yêu cầu vận hành.</small>
    </div>
    <div className="template-demo-quality">
     <span>MỨC TRIỂN KHAI</span><strong>{template.qualityTier}</strong>
     <small>Responsive · kiểm tra bàn giao · tối ưu nền tảng theo phạm vi dự án</small>
    </div>
    <div className="template-demo-scope">
     <h3>Phạm vi tham khảo</h3>
     <ul>{template.pages.map(page=><li key={page}>{page}</li>)}</ul>
    </div>
    <div className="template-demo-details">
     <span>{template.industry}</span><span>{template.style}</span><span>{template.pages.length} trang tham khảo</span>
    </div>
    <Link href={requestUrl} className="template-demo-contact" onClick={onClose}>Tùy biến mẫu này <span aria-hidden="true">↗</span></Link>
    <p className="template-demo-note">Ảnh và nội dung trong demo dùng để minh họa giao diện. Chưa có gửi biểu mẫu, đặt chỗ hoặc thanh toán thật.</p>
   </aside>
  </div>
 </dialog>;
}
