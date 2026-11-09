"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import site from "../data/site.json";
import style from "./pets-sovereign.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const navItems:[string,string][]=[["For dogs","/work"],["For cats","/services"],["The studio","/about"],["Contact","/contact"]];
const artifacts=[{"title":"For dogs","description":"An independent exploration of craft, process and everyday moments."},{"title":"For cats","description":"A closer look at the detail, people and thinking behind the work."},{"title":"Play & care","description":"A practical path from first idea to a considered experience."}];
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [selected,setSelected]=useState(0);
 const [inquiry,setInquiry]=useState("");
 const media=site.images.map(path=>assetBase+path);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{if(!menu)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[menu]);



 return <div className={style.root} id="pet-store-top">
<header className={style.header}><Link className={style.logo} href={go("/")}>{site.brand}</Link><nav>{navItems.slice(0,2).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav><button className={style.hamburger} aria-expanded={menu} onClick={()=>setMenu(v=>!v)} aria-label={menu?"Đóng điều hướng":"Mở điều hướng"}><i/><i/><i/></button><Link className={style.actionHead} href={go("/contact")}>Hi there!</Link></header>
 {menu&&<button className={style.menuScrim} aria-label="Đóng điều hướng" onClick={()=>setMenu(false)}/>}<aside className={style.menuPanel} inert={!menu} aria-hidden={!menu}><div className={style.menuTitle}>NAVIGATION / {site.brand}</div>{navItems.map(([label,path],i)=><Link key={path} href={go(path)} onClick={()=>setMenu(false)}><small>0{i+1}</small>{label}</Link>)}<button onClick={()=>setMenu(false)}>CLOSE / MENU</button></aside>
 <main>
 {section==="home"&&<>
  <section className={style.poppyScene} data-dna04-artifact="pet-store-poppyScene">
   <div className={style.poppyKicker}><span>POPPY & CO. / LITTLE THINGS, BIG FEELINGS</span><span>MADE FOR YOUR FAVOURITE SIDEKICK</span></div>
   <figure className={style.heroFigure}>
    <img key={selected} src={media[selected%media.length]} alt={"Ảnh minh họa "+artifacts[selected].title} fetchPriority="high"/>
    <div className={style.poppyPhotoBadge} aria-hidden="true"><span>100%</span>GOOD<br/>BOY<br/>ENERGY</div>
    <figcaption><span>THE POPPY DIARY</span><strong>0{selected+1} / 0{artifacts.length}</strong></figcaption>
   </figure>
   <div className={style.heroWords}>
    <span className={style.poppyOverline}><i aria-hidden="true"/> HELLO, LITTLE FRIEND!</span>
    <h1>Little <em>joys.</em><br/>Big <span>love.</span></h1>
    <p>All the little things that make life with your pet wonderfully, wildly happy. Find a new favourite for your furry companion.</p>
    <div className={style.poppyChips} role="group" aria-label="Chọn người bạn thú cưng">{artifacts.map((item,i)=><button key={item.title} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>{["DOG DAYS","CAT NAPS","PLAY TIME"][i]}</span><small>0{i+1}</small></button>)}</div>
    <Link href={go("/work")} className={style.poppyShopAction}>DISCOVER THE HAPPY STUFF <span aria-hidden="true">●</span></Link>
    <small className={style.poppyDemoLabel}>A playful boutique concept · No real orders or checkout</small>
   </div>
   <div className={style.poppyBottomStrip} aria-hidden="true"><span>PETS FIRST</span><span>♥</span><span>PLAY EVERY DAY</span><span>♥</span><span>SMALL JOYS, BIG HEARTS</span><span>♥</span><span>POPPY & CO.</span></div>
  </section>
  <section className={style.petPaths} data-dna04-artifact="pet-store-petPaths">
   <h2>WHO ARE WE SHOPPING FOR?</h2>
   <div className={style.interactive} role="group" aria-label="Khám phá nội dung">{artifacts.map((item,i)=><button type="button" key={item.title} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>0{i+1}</span><b>{item.title}</b></button>)}</div>
  </section>
 </>}
 {section==="work"&&<><section className={style.archivePage}><div className={style.sectionTitle}><small>POPPY / FRIENDLY FINDS</small><h1>For dogs / For cats</h1><p>The essentials for a happier everyday with your pet.</p></div><div className={style.catalogGrid}>{artifacts.map((item,i)=><Link key={item.title} href={go("/work/"+(i+1))} className={style.artifact} data-dna04-artifact="pet-store-artifact"><img src={media[i%media.length]} alt={item.title}/><small>0{i+1} / PETS</small><h2>{item.title}</h2><p>{item.description}</p></Link>)}</div></section></>}
 {section==="detail"&&<><article className={style.detailPage}><Link href={go("/work")}>← BACK TO INDEX</Link><small>FILE / 0{itemIndex}</small><h1>{artifacts[(itemIndex-1)%3].title}</h1><p>{artifacts[(itemIndex-1)%3].description}</p><figure><img src={media[(itemIndex-1)%media.length]} alt="Illustrative case material"/><figcaption>VISUAL STUDY / DEMONSTRATION MATERIAL</figcaption></figure><div className={style.detailPair}><span>CONTEXT</span><p>The essentials for a happier everyday with your pet.</p><span>PROCESS</span><p>Trình bày phương pháp minh họa. Không phải hồ sơ dự án đã thực hiện cho khách hàng.</p></div><Link href={go("/contact")}>START A CONVERSATION →</Link></article></>}
 {section==="services"&&<><section className={style.servicePage}><div className={style.sectionTitle}><small>THE PRACTICE / 01—03</small><h1>For dogs / For cats / Play &amp; care</h1><p>The essentials for a happier everyday with your pet.</p></div><div className={style.serviceSequence}>{artifacts.map((item,i)=><button key={item.title} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>0{i+1}</span><strong>{item.title}</strong><p>{item.description}</p></button>)}</div><figure className={style.serviceVisual}><img src={media[selected%media.length]} alt={artifacts[selected].title}/><figcaption>{artifacts[selected].title} / SELECTED DISCIPLINE</figcaption></figure></section></>}
 {section==="about"&&<><section className={style.aboutPage}><div className={style.aboutCopy}><small>ABOUT / PETS</small><h1>Every little friend matters.</h1><p>The essentials for a happier everyday with your pet.</p><p>Đây là thương hiệu khái niệm trong thư viện Athena Studio. Nội dung và hình ảnh minh họa không được trình bày là thành tích của khách hàng thật.</p></div><div className={style.aboutMedia}><img src={media[3%media.length]} alt="Illustrative brand material"/><span>THE PRINCIPLES / 2026</span></div></section></>}
 {section==="contact"&&<><section className={style.contactPage}><div className={style.contactIntro}><small>INQUIRY / PETS</small><h1>Let’s talk about for dogs.</h1><p>The essentials for a happier everyday with your pet.</p></div><form onSubmit={e=>{e.preventDefault();window.location.href="mailto:hello@example.com?subject="+encodeURIComponent("Poppy & Co. / enquiry")+"&body="+encodeURIComponent(inquiry)}}><label htmlFor="independent-inquiry-pet-store">YOUR MESSAGE</label><textarea id="independent-inquiry-pet-store" required minLength={10} value={inquiry} onChange={e=>setInquiry(e.target.value)} placeholder="Mô tả nhu cầu của bạn…"/><button type="submit">MỞ ỨNG DỤNG EMAIL →</button><p>Website demo không thu thập hoặc gửi dữ liệu đến máy chủ.</p></form></section></>}
 </main>
<footer className={style.footer}><div className={style.footerTop}><small>END OF THIS JOURNEY / NEXT STARTS HERE</small><Link href={go("/contact")}>START A CONVERSATION →</Link></div><div className={style.footerSignature}>{site.brand}</div><div className={style.footerMenu}>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</div><small>AN INDEPENDENT DEMO, NOT A VERIFIED COMMERCIAL ENTITY.</small></footer>
 </div>;
}
