"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState,type PointerEvent} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

const scenes=new Set(["creative-studio","architecture-studio","auto-showroom"]);
export function hasImmersiveHome(slug:string){return scenes.has(slug);}
type Props={slug:string;world:DemoCopy;extra:WorldDetail};
const modes:Record<string,string[]>={
 "creative-studio":["Lớp hình","Không gian","Chuyển động"],
 "architecture-studio":["Tổng thể","Chi tiết","Kết cấu"],
 "auto-showroom":["Ánh sáng","Thiết kế","Hiệu năng"]
};
const sceneDescriptions:Record<string,string[]>={
 "creative-studio":["Visual identity / 001","Spatial narrative / 002","Digital experience / 003"],
 "architecture-studio":["Ánh sáng & tỷ lệ","Những chất liệu thật","Không gian để sống"],
 "auto-showroom":["NIGHT DRIVE / 01","FORM STUDY / 02","PERFORMANCE / 03"]
};
function Series({slug,world,root}:{slug:string;world:DemoCopy;root:string}){
 return <section className="ix-series" aria-labelledby={"ix-series-"+slug}>
  <div className="ix-series-heading"><div><span>02 / SELECTED WORK</span><h2 id={"ix-series-"+slug}>{world.section}<span className="ix-period">.</span></h2></div><Link href={root+"/work"}>Toàn bộ dự án <span aria-hidden="true">↗</span></Link></div>
  <div className="ix-series-grid">{world.cards.map((card,i)=><Link href={root+"/work/"+(i+1)} className="ix-work-item" key={card.title}>
   <div className="ix-work-shot"><Image src={root+"/image-"+(i+3)+".jpg"} alt={"Hình ảnh minh họa cho "+card.title} fill sizes="(max-width: 760px) 100vw, 34vw" loading="lazy"/><span className="ix-work-number">{String(i+1).padStart(2,"0")} / 03</span></div>
   <div className="ix-work-meta"><span>{card.label}</span><span aria-hidden="true">↗</span></div><h3>{card.title}</h3><p>{card.text}</p>
  </Link>)}</div>
 </section>;
}
export function WorldImmersiveHome({slug,world,extra}:Props){
 const [mode,setMode]=useState(0);
 const [reduced,setReduced]=useState(false);
 const viewport=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync=()=>setReduced(media.matches);
  sync();media.addEventListener("change",sync);
  return()=>media.removeEventListener("change",sync);
 },[]);
 const track=(event:PointerEvent<HTMLDivElement>)=>{
  if(reduced||event.pointerType==="touch"||!viewport.current)return;
  const rect=event.currentTarget.getBoundingClientRect();
  const x=((event.clientX-rect.left)/rect.width-.5)*2;
  const y=((event.clientY-rect.top)/rect.height-.5)*2;
  viewport.current.style.setProperty("--ix-x",(x*10).toFixed(1)+"px");
  viewport.current.style.setProperty("--ix-y",(y*8).toFixed(1)+"px");
 };
 const reset=()=>{viewport.current?.style.setProperty("--ix-x","0px");viewport.current?.style.setProperty("--ix-y","0px");};
 const root="/template-demos/"+slug;
 const isStudio=slug==="creative-studio";
 const isArch=slug==="architecture-studio";
 const labels=modes[slug];
 const caption=sceneDescriptions[slug][mode];
 const orderedImages:Record<string,number[]>={"creative-studio":[1,4,5],"architecture-studio":[5,4,3],"auto-showroom":[5,1,4]};
 const activeImage=root+"/image-"+orderedImages[slug][mode]+".jpg";
 return <main className={"ix-site ix-"+slug+" immersive-home"} id="world-main">
  <section className="ix-hero">
   {isStudio&&<div className="ix-studio-intro"><span>INDEPENDENT CREATIVE PRACTICE</span><span>EST. 2026 / VIETNAM</span></div>}
   <div className="ix-hero-copy">
    <div className="ix-kicker"><span className="ix-kicker-dot"/>{world.eyebrow}</div>
    <h1>{isStudio?<>Đủ khác biệt<br/>để <em>được nhớ.</em></>:isArch?<>Không gian<br/><em>biết lắng nghe.</em></>:<>THE ART<br/>OF <em>ARRIVING.</em></>}</h1>
    <p>{world.intro}</p>
    <div className="ix-hero-links"><Link href={root+"/work"} className="ix-hero-primary">{isArch?"Khám phá công trình":slug==="auto-showroom"?"Khám phá bộ sưu tập":"Xem dự án"} <span aria-hidden="true">↗</span></Link><Link href={root+"/about"} className="ix-hero-text-link">Câu chuyện của chúng tôi <span aria-hidden="true">↗</span></Link></div>
   </div>
   <div className="ix-hero-visual immersive-stage" ref={viewport} onPointerMove={track} onPointerLeave={reset} data-scene={slug} data-preset={mode}>
    <div className="ix-hero-image" key={activeImage}><Image src={activeImage} fill priority quality={88} alt={"Ảnh concept "+world.brand+": "+caption} sizes="(max-width: 820px) 100vw, 70vw" className="ix-hero-photograph"/></div>
    <div className="ix-visual-vignette" aria-hidden="true"/>
    <div className="ix-visual-coordinate"><span>EDITION / 2026</span><span>INTERACTIVE VISUAL / {String(mode+1).padStart(2,"0")}</span></div>
    {isStudio&&<div className="ix-studio-overlay" aria-hidden="true"><span>01 / 03</span><strong>FORM<br/><em>&amp; FEELING.</em></strong><span>SORA © STUDIO</span></div>}
    {isArch&&<div className="ix-arch-overlay" aria-hidden="true"><span>MỘC / ARCHITECTURE</span><strong>Built around<br/><i>the way we live.</i></strong></div>}
    {!isStudio&&!isArch&&<div className="ix-auto-overlay" aria-hidden="true"><span>VELAR / MOTOR COLLECTION</span><strong>BEYOND<br/>THE <i>ORDINARY.</i></strong></div>}
    <div className="ix-scene-footer"><div className="ix-scene-caption"><span>{String(mode+1).padStart(2,"0")} / 03</span><strong>{caption}</strong></div>
     <div className="immersive-mode-selector ix-mode-list" role="group" aria-label="Thay đổi góc nhìn và hình ảnh">{labels.map((label,i)=><button type="button" key={label} aria-pressed={mode===i} onClick={()=>setMode(i)}><span>{String(i+1).padStart(2,"0")}</span>{label}</button>)}</div>
    </div>
   </div>
   <div className="ix-hero-bottom"><span>SCROLL TO DISCOVER <span aria-hidden="true">↓</span></span><span>{slug==="auto-showroom"?"ẢNH XE MINH HỌA / CONCEPT DEMO":world.brand+" / DEMONSTRATION SITE"}</span></div>
  </section>
  <section className="ix-manifesto"><span>01 / THE STUDIO</span><h2>{extra.storyTitle}</h2><div><p>{extra.story}</p><Link href={root+"/about"}>Về chúng tôi <span aria-hidden="true">↗</span></Link></div></section>
  <Series slug={slug} world={world} root={root}/>
  <section className="ix-ending"><span>03 / GET IN TOUCH</span><h2>{extra.contactTitle}</h2><p>{extra.contactIntro}</p><Link href={root+"/contact"}>Bắt đầu một cuộc trò chuyện <span aria-hidden="true">↗</span></Link></section>
 </main>;
}
