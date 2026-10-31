"use client";
import {useState} from "react";
type Principle={title:string,text:string};
const symbols=["+","","◈","◇"];
export function AboutPrinciples({principles}:{principles:Principle[]}){
 const [active,setActive]=useState(0);
 return <div className="dna02-about-system">
  <div className="dna02-about-options" role="group" aria-label="Chọn nguyên tắc của Athena">
   {principles.map((p,i)=><button key={p.title} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,"0")}</span><strong>{p.title}</strong><span aria-hidden="true">{active===i?"−":"+"}</span></button>)}
  </div>
  <div className="dna02-about-focus" key={active} aria-live="polite">
   <span className="dna02-overline">ATHENA / CÁCH CHÚNG TÔI LÀM</span>
   <div className="dna02-about-glyph" aria-hidden="true"><span>{symbols[active]}</span><i/></div>
   <span className="dna02-overline">{String(active+1).padStart(2,"0")} / {String(principles.length).padStart(2,"0")}</span>
   <h3>{principles[active].title}</h3><p>{principles[active].text}</p>
  </div>
 </div>;
}
