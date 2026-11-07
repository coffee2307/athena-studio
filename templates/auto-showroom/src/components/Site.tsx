"use client";
import {useState} from "react";
import Link from "next/link";
import site from "../data/site.json";
type Section="home"|"work"|"services"|"about"|"contact";
const routes=[["home","Trang chủ","/"],["work","Dự án","/work"],["services","Dịch vụ","/services"],["about","Giới thiệu","/about"],["contact","Liên hệ","/contact"]] as const;
export function Site({section="home"}:{section?:Section}){
 const [focus,setFocus]=useState(0);
 const [menu,setMenu]=useState(false);
 const items=site.features as string[];
 const gallery=site.images as string[];
 const label=section==="home"?"TRANG CHỦ":section==="work"?"CÔNG VIỆC":section==="services"?"DỊCH VỤ":section==="about"?"CÂU CHUYỆN":"LIÊN HỆ";
 return <div className={"site site-"+site.layout+" site-"+site.variant}>
  <header className="site-header"><Link className="brand" href="/">{site.brand}</Link><button className="menu-toggle" type="button" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?"Đóng":"Menu"}</button><nav className={menu?"open":""} aria-label="Điều hướng chính">{routes.map(([id,title,url])=><Link key={id} aria-current={section===id?"page":undefined} href={url}>{title}</Link>)}</nav><span className="site-index">EST. 2026 / CONCEPT</span></header>
  <main>
   <section className="hero"><div className="hero-copy"><span className="eyebrow">{site.industry} / {label}</span><h1>{section==="home"?site.brand:section==="work"?"Khám phá công việc.":section==="services"?"Những gì chúng tôi làm.":section==="about"?"Một hướng đi riêng.":"Bắt đầu trao đổi."}</h1><p>{section==="home"?site.description:section==="work"?site.purpose:section==="services"?site.description:section==="about"?site.purpose:"Mẫu website minh họa. Hãy thay thế thông tin liên hệ bằng thông tin thương hiệu của bạn trước khi sử dụng."}</p><Link className="hero-action" href={section==="contact"?"/":"#explore"}>{section==="contact"?"Trở về trang chủ":"Khám phá"}<span aria-hidden="true">→</span></Link></div><div className="hero-visual"><img src={gallery[focus]||gallery[0]} alt={"Ảnh minh họa "+site.title}/><span className="hero-overlay">{site.style} / {String(focus+1).padStart(2,"0")}</span></div></section>
   <section className="explore" id="explore"><div className="section-header"><small>SELECTED EXPERIENCE / 01</small><h2>{section==="work"?"Những góc nhìn khác nhau.":section==="services"?"Cấu trúc được thiết kế.":section==="about"?"Điều chúng tôi theo đuổi.":section==="contact"?"Mở đầu một câu chuyện.":"Dấu ấn riêng của mỗi lựa chọn."}</h2></div>
   {section==="contact"?<div className="contact-sample"><strong>Contact / Demo</strong><p>Website mẫu không tự động thu thập hay gửi thông tin.</p><Link href="mailto:hello@example.com?subject=Website%20inquiry">Mở ứng dụng email mẫu</Link></div>:<><div className="feature-grid">{items.slice(0,4).map((feature,i)=><button key={feature} type="button" aria-pressed={focus===i%gallery.length} onClick={()=>setFocus(i%gallery.length)} className="feature"><span>0{i+1}</span><strong>{feature}</strong><span>→</span></button>)}</div><div className="gallery">{gallery.slice(0,5).map((image,i)=><button type="button" aria-label={"Chọn ảnh "+(i+1)} aria-pressed={focus===i} key={image} onClick={()=>setFocus(i)}><img src={image} alt={site.title+" / hình "+(i+1)}/></button>)}</div></>}
   </section>
   <section className="ending"><span>ATHENA / INDEPENDENT TEMPLATE</span><h2>{site.style}</h2><Link href="/contact">Trao đổi về dự án <span aria-hidden="true">→</span></Link></section>
  </main><footer><span>{site.brand} © 2026 / CONCEPT</span><span>Template độc lập từ Athena Studio — Không phải website khách hàng thật</span></footer>
 </div>
}
