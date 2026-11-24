"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import site from "../data/site.json";
import style from "./pets-sovereign.module.css";
import {PoppyMarket} from "./PoppyMarket";
import frame from "./PoppyFrame.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const navItems:[string,string][]=[["Cửa hàng","/work"],["Cẩm nang","/services"],["Nhà Poppy","/about"],["Liên hệ","/contact"]];
const artifacts=[{"title":"For dogs","description":"Sản phẩm và hoạt động mô phỏng dành cho chó: đồ chơi, vận động, chăm sóc."},{"title":"For cats","description":"Những sản phẩm, góc nghỉ và hoạt động phù hợp với mèo trong không gian sống."},{"title":"Play & care","description":"Khám phá đồ chơi và phụ kiện qua các thẻ sản phẩm minh họa, không phát sinh mua bán."}];
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [selected,setSelected]=useState(0);
 const [inquiry,setInquiry]=useState("");
 const media=site.images.map(path=>assetBase+path);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{if(!menu)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[menu]);



 return <div className={style.root} id="pet-store-top">
<header className={frame.header}><Link className={frame.logo} href={go("/")}>{site.brand}<i aria-hidden="true"/></Link><nav aria-label="Poppy">{navItems.slice(0,3).map(([label,path])=><Link key={path} href={go(path)}>{label}</Link>)}</nav><Link className={frame.hello} href={go("/contact")}>Say hello! <span aria-hidden="true">♥</span></Link><button className={frame.menu} aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?"Đóng":"Menu"}</button></header>
 {menu&&<nav className={frame.menuPanel} aria-label="Poppy mobile">{navItems.map(([label,path])=><Link key={path} href={go(path)} onClick={()=>setMenu(false)}>{label}</Link>)}</nav>}
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
 {section==="work"&&<PoppyMarket section="work" itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/>}
 {section==="detail"&&<PoppyMarket section="detail" itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/>}
 {section==="services"&&<PoppyMarket section="services" itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/>}
 {section==="about"&&<PoppyMarket section="about" itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/>}
 {section==="contact"&&<PoppyMarket section="contact" itemIndex={itemIndex} basePath={basePath} assetBase={assetBase} images={site.images}/>}
 </main>
<footer className={frame.footer}><div className={frame.footerGraphic}>GOOD <em>PET</em> DAYS.</div><div className={frame.footerContent}><div><strong>{site.brand}</strong><p>Một góc nhỏ về tình bạn với thú cưng, được thiết kế như một cửa hàng concept vui nhộn.</p></div><nav aria-label="Điều hướng cuối trang">{navItems.map(([label,path])=><Link href={go(path)} key={path}>{label}</Link>)}</nav></div><small>POPPY & CO. / ATHENA STUDIO — WEBSITE DEMO. Không có sản phẩm thực tế, đơn hàng hoặc thanh toán.</small></footer>
 </div>;
}
