"use client";
import {useRef,useState} from "react";
import Link from "next/link";
type Card={slug:string,number:string,title:string,caption:string,description:string};
const cards:Card[]=[
 {slug:"pham",number:"01 / PHAM",title:"Form.\nIdentity.",caption:"Independent fashion",description:"Thời trang độc lập — bản sắc và trải nghiệm mua sắm."},
 {slug:"econith",number:"02 / ECONITH",title:"Data.\nThinking.",caption:"Quantitative research",description:"Nghiên cứu định lượng, mô hình và thử nghiệm có kiểm chứng."},
 {slug:"digital-creators",number:"03 / DIGITAL CREATORS",title:"Play.\nCreate.",caption:"Creative digital club",description:"Một thế giới sáng tạo số, những trải nghiệm và chuyển động."}
];
export function ProjectPlayground(){
 const [active,setActive]=useState(2);
 const [offsets,setOffsets]=useState<Record<number,{x:number,y:number}>>({});
 const drag=useRef<{id:number,pointer:number,x:number,y:number,fromX:number,fromY:number}|null>(null);
 function start(e:React.PointerEvent<HTMLButtonElement>,id:number){
  if(e.pointerType==="mouse"&&e.button!==0)return;
  setActive(id);
  const current=offsets[id]||{x:0,y:0};
  drag.current={id,pointer:e.pointerId,x:e.clientX,y:e.clientY,fromX:current.x,fromY:current.y};
  e.currentTarget.setPointerCapture(e.pointerId);
 }
 function move(e:React.PointerEvent<HTMLButtonElement>,id:number){
  const d=drag.current;
  if(!d||d.id!==id||d.pointer!==e.pointerId)return;
  const x=Math.max(-95,Math.min(95,d.fromX+(e.clientX-d.x)));
  const y=Math.max(-65,Math.min(65,d.fromY+(e.clientY-d.y)));
  setOffsets(old=>({...old,[id]:{x,y}}));
 }
 function end(e:React.PointerEvent<HTMLButtonElement>){
  if(drag.current?.pointer!==e.pointerId)return;
  drag.current=null;
 }
 return <div className="dna02-work-playground">
  <div className="dna-work-art dna02-work-art" aria-label="Kéo hoặc chọn một dự án để khám phá">
   {cards.map((p,i)=><button key={p.slug} type="button" className={"dna-work-art-card dna-work-art-"+["one","two","three"][i]+(active===i?" is-selected":"")}
    style={{"--drag-x":(offsets[i]?.x||0)+"px","--drag-y":(offsets[i]?.y||0)+"px",zIndex:active===i?5:i+1} as React.CSSProperties}
    aria-pressed={active===i} onClick={()=>setActive(i)} onPointerDown={e=>start(e,i)} onPointerMove={e=>move(e,i)} onPointerUp={end} onPointerCancel={end}>
      <span>{p.number}</span><strong>{p.title.split("\n").map((line,j)=><span key={line}>{j>0&&<br/>}{line}</span>)}</strong><small>{p.caption}</small>
    </button>)}
  </div>
  <div className="dna02-work-note" aria-live="polite"><span>CHỌN / KÉO THẺ DỰ ÁN</span><p>{cards[active].description}</p><Link href={"/projects/"+cards[active].slug}>Mở dự án {cards[active].slug==="pham"?"PHAM":cards[active].slug==="econith"?"ECONITH":"Digital Creators"} <span aria-hidden="true">→</span></Link></div>
 </div>;
}
