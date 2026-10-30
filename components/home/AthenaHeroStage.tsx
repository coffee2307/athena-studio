"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";

const previews=[
 {slug:"creative-studio",name:"Creative Studio",image:"/template-previews/creative-studio.jpg",tag:"01 / STUDIO"},
 {slug:"fashion-archive",name:"Fashion Archive",image:"/template-previews/fashion-archive.jpg",tag:"02 / FASHION"}
] as const;
export function AthenaHeroStage(){
 const [active,setActive]=useState(0);
 return <div className="dna-hero-art dna02-preview-stage" aria-label="Khám phá hai mẫu website thực tế">
  <div className="dna-hero-glow" aria-hidden="true"/>
  <div className="dna02-preview-stack">
   {previews.map((item,i)=><button key={item.slug} type="button"
     className={"dna-hero-window dna02-preview-window "+(active===i?"is-front":"is-back")}
     onClick={()=>setActive(i)} aria-pressed={active===i} aria-label={"Chọn bản xem trước "+item.name}>
     <span className="dna-hero-browser"><span><i/><i/><i/></span><small>{item.slug} / preview</small></span>
     <span className="dna-hero-window-picture"><Image src={item.image} alt={"Giao diện mẫu "+item.name} fill priority={i===0} sizes="(max-width:760px) 75vw, 38vw" style={{objectFit:"cover",objectPosition:"center top"}}/></span>
     <span className="dna02-preview-tag">{item.tag}</span>
   </button>)}
  </div>
  <div className="dna-hero-art-bottom"><span>CHỌN MẪU ĐỂ XEM / 01–02</span><Link href={"/template-demos/"+previews[active].slug}>Trải nghiệm {previews[active].name} <span aria-hidden="true">→</span></Link></div>
 </div>;
}
