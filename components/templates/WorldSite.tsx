"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useId,useState,type FormEvent} from "react";
import {copies} from "@/data/demo-worlds";
import {worldDetails} from "@/data/demo-world-details";
import {TemplateEngagementPrompt} from "@/components/templates/TemplateEngagementPrompt";
import {WorldSpecialHome,hasSpecializedHomepage} from "@/components/templates/WorldSpecialHome";
import {WorldExistingSpecialHome,hasExistingSpecialHome} from "@/components/templates/WorldExistingSpecialHome";
import {WorldLegacySpecialHome,hasLegacySpecialHome} from "@/components/templates/WorldLegacySpecialHome";
import {WorldExperiencePages,isExperienceSection,type ExperienceSection} from "@/components/templates/WorldExperiencePages";
import {WorldImmersiveHome,hasImmersiveHome} from "@/components/templates/WorldImmersiveHome";
import {WorldSubpageFeature} from "@/components/templates/WorldSubpageFeature";

export type WorldSection="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={slug:string;section?:WorldSection;itemIndex?:number;embedded?:boolean};
function picture(slug:string,n:number){return slug==="auto-showroom"?"/template-demos/auto-showroom/black-velocity-study-"+(n%3+1)+".jpg":"/template-demos/"+slug+"/image-"+(n%5+1)+".jpg";}
function Arrow(){return <span aria-hidden="true">↗</span>;}

