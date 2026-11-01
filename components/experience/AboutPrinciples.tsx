"use client";
import {useState} from "react";
type Principle={title:string;text:string};
export function AboutPrinciples({principles}:{principles:Principle[]}){
 const [active,setActive]=useState(0);
 return <div className="dna04-principles">
  <div className="dna04-principles-nav" role="group" aria-label="Chọn nguyên tắc làm việc">
   {principles.map((p,i)=><button type="button" key={p.title} aria-pressed={active===i} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,"0")}</span><strong>{p.title}</strong><span aria-hidden="true">{active===i?"−":"+"}</span></button>)}
  </div>
  <article className="dna04-principles-feature" aria-live="polite"><small>THE WAY WE THINK / {String(active+1).padStart(2,"0")}</small><span className="dna04-principles-line" aria-hidden="true"/><h3>{principles[active].title}</h3><p>{principles[active].text}</p><div className="dna04-principles-foot"><span>KHÔNG CHỈ LÀ HÌNH THỨC.</span><span>ATHENA STUDIO</span></div></article>
 </div>;
}
