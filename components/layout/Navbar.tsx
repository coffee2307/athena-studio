"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {navigation} from "@/data/navigation";
import {Icon} from "@/components/ui/Icon";
import {siteConfig} from "@/lib/constants";
import {contactChannels} from "@/lib/contact-channels";
import {ConsultationCTA} from "@/components/layout/ConsultationCTA";
import {SessionNavigation} from "@/components/auth/SessionNavigation";

const solutions=[
 {href:"/services/web-development",title:"Thiết kế website",detail:"Website mới, landing page, trang bán hàng"},
 {href:"/services/website-care",title:"Chăm sóc website",detail:"Sửa lỗi, cập nhật và tối ưu vận hành"},
 {href:"/services/ai-integration",title:"Tích hợp AI",detail:"Giảm công việc lặp lại và hỗ trợ nhân sự"}
];

export function Navbar(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const [scrolled,setScrolled]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null);
 const panel=useRef<HTMLElement>(null);
 const desktopServices=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{setOpen(false);if(desktopServices.current)desktopServices.current.open=false;},[pathname]);
 useEffect(()=>{
  const dismiss=(event:PointerEvent)=>{
   const node=desktopServices.current;
   if(node?.open&&!node.contains(event.target as Node))node.open=false;
  };
  const escape=(event:KeyboardEvent)=>{
   if(event.key==="Escape"&&desktopServices.current?.open){
    desktopServices.current.open=false;
    desktopServices.current.querySelector<HTMLElement>("summary")?.focus();
   }
  };
  document.addEventListener("pointerdown",dismiss);
  document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",dismiss);document.removeEventListener("keydown",escape);};
 },[]);
 useEffect(()=>{
  const listen=()=>setScrolled(window.scrollY>12);
  listen();window.addEventListener("scroll",listen,{passive:true});
  return()=>window.removeEventListener("scroll",listen);
 },[]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const first=panel.current?.querySelector<HTMLAnchorElement>("a");
  first?.focus({preventScroll:true});
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){setOpen(false);trigger.current?.focus();return;}
   if(event.key!=="Tab"||!panel.current)return;
   const focusable=Array.from(panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
   if(!focusable.length)return;
   const firstItem=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===firstItem){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();firstItem.focus();}
  };
  document.addEventListener("keydown",onKey);
  return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",onKey);};
 },[open]);
 return <header className={scrolled?"athena-header agency-header is-scrolled":"athena-header agency-header"}>
  <div className="agency-topline"><div className="container agency-topline-inner">
   <span>WEBSITE · VẬN HÀNH · ỨNG DỤNG AI</span>
   <div className="agency-topline-contacts"><a href={contactChannels.phone}><Icon name="phone" size={13}/>{siteConfig.phone}</a><a href={contactChannels.email}><Icon name="mail" size={13}/>{siteConfig.email}</a></div>
  </div></div>
  <div className="container agency-nav-shell">
   <Link href="/" className="brand-lockup" aria-label="Athena Studio — Trang chủ">
    <span className="brand-symbol"><Image src="/branding/logo-symbol-black.svg" alt="" width={48} height={48} priority/></span>
    <span className="brand-wordmark">ATHENA{" "}<span>STUDIO</span></span>
   </Link>
   <nav className="agency-desktop-nav" aria-label="Điều hướng chính">
    <details className="agency-service-menu" ref={desktopServices}>
     <summary className={pathname.startsWith("/services")?"agency-nav-current":""}>Dịch vụ <Icon name="chevron-down" size={15}/></summary>
     <div className="agency-dropdown" onClick={e=>{if((e.target as HTMLElement).closest("a")&&desktopServices.current)desktopServices.current.open=false;}}>
      <p>CHỌN GIẢI PHÁP THEO NHU CẦU</p>
      {solutions.map(s=><Link href={s.href} key={s.href}><span><strong>{s.title}</strong><small>{s.detail}</small></span><Icon name="arrow-up-right" size={17}/></Link>)}
      <Link href="/services" className="agency-dropdown-all">Xem tất cả dịch vụ <Icon name="arrow-right" size={16}/></Link>
     </div>
    </details>
    {navigation.filter(i=>i.href!=="/services").map(i=><Link key={i.href} href={i.href} className={pathname===i.href||pathname.startsWith(i.href+"/")?"agency-nav-current":""}>{i.label}</Link>)}
   </nav>
   <div className="agency-nav-actions">
    <SessionNavigation/>
    <ConsultationCTA className="agency-primary-cta" label="Yêu cầu tư vấn" iconSize={17}/>
   </div>
   <button ref={trigger} type="button" className={open?"agency-menu-toggle is-open":"agency-menu-toggle"}
    aria-label={open?"Đóng menu":"Mở menu"} aria-expanded={open} aria-controls="athena-mobile-menu"
    onClick={()=>setOpen(o=>!o)} style={{touchAction:"manipulation"}}>
    <span className="agency-toggle-line"/><span className="agency-toggle-line"/>
   </button>
  </div>
  <button type="button" aria-label="Đóng menu điều hướng" tabIndex={open?0:-1} aria-hidden={!open}
   className={open?"agency-menu-backdrop is-open":"agency-menu-backdrop"} onClick={()=>setOpen(false)}/>
  <nav ref={panel} id="athena-mobile-menu" aria-label="Điều hướng trên điện thoại"
   className={open?"agency-mobile-panel is-open":"agency-mobile-panel"} inert={!open} onClick={event=>{if((event.target as HTMLElement).closest("a"))setOpen(false);}}>
   <div className="agency-mobile-scroll">
    <span className="agency-mobile-eyebrow">ATHENA / KHÁM PHÁ</span>
    <Link href="/services" className="agency-mobile-primary">Dịch vụ <Icon name="arrow-up-right"/></Link>
    <div className="agency-mobile-services">
     {solutions.map(s=><Link href={s.href} key={s.href}>{s.title}<Icon name="arrow-right" size={17}/></Link>)}
    </div>
    {navigation.filter(i=>i.href!=="/services").map(i=><Link href={i.href} key={i.href} className="agency-mobile-primary">{i.label}<Icon name="arrow-up-right"/></Link>)}
    <div className="agency-mobile-account"><SessionNavigation mobile/></div>
    <ConsultationCTA className="agency-mobile-cta" label="Gửi yêu cầu tư vấn" iconSize={18}/>
    <a href={contactChannels.phone} className="agency-mobile-email"><Icon name="phone" size={16}/>{siteConfig.phone}</a>
    <a href={contactChannels.email} className="agency-mobile-email"><Icon name="mail" size={16}/>{siteConfig.email}</a>
   </div>
  </nav>
 </header>;
}
