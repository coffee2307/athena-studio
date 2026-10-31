"use client";
import {useState} from "react";
type Stage={n:string,title:string,description:string,deliverable:string,customer:string,studio:string};
export function ProcessJourney({stages}:{stages:Stage[]}){
 const [active,setActive]=useState(0);
 const item=stages[active];
 return <div className="dna02-journey">
  <div className="dna02-journey-rail" role="group" aria-label="Khám phá sáu bước hợp tác">
   {stages.map((s,i)=><button key={s.n} type="button" aria-pressed={active===i}
     className={"dna02-journey-stop "+(active===i?"is-current":"")} onClick={()=>setActive(i)}>
     <span className="dna02-journey-number">{s.n}</span><span>{s.title}</span>
   </button>)}
  </div>
  <div className="dna02-journey-scene" key={item.n} aria-live="polite" aria-atomic="true">
   <div className="dna02-journey-top"><span>ATHENA / WORKFLOW</span><span>{item.n} — 06</span></div>
   <div className="dna02-journey-visual" aria-hidden="true"><span className="dna02-journey-halo"/><strong>{item.n}</strong><span className="dna02-journey-spark">+</span></div>
   <p className="dna02-overline">BƯỚC {item.n} / ĐẦU RA RÕ RÀNG</p>
   <h3>{item.title}</h3><p className="dna02-journey-summary">{item.description}</p>
   <div className="dna02-journey-deliverable"><span>KHÁCH HÀNG NHẬN</span><strong>{item.deliverable}</strong></div>
   <details className="dna02-journey-details"><summary>Vai trò của hai bên <span aria-hidden="true">+</span></summary><div><p><strong>Bạn chuẩn bị</strong>{item.customer}</p><p><strong>Athena thực hiện</strong>{item.studio}</p></div></details>
   <div className="dna02-journey-controls"><button type="button" disabled={active===0} onClick={()=>setActive(i=>Math.max(0,i-1))}>← Trước</button><div className="dna02-journey-progress" role="progressbar" aria-label="Tiến độ hợp tác" aria-valuemin={0} aria-valuemax={stages.length} aria-valuenow={active+1}><span style={{width:((active+1)/stages.length*100)+"%"}}/></div><button type="button" disabled={active===stages.length-1} onClick={()=>setActive(i=>Math.min(stages.length-1,i+1))}>Tiếp →</button></div>
  </div>
 </div>;
}
