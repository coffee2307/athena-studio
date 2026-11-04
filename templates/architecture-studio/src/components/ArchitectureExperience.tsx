"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type CSSProperties} from "react";
import s from "./architecture-experience.module.css";

type Chapter={step:string;title:string;note:string;image:number;meta:string};
const chapters:Chapter[]=[
 {step:"01",title:"From the first line.",note:"A sketch is where a space begins: proportion, movement and a first conversation with light.",image:0,meta:"SKETCH / THE FIRST LINE"},
 {step:"02",title:"Structure takes shape.",note:"We explore massing, rhythm and the relationship between the built form and the spaces around it.",image:1,meta:"MODEL / SPACE & FORM"},
 {step:"03",title:"Material has memory.",note:"Stone, timber and concrete change how a room feels long before furniture arrives.",image:2,meta:"MATERIAL / TEXTURE & TOUCH"},
 {step:"04",title:"Light completes the room.",note:"The final experience is not a drawing. It is the movement of sunlight through a space.",image:3,meta:"LIGHT / A LIVING SPACE"}
];
const projects=[
 {title:"The Vertical Study",type:"URBAN FORM",image:0,description:"An exploration of lines, density and a quiet space within the city."},
 {title:"The Interior Sequence",type:"SPATIAL DESIGN",image:1,description:"Transitions between an entrance, a shared room and the light beyond."},
 {title:"The Material House",type:"MATERIAL STUDY",image:2,description:"A balance between warm surfaces, exposed structure and open air."}
];
const materials=[
 {title:"Concrete",code:"M01",description:"Quiet in appearance. Precise in its relationship to light.",image:0},
 {title:"Stone",code:"M02",description:"A surface that carries geological time and small imperfections.",image:2},
 {title:"Timber",code:"M03",description:"Warmth, tactility and a human scale inside large spaces.",image:3},
 {title:"Glass",code:"M04",description:"A threshold between built space, daylight and the outside world.",image:4}
];

