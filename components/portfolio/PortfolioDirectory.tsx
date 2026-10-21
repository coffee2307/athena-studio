"use client";
import {useState} from "react";
import type {Project} from "@/types/project";
import {ProjectCard} from "./ProjectCard";

type Filter="all"|"founder"|"research";
export function PortfolioDirectory({items}:{items:Project[]}){
 const [active,setActive]=useState<Filter>("all");
 const options:[Filter,string][]=[["all","Tất cả"],["founder","Dự án founder"],["research","Nghiên cứu"]];
 const visible=items.filter(x=>active==="all"||x.kind===active);
 return <div className="portfolio-directory">
   <div className="portfolio-controls"><div className="filter-group" role="group" aria-label="Lọc dự án">{options.map(([value,label])=><button type="button" key={value} className={active===value?"filter-chip is-active":"filter-chip"} aria-pressed={active===value} onClick={()=>setActive(value)}>{label}</button>)}</div><p aria-live="polite" className="result-count">{visible.length} dự án</p></div>
   <div className="portfolio-grid">{visible.map(item=><ProjectCard key={item.slug} project={item} index={items.indexOf(item)}/>)}</div>
   {visible.length===0&&<p className="portfolio-empty">Chưa có dự án được công bố trong nhóm này.</p>}
 </div>;
}
