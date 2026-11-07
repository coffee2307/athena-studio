"use client";
import {useState} from "react";
import {LocalizedTemplateImage} from "@/components/templates/LocalizedTemplateImage";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";
import Link from "next/link";

const previews=[
 {slug:"creative-studio",name:"Creative Studio",tag:"01 / STUDIO"},
 {slug:"fashion-archive",name:"Fashion Archive",tag:"02 / FASHION"}
] as const;
export function AthenaHeroStage(){
 const [active,setActive]=useState(0);
 const {language}=useAthenaLanguage();
 return <div className="dna-hero-art dna02-preview-stage" aria-label="Khám phá hai mẫu website thực tế">
  <div className="dna-hero-glow" aria-hidden="true"/>
  <div className="dna02-preview-stack">
   {previews.map((item,i)=><button key={item.slug} type="button"
     className={"dna-hero-window dna02-preview-window "+(active===i?"is-front":"is-back")}
     onClick={()=>setActive(i)} aria-pressed={active===i} aria-label={"Chọn bản xem trước "+item.name}>
     <span className="dna-hero-browser"><span><i/><i/><i/></span><small>{item.slug} / preview</small></span>
     <span className="dna-hero-window-picture"><LocalizedTemplateImage slug={item.slug} altVi={"Giao diện mẫu "+item.name} altEn={"Preview of "+item.name} fill priority={i===0} sizes="(max-width:760px) 75vw, 38vw" style={{objectFit:active===i?"cover":"contain",objectPosition:"center top"}}/></span>
     <span className="dna02-preview-tag">{item.tag}</span>
   </button>)}
  </div>
  <div className="dna-hero-art-bottom"><span>CHỌN MẪU ĐỂ XEM / 01–02</span><Link href={"/template-demos/"+previews[active].slug+"?lang="+language}>Trải nghiệm {previews[active].name} <span aria-hidden="true">→</span></Link></div>
 </div>;
}
