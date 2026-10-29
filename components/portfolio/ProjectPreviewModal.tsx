"use client";

import {useEffect,useRef,useState} from "react";
import Image from "next/image";
import type {Project} from "@/types/project";

type Viewport="desktop"|"mobile";
type PreviewTab="home"|"product";
const isFrameable=(project:Project)=>project.slug==="digital-creators"&&!!project.websiteUrl?.startsWith("/");
export function ProjectPreviewModal({project,onClose}:{project:Project;onClose:()=>void}){
 const [viewport,setViewport]=useState<Viewport>("desktop");
 const [tab,setTab]=useState<PreviewTab>("home");
 const panel=useRef<HTMLDivElement>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const old=document.body.style.overflow;
  document.body.style.overflow="hidden";
  closeRef.current?.focus();
  function keydown(e:KeyboardEvent){
   if(e.key==="Escape"){e.preventDefault();onClose();return;}
   if(e.key!=="Tab"||!panel.current)return;
   const focusable=Array.from(panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],iframe,[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);
   if(!focusable.length)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  document.addEventListener("keydown",keydown);
  return ()=>{document.body.style.overflow=old;document.removeEventListener("keydown",keydown);previous?.focus();};
 },[onClose]);
 const canEmbed=isFrameable(project);
 const gallery=project.gallery.filter(x=>x.rightsVerified);
 const chooseImage=()=>{
  if(project.slug==="pham"){
   const index=viewport==="desktop"?(tab==="home"?0:1):(tab==="home"?2:3);
   return gallery[index]||gallery[0];
  }
  return gallery[0];
 };
 const shot=chooseImage();
 return <div className="ae-preview-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="ae-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="ae-preview-title" ref={panel}>
   <header className="ae-preview-topbar"><div><span className="ae-micro">ATHENA / PROJECT PREVIEW</span><strong id="ae-preview-title">{project.title}</strong></div>
    <button ref={closeRef} className="ae-preview-close" onClick={onClose} aria-label="Đóng cửa sổ xem trước">Đóng <span aria-hidden="true">×</span></button>
   </header>
   <div className="ae-preview-grid">
    <div className="ae-preview-stage">
     <div className="ae-preview-toolbar">
      <span className="ae-preview-url">{canEmbed?project.websiteUrl:"phamofficial.com / ảnh giao diện được ghi lại"}</span>
      <div className="ae-preview-device" aria-label="Chọn chế độ xem">
       <button type="button" className={viewport==="desktop"?"is-active":""} aria-pressed={viewport==="desktop"} onClick={()=>setViewport("desktop")}>Desktop</button>
       <button type="button" className={viewport==="mobile"?"is-active":""} aria-pressed={viewport==="mobile"} onClick={()=>setViewport("mobile")}>Mobile</button>
      </div>
     </div>
     <div className={"ae-preview-surface "+(viewport==="mobile"?"is-mobile":"is-desktop")}>
      {canEmbed?<div className="ae-preview-device-shell"><iframe title={"Trải nghiệm website "+project.title} src={project.websiteUrl} loading="eager" referrerPolicy="strict-origin-when-cross-origin" /></div>:
       shot?<div className="ae-preview-device-shell ae-preview-screenshot" key={shot.src}>
        <Image src={shot.src} alt={shot.alt} width={viewport==="mobile"?440:1440} height={viewport==="mobile"?940:900} sizes={viewport==="mobile"?"(max-width:700px) 75vw, 390px":"(max-width:900px) 100vw, 75vw"} quality={85} style={{width:"100%",height:"auto"}}/>
       </div>:
       <div className="ae-preview-unavailable">Chưa có nội dung được duyệt để xem trước.</div>}
     </div>
     {!canEmbed&&<div className="ae-preview-caption">Ảnh chụp giao diện thực tế, không phải phiên truy cập trực tiếp. Có thể cuộn ảnh và chuyển màn hình.</div>}
    </div>
    <aside className="ae-preview-aside">
     <span className="ae-micro">PROJECT / {project.slug.toUpperCase()}</span>
     <h2>{project.title}</h2>
     <p>{project.summary}</p>
     {project.slug==="pham"&&<div className="ae-preview-tabs" role="group" aria-label="Chọn màn hình PHAM">
      <button type="button" aria-pressed={tab==="home"} onClick={()=>setTab("home")}>01 / Trang chủ</button>
      <button type="button" aria-pressed={tab==="product"} onClick={()=>setTab("product")}>02 / Sản phẩm</button>
     </div>}
     <div className="ae-preview-aside-bottom">
      <p className="ae-preview-truth">{project.slug==="pham"?"Cửa hàng PHAM không cho phép nhúng vào website khác vì chính sách bảo mật. Đây là bộ ảnh giao diện được chủ dự án cho phép công bố.":"Website demo nội bộ đang được hiển thị trực tiếp trong khung xem trước."}</p>
      {project.websiteUrl&&<a className="ae-preview-visit" href={project.websiteUrl} target="_blank" rel="noopener noreferrer">Truy cập website thật <span aria-hidden="true">↗</span></a>}
      <a className="ae-preview-detail" href={"/projects/"+project.slug}>Đọc hồ sơ dự án <span aria-hidden="true">→</span></a>
     </div>
    </aside>
   </div>
  </div>
 </div>;
}
export function ProjectPreviewButton({project,className="",children}:{project:Project;className?:string;children:React.ReactNode}){
 const [open,setOpen]=useState(false);
 return <><button type="button" className={className} onClick={()=>setOpen(true)}>{children}</button>{open&&<ProjectPreviewModal project={project} onClose={()=>setOpen(false)}/>}</>;
}
