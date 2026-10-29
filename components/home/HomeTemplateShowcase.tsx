"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {getTemplate,templates} from "@/lib/templates";
const groups=[
 {id:"featured",label:"Nổi bật",slugs:["finance-trust","hospitality-booking","pet-store","creative-studio"]},
 {id:"business",label:"Doanh nghiệp",slugs:["finance-trust","modern-corporate","engineering-industry","construction-firm"]},
 {id:"commerce",label:"Bán hàng",slugs:["commerce-standard","fashion-archive","pet-store","auto-showroom"]},
 {id:"creative",label:"Sáng tạo",slugs:["creative-studio","editorial-journal","music-label","live-concert"]},
 {id:"lifestyle",label:"Đời sống",slugs:["hospitality-booking","wellness-clinic","property-showcase","education-platform"]}
] as const;
export function HomeTemplateShowcase(){
 const [category,setCategory]=useState<(typeof groups)[number]["id"]>("featured");
 const group=groups.find(item=>item.id===category)??groups[0];
 const items=group.slugs.map(slug=>getTemplate(slug)).filter((x):x is NonNullable<typeof x>=>Boolean(x));
 return <section className="home-demo-section section-space" id="website-mau" aria-labelledby="home-demo-title">
  <div className="container home-demo-layout">
   <div className="home-demo-intro reveal">
    <p className="section-index"><span className="index-circle">03</span> THƯ VIỆN WEBSITE MẪU</p>
    <h2 id="home-demo-title">Một thương hiệu.<br/><span>Một phong cách riêng.</span></h2>
    <p className="home-demo-lede">Từ nhà hàng ấm cúng đến tài chính cứng cáp, mỗi website được xây dựng theo một cách trình bày riêng. Xem trực tiếp trang chủ, dịch vụ, dự án và trải nghiệm trên điện thoại.</p>
    <div className="home-demo-facts"><div><strong>{templates.length}</strong><span>Mẫu đa ngành</span></div><div><strong>{String(groups.length).padStart(2,"0")}</strong><span>Nhóm phong cách</span></div><div><strong>01</strong><span>Định hướng của bạn</span></div></div>
    <Link href="/services/web-development/templates" className="home-demo-all">Xem toàn bộ {templates.length} mẫu <span aria-hidden="true">→</span></Link>
   </div>
   <div className="home-demo-content">
    <div className="home-demo-filters" role="group" aria-label="Lọc mẫu website">
     {groups.map(g=><button type="button" key={g.id} aria-pressed={category===g.id} onClick={()=>setCategory(g.id)}>{g.label}</button>)}
    </div>
    <div className="home-demo-cards" aria-live="polite">{items.map((item,i)=><article className="home-demo-card" key={item.slug}>
      <Link href={item.demoPath} className="home-demo-picture" aria-label={"Xem demo "+item.title}>
       <Image src={"/template-previews/"+item.slug+".jpg"+(item.slug==="auto-showroom"?"?v=20261029-p1-3d-cover":"")} alt={"Xem trước website "+item.title} fill sizes="(max-width:600px) 100vw, (max-width:1100px) 50vw, 33vw" />
       <span className="home-demo-open" aria-hidden="true">Xem mẫu</span>
      </Link>
      <div className="home-demo-meta"><span>{String(i+1).padStart(2,"0")} / {item.industry}</span><span>{item.style}</span></div>
      <h3><Link href={item.demoPath}>{item.title}</Link></h3>
      <p>{item.description}</p>
      <Link className="home-demo-visit" href={item.demoPath}>Xem demo</Link>
     </article>)}</div>
    <div className="home-demo-footer"><span>Muốn tạo một thiết kế riêng theo thương hiệu?</span><Link href="/contact">Thiết kế cho thương hiệu của bạn</Link></div>
   </div>
  </div>
 </section>;
}
