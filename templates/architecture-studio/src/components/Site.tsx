"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import site from "../data/site.json";
import {ArchitectureExperience} from "./ArchitectureExperience";
import {FormaAtlas} from "./FormaAtlas";
import s from "./FormaFrame.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const nav=[["Dự án","/work"],["Phòng vật liệu","/services"],["Studio","/about"],["Gửi brief","/contact"]] as const;
export function Site({section="home",itemIndex=1,basePath="/template-demos/architecture-studio",assetBase="/sovereign/architecture-studio"}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string;embedded?:boolean}){
 const [open,setOpen]=useState(false);
 useEffect(()=>setOpen(false),[section,itemIndex]);
 useEffect(()=>{if(!open)return;const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",k);return()=>window.removeEventListener("keydown",k)},[open]);
 return <div className={s.shell} data-world="architecture-studio">
 <header className={s.header}>
  <Link href={basePath} className={s.wordmark}><b>F.</b><span>{site.brand}<small>ARCHITECTURAL STUDIES</small></span></Link>
  <p>KHÔNG GIAN / HÌNH KHỐI / ÁNH SÁNG</p>
  <nav className={s.nav} aria-label="Các khu vực FORMA">{nav.map(([name,url])=><Link key={url} href={basePath+url} aria-current={section===url.slice(1)?"page":undefined}>{name}</Link>)}</nav>
  <button className={s.toggle} type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?"Đóng điều hướng":"Mở điều hướng"}>{open?"Đóng":"Menu"}<span aria-hidden="true">+</span></button>
 </header>
 {open&&<nav className={s.drawer} aria-label="Điều hướng FORMA">{nav.map(([name,url])=><Link onClick={()=>setOpen(false)} key={url} href={basePath+url}>{name}</Link>)}</nav>}
 <main>
 {section==="home"?<ArchitectureExperience basePath={basePath} assetBase={assetBase} images={site.images}/>:<div data-dna04-artifact="architecture-studio-atlas"><FormaAtlas section={section} itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/></div>}
 </main>
 <footer className={s.footer}><div><small>FORMA / STUDIO STUDY</small><Link href={basePath}>Nơi ý tưởng<br/>thành không gian.</Link></div><nav>{nav.map(([name,url])=><Link key={url} href={basePath+url}>{name}</Link>)}</nav><p>Website concept do Athena Studio xây dựng. Các hình ảnh và hồ sơ là nội dung minh họa, không phải dự án đã thi công.</p></footer>
 </div>;
}