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
 const clear=()=>{setQuery("");setIndustry("Tất cả ngành");setStyle("Tất cả phong cách");setSort("recommended");};
 return <section className="templates-catalog" aria-label="Danh sách các mẫu website">
  <div className="templates-catalog-heading"><div><span>01 — THƯ VIỆN WEBSITE</span><h2>Khám phá mẫu thiết kế<span>.</span></h2></div><p>Nhấn vào bản xem trước để trải nghiệm website thực tế ngay trong Athena.</p></div>
  <div className="template-filters" aria-label="Lọc mẫu website">
   <label className="template-search-label">Tìm kiếm<input type="search" placeholder="Tìm theo ngành, tên mẫu..." value={query} onChange={event=>setQuery(event.target.value)}/></label>
   <label>Ngành nghề<select value={industry} onChange={event=>setIndustry(event.target.value)}><option>Tất cả ngành</option>{industries.map(item=><option key={item}>{item}</option>)}</select></label>
   <label>Phong cách<select value={style} onChange={event=>setStyle(event.target.value)}><option>Tất cả phong cách</option>{styles.map(item=><option key={item}>{item}</option>)}</select></label>
   <label>Sắp xếp<select value={sort} onChange={event=>setSort(event.target.value)}><option value="recommended">Đề xuất của Athena</option><option value="name">Tên A–Z</option></select></label>
  </div>
  <div className="templates-results"><p aria-live="polite"><strong>{String(visible.length).padStart(2,"0")}</strong> / {String(templates.length).padStart(2,"0")} MẪU PHÙ HỢP</p>{(query||industry!=="Tất cả ngành"||style!=="Tất cả phong cách")&&<button type="button" onClick={clear}>Xóa bộ lọc ×</button>}</div>
  {visible.length?<div className="template-grid">{visible.map((item,index)=><article className="template-card" key={item.slug}>
   <button type="button" className="template-card-preview" aria-haspopup="dialog" aria-label={"Trải nghiệm website "+item.title} onClick={()=>setSelected(item)}><TemplatePreview template={item}/><span className="template-preview-badge">XEM WEBSITE</span></button>
   <div className="template-card-content"><div className="template-card-meta"><span>{String(index+1).padStart(2,"0")} / {item.industry}</span><span>{item.style}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="template-card-footer"><span>{item.qualityTier}</span><button type="button" onClick={()=>setSelected(item)}>Trải nghiệm mẫu</button></div></div>
  </article>)}</div>:<div className="template-empty"><h2>Không tìm thấy mẫu phù hợp.</h2><p>Thử một ngành khác hoặc xóa bộ lọc để xem toàn bộ thư viện.</p><button type="button" onClick={clear}>Hiển thị tất cả</button></div>}
  <div className="template-personalize-note"><div><small>02 — TỪ MẪU ĐẾN THƯƠNG HIỆU</small><strong>Điểm khởi đầu cho một website riêng.</strong><span>Athena điều chỉnh bố cục, nhận diện, nội dung và tính năng theo mục tiêu thực tế — không giao sản phẩm sao chép máy móc từ bản demo.</span></div><Link href="/contact?service=web-development">Trao đổi ý tưởng</Link></div>
  <TemplateDemoModal template={selected} onClose={closeDemo}/>
 </section>;
}
