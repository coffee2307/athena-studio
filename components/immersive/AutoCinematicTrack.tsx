"use client";

import {useEffect,useRef,useState} from "react";
import type {ReactNode} from "react";

export const AUTO_CINEMATIC_ID="bv-cinematic-track";

const chapters=[
 {eyebrow:"01 / THE REVEAL",title:"MCLAREN P1.",description:"Tỷ lệ và bề mặt chiếc McLaren P1 hiện ra dưới ánh sáng studio. Cuộn xuống để khám phá các góc nhìn được dàn dựng.",detail:"SILHOUETTE / LIGHT"},
 {eyebrow:"02 / SIDE PROFILE",title:"A LINE OF INTENT.",description:"Chiếc xe lướt ngang sân khấu. Camera đi cùng thân xe để bộc lộ tỷ lệ thấp, dáng dài và đường cắt dứt khoát.",detail:"PROPORTION / MOVEMENT"},
 {eyebrow:"03 / MATERIAL STUDY",title:"EVERY SURFACE COUNTS.",description:"Đến gần bề mặt sơn graphite, mâm xe và các mảng carbon. Không cần làm nhòe hình để tạo chiều sâu.",detail:"GRAPHITE / DETAIL"},
 {eyebrow:"04 / AERODYNAMICS",title:"SHAPED BY AIR.",description:"Góc máy dịch chuyển về phía đuôi xe, phơi bày các đường dẫn khí và cấu trúc phía sau của concept.",detail:"FORM / AERODYNAMICS"},
 {eyebrow:"05 / YOUR PERSPECTIVE",title:"TAKE ANOTHER LOOK.",description:"Trở về toàn cảnh. Kéo trực tiếp trên xe để đổi góc nhìn hoặc khám phá các nghiên cứu thiết kế tiếp theo.",detail:"EXPLORE / DISCOVER"}
] as const;

const clamp=(value:number)=>Math.max(0,Math.min(1,value));

export function jumpToAutoCinematicChapter(index:number){
 const track=document.getElementById(AUTO_CINEMATIC_ID);
 if(!track)return;
 const extent=Math.max(1,track.getBoundingClientRect().height-window.innerHeight);
 const top=track.getBoundingClientRect().top+window.scrollY+extent*clamp(index/4);
 const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 window.scrollTo({top,behavior:reducedMotion?"instant":"smooth"});
}

/** One native-scroll owner updates visible chapters and the progress meter.
 * The Three.js renderer samples the same track rect; neither drives scrolling. */
export function AutoCinematicTrack({children}:{children:ReactNode}){
 const trackRef=useRef<HTMLDivElement>(null);
 const [chapter,setChapter]=useState(0);
 useEffect(()=>{
  let raf=0;
  const update=()=>{
   raf=0;
   const track=trackRef.current;
   if(!track)return;
   const rect=track.getBoundingClientRect();
   const p=clamp(-rect.top/Math.max(1,rect.height-window.innerHeight));
   track.style.setProperty("--bv-progress",p.toFixed(5));
   // The site header precedes the sticky cinematic stage in document flow.
   // Pin the mobile HUD to the visible viewport from the very first frame,
   // including the short interval before the stage itself reaches top: 0.
   const hudOffset=window.innerWidth<=760?-Math.max(0,rect.top):0;
   track.style.setProperty("--bv-hud-offset",`${Math.round(hudOffset)}px`);
   // During the first chapter, move the mobile canvas continuously with native
   // scroll instead of abruptly swapping its top offset at chapter 02.
   const phase=clamp((p-.02)/.28);
   const easedPhase=phase*phase*(3-2*phase);
   const height=window.innerHeight;
   const short=window.innerWidth<=760&&height<=680;
   const startTop=short?Math.min(310,Math.max(280,height*.45)):Math.min(390,Math.max(300,height*.43));
   const delta=startTop-height*.13;
   // Align the translated WebGL surface to device pixels to avoid softening
   // its edges during the chapter-one camera move on high-DPR phones.
   const dpr=Math.min(window.devicePixelRatio||1,2);
   const aligned=Math.round(-delta*easedPhase*dpr)/dpr;
   track.style.setProperty("--bv-stage-translate",`${aligned}px`);
   // Use one continuous native-scroll progress for both the canvas and copy.
   // Never toggle visibility when an integer chapter index changes: that
   // caused abrupt disappearances and stacked cards on short phones.
   track.style.setProperty("--bv-intro-opacity",(1-clamp((p-.04)/.19)).toFixed(4));
   track.querySelectorAll<HTMLElement>(".bv-cinematic-step").forEach((step,index)=>{
    if(index===0)return;
    const start=(index-1)/4+.17;
    const end=index/4+.24;
    const fadeIn=clamp((p-start)/.075);
    const fadeOut=clamp((end-p)/.075);
    const opacity=fadeIn*fadeOut;
    step.style.setProperty("--bv-copy-opacity",opacity.toFixed(4));
    step.style.setProperty("--bv-copy-shift",`${Math.round((1-opacity)*13)}px`);
   });
   const next=Math.min(4,Math.floor(p*5));
   setChapter(previous=>previous===next?previous:next);
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule);
  return ()=>{
   cancelAnimationFrame(raf);
   window.removeEventListener("scroll",schedule);
   window.removeEventListener("resize",schedule);
  };
 },[]);
 return <div ref={trackRef} id={AUTO_CINEMATIC_ID} className="bv-cinematic-track" data-chapter={chapter}>
  {children}
  <div className="bv-cinematic-steps">
   {chapters.map((item,index)=><section key={item.eyebrow} className="bv-cinematic-step"
    aria-label={item.eyebrow} data-scene-index={index}>
    {index>0&&<div className={"bv-cinematic-copy"+(chapter===index?" is-current":"")}>
     <span>{item.eyebrow}</span><h2>{item.title}</h2><p>{item.description}</p><small>{item.detail}</small>
    </div>}
   </section>)}
  </div>
 </div>;
}
