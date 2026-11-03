"use client";
import {useCallback,useEffect,useId,useState} from "react";
import Link from "next/link";
import {getTemplate} from "@/lib/templates";
import {findSovereignSite} from "@/data/sovereign-site-registry";

/** A small Athena-owned information layer, outside each sovereign demo's UI.
 * Hide inside iframe previews; the desktop library keeps its existing sidebar.
 */
export function TemplateExperienceInfo({slug}:{slug:string}){
 const template=getTemplate(slug);
 const site=findSovereignSite(slug);
 const id=useId();
 const [eligible,setEligible]=useState(false);
 const [expanded,setExpanded]=useState(true);
 const key="athena-demo-info:"+slug;
 useEffect(()=>{
  // An embedded template must stay free from overlay UI, including on subpages.
  const topLevel=window.self===window.top;
  const notEmbedded=new URLSearchParams(window.location.search).get("embed")!=="1";
  setEligible(topLevel&&notEmbedded);
  try{setExpanded(window.sessionStorage.getItem(key)!=="collapsed");}
  catch{setExpanded(true);}
 },[key]);
 const toggle=useCallback((next:boolean)=>{
  setExpanded(next);
  try{window.sessionStorage.setItem(key,next?"expanded":"collapsed");}catch{}
 },[key]);
 useEffect(()=>{
  if(!eligible||!expanded)return;
  const onEscape=(event:KeyboardEvent)=>{
   if(event.key==="Escape")toggle(false);
  };
  document.addEventListener("keydown",onEscape);
  return()=>document.removeEventListener("keydown",onEscape);
 },[eligible,expanded,toggle]);
 if(!template||!eligible)return null;
 const inquiry="/contact?service=web-development&template="+encodeURIComponent(slug);
 return <aside className={"athena-demo-float"+(expanded?" is-expanded":" is-collapsed")} data-athena-demo-info={slug} aria-label={"Thông tin mẫu "+template.title}>
  {expanded?<div id={id} className="athena-demo-float-panel">
   <div className="athena-demo-float-header">
    <span>ATHENA / WEBSITE DEMO</span>
    <button type="button" className="athena-demo-float-toggle" onClick={()=>toggle(false)} aria-controls={id} aria-expanded="true" aria-label="Thu gọn thông tin mẫu thành dấu ba chấm" title="Thu gọn">•••</button>
   </div>
   <p className="athena-demo-float-brand">{site?.owner?.replaceAll("-"," ")??"WEBSITE"}</p>
   <h2>{template.title}</h2>
   <p className="athena-demo-float-category">{template.industry} · {template.style}</p>
   <div className="athena-demo-float-price"><span>Chi phí dự kiến</span><strong>{template.estimatedPrice}</strong></div>
   <div className="athena-demo-float-links">
    <Link href={inquiry}>Tùy biến mẫu này <span aria-hidden="true">↗</span></Link>
    <Link href="/services/web-development/templates">Thư viện mẫu</Link>
   </div>
   <p className="athena-demo-float-note">Bản trình diễn · Chưa phải báo giá chính thức</p>
  </div>:<button type="button" className="athena-demo-float-handle" onClick={()=>toggle(true)} aria-label={"Mở thông tin mẫu "+template.title} aria-controls={id} aria-expanded="false" title="Thông tin mẫu">•••</button>}
 </aside>;
}
