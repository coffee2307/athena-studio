"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type PointerEvent} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

const immersiveSlugs=new Set(["creative-studio","architecture-studio","auto-showroom"]);
export function hasImmersiveHome(slug:string){return immersiveSlugs.has(slug);}
type Props={slug:string;world:DemoCopy;extra:WorldDetail};
const modes:Record<string,string[]>={
 "creative-studio":["Lớp hình","Không gian","Chuyển động"],
 "architecture-studio":["Tổng thể","Chi tiết","Kết cấu"],
 "auto-showroom":["Graphite","Silver","Pearl"]
};

function StudioScene(){return <div className="immersive-rig studio-rig" aria-hidden="true">
 <div className="studio-plate studio-plate-back"/><div className="studio-plate studio-plate-front"><span>INDEPENDENT / STUDIO</span><b>FORM<br/>IS<br/><i>FEELING.</i></b><small>VISUAL STUDY / 001</small></div>
 <div className="studio-donut"/><div className="studio-orbit studio-orbit-one"/><div className="studio-orbit studio-orbit-two"/>
 <div className="studio-corner-label">DIGITAL / MATERIAL / SPACE</div>
 </div>;}
function ArchitectureScene(){return <div className="immersive-rig arch-rig" aria-hidden="true">
 <div className="arch-ground"/><div className="arch-structure">
 <div className="arch-face arch-front"><span/><span/><span/><span/></div>
 <div className="arch-face arch-back"/><div className="arch-face arch-left"/><div className="arch-face arch-right"/>
 <div className="arch-face arch-roof"/><div className="arch-face arch-floor"/>
 </div><div className="arch-block arch-block-one"/><div className="arch-block arch-block-two"/>
 <span className="arch-caption">STUDY / ARCHITECTURAL VOLUMES</span>
 </div>;}
function AutoScene(){return <div className="immersive-rig auto-rig" aria-hidden="true">
 <div className="auto-back-ring"/><div className="auto-shadow"/>
 <div className="auto-vehicle"><div className="auto-roof"/><div className="auto-glass"/><div className="auto-hood"/><div className="auto-car-body"/><div className="auto-light"/><div className="auto-wheel auto-wheel-back"/><div className="auto-wheel auto-wheel-front"/><div className="auto-ground-line"/></div>
 <span className="auto-model-id">VELAR / CONCEPT 01</span>
 </div>;}
export function WorldImmersiveHome({slug,world,extra}:Props){
 const [mode,setMode]=useState(0);
 const [reduced,setReduced]=useState(false);
 const stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const query=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>setReduced(query.matches);
  update();query.addEventListener("change",update);
  return()=>query.removeEventListener("change",update);
 },[]);
 const onMove=(event:PointerEvent<HTMLDivElement>)=>{
  if(reduced||event.pointerType==="touch"||!stage.current)return;
  const r=event.currentTarget.getBoundingClientRect();
  const x=((event.clientX-r.left)/r.width-.5)*2;
  const y=((event.clientY-r.top)/r.height-.5)*2;
  stage.current.style.setProperty("--scene-rotate-y",(x*8).toFixed(2)+"deg");
  stage.current.style.setProperty("--scene-rotate-x",(-y*6).toFixed(2)+"deg");
 };
 const onLeave=()=>{
  stage.current?.style.setProperty("--scene-rotate-y","0deg");
  stage.current?.style.setProperty("--scene-rotate-x","0deg");
 };
 const root="/template-demos/"+slug;
 const labels=modes[slug]??[];
 return <main className={"immersive-home immersive-"+slug} id="world-main">
  <section className="immersive-hero">
   <div className="immersive-hero-copy">
    <span className="immersive-serial">{slug==="creative-studio"?"01 / FORM STUDIES":slug==="architecture-studio"?"09 / SPATIAL STUDIES":"14 / MOTION STUDIES"}</span>
    <p className="immersive-overline">{world.eyebrow}</p>
    <h1>{slug==="creative-studio"?<>Thương hiệu,<br/><em>trong không gian.</em></>:slug==="architecture-studio"?<>Kiến trúc<br/><em>được cảm nhận.</em></>:<>Chạm vào<br/><em>chuyển động.</em></>}</h1>
    <p className="immersive-subtitle">{world.intro}</p>
    <div className="immersive-actions"><Link href={root+"/work"} className="immersive-primary">Khám phá nội dung <span aria-hidden="true">↗</span></Link><Link href={root+"/about"} className="immersive-secondary">Về dự án ↗</Link></div>
    <div className="immersive-hint"><span className="immersive-hint-dot"/> KÉO CHUỘT ĐỂ THAY ĐỔI GÓC NHÌN <span aria-hidden="true">↗</span></div>
   </div>
   <div className="immersive-stage" data-scene={slug} data-preset={mode} ref={stage} onPointerMove={onMove} onPointerLeave={onLeave}>
    <div className="immersive-stage-top"><span>INTERACTIVE / VIEWPORT</span><span>{String(mode+1).padStart(2,"0")} / 03</span></div>
    {slug==="creative-studio"?<StudioScene/>:slug==="architecture-studio"?<ArchitectureScene/>:<AutoScene/>}
    <div className="immersive-mode-selector" role="group" aria-label="Chọn góc nhìn tương tác">{labels.map((label,i)=><button key={label} type="button" onClick={()=>setMode(i)} aria-pressed={mode===i}><span>{String(i+1).padStart(2,"0")}</span>{label}</button>)}</div>
   </div>
  </section>
  <div className="immersive-marquee" aria-hidden="true"><span>{world.brand} / EXPERIENCES / {world.brand} / EXPERIENCES /</span><span>{world.brand} / EXPERIENCES / {world.brand} / EXPERIENCES /</span></div>
  <section className="immersive-editorial"><div className="immersive-section-intro"><span>01 / THE APPROACH</span><h2>{extra.storyTitle}</h2><p>{extra.story}</p></div>
   <div className="immersive-chapter-grid">{world.cards.map((card,i)=><Link href={root+"/work/"+(i+1)} className="immersive-chapter" key={card.title}><div className={"immersive-chapter-visual visual-"+i}><span className="immersive-chapter-object"/><b>{String(i+1).padStart(2,"0")}</b></div><div className="immersive-chapter-meta"><span>{card.label}</span><span aria-hidden="true">↗</span></div><h3>{card.title}</h3><p>{card.text}</p></Link>)}</div>
  </section>
  <section className="immersive-closing"><span>02 / EXPERIENCE THE IDEA</span><h2>{extra.contactTitle}</h2><p>{extra.contactIntro}</p><Link href={root+"/contact"}>Bắt đầu trao đổi <span aria-hidden="true">↗</span></Link></section>
 </main>;
}