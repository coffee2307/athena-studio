import Link from "next/link";
import {notFound} from "next/navigation";
import {publicProjects,getProjectBySlug} from "@/data/projects";
import {ProjectArtwork} from "@/components/portfolio/ProjectArtwork";
import {ProjectGallery} from "@/components/portfolio/ProjectGallery";
import {ProjectCard} from "@/components/portfolio/ProjectCard";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return publicProjects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props){
 const {slug}=await params;const p=getProjectBySlug(slug);
 return p?createMetadata(p.title+" — Giao diện và tính năng",p.summary,`/du-an/${p.slug}`):createMetadata("Không tìm thấy dự án");
}
export default async function CaseStudy({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 if(!p)notFound();
 const others=publicProjects.filter(x=>x.slug!==p.slug);
 return <div className="page-shell case-detail agency-case-detail">
  <section className="case-detail-hero"><div className="container">
   <Link href="/du-an" className="case-back"><Icon name="arrow-right" size={17} className="agency-back-icon"/> Tất cả dự án</Link>
   <div className="case-detail-title"><div><p className="page-kicker"><span className="eyebrow-dot"/> {p.kicker}</p>
    <h1>{p.title}<span>.</span></h1><p>{p.summary}</p></div>
    <div className="case-detail-number">{p.kind==="research"?"DỰ ÁN NGHIÊN CỨU":"SẢN PHẨM CỦA FOUNDER"}</div>
   </div>
   <ProjectArtwork project={p}/>
   <p className="art-disclaimer">{p.gallery.some(x=>x.rightsVerified)?"Hình ảnh được chụp từ giao diện sản phẩm công khai, không phải ảnh chụp mã nguồn.":"Ảnh phía trên là đồ họa nhận diện, không phải ảnh chụp phần mềm."}</p>
  </div></section>
  <section className="page-section agency-case-story"><div className="container">
   <div className="case-facts">
    <div><span>PHÂN LOẠI</span><strong>{p.kind==="research"?"Nghiên cứu":"Dự án founder"}</strong></div>
    <div><span>TÌNH TRẠNG</span><strong>{p.status}</strong></div>
    <div><span>LĨNH VỰC</span><strong>{p.category}</strong></div>
    <div><span>ẢNH GIAO DIỆN</span><strong>{p.gallery.length?"Đã đối chiếu":"Chưa được duyệt"}</strong></div>
   </div>
   <div className="case-provenance"><span>VAI TRÒ THỰC HIỆN</span><p>{p.responsibility}</p></div>
   <div className="agency-case-section-title">
    <p className="section-index"><span className="index-circle">01</span> TRẢI NGHIỆM KHÁCH HÀNG CÓ THỂ XEM</p>
    <h2>Giao diện thực tế.<br/><span>Không phải mã nguồn.</span></h2>
    <p>{p.evidenceNote}</p>
   </div>
   <ProjectGallery project={p}/>
   <div className="agency-case-section-title agency-case-functional">
    <p className="section-index"><span className="index-circle">02</span> HẠNG MỤC VÀ CHỨC NĂNG</p>
    <h2>Những gì dự án <span>tập trung xây dựng.</span></h2>
   </div>
   <div className="agency-case-feature-grid">{p.activities.map((a,i)=><div key={a}><span>{String(i+1).padStart(2,"0")}</span><h3>{a}</h3></div>)}</div>
   <div className="case-story">
    <div className="case-story-row"><p>03 / BỐI CẢNH</p><div><h2>Bài toán ban đầu.</h2><p>{p.introduction}</p></div></div>
    <div className="case-story-row"><p>04 / THÁCH THỨC</p><div><h2>Vấn đề cần giải quyết.</h2><p>{p.challenge}</p></div></div>
    <div className="case-story-row"><p>05 / GIẢI PHÁP</p><div><h2>Hướng triển khai.</h2><p>{p.approach}</p><div className="case-tags">{p.technologies.map(t=><span key={t}>{t}</span>)}</div></div></div>
    <div className="case-story-row"><p>06 / TÌNH TRẠNG</p><div><h2>Đã có gì để xem?</h2><p>{p.outcome}</p><small className="case-outcome-note">{p.outcomeNote}</small></div></div>
   </div>
   <div className="agency-case-actions">
    {p.websiteUrl&&<a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="agency-outline-cta">Xem website dự án <Icon name="arrow-up-right" size={18}/></a>}
    <Link className="agency-outline-cta" href="/lien-he">Thảo luận một dự án tương tự <Icon name="arrow-right" size={18}/></Link>
   </div>
  </div></section>
  {others.length>0&&<section className="page-section more-cases"><div className="container">
   <div className="case-section-head"><div><p className="section-index"><span className="index-circle">07</span> DỰ ÁN KHÁC</p>
    <h2>Khám phá <span>thêm công việc.</span></h2></div></div>
   <div className="portfolio-grid">{others.map((item,i)=><ProjectCard key={item.slug} project={item} index={i}/>)}</div>
  </div></section>}
 </div>;
}