export function ArchitectureExperience({basePath="",assetBase="",images}:{basePath?:string;assetBase?:string;images:string[]}){
 const [chapter,setChapter]=useState(0);
 const [plan,setPlan]=useState(0);
 const [material,setMaterial]=useState(0);
 const [compare,setCompare]=useState(51);
 const [gallery,setGallery]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 const image=(i:number)=>assetBase+images[i%images.length];
 useEffect(()=>{
  const node=root.current;
  if(!node)return;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const onEntries=(entries:IntersectionObserverEntry[])=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     const el=entry.target as HTMLElement;
     if(el.dataset.storyChapter!==undefined)setChapter(Number(el.dataset.storyChapter));
     if(el.dataset.planChapter!==undefined)setPlan(Number(el.dataset.planChapter));
     if(el.dataset.reveal!==undefined){el.dataset.visible="true";revealObserver.unobserve(el);}
    }
   }
  };
  if(!("IntersectionObserver" in window))return;
  const steps=[...node.querySelectorAll<HTMLElement>("[data-story-chapter],[data-plan-chapter]")];
  const observer=new IntersectionObserver(onEntries,{rootMargin:"-32% 0px -40% 0px",threshold:0});
  steps.forEach(el=>observer.observe(el));
  const revealObserver=new IntersectionObserver(onEntries,{rootMargin:"0px 0px -10% 0px",threshold:.05});
  if(!media.matches){
   node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el=>{
    if(el.getBoundingClientRect().top>window.innerHeight*.88){el.dataset.pending="true";revealObserver.observe(el);}
    else el.dataset.visible="true";
   });
  }
  return()=>{observer.disconnect();revealObserver.disconnect();};
 },[]);
 const active=chapters[chapter];
 return <div ref={root} className={s.experience} data-forma-home>
  <section className={s.hero} aria-label="FORMA Architecture Studio">
   <div className={s.heroMeta}><span>FORMA / ARCHITECTURAL ATELIER</span><span>INDEPENDENT CONCEPT STUDIO / 2026</span></div>
   <div className={s.heroLayout}>
    <div className={s.heroCopy}>
     <small>EXPLORING SPACE, MATERIAL & LIGHT</small>
     <h1>Space <em>shapes</em> thought.</h1>
     <p>Architecture lives somewhere between the first line on paper and the way daylight enters a room.</p>
     <Link className={s.primaryLink} href={go("/work")}>EXPLORE SELECTED STUDIES <span aria-hidden="true">↗</span></Link>
     <div className={s.heroIndex}><span>01 / 04</span><span>SCROLL TO EXPLORE ↓</span></div>
    </div>
    <figure className={s.heroPicture}>
     <img src={image(0)} alt="Concept architecture photo looking upward through contemporary structures"/>
     <figcaption><span>FIG. 01 / ARCHITECTURAL PERSPECTIVE</span><span>VISUAL STUDY — DEMONSTRATION</span></figcaption>
     <span className={s.heroCrosshair} aria-hidden="true"/>
    </figure>
   </div>
  </section>
  <section className={s.story} aria-label="From sketch to light">
   <div className={s.storyVisual}>
    <div className={s.storyPicture}>
     <img key={chapter} src={image(active.image)} alt={"Architectural image for "+active.title}/>
     <div className={s.storyGrid} aria-hidden="true"/>
     <div className={s.storyPictureFooter}><span>{active.meta}</span><span>{active.step} / 04</span></div>
    </div>
    <div className={s.storyIndicator} aria-hidden="true">{chapters.map((c,i)=><span key={c.step} data-active={chapter===i}/>)}</div>
   </div>
   <div className={s.storyChapters}>
    {chapters.map((c,i)=><article key={c.step} data-story-chapter={i} className={s.storyChapter} data-active={chapter===i}>
     <div className={s.chapterNumber}>CHAPTER {c.step} <span>—</span> THE PROCESS</div>
     <h2>{c.title}</h2><p>{c.note}</p>
     <span className={s.chapterMarker}>0{i+1} / 04</span>
    </article>)}
   </div>
  </section>
  <section className={s.projects} data-reveal>
   <div className={s.sectionTop}><span>02 / STUDIES IN SPACE</span><Link href={go("/work")}>VIEW THE INDEX <span aria-hidden="true">↗</span></Link></div>
   <div className={s.sectionHeading}><h2>Selected work<span>.</span></h2><p>Three visual studies that reveal how structure, proportion and light work together. These are illustrative concepts, not commissioned projects.</p></div>
   <div className={s.projectGrid}>{projects.map((p,i)=><Link href={go("/work/"+(i+1))} className={s.projectCard} key={p.title} data-index={i+1}>
    <div className={s.projectImage}><img src={image(p.image)} alt={"Illustration of "+p.title}/><span className={s.projectArrow} aria-hidden="true">↗</span></div>
    <div className={s.projectCaption}><small>0{i+1} / {p.type}</small><h3>{p.title}</h3><p>{p.description}</p></div>
   </Link>)}</div>
  </section>
  <section className={s.planStudy} aria-label="The making of a plan">
   <div className={s.planVisual}>
    <div className={s.planPaper}>
     <div className={s.planDrawing} data-plan={plan}>
      <svg aria-hidden="true" viewBox="0 0 600 530" fill="none" stroke="currentColor" strokeWidth="1.5">
       <path d="M86 86H510V446H86z M86 270H510 M282 86V446 M282 196H510 M86 360H282 M396 196V446"/>
       <path d="M114 112H254V244H114z M310 112H482V174H310z M310 298H370V420H310z M419 218H482V420H419z"/>
       <path d="M86 72V55M510 72V55M86 60H510 M70 86H52M70 446H52M58 86V446" strokeDasharray="5 6"/>
       <circle cx="282" cy="270" r="38"/><path d="M246 270h72M282 234v72" strokeDasharray="3 7"/>
       <path d="M140 270q0 48 48 48 M282 364q50 0 50-50 M396 226q-48 0-48 48"/>
      </svg>
      <div className={s.planScan} aria-hidden="true"/>
     </div>
     <div className={s.planFoot}><span>PLATE 002 / DRAWING STUDY</span><span>1:100 / CONCEPT</span></div>
    </div>
   </div>
   <div className={s.planChapters}>
    {[["01","Every room begins as a line.","Lines establish boundaries. They also suggest where the human body can move."],["02","The plan becomes a sequence.","Proportion gives each room a purpose and creates a rhythm of spaces."],["03","The drawing makes room for life.","From a technical idea to a place for sunlight, conversation and the everyday."]].map(([n,title,body],i)=><article key={n} data-plan-chapter={i}><small>PLAN STUDY / {n}</small><h2>{title}</h2><p>{body}</p></article>)}
   </div>
  </section>
  <section className={s.compareSection} data-reveal>
   <div className={s.sectionTop}><span>03 / FROM DRAWING TO BUILT</span><span>INTERACTIVE STUDY</span></div>
   <div className={s.compareIntro}><h2>Drawn, then built.</h2><p>Move the divider to explore the relationship between a conceptual line drawing and its architectural photograph. An illustrative demonstration, not a real before-and-after project.</p></div>
   <div className={s.comparison} style={{"--compare":compare+"%"} as CSSProperties}>
    <img className={s.afterImage} src={image(3)} alt="Architectural photograph used in comparison"/>
    <div className={s.beforeImage} aria-hidden="true"><img src={image(3)} alt=""/><div className={s.drawingOverlay}><svg viewBox="0 0 700 500" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M0 300L170 90L480 110L700 330 M130 500L210 155L460 180L600 500 M0 445L700 445 M210 155L210 500 M460 180L460 500 M170 90L170 500 M480 110L480 500"/><path d="M0 250H700M0 360H700M320 0V500" strokeDasharray="4 8"/></svg></div></div>
    <div className={s.compareDivider} aria-hidden="true"><span>↔</span></div>
    <span className={s.beforeLabel}>LINE STUDY</span><span className={s.afterLabel}>PHOTOGRAPH</span>
    <input aria-label="Reveal line study versus architectural photograph" className={s.compareRange} type="range" min="0" max="100" step="1" value={compare} onChange={e=>setCompare(Number(e.target.value))}/>
   </div>
  </section>
  <section className={s.materialSection} data-reveal>
   <div className={s.sectionTop}><span>04 / THE MATERIAL LIBRARY</span><span>TOUCH, TEXTURE, TIME</span></div>
   <div className={s.materialHeading}><h2>Honest materials.</h2><p>A few carefully chosen surfaces are enough to give an interior its character.</p></div>
   <div className={s.materialLayout}>
    <div className={s.materialList} role="group" aria-label="Explore architectural materials">{materials.map((m,i)=><button key={m.code} type="button" aria-pressed={material===i} onClick={()=>setMaterial(i)}><span>{m.code}</span><strong>{m.title}</strong><span className={s.materialPlus} aria-hidden="true">{material===i?"−":"+"}</span></button>)}</div>
    <figure className={s.materialVisual}><img key={material} src={image(materials[material].image)} alt={materials[material].title+" visual reference"}/><figcaption><span>{materials[material].code} / {materials[material].title}</span><p>{materials[material].description}</p></figcaption></figure>
   </div>
  </section>
  <section className={s.gallerySection} data-reveal><div className={s.sectionTop}><span>05 / LIGHT IN FRAMES</span><span>VISUAL ARCHIVE</span></div><h2>A quieter point of view.</h2>
   <div className={s.galleryLayout}><figure><img key={gallery} src={image(gallery+1)} alt={"FORMA visual archive image "+(gallery+1)}/><figcaption>ARCHIVE / 0{gallery+1} OF 04</figcaption></figure><div className={s.galleryAside}><span>CURATED FRAMES</span><p>Each image explores a different quality of light, structure and material.</p><div className={s.galleryControls}><button onClick={()=>setGallery(v=>(v+3)%4)} aria-label="Previous archive image" type="button">←</button><span>0{gallery+1} / 04</span><button onClick={()=>setGallery(v=>(v+1)%4)} aria-label="Next archive image" type="button">→</button></div><Link href={go("/about")}>OUR PERSPECTIVE ↗</Link></div></div>
  </section>
  <section className={s.finalCta} data-reveal><small>EVERY SPACE HAS A FIRST LINE</small><h2>Begin with a conversation.</h2><p>Tell us about a place, a material, or the way you want to live in a space.</p><Link href={go("/contact")}>START A CONVERSATION <span aria-hidden="true">↗</span></Link></section>
 </div>;
}
