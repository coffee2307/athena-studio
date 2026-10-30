"use client";
import Link from "next/link";
import {useState} from "react";
import type {Project} from "@/types/project";
import {ProjectArtwork} from "./ProjectArtwork";

type Filter="all"|"founder"|"research";
const options:[Filter,string][]=[["all","Tất cả"],["founder","Sản phẩm & trải nghiệm"],["research","Nghiên cứu"]];

export function PortfolioDirectory({items}:{items:Project[]}){
 const [active,setActive]=useState<Filter>("all");
 const visible=items.filter(item=>active==="all"||item.kind===active);
 return <div className="ae-directory">
  <div className="ae-directory-toolbar"><div className="ae-directory-filters" role="group" aria-label="Lọc các dự án">
   {options.map(([value,label])=><button key={value} type="button" aria-pressed={active===value} onClick={()=>setActive(value)}>{label}</button>)}
  </div><span className="ae-directory-counter" aria-live="polite">{String(visible.length).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span></div>
  <div className="ae-project-grid">
   {visible.map((project,index)=><article key={project.slug} className={"ae-project-tile ae-project-"+project.slug}>
    <div className="ae-project-poster"><Link href={"/projects/"+project.slug} className="ae-project-visual-action" aria-label={"Đọc hồ sơ dự án "+project.title}>
     <ProjectArtwork project={project} compact/>
    </Link></div>
    <div className="ae-project-tile-foot"><div className="ae-project-tile-top"><span>{String(index+1).padStart(2,"0")} / {project.category}</span><span>{project.kind==="research"?"NGHIÊN CỨU":"DỰ ÁN SÁNG LẬP"}</span></div>
     <div className="ae-project-tile-copy"><div><h3>{project.title}</h3><p>{project.summary}</p></div><div className="ae-project-tile-actions"><Link href={"/projects/"+project.slug}>Khám phá dự án <span aria-hidden="true">↗</span></Link></div></div>
    </div>
   </article>)}
  </div>
  {visible.length===0&&<p className="ae-directory-empty">Không có dự án thuộc nhóm này.</p>}
 </div>;
}