"use client";
import {useState,useRef} from "react";
import Image from "next/image";
import Link from "next/link";
const disciplines=[
 {name:"Design",type:"01 / BẢN SẮC",headline:"Một trải nghiệm không thể hoán đổi logo.",description:"Nhìn từ chữ, tỷ lệ, hình ảnh đến cách con người tương tác. Thiết kế cần giải thích đúng sản phẩm.",image:"/template-previews/creative-studio.jpg",href:"/template-demos/creative-studio",tone:"design"},
 {name:"Engineering",type:"02 / HỆ THỐNG",headline:"Không chỉ đẹp trong ảnh chụp.",description:"Kiến trúc frontend, backend, hiệu năng và khả năng vận hành có thể kiểm chứng.",image:"/template-previews/saas-product.jpg",href:"/services/web-development",tone:"engineering"},
 {name:"AI",type:"03 / ỨNG DỤNG",headline:"Giải quyết công việc, không trình diễn thuật ngữ.",description:"Chọn đúng điểm cần tự động hóa, giữ con người ở những bước quyết định.",image:"/template-previews/modern-corporate.jpg",href:"/services/ai-integration",tone:"ai"}
] as const;
export function AboutStudioDesk(){
 const [active,setActive]=useState(0);
 const surface=useRef<HTMLDivElement>(null);
 const current=disciplines[active];
 const move=(event:React.PointerEvent<HTMLDivElement>)=>{
  if(event.pointerType==="touch"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const node=surface.current;if(!node)return;const r=node.getBoundingClientRect();
  node.style.setProperty("--desk-x",String(((event.clientX-r.left)/r.width-.5)*12)+"px");
  node.style.setProperty("--desk-y",String(((event.clientY-r.top)/r.height-.5)*10)+"px");
 };
 return <div className="dna04-desk" ref={surface} onPointerMove={move} onPointerLeave={()=>{surface.current?.style.setProperty("--desk-x","0px");surface.current?.style.setProperty("--desk-y","0px")}}>
  <div className="dna04-desk-top"><span>WORKSPACE / 001</span><span>THỬ CHỌN MỘT LỚP</span></div>
  <div className="dna04-desk-visual" data-discipline={current.tone}>
   <span className="dna04-desk-orbit" aria-hidden="true"/>
   <div className="dna04-desk-paper dna04-desk-under" aria-hidden="true"><span>ATHENA / FIELD NOTES</span><strong>FORM<br/>FOLLOWS<br/>PURPOSE.</strong></div>
   <div className="dna04-desk-paper dna04-desk-main" key={current.name}>
    <div className="dna04-desk-window"><Image alt={"Giao diện nghiên cứu "+current.name} src={current.image} fill sizes="(max-width: 700px) 75vw, 410px" priority={active===0}/></div>
    <span className="dna04-desk-photo-credit">ATHENA / {current.type}</span>
   </div>
   <div className="dna04-desk-slip" aria-hidden="true"><small>MAKE IT<br/>WORK.</small><strong>0{active+1}</strong></div>
  </div>
  <div className="dna04-desk-tabs" role="group" aria-label="Khám phá ba lĩnh vực của Athena">
   {disciplines.map((item,i)=><button type="button" key={item.name} aria-pressed={i===active} onClick={()=>setActive(i)}><span>0{i+1}</span>{item.name}</button>)}
  </div>
  <div className="dna04-desk-description" aria-live="polite"><div><small>{current.type}</small><h2>{current.headline}</h2><p>{current.description}</p></div><Link href={current.href}>Xem cách thực hiện <span aria-hidden="true">→</span></Link></div>
 </div>;
}
