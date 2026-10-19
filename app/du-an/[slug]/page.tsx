import Link from "next/link";
import {notFound} from "next/navigation";
import {publicProjects,getProjectBySlug} from "@/data/projects";
import {ProjectArtwork} from "@/components/portfolio/ProjectArtwork";
import {ProjectCard} from "@/components/portfolio/ProjectCard";
import {createMetadata} from "@/lib/metadata";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return publicProjects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props){
 const {slug}=await params;const p=getProjectBySlug(slug);
 return p?createMetadata(p.title+" — Hồ sơ dự án",p.summary,`/du-an/${p.slug}`):createMetadata("Không tìm thấy dự án");
}
export default async function CaseStudy({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 if(!p)notFound();
 const others=publicProjects.filter(o=>o.slug!==p.slug);
 return <div className="page-shell case-detail">
  <section className="case-detail-hero"><div className="container">
   <Link href="/du-an" className="case-back">← Tất cả dự án</Link>
   <div className="case-detail-title"><div><p className="page-kicker"><span className="eyebrow-dot"/> {p.kicker}</p><h1>{p.title}<span>.</span></h1><p>{p.summary}</p></div><div className="case-detail-number">DỰ ÁN / {p.kind==="research"?"NGHIÊN CỨU":"FOUNDER"}</div></div>
   <ProjectArtwork project={p}/>
   <p className="art-disclaimer">Minh họa đồ họa được thiết kế riêng để trình bày dự án; không phải ảnh chụp phần mềm hoặc ảnh chụp chiến dịch.</p>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="case-facts"><div><span>PHÂN LOẠI</span><strong>{p.kind==="research"?"Dự án nghiên cứu":"Dự án của founder"}</strong></div><div><span>TÌNH TRẠNG</span><strong>{p.status}</strong></div><div><span>LĨNH VỰC</span><strong>{p.category}</strong></div><div><span>NGUỒN KIỂM CHỨNG</span><strong>{p.updatedLabel}</strong></div></div>
   <div className="case-provenance"><span>VAI TRÒ ĐƯỢC CÔNG BỐ</span><p>{p.responsibility}</p></div>
   <div className="case-story"><div className="case-story-row"><p>01 / TỔNG QUAN</p><div><h2>Đặt vấn đề<br/><em>đúng trước.</em></h2><p>{p.introduction}</p></div></div><div className="case-story-row"><p>02 / THÁCH THỨC</p><div><h2>Bài toán<br/><em>cần giải quyết.</em></h2><p>{p.challenge}</p></div></div><div className="case-story-row"><p>03 / TIẾP CẬN</p><div><h2>Tư duy và<br/><em>cấu trúc.</em></h2><p>{p.approach}</p><div className="case-tags">{p.technologies.map(t=><span key={t}>{t}</span>)}</div></div></div><div className="case-story-row"><p>04 / NHỮNG GÌ ĐÃ CÓ</p><div><h2>Hiện vật<br/><em>có thể đối chiếu.</em></h2><p>{p.outcome}</p><small className="case-outcome-note">{p.outcomeNote}</small></div></div></div>
   <div className="case-evidence"><div><p className="small-index">MINH BẠCH NGUỒN</p><h3>Thông tin có thể kiểm chứng.</h3><p>{p.evidenceNote}</p></div>{p.sourceUrl&&<a href={p.sourceUrl} className="pill-link pill-dark" target="_blank" rel="noopener noreferrer">Mở repository gốc ↗</a>}</div>
  </div></section>
  {others.length>0&&<section className="page-section more-cases"><div className="container"><div className="case-section-head"><div><p className="section-index"><span className="index-circle">05</span> KHÁM PHÁ THÊM</p><h2>Một góc nhìn<br/><em>khác.</em></h2></div></div><div className="portfolio-grid">{others.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div></div></section>}
 </div>;
}
