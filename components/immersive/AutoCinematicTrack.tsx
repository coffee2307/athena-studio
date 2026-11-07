"use client";

import {useEffect,useRef,useState} from "react";
import type {ReactNode} from "react";

export const AUTO_CINEMATIC_ID="bv-cinematic-track";

export const chapters=[
 {eyebrow:"01 / THE REVEAL",title:"BORN FOR THE EDGE.",description:"McLaren P1 xuất hiện dưới ánh sáng studio. Bắt đầu với góc nhìn toàn cảnh để quan sát tỷ lệ và dáng thân xe thấp.",detail:"SILHOUETTE / LIGHT"},
 {eyebrow:"02 / SIDE PROFILE",title:"A LINE OF INTENT.",description:"Camera chuyển sang mặt bên, làm rõ chiều dài thân xe và cách các bề mặt nối tiếp nhau từ đầu đến đuôi.",detail:"PROPORTION / MOVEMENT"},
 {eyebrow:"03 / MATERIAL STUDY",title:"EVERY SURFACE COUNTS.",description:"Quan sát mâm xe, các vùng sơn tối và chi tiết vật liệu ngay trên mô hình 3D khi camera tiến lại gần.",detail:"GRAPHITE / DETAIL"},
 {eyebrow:"04 / AERODYNAMICS",title:"SHAPED BY AIR.",description:"Đi vòng ra phía sau để nhìn cánh gió, khe mở và hình khối đuôi xe từ góc khó thấy ở toàn cảnh.",detail:"FORM / AERODYNAMICS"},
 {eyebrow:"05 / YOUR PERSPECTIVE",title:"TAKE ANOTHER LOOK.",description:"Trở về góc rộng. Kéo để xoay McLaren P1 hoặc dùng nút + và − để chọn khoảng cách quan sát phù hợp.",detail:"EXPLORE / DISCOVER"}
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
   // Chapter labels switch at the midpoint between the five authored camera poses.
   const next=Math.min(4,Math.round(p*4));
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
