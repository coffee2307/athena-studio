"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";
import {WorldScene} from "@/components/immersive/WorldScene";
import {ModelAttribution} from "@/components/immersive/ModelAttribution";
import {AUTO_CINEMATIC_ID,AutoCinematicTrack,chapters,jumpToAutoCinematicChapter} from "@/components/immersive/AutoCinematicTrack";
import {WorldEditorialInterlude} from "@/components/templates/WorldEditorialInterlude";

const scenes=new Set(["creative-studio","architecture-studio","auto-showroom"]);
export function hasImmersiveHome(slug:string){return scenes.has(slug);}
type Props={slug:string;world:DemoCopy;extra:WorldDetail};
const modes:Record<string,string[]>={
 "creative-studio":["Lớp hình","Không gian","Chuyển động"],
 "architecture-studio":["Tổng thể","Chi tiết","Kết cấu"],
 "auto-showroom":["Góc 3/4","Thân xe","Khí động học"]
};
const sceneDescriptions:Record<string,string[]>={
 "creative-studio":["Visual identity / 001","Spatial narrative / 002","Digital experience / 003"],
 "architecture-studio":["Ánh sáng & tỷ lệ","Những chất liệu thật","Không gian để sống"],
 "auto-showroom":["01 / THE REVEAL","02 / SIDE PROFILE","03 / AERODYNAMIC FORM"]
};
function Series({slug,world,root}:{slug:string;world:DemoCopy;root:string}){
 return <section className="ix-series" aria-labelledby={"ix-series-"+slug}>
  <div className="ix-series-heading"><div><span>03 / SELECTED WORK</span><h2 id={"ix-series-"+slug}>{world.section}<span className="ix-period">.</span></h2></div><Link href={root+"/work"}>Toàn bộ dự án <span aria-hidden="true"></span></Link></div>
  <div className="ix-series-grid">{world.cards.map((card,i)=><Link href={root+"/work/"+(i+1)} className="ix-work-item" key={card.title}>
   <div className="ix-work-shot"><Image src={root+"/image-"+(i+3)+".jpg"} alt={"Hình ảnh minh họa cho "+card.title} fill sizes="(max-width: 760px) 100vw, 34vw" loading="lazy" unoptimized={slug==="creative-studio"}/><span className="ix-work-number">{String(i+1).padStart(2,"0")} / 03</span></div>
   <div className="ix-work-meta"><span>{card.label}</span><span aria-hidden="true"></span></div><h3>{card.title}</h3><p>{card.text}</p>
  </Link>)}</div>
 </section>;
}
export function WorldImmersiveHome({slug,world,extra}:Props){
 const [mode,setMode]=useState(0);
 const [zoom,setZoom]=useState(0);
 // Auto showroom is a model-first experience. Other worlds remain opt-in.
 const [enable3D,setEnable3D]=useState(slug==="auto-showroom");
 const root="/template-demos/"+slug;
 const isStudio=slug==="creative-studio";
 const isArch=slug==="architecture-studio";
 const labels=modes[slug];
 const caption=sceneDescriptions[slug][mode];
 const isAuto=slug==="auto-showroom";
 const orderedImages:Record<string,number[]>={"creative-studio":[1,4,5],"architecture-studio":[5,4,3],"auto-showroom":[5,1,4]};
 const activeImage=root+"/image-"+orderedImages[slug][mode]+".jpg";
 const hero=<section className="ix-hero">
   {isStudio&&<div className="ix-studio-intro"><span>INDEPENDENT CREATIVE PRACTICE</span><span>EST. 2026 / VIETNAM</span></div>}
   <div className="ix-hero-copy">
    <div className="ix-kicker"><span className="ix-kicker-dot"/>{isAuto?"BLACK VELOCITY / CONCEPT STUDY":world.eyebrow}</div>
    <h1>{isStudio?<>Đủ khác biệt<br/>để <em>được nhớ.</em></>:isArch?<>Không gian<br/><em>biết lắng nghe.</em></>:<>BORN FOR<br/><em>THE EDGE.</em></>}</h1>
    <p>{isAuto?"Khám phá McLaren P1 qua năm góc nhìn 3D. Kéo ngang để xoay, dùng nút + và − để quan sát chi tiết, hoặc cuộn xuống để tiếp tục hành trình.":world.intro}</p>
    <div className="ix-hero-links">
     {isAuto?<button type="button" className="ix-hero-primary" onClick={()=>jumpToAutoCinematicChapter(1)}>XEM NĂM GÓC NHÌN</button>:<Link href={root+"/work"} className="ix-hero-primary">{isArch?"Khám phá công trình":"Xem dự án"} <span aria-hidden="true"></span></Link>}
     <Link href={isAuto?root+"/work":root+"/about"} className="ix-hero-text-link">{isAuto?"BA NGHIÊN CỨU THIẾT KẾ":"Câu chuyện của chúng tôi"}</Link>
     {!isAuto&&<Link href={root+"/experience"} className="ix-journey-link">Trải nghiệm 3D</Link>}
    </div>
   </div>
   <div className="ix-hero-visual immersive-stage" data-scene={slug} data-preset={mode}>
    {isAuto?<div className="ix-hero-image bv-studio-fallback" aria-hidden="true"/>:<div className="ix-hero-image" key={activeImage}><Image src={activeImage} fill priority quality={88} unoptimized={slug==="creative-studio"} alt={"Ảnh concept "+world.brand+": "+caption} sizes="(max-width: 820px) 100vw, 70vw" className="ix-hero-photograph"/></div>}
    <WorldScene slug={slug as "creative-studio"|"architecture-studio"|"auto-showroom"} preset={mode} enabled={enable3D} zoom={isAuto?zoom:0} scrollRootId={isAuto?AUTO_CINEMATIC_ID:undefined} onRequestFallback={()=>setEnable3D(false)}/>
    {isAuto&&enable3D&&<div className="bv-zoom-controls" role="group" aria-label="Điều chỉnh mức phóng đại xe 3D"><button type="button" aria-label="Phóng to xe" disabled={zoom>=2} onClick={()=>setZoom(v=>Math.min(2,v+1))}>+</button><button type="button" aria-label="Thu nhỏ xe" disabled={zoom<=-2} onClick={()=>setZoom(v=>Math.max(-2,v-1))}>−</button></div>}
    <div className="ix-visual-vignette" aria-hidden="true"/>
    {isAuto&&<div className="bv-cinematic-hud">
      <div className="bv-mobile-story" aria-label="Thông tin góc nhìn hiện tại">
       {chapters.slice(1).map((entry,index)=><section className="bv-mobile-scene" data-mobile-chapter={index+1} key={entry.eyebrow}>
        <span className="bv-mobile-eyebrow">{entry.eyebrow}</span>
        <h2>{entry.title}</h2>
        <p>{entry.description}</p>
        <small>{entry.detail}</small>
       </section>)}
      </div>
      <p className="bv-mobile-gesture-hint">KÉO NGANG ĐỂ XOAY · CUỘN ĐỂ KHÁM PHÁ</p>
     <nav className="bv-cinematic-nav" aria-label="Chọn cảnh cinematic">
      {["The Reveal","Side Profile","Material Study","Aerodynamics","Your Perspective"].map((name,index)=><button
       type="button" key={name} aria-label={"Đến cảnh "+(index+1)+": "+name}
       onClick={()=>jumpToAutoCinematicChapter(index)}>{String(index+1).padStart(2,"0")}</button>)}
     </nav>
     <div className="bv-cinematic-meter" aria-hidden="true"><span/></div>
     <a className="bv-cinematic-skip" href="#bv-after-cinematic">BỎ QUA HÀNH TRÌNH ↓</a>
    </div>}
    {!isAuto&&<div className="ix-visual-coordinate"><span>EDITION / 2026</span><span>{enable3D?"3D STUDY / ACTIVE":"EDITORIAL VIEW / 3D OPTIONAL"}</span></div>}
    {isStudio&&!enable3D&&<div className="ix-studio-overlay" aria-hidden="true"><span>01 / 03</span><strong>FORM<br/><em>&amp; FEELING.</em></strong><span>SORA © STUDIO</span></div>}
    {isArch&&<div className="ix-arch-overlay" aria-hidden="true"><span>MỘC / ARCHITECTURE</span><strong>Built around<br/><i>the way we live.</i></strong></div>}
    {!isStudio&&!isArch&&!enable3D&&<div className="ix-auto-overlay" aria-hidden="true"><span>BLACK VELOCITY / DESIGN STUDY</span><strong>BEYOND<br/>THE <i>ORDINARY.</i></strong></div>}
    {!isAuto&&<div className="ix-scene-footer"><div className="ix-scene-caption"><span>{String(mode+1).padStart(2,"0")} / 03</span><strong>{caption}</strong></div></div>}
   </div>
   <div className="ix-hero-bottom"><span>{isAuto?"EXPLORE THE MACHINE":"SCROLL TO DISCOVER"} <span aria-hidden="true">↓</span></span><span>{slug==="auto-showroom"?"MCLAREN P1 / FIVE PERSPECTIVES":world.brand+" / DEMONSTRATION SITE"}</span></div>
  </section>;
 return <main className={"ix-site ix-"+slug+" immersive-home"} data-immersive={enable3D?"true":"false"} id="world-main">
  {isAuto?<AutoCinematicTrack>{hero}</AutoCinematicTrack>:hero}
  {!isAuto&&<section className="ix-scene-rail" aria-label="Điều khiển trải nghiệm 3D">
   <div className="ix-scene-rail-copy"><span>{isAuto?"01 / INTERACTIVE MACHINE":"INTERACTIVE STUDY / 0"+(mode+1)}</span><strong aria-live="polite">{caption}</strong><p>{slug==="auto-showroom"?"Khám phá mô hình McLaren P1 trong không gian tương tác: kéo ngang để xoay, dùng nút + và − để thay đổi góc nhìn cận cảnh, hoặc chọn một trong năm cảnh để quan sát từng chi tiết.":"Ảnh editorial được ưu tiên để tải nhanh. Bật 3D khi muốn khám phá mô hình; nhấn một trong ba góc nhìn để thay đổi cấu trúc."}</p>{isAuto&&<ModelAttribution/>}</div>
   <div className="ix-rail-actions">
    <div className="immersive-mode-selector ix-mode-list" role="group" aria-label="Chọn chế độ 3D">{labels.map((label,i)=><button type="button" key={label} aria-pressed={mode===i} onClick={()=>{setMode(i);if(isAuto)jumpToAutoCinematicChapter(i===0?0:i===1?1:3);}}><span>{String(i+1).padStart(2,"0")}</span>{label}</button>)}</div>
    <button type="button" className="ix-render-toggle" aria-pressed={enable3D ? "true" : "false"} aria-label={enable3D?"Tắt chế độ 3D":"Bật chế độ 3D"} onClick={()=>setEnable3D(value=>!value)}>3D {enable3D?"ON":"OFF"}</button>
   </div>
  </section>}
  {isAuto&&<div className="bv-after-cinematic" id="bv-after-cinematic"><span>3D STUDY / ORIGINAL MODEL CREDIT</span><ModelAttribution compact/></div>}
  <section className="ix-manifesto"><span>{isAuto?"FIVE PERSPECTIVES / ONE CAR":"01 / THE STUDIO"}</span><h2>{isAuto?"ONE CAR. FIVE PERSPECTIVES.":extra.storyTitle}</h2><div><p>{isAuto?"Một hình khối, nhiều cách nhìn: dáng xe thấp ở góc toàn cảnh, đường nét thân xe dưới ánh sáng studio và những chi tiết phía sau. Mỗi chuyển động camera đưa người xem đến gần hơn với McLaren P1.":extra.story}</p><Link href={root+"/about"}>{isAuto?"Đọc về BLACK VELOCITY":"Về chúng tôi"}</Link></div></section>
  <WorldEditorialInterlude slug={slug as "creative-studio"|"architecture-studio"|"auto-showroom"}/>
  {!isAuto&&<Series slug={slug} world={world} root={root}/>}
  <section className="ix-ending"><span>{isAuto?"CONTINUE THE STUDY":"04 / GET IN TOUCH"}</span><h2>{isAuto?"EXPLORE THE DETAILS.":extra.contactTitle}</h2><p>{isAuto?"Ba nghiên cứu chọn lọc về tỷ lệ, bề mặt và phần đuôi của McLaren P1. Khám phá từng góc nhìn ở trang tiếp theo.":extra.contactIntro}</p><Link href={isAuto?root+"/work":root+"/contact"}>{isAuto?"XEM BA NGHIÊN CỨU":"Bắt đầu một cuộc trò chuyện"}</Link></section>
 </main>;
}
