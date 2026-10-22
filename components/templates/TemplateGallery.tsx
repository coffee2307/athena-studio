"use client";
import {useCallback,useMemo,useState} from "react";
import Link from "next/link";
import type {Template} from "@/lib/templates";
import {TemplatePreview} from "@/components/templates/TemplatePreview";
import {TemplateDemoModal} from "@/components/templates/TemplateDemoModal";

export function TemplateGallery({templates,industries,styles}:{templates:Template[];industries:string[];styles:string[]}){
 const [query,setQuery]=useState("");
 const [industry,setIndustry]=useState("Tất cả ngành");
 const [style,setStyle]=useState("Tất cả phong cách");
 const [sort,setSort]=useState("recommended");
 const [selected,setSelected]=useState<Template|null>(null);
 const closeDemo=useCallback(()=>setSelected(null),[]);
 const visible=useMemo(()=>{
  const term=query.trim().toLocaleLowerCase("vi");
  const filtered=templates.filter(item=>
   (industry==="Tất cả ngành"||item.industry===industry)&&
   (style==="Tất cả phong cách"||item.style===style)&&
   (!term||[item.title,item.category,item.industry,item.style,item.purpose,...item.tags].join(" ").toLocaleLowerCase("vi").includes(term))
  );
  return sort==="name"?[...filtered].sort((a,b)=>a.title.localeCompare(b.title,"vi")):filtered;
 },[templates,query,industry,style,sort]);
 return <>
  <div className="template-filters" aria-label="Lọc mẫu website">
   <label>Tìm mẫu<input type="search" placeholder="Tên, ngành hoặc phong cách" value={query} onChange={event=>setQuery(event.target.value)}/></label>
   <label>Ngành<select value={industry} onChange={event=>setIndustry(event.target.value)}><option>Tất cả ngành</option>{industries.map(item=><option key={item}>{item}</option>)}</select></label>
   <label>Phong cách<select value={style} onChange={event=>setStyle(event.target.value)}><option>Tất cả phong cách</option>{styles.map(item=><option key={item}>{item}</option>)}</select></label>
   <label>Sắp xếp<select value={sort} onChange={event=>setSort(event.target.value)}><option value="recommended">Athena gợi ý</option><option value="name">Tên A–Z</option></select></label>
  </div>
  <p className="template-count" aria-live="polite">{visible.length} mẫu phù hợp · {templates.length} demo tương tác</p>
  {visible.length?<div className="template-grid">{visible.map((item,index)=><article className="template-card" key={item.slug}>
   <button type="button" className="template-card-preview" aria-haspopup="dialog" aria-label={"Mở demo website "+item.title} onClick={()=>setSelected(item)}><TemplatePreview template={item}/><span className="template-preview-badge">MỞ WEBSITE DEMO ↗</span></button>
   <div className="template-card-content"><div className="template-card-meta"><span>{String(index+1).padStart(2,"0")} / {item.category}</span><span>{item.style}</span></div><h2>{item.title}</h2><p>{item.description}</p><div className="template-tags">{item.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div><div className="template-card-actions"><button type="button" onClick={()=>setSelected(item)}>Trải nghiệm demo <span aria-hidden="true">↗</span></button><Link href={"/templates/"+item.slug}>Phạm vi & thông tin <span aria-hidden="true">↗</span></Link></div></div>
  </article>)}</div>:<div className="template-empty"><h2>Chưa tìm thấy mẫu phù hợp.</h2><p>Hãy đổi từ khóa hoặc đặt lại bộ lọc để xem thêm.</p><button type="button" onClick={()=>{setQuery("");setIndustry("Tất cả ngành");setStyle("Tất cả phong cách");}}>Xóa bộ lọc</button></div>}
  <div className="template-personalize-note"><div><strong>Mẫu là điểm bắt đầu, không phải khuôn cố định.</strong><span>Athena sẽ cùng bạn làm rõ nội dung, nhận diện, tích hợp và chức năng cần thiết trước khi chốt phạm vi.</span></div><Link href="/contact?service=web-development">Tư vấn mẫu phù hợp ↗</Link></div>
  <TemplateDemoModal template={selected} onClose={closeDemo}/>
 </>;
}
