"use client";
import {useState} from "react";
import type {Project} from "@/types/project";
import {ProjectCard} from "./ProjectCard";
type Filter="all"|"founder"|"research"|"immersive";
const options:[Filter,string][]=[["all","Tất cả"],["founder","Sản phẩm"],["immersive","Immersive 3D"],["research","Nghiên cứu"]];
export function PortfolioDirectory({items}:{items:Project[]}){
 const [active,setActive]=useState<Filter>("all");
 const visible=items.filter(x=>active==="all"||(active==="immersive"?x.slug==="digital-creators":x.kind===active));
 return <div className="portfolio-directory phase0-portfolio-directory"><div className="portfolio-controls"><div className="filter-group" role="group" aria-label="Lọc dự án">{options.map(([value,label])=><button type="button" key={value} className={active===value?"filter-chip is-active":"filter-chip"} aria-pressed={active===value} onClick={()=>setActive(value)}>{label}</button>)}</div><p aria-live="polite" className="result-count">{String(visible.length).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</p></div><div className="portfolio-grid phase0-portfolio-grid">{visible.map((item,i)=><ProjectCard key={item.slug} project={item} index={i}/>)}</div>{visible.length===0&&<p className="portfolio-empty">Chưa có dự án trong nhóm này.</p>}</div>;
}