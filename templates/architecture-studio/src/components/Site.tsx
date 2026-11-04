"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import site from "../data/site.json";
import style from "./architecture-sovereign.module.css";
import {ArchitectureExperience} from "./ArchitectureExperience";
import {formaLanguageStorageKey,formaText,type FormaLocale} from "./forma-language";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};
const navItems:[string,string][]=[["Residences","/work"],["Material studies","/services"],["The studio","/about"],["Contact","/contact"]];
const artifacts=[
 {title:"Residences",description:"An independent exploration of craft, process and everyday moments."},
 {title:"Material studies",description:"A closer look at the detail, people and thinking behind the work."},
 {title:"Public spaces",description:"A practical path from first idea to a considered experience."}
];

export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menu,setMenu]=useState(false);
 const [selected,setSelected]=useState(0);
 const [inquiry,setInquiry]=useState("");
 const [locale,setLocale]=useState<FormaLocale>("en");
 const t=(value:string)=>formaText(locale,value);
 const media=site.images.map(path=>assetBase+path);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 const item=artifacts[Math.max(0,Math.min(artifacts.length-1,itemIndex-1))];
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{
  try{
   const stored=window.localStorage.getItem(formaLanguageStorageKey);
   if(stored==="vi"||stored==="en")setLocale(stored);
  }catch{}
  const onStorage=(e:StorageEvent)=>{
   if(e.key===formaLanguageStorageKey&&(e.newValue==="vi"||e.newValue==="en"))setLocale(e.newValue);
  };
  window.addEventListener("storage",onStorage);
  return()=>window.removeEventListener("storage",onStorage);
 },[]);
 useEffect(()=>{
  if(!menu)return;
  const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};
  window.addEventListener("keydown",close);
  return()=>window.removeEventListener("keydown",close);
 },[menu]);
 function changeLocale(next:FormaLocale){
  setLocale(next);
  try{window.localStorage.setItem(formaLanguageStorageKey,next)}catch{}
 }
 return <div className={style.root} id="architecture-studio-top" lang={locale} data-forma-locale={locale}>
  <header className={style.header}>
   <Link className={style.logo} href={go("/")} aria-label={locale==="vi"?"FORMA — Trang chủ":"FORMA — Home"}>{site.brand}</Link>
   <span className={style.headStatus}>{t("SPACE & STRUCTURE")}</span>
   <nav aria-label={t("NAVIGATION")}>{navItems.map(([label,path])=><Link href={go(path)} key={path}>{t(label)}</Link>)}</nav>
   <div className={style.languageSwitch} role="group" aria-label={t("Language")}>
    <button type="button" lang="vi" aria-label="Tiếng Việt" aria-pressed={locale==="vi"} onClick={()=>changeLocale("vi")}>VI</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="en" aria-label="English" aria-pressed={locale==="en"} onClick={()=>changeLocale("en")}>EN</button>
   </div>
   <button type="button" className={style.hamburger} aria-expanded={menu} aria-label={menu?t("Close navigation"):t("Open navigation")} onClick={()=>setMenu(v=>!v)}><i/><i/><i/></button>
  </header>
  {menu&&<button type="button" className={style.menuScrim} aria-label={t("Close navigation")} onClick={()=>setMenu(false)}/>}
  <aside className={style.menuPanel} inert={!menu} aria-hidden={!menu}>
   <div className={style.menuTitle}>{t("NAVIGATION")} / {site.brand}</div>
   {navItems.map(([label,path],i)=><Link key={path} href={go(path)} onClick={()=>setMenu(false)}><small>0{i+1}</small>{t(label)}</Link>)}
   <button type="button" onClick={()=>setMenu(false)}>{t("CLOSE / MENU")}</button>
  </aside>
  <main>
   {section==="home"&&<ArchitectureExperience basePath={basePath} assetBase={assetBase} images={site.images} locale={locale}/>}
   {section==="work"&&<section className={style.archivePage}>
    <div className={style.sectionTitle}><small>{t("ARCHIVE / BUILT & UNBUILT")}</small><h1>{t("Residences / Material studies")}</h1><p>{t("An architectural practice exploring the space between light and structure.")}</p></div>
    <div className={style.catalogGrid}>{artifacts.map((entry,i)=><Link key={entry.title} href={go("/work/"+(i+1))} className={style.artifact} data-dna04-artifact="architecture-studio-artifact"><img src={media[i%media.length]} alt={t(entry.title)}/><small>0{i+1} / {t("ARCHITECTURE")}</small><h2>{t(entry.title)}</h2><p>{t(entry.description)}</p></Link>)}</div>
   </section>}
   {section==="detail"&&<article className={style.detailPage}>
    <Link href={go("/work")}>← {t("BACK TO INDEX")}</Link>
    <small>{t("FILE")} / 0{itemIndex}</small><h1>{t(item.title)}</h1><p>{t(item.description)}</p>
    <figure><img src={media[(itemIndex-1)%media.length]} alt={t("Illustrative case material")}/><figcaption>{t("VISUAL STUDY / DEMONSTRATION MATERIAL")}</figcaption></figure>
    <div className={style.detailPair}><span>{t("CONTEXT")}</span><p>{t("An architectural practice exploring the space between light and structure.")}</p><span>{t("PROCESS")}</span><p>{t("Trình bày phương pháp minh họa. Không phải hồ sơ dự án đã thực hiện cho khách hàng.")}</p></div>
    <Link href={go("/contact")}>{t("START A CONVERSATION")} →</Link>
   </article>}
   {section==="services"&&<section className={style.servicePage}>
    <div className={style.sectionTitle}><small>{t("THE PRACTICE / 01—03")}</small><h1>{t("Residences / Material studies / Public spaces")}</h1><p>{t("An architectural practice exploring the space between light and structure.")}</p></div>
    <div className={style.serviceSequence}>{artifacts.map((entry,i)=><button key={entry.title} type="button" onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>0{i+1}</span><strong>{t(entry.title)}</strong><p>{t(entry.description)}</p></button>)}</div>
    <figure className={style.serviceVisual}><img src={media[selected%media.length]} alt={t(artifacts[selected].title)}/><figcaption>{t(artifacts[selected].title)} / {t("SELECTED DISCIPLINE")}</figcaption></figure>
   </section>}
   {section==="about"&&<section className={style.aboutPage}>
    <div className={style.aboutCopy}><small>{t("ABOUT / ARCHITECTURE")}</small><h1>{t("Space shapes thought.")}</h1><p>{t("An architectural practice exploring the space between light and structure.")}</p><p>{t("Đây là thương hiệu khái niệm trong thư viện Athena Studio. Nội dung và hình ảnh minh họa không được trình bày là thành tích của khách hàng thật.")}</p></div>
    <div className={style.aboutMedia}><img src={media[3%media.length]} alt={t("Illustrative brand material")}/><span>{t("THE PRINCIPLES / 2026")}</span></div>
   </section>}
   {section==="contact"&&<section className={style.contactPage}>
    <div className={style.contactIntro}><small>{t("INQUIRY / ARCHITECTURE")}</small><h1>{t("Let’s talk about residences.")}</h1><p>{t("An architectural practice exploring the space between light and structure.")}</p></div>
    <form onSubmit={event=>{event.preventDefault();window.location.href="mailto:?subject="+encodeURIComponent("FORMA / enquiry")+"&body="+encodeURIComponent(inquiry)}}>
     <label htmlFor="independent-inquiry-architecture-studio">{t("YOUR MESSAGE")}</label>
     <textarea id="independent-inquiry-architecture-studio" required minLength={10} value={inquiry} onChange={event=>setInquiry(event.target.value)} placeholder={t("Mô tả nhu cầu của bạn…")}/>
     <button type="submit">{t("MỞ ỨNG DỤNG EMAIL")} →</button><p>{t("Website demo không thu thập hoặc gửi dữ liệu đến máy chủ.")}</p>
    </form>
   </section>}
  </main>
  <footer className={style.footer}>
   <div className={style.footerTop}><small>{t("END OF THIS JOURNEY / NEXT STARTS HERE")}</small><Link href={go("/contact")}>{t("START A CONVERSATION")} →</Link></div>
   <div className={style.footerSignature}>{site.brand}</div>
   <div className={style.footerMenu}>{navItems.map(([label,path])=><Link href={go(path)} key={path}>{t(label)}</Link>)}</div>
   <small>{t("AN INDEPENDENT DEMO, NOT A VERIFIED COMMERCIAL ENTITY.")}</small>
  </footer>
 </div>;
}
