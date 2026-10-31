"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import site from "../data/site.json";
import s from "./Sora.module.css";
import {SoraLivingCover} from "./SoraLivingCover";
import {SoraLetterDesk} from "./SoraLetterDesk";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [editorialLayer,setEditorialLayer]=useState(0);
 const [filter,setFilter]=useState("Tất cả");
 const images=site.images.map(path=>assetBase+path);
 const go=(p:string)=>basePath+(p==="/"?"":p);
 const routes:[string,string][]=[["Mẫu thiết kế","/work"],["Dịch vụ","/services"],["Giới thiệu","/about"],["Liên hệ","/contact"]];
 const projects=[
  {name:"Bộ nhận diện quán cà phê",type:"Nhận diện",line:"Mẫu logo, bảng màu, kiểu chữ và bao bì cho quán cà phê.",goal:"Giúp quán sử dụng hình ảnh thống nhất trên menu, bao bì và bảng hiệu.",deliverables:"Logo, bảng màu, kiểu chữ, menu và mẫu bao bì."},
  {name:"Website studio nội thất",type:"Website",line:"Mẫu trang giới thiệu dịch vụ, dự án và biểu mẫu liên hệ.",goal:"Giúp khách hàng xem các công trình và gửi yêu cầu tư vấn.",deliverables:"Trang chủ, danh sách dự án, giới thiệu studio và trang liên hệ."},
  {name:"Bộ ảnh ra mắt sản phẩm",type:"Hình ảnh",line:"Mẫu ảnh quảng cáo, banner và bài đăng cho đợt ra mắt sản phẩm.",goal:"Giới thiệu sản phẩm thống nhất trên website và mạng xã hội.",deliverables:"Ảnh chủ đạo, banner quảng cáo và mẫu bài đăng mạng xã hội."},
  {name:"Bộ nhận diện cửa hàng hoa",type:"Nhận diện",line:"Mẫu logo, nhãn sản phẩm, túi giấy và bảng hiệu.",goal:"Giúp cửa hàng duy trì nhận diện thống nhất tại cửa hàng và trên bao bì.",deliverables:"Logo, bảng màu, nhãn sản phẩm, túi giấy và bảng hiệu."},
  {name:"Website giới thiệu sự kiện",type:"Website",line:"Mẫu trang lịch chương trình, thông tin sự kiện và đăng ký tham gia.",goal:"Giúp người xem nắm lịch trình và tìm thấy thông tin tham gia.",deliverables:"Trang giới thiệu, lịch chương trình, thông tin địa điểm và mẫu đăng ký."}
 ];
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{if(!menu)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[menu]);
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>("[data-sora-surface]");
  if(!root)return;
  const items=root.querySelectorAll<HTMLElement>("[data-sora-reveal]");
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){items.forEach(x=>x.dataset.soraVisible="true");return;}
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.soraVisible="true";observer.unobserve(entry.target)}},{threshold:.12,rootMargin:"0px 0px -24px 0px"});
  items.forEach(x=>observer.observe(x));
  let frame=0;
  const onScroll=()=>{if(frame||document.hidden)return;frame=requestAnimationFrame(()=>{frame=0;const hero=root.querySelector<HTMLElement>("[data-sora-parallax]");if(!hero)return;const rect=hero.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;root.style.setProperty("--sora-depth",Math.round(Math.max(-1,Math.min(1,(rect.top-innerHeight*.25)/innerHeight))*-28)+"px");const p=Math.max(0,Math.min(1,(innerHeight*.75-rect.top)/(innerHeight+rect.height*.32)));root.style.setProperty("--sora-page-rise",Math.round(-36*p)+"px");root.style.setProperty("--sora-page-turn",(-4*p).toFixed(2)+"deg")})};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  const ambient=root.querySelectorAll<HTMLElement>("[data-sora-ambient]");
  const ambientObserver=new IntersectionObserver(entries=>{for(const entry of entries)(entry.target as HTMLElement).dataset.soraActive=(!document.hidden&&entry.isIntersecting)?"true":"false"});
  ambient.forEach(el=>ambientObserver.observe(el));
  const onVisible=()=>{for(const el of ambient){const r=el.getBoundingClientRect();el.dataset.soraActive=(!document.hidden&&r.bottom>0&&r.top<innerHeight)?"true":"false"}};
  document.addEventListener("visibilitychange",onVisible);
  return()=>{observer.disconnect();ambientObserver.disconnect();document.removeEventListener("visibilitychange",onVisible);window.removeEventListener("scroll",onScroll);if(frame)cancelAnimationFrame(frame)};
 },[section]);
 const nav=<><div className={s.navCollection}>{routes.map(([label,url],i)=><Link key={url} onClick={()=>setMenu(false)} href={go(url)}><small>0{i+1}</small><span>{label}</span></Link>)}</div><span className={s.navEnd}>LOGO / WEBSITE / HÌNH ẢNH</span></>;
 return <div className={s.sora} id="sora-top" data-sora-surface>
  <header className={s.masthead}>
   <Link className={s.logotype} href={go("/")}>{site.brand}<span>®</span></Link>
   <span className={s.headEdition}>XƯỞNG SÁNG TẠO / SỐ 01</span>
   <nav className={s.desktopIndex} aria-label="Điều hướng SORA trên máy tính">{routes.map(([label,url],index)=><Link href={go(url)} key={url}><small>0{index+1}</small>{label}</Link>)}</nav>
   <button className={s.menuButton} aria-expanded={menu} aria-label={menu?"Đóng mục lục":"Mở mục lục"} onClick={()=>setMenu(v=>!v)}><i/><i/></button>
  </header>
  <button className={s.menuBackdrop} type="button" data-open={menu} aria-label="Đóng mục lục" aria-hidden={!menu} tabIndex={menu?0:-1} onClick={()=>setMenu(false)}/>
  <aside className={s.drawer} role="dialog" aria-label="Mục lục SORA" aria-hidden={!menu} inert={!menu}><button type="button" className={s.drawerX} onClick={()=>setMenu(false)} aria-label="Đóng mục lục"><span aria-hidden="true">×</span></button><span className={s.drawerTitle}>Mục lục<span>.</span></span>{nav}</aside>
  <main>
   {section==="home"&&<>
    <SoraLivingCover images={images} workHref={go("/work")}/>
    <div className={s.typeRibbon} data-sora-ambient aria-hidden="true"><div>THIẾT KẾ LOGO · GIAO DIỆN WEBSITE · HÌNH ẢNH QUẢNG CÁO · THIẾT KẾ LOGO · GIAO DIỆN WEBSITE · HÌNH ẢNH QUẢNG CÁO ·</div></div>
    <section id="sora-manifesto" className={s.manifesto} data-sora-reveal><span>02 / CÁCH LÀM VIỆC</span><p>Mỗi thiết kế cần giải quyết một việc cụ thể: <em>giúp người xem nhận ra thương hiệu, hiểu sản phẩm và biết bước tiếp theo.</em></p><div className={s.manifestoAccent} aria-hidden="true">“</div></section>
    <section className={s.featured}><div className={s.sectionLabel}><span>03 / CÁC MẪU THIẾT KẾ</span><Link href={go("/work")}>Xem tất cả mẫu <span aria-hidden="true">→</span></Link></div><div className={s.asymmetricGrid}>{projects.slice(0,3).map((project,i)=><Link className={s.project} data-sora-reveal key={project.name} href={go("/work/"+(i+1))}><div className={s.projectImage}><img src={images[i+1]||images[0]} alt={project.name}/><span>0{i+1} / {project.type}</span></div><h2>{project.name}</h2><p>{project.line}</p></Link>)}</div></section>
    <section className={s.editorialLab} data-sora-reveal aria-label="Bàn biên tập SORA">
      <div className={s.labHeading}><span>04 / XƯỞNG HÌNH ẢNH</span><h2>Một ý tưởng.<br/><em>Ba cách kể.</em></h2><p>Chọn một mục để xem ba thành phần thường có trong một thiết kế: hình ảnh, chất liệu và chuyển động.</p></div>
      <div className={s.labStage}>
        <div className={s.labVisual} data-layer={editorialLayer} key={editorialLayer}><img src={images[[2,4,3][editorialLayer]]} alt={["Thử nghiệm hình ảnh và đường nét","Hình ảnh và chất liệu trong nhận diện","Nhịp chuyển động của một dự án sáng tạo"][editorialLayer]}/><div className={s.labIndex} aria-hidden="true">0{editorialLayer+1} / 03</div></div>
        <div className={s.labControls} role="group" aria-label="Chọn lớp sáng tạo">{[["01","Hình ảnh","Lựa chọn ảnh và bố cục."],["02","Chất liệu","So sánh màu sắc và bề mặt."],["03","Chuyển động","Xem cách hiệu ứng dẫn hướng người dùng."]].map(([index,title,desc],i)=><button type="button" aria-pressed={editorialLayer===i} onClick={()=>setEditorialLayer(i)} key={index}><span>{index}</span><strong>{title}</strong><small>{desc}</small></button>)}</div>
      </div>
    </section>
    <section className={s.contactBand} data-sora-reveal><span>05 / LIÊN HỆ</span><p>Cần thiết kế logo, website hay hình ảnh quảng cáo?</p><Link href={go("/contact")}>Gửi yêu cầu thiết kế <span aria-hidden="true">→</span></Link></section>
   </>}
   {section==="work"&&<section className={s.workSpread}><div className={s.routeIntro}><span>THƯ VIỆN MẪU / SỐ 01</span><h1>Năm mẫu<br/><em>thiết kế cụ thể.</em></h1><p>Chọn một nhóm để xem mẫu logo, website hoặc hình ảnh quảng cáo. Đây là dự án minh họa, không phải hồ sơ khách hàng thực tế.</p></div><div className={s.filters} role="group" aria-label="Lọc dự án">{["Tất cả","Nhận diện","Website","Hình ảnh"].map(x=><button aria-pressed={filter===x} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div><div className={s.workGrid}>{projects.map((p,i)=>({p,i})).filter(({p})=>filter==="Tất cả"||p.type===filter).map(({p,i})=><Link key={p.name} href={go("/work/"+(i+1))} className={s.workPiece}><img src={images[i%images.length]} alt={p.name}/><small>HÌNH {String(i+1).padStart(2,"0")} / {p.type}</small><h2>{p.name}</h2><p>{p.line}</p></Link>)}</div></section>}
   {section==="detail"&&<article className={s.story}><div className={s.storyHeading}><Link href={go("/work")}>← VỀ TUYỂN TẬP</Link><span>HỒ SƠ / 0{itemIndex}</span><h1>{projects[(itemIndex-1)%projects.length].name}</h1><p>{projects[(itemIndex-1)%projects.length].line}</p></div><img className={s.storyHero} src={images[(itemIndex-1)%images.length]} alt="Ảnh mở đầu case study"/><div className={s.storyText}><span>01 / GÓC NHÌN</span><h2>Mẫu thiết kế gồm những gì?</h2><p>{projects[(itemIndex-1)%projects.length].deliverables} Mục tiêu: {projects[(itemIndex-1)%projects.length].goal} Đây là nội dung minh họa, không phải hồ sơ khách hàng thật.</p></div><div className={s.storyPair}><img src={images[itemIndex%images.length]} alt="Chi tiết thị giác dự án"/><img src={images[(itemIndex+1)%images.length]} alt="Thử nghiệm hình ảnh dự án"/></div><Link className={s.lineLink} href={go("/contact")}>Trao đổi về dự án mới →</Link></article>}
   {section==="services"&&<section className={s.disciplines}><div className={s.routeIntro}><span>DỊCH VỤ / 03 NHÓM THIẾT KẾ</span><h1>Logo, website<br/><em>và hình ảnh.</em></h1><p>Xem những hạng mục có thể thiết kế cho một thương hiệu.</p></div>{[{t:"01 / Nhận diện thương hiệu",d:"Thiết kế logo, bảng màu, kiểu chữ và các ấn phẩm thương hiệu."},{t:"02 / Website sáng tạo",d:"Thiết kế giao diện, trang nội dung và các tính năng tương tác."},{t:"03 / Chiến dịch hình ảnh",d:"Thiết kế ảnh quảng cáo, banner và bài đăng mạng xã hội."}].map((x,i)=><div className={s.discipline} key={x.t}><span>{x.t}</span><p>{x.d}</p><img src={images[i%images.length]} alt={"Minh họa "+x.t}/></div>)}</section>}
   {section==="about"&&<section className={s.aboutLetter}><span>MỘT LÁ THƯ / TỪ SORA</span><h1>Một xưởng<br/><em>không rập</em><br/>khuôn.</h1><div><p>Chúng tôi tin rằng mọi thương hiệu đều có một câu chuyện chưa được kể đúng cách. SORA là mẫu website giới thiệu dịch vụ thiết kế logo, website và hình ảnh quảng bá.</p><p>Đây là website mẫu minh họa trải nghiệm sáng tạo. Các dự án và nội dung bên trong không đại diện cho khách hàng thật của Athena Studio.</p></div><figure><img src={images[3]} alt="Không gian sáng tạo SORA"/><figcaption>KHÔNG CÓ HAI CÂU CHUYỆN GIỐNG NHAU.</figcaption></figure></section>}
   {section==="contact"&&<section className={s.letterForm}><div className={s.routeIntro}><span>LÁ THƯ / SỐ 01</span><h1>Kể chúng tôi<br/><em>nghe nhé.</em></h1><p>Một lá thư tốt thường bắt đầu bằng một câu hỏi nhỏ.</p><div className={s.letterIntroStamp} aria-hidden="true"><span>SORA</span><strong>THƯ<br/>BẠN GỬI</strong></div></div><SoraLetterDesk/></section>}
  </main>
  <footer className={s.lastPage}><span>HẾT SỐ BÁO / CHƯA HẾT CÂU CHUYỆN</span><Link className={s.footerName} href={go("/")}>{site.brand}<sup>©26</sup></Link><div className={s.footerLinks}><p>Mẫu thiết kế logo,<br/>website và hình ảnh.</p><Link href={go("/work")}>Tuyển tập</Link><Link href={go("/about")}>Về SORA</Link><Link href={go("/contact")}>Gửi lời nhắn</Link></div><small>MẪU TRẢI NGHIỆM SÁNG TẠO — DỮ LIỆU MINH HỌA</small></footer>
 </div>;
}
