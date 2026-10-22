"use client";
import {useEffect,useState} from "react";
import Link from "next/link";

export function TemplateEngagementPrompt({slug,embedded=false}:{slug:string;embedded?:boolean}){
 const [open,setOpen]=useState(false);
 const [dismissed,setDismissed]=useState(false);
 useEffect(()=>{
  const key="athena-demo-interest-"+slug;
  if(window.sessionStorage.getItem(key)==="dismissed")return;
  const timer=window.setTimeout(()=>setOpen(true),5*60*1000);
  return()=>window.clearTimeout(timer);
 },[slug]);
 function close(){
  window.sessionStorage.setItem("athena-demo-interest-"+slug,"dismissed");
  setOpen(false);setDismissed(true);
 }
 if(!open||dismissed)return null;
 return <div className="template-interest-backdrop" role="presentation">
  <section className="template-interest-card" role="dialog" aria-modal="true" aria-labelledby="template-interest-title">
   <button type="button" className="template-interest-close" onClick={close} aria-label="Đóng lời mời">×</button>
   <p className="template-demo-eyebrow">ATHENA STUDIO / CÙNG BẠN LÀM RIÊNG</p>
   <h2 id="template-interest-title">Bạn có thích mẫu này?</h2>
   <p>Hãy cho Athena biết điều bạn muốn giữ lại. Chúng tôi sẽ tùy biến giao diện theo thương hiệu, nội dung và cách bạn vận hành.</p>
   <div className="template-interest-actions">
    <Link href={"/contact?service=web-development&template="+encodeURIComponent(slug)} target={embedded?"_top":undefined} onClick={close}>Trao đổi với Athena ↗</Link>
    <button type="button" onClick={close}>Tiếp tục xem demo</button>
   </div>
  </section>
 </div>;
}