export function WorldSite({slug,section="home",itemIndex,embedded=false}:Props){
 const world=copies[slug],extra=worldDetails[slug];
 const [menuOpen,setMenuOpen]=useState(false);
 const [isFramed,setIsFramed]=useState(false);
 const [cart,setCart]=useState(0);
 const [cartOpen,setCartOpen]=useState(false);
 const [lightbox,setLightbox]=useState<number|null>(null);
 const [formState,setFormState]=useState<"idle"|"success">("idle");
 const formId=useId();
 const root="/template-demos/"+slug;
 const isShop=world?.action==="shop";
 const isBooking=world?.action==="booking";
 const isMagazine=slug==="editorial-journal";
 const pages=[
  {id:"home",label:"Trang chủ",href:root},
  {id:"work",label:extra?.navWork??"Dự án",href:root+"/work"},
  {id:"services",label:extra?.navServices??"Dịch vụ",href:root+"/services"},
  {id:"about",label:extra?.navAbout??"Về chúng tôi",href:root+"/about"},
  {id:"contact",label:"Liên hệ",href:root+"/contact"}
 ];
 useEffect(()=>{setMenuOpen(false);setFormState("idle");},[slug,section,itemIndex]);
 useEffect(()=>{try{setIsFramed(window.self!==window.top)}catch{setIsFramed(true)}},[]);
 useEffect(()=>{try{setCart(Number(window.sessionStorage.getItem("athena-demo-cart-"+slug)||0));}catch{}},[slug]);
 useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setLightbox(null);setCartOpen(false);setMenuOpen(false);}};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close);},[]);
 if(!world||!extra)return <div className="world-site world-missing"><h1>Không tìm thấy website demo.</h1><Link href="/services/web-development/templates">Về thư viện mẫu</Link></div>;
 const textCTA=isBooking?"Đặt lịch trải nghiệm":isShop?"Xem bộ sưu tập":isMagazine?"Khám phá bài viết":"Khám phá dự án";
 const addToCart=(quantity=1)=>{const next=cart+quantity;setCart(next);setCartOpen(true);try{window.sessionStorage.setItem("athena-demo-cart-"+slug,String(next));}catch{}};
 const resetCart=()=>{setCart(0);try{window.sessionStorage.removeItem("athena-demo-cart-"+slug);}catch{}};
 const handleForm=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setFormState("success");};
 const img=(number:number)=>picture(slug,number);
 const cards=(preview=false)=> <div className={"world-works-grid"+(preview?" is-preview":"")}>
  {world.cards.map((item,index)=>{const card={...item,index};return <article className="world-work-card" key={card.index}>
   <Link href={root+"/work/"+(card.index+1)} className="world-work-cover" aria-label={"Xem chi tiết "+card.title}>
    <Image src={img(card.index+1)} alt={"Ảnh minh họa "+card.title} fill sizes="(max-width:720px) 95vw, (max-width:1100px) 47vw, 33vw" className="world-cover-image"/>
    <span className="world-cover-index">0{card.index+1} / 03</span><span className="world-cover-arrow"><Arrow/></span>
   </Link>
   <div className="world-work-topline"><span>{card.label}</span><span>0{card.index+1} — 03</span></div>
   <div className="world-work-meta"><div><h3>{card.title}</h3><p>{card.text}</p></div>
   {isShop?<button type="button" className="world-text-link" onClick={()=>addToCart()}>Thêm vào giỏ <Arrow/></button>:<Link className="world-text-link" href={root+"/work/"+(card.index+1)}>Chi tiết <Arrow/></Link>}
   </div>
  </article>})}
 </div>;
 const overview=()=> <div className="world-highlights">
  {extra.principles.map((text,i)=><div key={text}><span>0{i+1} / OUR VALUES</span><strong>{text}</strong></div>)}
 </div>;
 const servicePreview=(full=false)=> <div className={"world-service-list"+(full?" expanded":"")}>
  {extra.services.map((service,i)=><article key={service.number} className="world-service-row">
   <span className="world-service-count">{service.number} / 03</span>
   <div><h3>{service.title}</h3><p>{service.detail}</p>{full&&<small>{service.outcome}</small>}</div>
   {full?<div className="world-service-image"><Image src={img(i+1)} alt={"Minh họa "+service.title} fill sizes="(max-width:720px) 100vw, 30vw"/></div>:<Link href={root+"/services"} aria-label={"Tìm hiểu "+service.title} className="world-service-arrow"><Arrow/></Link>}
  </article>)}
 </div>;
 const contactCta=(heading?:string)=> <section className="world-closing">
  <p className="world-eyebrow">TIẾP THEO / {world.brand}</p>
  <h2>{heading??extra.contactTitle}</h2><p>{extra.contactIntro}</p>
  <Link href={root+"/contact"} className="world-btn world-btn-inverse">Bắt đầu trao đổi <Arrow/></Link>
  <span className="world-closing-deco" aria-hidden="true">✳</span>
 </section>;
 const home=()=> <main id="world-main">
  <section className="world-hero">
   <div className="world-hero-copy"><p className="world-eyebrow">{world.eyebrow}</p><h1>{world.title}</h1><p className="world-hero-subtitle">{world.intro}</p>
    <div className="world-hero-actions"><Link className="world-btn" href={isBooking?root+"/contact":root+"/work"}>{textCTA} <Arrow/></Link><Link className="world-inline-link" href={root+"/about"}>Về thương hiệu ↗</Link></div>
    <div className="world-hero-foot"><span>{extra.slogan}</span><span>SCROLL TO EXPLORE ↓</span></div>
   </div>
   <div className="world-hero-visual"><Image src={img(0)} alt={"Hình ảnh đại diện "+world.brand} fill priority sizes="(max-width:700px) 100vw, 55vw"/><div className="world-hero-photo-caption"><span>01 / 05</span><span>{world.eyebrow}</span></div></div>
   {slug==="saas-product"&&<div className="world-dashboard" aria-label="Minh họa giao diện quản lý công việc"><div className="world-dashboard-head"><span>◉ LUMA / OVERVIEW</span><span>● SYSTEM ACTIVE</span></div><div className="world-dashboard-grid"><div><small>THIS WEEK</small><strong>84%</strong><span>Project progress</span></div><div><small>IN PROGRESS</small><strong>12</strong><span>Active tasks</span></div><div><small>UP NEXT</small><strong>03</strong><span>Team priorities</span></div></div><div className="world-dashboard-bars"><i/><i/><i/><i/><i/><i/><i/></div></div>}
  </section>
  <div className="world-ticker"><div><span>{extra.slogan}</span><b>✳</b><span>{world.brand}</span><b>✳</b><span>{extra.slogan}</span><b>✳</b><span>{world.brand}</span></div></div>
  <section className="world-section world-home-intro"><div className="world-section-label">01 / THE IDEA</div><div className="world-home-intro-text"><p className="world-eyebrow">{extra.aboutLabel}</p><h2>{extra.storyTitle}</h2><p>{extra.story}</p><Link className="world-inline-link" href={root+"/about"}>Khám phá câu chuyện <Arrow/></Link></div></section>
  <section className="world-section world-section-work"><div className="world-section-heading"><div><p className="world-eyebrow">02 / {extra.worksLabel}</p><h2>{world.section}</h2></div><Link className="world-inline-link" href={root+"/work"}>Xem tất cả <Arrow/></Link></div>{cards(true)}</section>
  <section className="world-section world-home-services"><div className="world-section-heading"><div><p className="world-eyebrow">03 / {extra.servicesLabel}</p><h2>Điều chúng tôi mang lại<span className="world-highlight">.</span></h2></div><p>{extra.approach}</p></div>{servicePreview()}</section>
  <section className="world-visual-essay"><div className="world-essay-photo"><Image src={img(4)} alt={world.brand+" — hình ảnh câu chuyện"} fill sizes="(max-width:700px) 100vw, 52vw"/></div><div className="world-essay-copy"><p className="world-eyebrow">BUILT WITH INTENTION</p><span className="world-essay-no">01 — 03</span><h2>{extra.slogan}</h2><p>{extra.approach}</p><Link className="world-inline-link" href={root+"/services"}>Khám phá thêm <Arrow/></Link></div></section>
  {contactCta()}
 </main>;
 const about=()=> <main id="world-main">
  <section className="world-about-hero"><div><p className="world-eyebrow">{extra.aboutLabel}</p><h1>{extra.storyTitle}</h1><p>{extra.story}</p></div><div className="world-about-portrait"><Image src={img(2)} alt={"Không gian và câu chuyện "+world.brand} fill sizes="(max-width:700px) 100vw, 50vw"/></div></section>
  <section className="world-section world-about-statement"><span>OUR POINT OF VIEW / 2026</span><p>{extra.slogan}</p></section>
  <section className="world-section world-values"><div className="world-section-heading"><div><p className="world-eyebrow">OUR VALUES</p><h2>Những điều chúng tôi tin.</h2></div><p>{extra.approach}</p></div>{overview()}</section>
  <section className="world-visual-essay world-visual-essay-reverse"><div className="world-essay-photo"><Image src={img(3)} alt={"Chi tiết "+world.brand} fill sizes="(max-width:700px) 100vw, 52vw"/></div><div className="world-essay-copy"><p className="world-eyebrow">A DIFFERENT POINT OF VIEW</p><h2>Không chỉ là hình thức.</h2><p>{extra.story}</p><Link className="world-inline-link" href={root+"/work"}>Xem điều chúng tôi làm <Arrow/></Link></div></section>{contactCta()}
 </main>;
 const contact=()=> <main id="world-main">
  <section className="world-page-heading"><p className="world-eyebrow">GET IN TOUCH / {world.brand}</p><h1>Liên hệ<span>.</span></h1><div><p>{extra.contactIntro}</p><span>LET&apos;S TALK ↗</span></div></section>
  <section className="world-section world-contact-layout"><div className="world-contact-details"><p className="world-eyebrow">START A CONVERSATION</p><h2>{extra.contactTitle}</h2><p>{extra.story}</p><div className="world-contact-facts"><div><span>TRANG THÁI</span><strong>Bản demo tương tác</strong></div><div><span>PHẠM VI</span><strong>{extra.servicesLabel}</strong></div><div><span>PHẢN HỒI</span><strong>Biểu mẫu mô phỏng, không gửi dữ liệu</strong></div></div></div>
  <form className="world-contact-form" onSubmit={handleForm}>
   <p className="world-eyebrow">01 / YOUR ENQUIRY</p>
   <div className="world-form-row"><label htmlFor={formId+"-name"}>Tên của bạn <span>*</span><input id={formId+"-name"} name="name" autoComplete="name" required minLength={2} placeholder="Họ và tên"/></label><label htmlFor={formId+"-mail"}>Email <span>*</span><input id={formId+"-mail"} name="email" type="email" autoComplete="email" required placeholder="ten@example.com"/></label></div>
   <div className="world-form-row"><label htmlFor={formId+"-phone"}>Số điện thoại (không bắt buộc)<input id={formId+"-phone"} name="phone" type="tel" autoComplete="tel" placeholder="+84 ..."/></label><label htmlFor={formId+"-interest"}>{isBooking?"Dịch vụ quan tâm":"Bạn quan tâm đến"} <span>*</span><select id={formId+"-interest"} required defaultValue=""><option value="" disabled>Chọn một nội dung</option>{extra.services.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}<option value="other">Trao đổi khác</option></select></label></div>
   {isBooking&&<div className="world-form-row"><label htmlFor={formId+"-date"}>Ngày mong muốn <span>*</span><input id={formId+"-date"} name="date" type="date" min={new Date().toLocaleDateString("en-CA")} required/></label><label htmlFor={formId+"-guests"}>{slug==="hospitality-booking"?"Số khách":"Số người tham gia"}<select id={formId+"-guests"} defaultValue="2">{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} người</option>)}</select></label></div>}
   <label htmlFor={formId+"-message"}>Lời nhắn <span>*</span><textarea id={formId+"-message"} rows={5} minLength={10} required placeholder="Mô tả điều bạn đang tìm kiếm..."/></label>
   <div className="world-form-consent"><span aria-hidden="true">ⓘ</span><span>Đây là biểu mẫu mô phỏng của Athena. Thông tin không được gửi đến máy chủ và không phát sinh đặt chỗ, thanh toán hay đăng ký thật.</span></div>
   <button className="world-btn" type="submit">{isBooking?"Thử gửi yêu cầu đặt lịch":"Gửi yêu cầu mô phỏng"} <Arrow/></button>
   {formState==="success"&&<p className="world-form-success" role="status"><strong>Đã mô phỏng gửi thành công.</strong> Dữ liệu chỉ được sử dụng để trình diễn giao diện và không được chuyển đến bất kỳ hộp thư nào.</p>}
  </form></section>
  <section className="world-contact-photo"><Image src={img(4)} alt={world.brand+" — không gian minh họa"} fill sizes="100vw"/><div><span>WE WOULD LOVE TO HEAR FROM YOU.</span><strong>{world.brand}</strong></div></section>
 </main>;
 return <div className="world-site" data-world={slug} data-page={section} id="world-top">
  <div className="world-announcement"><span>{world.eyebrow}</span><span>EXPERIENCE CONCEPT / 2026</span></div>
  <header className="world-header">
   <Link className="world-brand" href={root} aria-label={world.brand+" — Trang chủ"}>{world.brand}</Link>
   <nav className="world-desktop-nav" aria-label={"Điều hướng "+world.brand}>{pages.map(p=><Link key={p.id} href={p.href} scroll={false} onClick={()=>window.scrollTo({top:0,left:0,behavior:"auto"})} aria-current={(section==="detail"?"work":section)===p.id?"page":undefined}>{p.label}</Link>)}</nav>
   <div className="world-header-actions">{isShop&&<button className="world-cart-button" type="button" onClick={()=>setCartOpen(true)} aria-label={"Mở giỏ hàng với "+cart+" sản phẩm"}>BAG ({cart})</button>}<Link className="world-header-cta" href={root+"/contact"}>{isBooking?"Đặt lịch":"Bắt đầu"} <Arrow/></Link><button className="world-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls={"world-menu-"+slug} aria-label={menuOpen?"Đóng menu":"Mở menu"} onClick={()=>setMenuOpen(!menuOpen)}><span/><span/></button></div>
  </header>
  <div className={"world-mobile-nav"+(menuOpen?" is-open":"")} id={"world-menu-"+slug} aria-hidden={!menuOpen}>{pages.map((p,i)=><Link tabIndex={menuOpen?0:-1} key={p.id} href={p.href} scroll={false} onClick={()=>{setMenuOpen(false);window.scrollTo({top:0,left:0,behavior:"auto"});}}><span>0{i+1}</span>{p.label}<Arrow/></Link>)}<div className="world-mobile-nav-bottom"><strong>{world.brand}</strong><span>{extra.slogan}</span></div></div>
  {section!=="home"&&hasImmersiveHome(slug)&&<WorldSubpageFeature slug={slug} section={section}/>}
  {section==="home"?(hasImmersiveHome(slug)?<WorldImmersiveHome slug={slug} world={world} extra={extra}/>:hasSpecializedHomepage(slug)?<WorldSpecialHome slug={slug} world={world} extra={extra} addToCart={addToCart}/>:hasExistingSpecialHome(slug)?<WorldExistingSpecialHome slug={slug} world={world} extra={extra} addToCart={addToCart}/>:hasLegacySpecialHome(slug)?<WorldLegacySpecialHome slug={slug} world={world} extra={extra}/>:home()):isExperienceSection(section)?<WorldExperiencePages slug={slug} section={section as ExperienceSection} itemIndex={itemIndex} world={world} extra={extra} addToCart={addToCart}/>:section==="about"?about():contact()}
  <footer className="world-footer"><div className="world-footer-main"><div className="world-footer-identity"><Link href={root}>{world.brand}</Link><p>{extra.slogan}</p></div><div className="world-footer-column"><span>KHÁM PHÁ</span>{pages.slice(0,3).map(p=><Link key={p.id} href={p.href}>{p.label}</Link>)}</div><div className="world-footer-column"><span>THÔNG TIN</span>{pages.slice(3).map(p=><Link key={p.id} href={p.href}>{p.label}</Link>)}<Link href={root+"/work"}>Khám phá nội dung</Link></div><div className="world-footer-column"><span>TRẢI NGHIỆM</span><Link href={root+"/contact"}>Gửi yêu cầu ↗</Link><p>Một dự án website mẫu của Athena Studio. Tất cả chức năng giao dịch chỉ mang tính mô phỏng.</p></div></div><div className="world-footer-bottom"><span>© 2026 {world.brand} — {extra.footerLine}</span><Link href="#world-top">TRỞ LÊN ĐẦU ↑</Link><span>CREATED FOR ATHENA DEMO LIBRARY</span></div></footer>
  {isShop&&cartOpen&&<div className="world-drawer-backdrop" onClick={()=>setCartOpen(false)} role="presentation"><aside className="world-cart-drawer" role="dialog" aria-modal="true" aria-label="Giỏ hàng demo" onClick={event=>event.stopPropagation()}><div className="world-drawer-head"><span>YOUR BAG / DEMO</span><button onClick={()=>setCartOpen(false)} aria-label="Đóng giỏ">×</button></div><h2>Giỏ hàng của bạn.</h2><p>{cart?cart+" sản phẩm đã được thêm vào giỏ demo.":"Giỏ hàng hiện đang trống."}</p><div className="world-drawer-info">Không có xử lý thanh toán, thông tin cá nhân hay đơn hàng thật.</div>{cart>0&&<button onClick={resetCart} className="world-drawer-secondary">Xóa giỏ mô phỏng</button>}<Link href={root+"/work"} onClick={()=>setCartOpen(false)} className="world-btn">Tiếp tục mua sắm <Arrow/></Link></aside></div>}
  {lightbox!==null&&<div className="world-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh" onClick={()=>setLightbox(null)}><button onClick={()=>setLightbox(null)} aria-label="Đóng ảnh">×</button><Image src={img(lightbox)} alt={world.brand+" — ảnh trải nghiệm"} width={1600} height={1100} sizes="90vw"/></div>}
  {!embedded&&!isFramed&&section==="home"&&<TemplateEngagementPrompt slug={slug}/>}
 </div>;
}
