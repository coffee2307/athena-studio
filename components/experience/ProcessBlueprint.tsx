"use client";
import {useEffect,useRef,useState} from "react";
type Stage={n:string;title:string;description:string;deliverable:string;customer:string;studio:string};
export function ProcessBlueprint({stages}:{stages:Stage[]}){
 const [active,setActive]=useState(0);
 const cards=useRef<Array<HTMLElement|null>>([]);
 const requestedStage=useRef<number|null>(null);
 useEffect(()=>{
  if(!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(entries=>{
   const candidates=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
   if(requestedStage.current!==null){
    const arrived=candidates.some(entry=>Number((entry.target as HTMLElement).dataset.stageIndex)===requestedStage.current&&entry.intersectionRatio>.06);
    if(arrived){setActive(requestedStage.current);requestedStage.current=null;}
    return;
   }
   if(candidates.length){const idx=Number((candidates[0].target as HTMLElement).dataset.stageIndex);if(Number.isInteger(idx))setActive(idx);}
  },{rootMargin:"-22% 0px -38% 0px",threshold:[0,.18,.4,.65]});
  cards.current.forEach(el=>{if(el)observer.observe(el)});return()=>observer.disconnect();
 },[]);
 const jump=(i:number)=>{requestedStage.current=i;setActive(i);cards.current[i]?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"})};
 const stage=stages[active];
 return <div className="dna04-blueprint" aria-label="Hành trình sáu bước triển khai dự án">
  <div className="dna04-blueprint-left">
   <div className="dna04-blueprint-label"><span>THE DELIVERY BLUEPRINT</span><span>01 → 06</span></div>
   <h2>Một dự án đang<br/><em>thành hình.</em></h2>
   <p className="dna04-blueprint-lede">Cuộn qua từng bước, hoặc chọn trực tiếp để thấy đầu ra hình thành như thế nào. Không có bước nào được tự động bỏ qua.</p>
   <div className="dna04-blueprint-steps" role="group" aria-label="Chọn bước triển khai">
    {stages.map((s,i)=><button key={s.n} type="button" aria-pressed={i===active} onClick={()=>jump(i)}><span>{s.n}</span><strong>{s.title}</strong><i aria-hidden="true"/></button>)}
   </div>
  </div>
  <div className="dna04-blueprint-story">
   <div className="dna04-blueprint-sticky">
    <div className="dna04-blueprint-stage" data-chapter={active}>
     <div className="dna04-blueprint-grid" aria-hidden="true"/>
     <div className="dna04-blueprint-toolbar"><span>ATHENA / PROJECT WORKSPACE</span><span>{stage.n} — 06</span></div>
     <div className="dna04-blueprint-art" aria-hidden="true">
      <div className="dna04-blueprint-page">
       <span>PROJECT DOCUMENT / REV {stage.n}</span>
       <div className="dna04-blueprint-art-lines"><i/><i/><i/></div>
       <div className="dna04-blueprint-art-tiles">
        {stages.map((s,i)=><div key={s.n} data-ready={i<=active}><span>{s.n}</span><b>{["BRIEF","AUDIT","SCOPE","BUILD","QA","HANDOFF"][i]}</b></div>)}
       </div>
      </div>
      <div className="dna04-blueprint-stamp">ĐÃ HÌNH THÀNH <b>{active+1}/6</b></div>
     </div>
     <div className="dna04-blueprint-current" aria-live="polite"><small>ĐẦU RA CỦA CHẶNG {stage.n}</small><strong>{stage.deliverable}</strong></div>
    </div>
   </div>
   <div className="dna04-blueprint-chapters">
    {stages.map((s,i)=><article className="dna04-blueprint-chapter" data-stage-index={i} ref={node=>{cards.current[i]=node}} key={s.n}>
      <span>BƯỚC {s.n} / 06</span><h3>{s.title}</h3><p>{s.description}</p>
      <div className="dna04-blueprint-responsibility"><div><small>BẠN CHUẨN BỊ</small><p>{s.customer}</p></div><div><small>ATHENA THỰC HIỆN</small><p>{s.studio}</p></div></div>
      <div className="dna04-blueprint-mobile-output"><small>ĐẦU RA</small><strong>{s.deliverable}</strong></div>
     </article>)}
   </div>
  </div>
 </div>;
}
