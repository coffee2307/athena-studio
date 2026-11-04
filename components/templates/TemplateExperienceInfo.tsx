"use client";
import {useCallback,useEffect,useId,useState} from "react";
import Link from "next/link";
import {getTemplate} from "@/lib/templates";
import {findSovereignSite} from "@/data/sovereign-site-registry";

/** Athena-owned demo information, rendered outside individual template layouts. */
function ZoomIcon({out=false}:{out?:boolean}){
 return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/><path d="M7.8 10.8h6"/>{!out&&<path d="M10.8 7.8v6"/>}
 </svg>;
}
export function TemplateExperienceInfo({slug}:{slug:string}){
 const template=getTemplate(slug);
 const site=findSovereignSite(slug);
 const id=useId();
 const [eligible,setEligible]=useState(false);
 const compactByDefault=["auto-showroom","campaign-landing","saas-product","hospitality-booking","architecture-studio"].includes(slug);
 const [expanded,setExpanded]=useState(!compactByDefault);
 const key="athena-demo-info:"+slug;
 useEffect(()=>{
  setEligible(window.self===window.top&&new URLSearchParams(window.location.search).get("embed")!=="1");
  // Immersive showroom controls must be available on first entry at every viewport.
  if(slug==="auto-showroom"){setExpanded(false);return;}
  try{const value=window.sessionStorage.getItem(key);setExpanded(value===null?!compactByDefault:value==="expanded");}
  catch{setExpanded(!compactByDefault);}
 },[key,slug,compactByDefault]);
 const toggle=useCallback((next:boolean)=>{
  setExpanded(next);
  try{window.sessionStorage.setItem(key,next?"expanded":"collapsed");}catch{}
 },[key]);
 useEffect(()=>{
  if(!eligible||!expanded)return;
  const onEscape=(event:KeyboardEvent)=>{if(event.key==="Escape")toggle(false);};
  document.addEventListener("keydown",onEscape);
  return()=>document.removeEventListener("keydown",onEscape);
 },[eligible,expanded,toggle]);
 if(!template||!eligible)return null;
 const inquiry="/contact?service=web-development&template="+encodeURIComponent(slug);
 return <aside className={"athena-demo-float"+(expanded?" is-expanded":" is-collapsed")} data-athena-demo-info={slug} aria-label={"Thông tin mẫu "+template.title}>
  <div id={id} className="athena-demo-float-panel" aria-hidden={!expanded} inert={!expanded}>
   <div className="athena-demo-float-header">
    <span>ATHENA / WEBSITE DEMO</span>
    <button type="button" className="athena-demo-float-toggle" onClick={()=>toggle(false)} aria-controls={id} aria-expanded={expanded} aria-label="Thu nhỏ bảng thông tin mẫu" title="Thu nhỏ"><ZoomIcon out/></button>
   </div>
   <p className="athena-demo-float-brand">{site?.owner?.replaceAll("-"," ")??"WEBSITE"}</p>
   <h2>{template.title}</h2>
   <p className="athena-demo-float-category">{template.industry} · {template.style}</p>
   <div className="athena-demo-float-price"><span>Chi phí dự kiến</span><strong>{template.estimatedPrice}</strong></div>
   <div className="athena-demo-float-links">
    <Link href={inquiry}>Tùy biến mẫu này <span aria-hidden="true">→</span></Link>
    <Link href="/services/web-development/templates">Thư viện mẫu</Link>
   </div>
   <p className="athena-demo-float-note">Bản trình diễn · Chưa phải báo giá chính thức</p>
  </div>
  <button type="button" className="athena-demo-float-handle" onClick={()=>toggle(true)} aria-controls={id} aria-expanded={expanded} aria-hidden={expanded} tabIndex={expanded?-1:0} aria-label={"Phóng to thông tin mẫu "+template.title} title="Phóng to thông tin mẫu"><ZoomIcon/></button>
 </aside>;
}
