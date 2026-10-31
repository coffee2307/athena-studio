"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import site from "../data/site.json";
import s from "./Sora.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [filter,setFilter]=useState("Tất cả");
 const [brief,setBrief]=useState("");
 const [subject,setSubject]=useState("Nhận diện thương hiệu");
 const images=site.images.map(path=>assetBase+path);
 const go=(p:string)=>basePath+(p==="/"?"":p);
 const routes:[string,string][]=[["Tuyển tập","/work"],["Chuyên môn","/services"],["Câu chuyện","/about"],["Gửi lời nhắn","/contact"]];
 const projects=[{name:"Nếp — Điều thân thuộc",type:"Nhận diện",line:"Ngôn ngữ thị giác của những điều gần gũi."},{name:"Lặng — Những khoảng trống",type:"Không gian",line:"Không gian được kể bằng ánh sáng và im lặng."},{name:"Mùa — Giao diện biết thở",type:"Trải nghiệm số",line:"Một trải nghiệm số giữ lại nhịp sống tự nhiên."},{name:"Chân trời — Chuyện mới",type:"Nhận diện",line:"Thử nghiệm cách một câu chuyện có thể bắt đầu."},{name:"Dòng chảy — Nhận diện động",type:"Trải nghiệm số",line:"Chuyển động là một phần của nhận diện."}];
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
  const onScroll=()=>{if(frame||document.hidden)return;frame=requestAnimationFrame(()=>{frame=0;const hero=root.querySelector<HTMLElement>("[data-sora-parallax]");if(!hero)return;const rect=hero.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;root.style.setProperty("--sora-depth",Math.round(Math.max(-1,Math.min(1,(rect.top-innerHeight*.25)/innerHeight))*-28)+"px")})};
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  const ambient=root.querySelectorAll<HTMLElement>("[data-sora-ambient]");
  const ambientObserver=new IntersectionObserver(entries=>{for(const entry of entries)(entry.target as HTMLElement).dataset.soraActive=(!document.hidden&&entry.isIntersecting)?"true":"false"});
  ambient.forEach(el=>ambientObserver.observe(el));
  const onVisible=()=>{for(const el of ambient){const r=el.getBoundingClientRect();el.dataset.soraActive=(!document.hidden&&r.bottom>0&&r.top<innerHeight)?"true":"false"}};
  document.addEventListener("visibilitychange",onVisible);
  return()=>{observer.disconnect();ambientObserver.disconnect();document.removeEventListener("visibilitychange",onVisible);window.removeEventListener("scroll",onScroll);if(frame)cancelAnimationFrame(frame)};
 },[section]);
 const nav=<><div className={s.navCollection}>{routes.map(([label,url],i)=><Link key={url} onClick={()=>setMenu(false)} href={go(url)}><small>0{i+1}</small><span>{label}</span></Link>)}</div><span className={s.navEnd}>MỖI CÂU CHUYỆN CẦN MỘT NGÔN NGỮ RIÊNG</span></>;
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
    <section className={s.opening} data-sora-ambient><div className={s.openingWords}><p className={s.kicker}>SORA / TẠP CHÍ SÁNG TẠO SỐ 01</p><h1><span>Ý tưởng</span><br/><em>có đời</em><br/><span>sống riêng.</span></h1><p>Ý tưởng không chỉ cần đẹp. Chúng cần một đời sống riêng, một giọng nói riêng và đủ sức khiến người khác dừng lại.</p><Link className={s.lineLink} href={go("/work")}>Mở tuyển tập dự án <span aria-hidden="true">→</span></Link></div><figure className={s.openingImage} data-sora-parallax><img src={images[0]} alt="Ảnh chủ đề SORA, thiết kế sáng tạo"/><figcaption>01 / MỘT THẾ GIỚI ĐANG HÌNH THÀNH</figcaption></figure><div className={s.floatingCutout} aria-hidden="true"><img src={images[2]} alt=""/></div><div className={s.editorialSeal} aria-hidden="true"><span>SORA / 01</span><strong>Ý</strong><span>TƯỞNG SỐNG</span></div><span className={s.verticalLabel}>CHỮ / ẢNH / CHUYỂN ĐỘNG</span><span className={s.scrollGuide}>CUỘN ĐỂ MỞ TRANG <span aria-hidden="true">↓</span></span></section><div className={s.typeRibbon} data-sora-ambient aria-hidden="true"><div>KHÔNG THEO KHUÔN · THỬ NGHIỆM · HÌNH ẢNH · CHUYỂN ĐỘNG · KHÔNG THEO KHUÔN · THỬ NGHIỆM · HÌNH ẢNH · CHUYỂN ĐỘNG ·</div></div>
    <section className={s.manifesto} data-sora-reveal><span>02 / TUYÊN NGÔN</span><p>Thứ đáng nhớ không nhất thiết phải ồn ào. Điều quan trọng là <em>biết chính xác mình muốn kể câu chuyện gì.</em></p><div className={s.manifestoAccent} aria-hidden="true">“</div></section>
    <section className={s.featured}><div className={s.sectionLabel}><span>03 / NHỮNG DỰ ÁN ĐÃ CHỌN</span><Link href={go("/work")}>Xem toàn bộ tuyển tập <span aria-hidden="true">→</span></Link></div><div className={s.asymmetricGrid}>{projects.slice(0,3).map((project,i)=><Link className={s.project} data-sora-reveal key={project.name} href={go("/work/"+(i+1))}><div className={s.projectImage}><img src={images[i+1]||images[0]} alt={project.name}/><span>0{i+1} / {project.type}</span></div><h2>{project.name}</h2><p>{project.line}</p></Link>)}</div></section>
    <section className={s.contactBand} data-sora-reveal><span>04 / TRANG TIẾP THEO?</span><p>Những câu chuyện đáng nhớ bắt đầu bằng một cuộc trò chuyện.</p><Link href={go("/contact")}>Kể câu chuyện của bạn <span aria-hidden="true">→</span></Link></section>
   </>}
   {section==="work"&&<section className={s.workSpread}><div className={s.routeIntro}><span>TUYỂN TẬP / SỐ 01</span><h1>Có chọn lọc,<br/><em>có chủ đích.</em></h1><p>Năm hướng khám phá, mỗi dự án là một cách đặt câu hỏi.</p></div><div className={s.filters} role="group" aria-label="Lọc dự án">{["Tất cả","Nhận diện","Không gian","Trải nghiệm số"].map(x=><button aria-pressed={filter===x} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div><div className={s.workGrid}>{projects.map((p,i)=>({p,i})).filter(({p})=>filter==="Tất cả"||p.type===filter).map(({p,i})=><Link key={p.name} href={go("/work/"+(i+1))} className={s.workPiece}><img src={images[i%images.length]} alt={p.name}/><small>HÌNH {String(i+1).padStart(2,"0")} / {p.type}</small><h2>{p.name}</h2><p>{p.line}</p></Link>)}</div></section>}
   {section==="detail"&&<article className={s.story}><div className={s.storyHeading}><Link href={go("/work")}>← VỀ TUYỂN TẬP</Link><span>HỒ SƠ / 0{itemIndex}</span><h1>{projects[(itemIndex-1)%projects.length].name}</h1><p>{projects[(itemIndex-1)%projects.length].line}</p></div><img className={s.storyHero} src={images[(itemIndex-1)%images.length]} alt="Ảnh mở đầu case study"/><div className={s.storyText}><span>01 / GÓC NHÌN</span><h2>Mỗi dự án bắt đầu bằng một câu hỏi khác.</h2><p>Trong bản minh họa này, phương pháp tiếp cận đặt trải nghiệm và ngôn ngữ thị giác lên trước kết quả trang trí. Nội dung là ví dụ cho portfolio, không phải hồ sơ khách hàng thật.</p></div><div className={s.storyPair}><img src={images[itemIndex%images.length]} alt="Chi tiết thị giác dự án"/><img src={images[(itemIndex+1)%images.length]} alt="Thử nghiệm hình ảnh dự án"/></div><Link className={s.lineLink} href={go("/contact")}>Trao đổi về dự án mới →</Link></article>}
   {section==="services"&&<section className={s.disciplines}><div className={s.routeIntro}><span>LĨNH VỰC / 03 HƯỚNG SÁNG TẠO</span><h1>Không một<br/><em>khuôn mẫu.</em></h1><p>Cách chúng tôi làm bắt đầu từ điều thương hiệu cần truyền đạt, không bắt đầu từ một template.</p></div>{[{t:"01 / Nhận diện và mỹ thuật",d:"Từ định vị, hệ thống ngôn ngữ đến cách thương hiệu sống trong từng điểm chạm."},{t:"02 / Trải nghiệm số",d:"Những không gian số có nhịp kể chuyện, khả năng sử dụng và một dấu ấn riêng."},{t:"03 / Chiến dịch và biên tập",d:"Biến thông điệp thành hình ảnh, ấn phẩm và những khoảnh khắc dễ nhớ."}].map((x,i)=><div className={s.discipline} key={x.t}><span>{x.t}</span><p>{x.d}</p><img src={images[i%images.length]} alt={"Minh họa "+x.t}/></div>)}</section>}
   {section==="about"&&<section className={s.aboutLetter}><span>MỘT LÁ THƯ / TỪ SORA</span><h1>Một xưởng<br/><em>không rập</em><br/>khuôn.</h1><div><p>Chúng tôi tin rằng mọi thương hiệu đều có một câu chuyện chưa được kể đúng cách. SORA tồn tại để tìm ra ngôn ngữ của câu chuyện ấy.</p><p>Đây là website mẫu minh họa trải nghiệm sáng tạo. Các dự án và nội dung bên trong không đại diện cho khách hàng thật của Athena Studio.</p></div><figure><img src={images[3]} alt="Không gian sáng tạo SORA"/><figcaption>KHÔNG CÓ HAI CÂU CHUYỆN GIỐNG NHAU.</figcaption></figure></section>}
   {section==="contact"&&<section className={s.letterForm}><div className={s.routeIntro}><span>LÁ THƯ / SỐ 01</span><h1>Kể chúng tôi<br/><em>nghe nhé.</em></h1><p>Một lá thư tốt thường bắt đầu bằng một câu hỏi nhỏ.</p></div><form onSubmit={e=>{e.preventDefault();window.location.href="mailto:hello@example.com?subject="+encodeURIComponent("SORA / "+subject)+"&body="+encodeURIComponent(brief)}}><label htmlFor="sora-disc">Bạn đang nghĩ về điều gì?</label><select id="sora-disc" value={subject} onChange={e=>setSubject(e.target.value)}><option>Nhận diện thương hiệu</option><option>Website sáng tạo</option><option>Chiến dịch hình ảnh</option></select><label htmlFor="sora-brief">Ý tưởng của bạn</label><textarea required id="sora-brief" minLength={10} value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Kể cho chúng tôi nghe về ý tưởng của bạn…"/><button>Soạn thư trong ứng dụng email <span aria-hidden="true">→</span></button><p>Thư mẫu mở ứng dụng email, không gửi dữ liệu đến máy chủ của website demo.</p></form></section>}
  </main>
  <footer className={s.lastPage}><span>HẾT SỐ BÁO / CHƯA HẾT CÂU CHUYỆN</span><Link className={s.footerName} href={go("/")}>{site.brand}<sup>©26</sup></Link><div className={s.footerLinks}><p>Những góc nhìn riêng.<br/>Chung một sự tò mò.</p><Link href={go("/work")}>Tuyển tập</Link><Link href={go("/about")}>Về SORA</Link><Link href={go("/contact")}>Gửi lời nhắn</Link></div><small>MẪU TRẢI NGHIỆM SÁNG TẠO — DỮ LIỆU MINH HỌA</small></footer>
 </div>;
}
