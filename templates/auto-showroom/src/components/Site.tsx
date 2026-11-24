"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {copies} from "@/data/demo-worlds";
import {worldDetails} from "@/data/demo-world-details";
import {CinematicExperience} from "./CinematicExperience";
import {AutoShowroomSubpages} from "./ShowroomRoutes";
import {BlackVelocityMotion} from "./ShowroomMotion";
import s from "./AutoShowroom.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const links=[["home","Trang chủ",""],["work","Thiết kế","/work"],["services","Trải nghiệm","/services"],["about","Câu chuyện","/about"],["contact","Liên hệ","/contact"]] as const;
export function Site({section="home",itemIndex,basePath="/template-demos/auto-showroom"}:{section?:Section;itemIndex?:number;embedded?:boolean;basePath?:string;assetBase?:string}){
 const [open,setOpen]=useState(false);
 const world=copies["auto-showroom"],extra=worldDetails["auto-showroom"];
 useEffect(()=>setOpen(false),[section,itemIndex]);
 useEffect(()=>{if(!open)return;const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",k);return()=>window.removeEventListener("keydown",k)},[open]);
 return <div className={"world-site "+s.root} data-world="auto-showroom" data-page={section} id="world-top">
  <header className={s.header}>
   <Link href={basePath} className={s.brand}><span className={s.mark}>BV</span>BLACK <strong>VELOCITY</strong></Link>
   <span className={s.model}>McLAREN P1 / DIGITAL SHOWROOM</span>
   <nav className={s.desktop} aria-label="Điều hướng Black Velocity">{links.map(([id,label,path])=><Link key={id} href={basePath+path} aria-current={(section==="detail"?"work":section)===id?"page":undefined}>{label}</Link>)}</nav>
   <button className={s.toggle} onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="bv-menu" aria-label={open?"Đóng menu":"Mở menu"}><span/><span/></button>
  </header>
  {open&&<button className={s.scrim} aria-label="Đóng menu" onClick={()=>setOpen(false)}/>}
  <nav id="bv-menu" className={s.mobile} data-open={open} aria-hidden={!open} inert={!open} aria-label="Điều hướng di động">{links.map(([id,label,path],i)=><Link key={id} href={basePath+path} onClick={()=>setOpen(false)}><small>{String(i+1).padStart(2,"0")}</small>{label}</Link>)}</nav>
  {section==="home"?<CinematicExperience slug="auto-showroom" world={world} extra={extra}/>:<AutoShowroomSubpages section={section} itemIndex={itemIndex} world={world} extra={extra}/>}
  <footer className={s.footer}><strong>BLACK VELOCITY</strong><nav aria-label="Điều hướng cuối trang">{links.map(([id,label,path])=><Link key={id} href={basePath+path}>{label}</Link>)}</nav><small>© 2026 ATHENA STUDIO / CONCEPT SHOWROOM. Không phải trang chính thức của hãng xe.</small></footer>
  <BlackVelocityMotion section={section}/>
 </div>;
}