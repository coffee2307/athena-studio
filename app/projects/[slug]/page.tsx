import Link from "next/link";
import {notFound} from "next/navigation";
import {publicProjects,getProjectBySlug} from "@/data/projects";
import {ProjectArtwork} from "@/components/portfolio/ProjectArtwork";
import {ProjectGallery} from "@/components/portfolio/ProjectGallery";
import {ProjectPreviewButton} from "@/components/portfolio/ProjectPreviewModal";
import {createMetadata} from "@/lib/metadata";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return publicProjects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 return p?createMetadata(p.title+" — Dự án của người sáng lập Athena",p.summary,`/projects/${p.slug}`):createMetadata("Không tìm thấy dự án");
}

export default async function CaseStudy({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 if(!p)notFound();
 const others=publicProjects.filter(x=>x.slug!==p.slug);
 const previewable=p.slug==="pham"||p.slug==="digital-creators";
 const hasScreenshots=p.gallery.some(item=>item.rightsVerified);
 return <div className={"ae-case ae-case-"+p.slug}>
  <header className="ae-case-hero">
   <div className="ae-case-breadcrumb"><Link href="/projects">← Trở về dự án</Link><span>ATHENA / PROJECTS / {p.slug.toUpperCase()}</span></div>
   <div className="ae-case-intro">
    <div><span className="ae-micro">{p.kicker}</span><h1>{p.title}<span className="ae-case-period">.</span></h1></div>
    <div className="ae-case-lead"><span className="ae-case-number">PROJECT / {String(publicProjects.indexOf(p)+1).padStart(2,"0")}</span><p>{p.summary}</p><div className="ae-case-action-row">
      {previewable&&<ProjectPreviewButton project={p} className="ae-case-primary">Trải nghiệm dự án <span aria-hidden="true">↗</span></ProjectPreviewButton>}
      {p.websiteUrl&&<a className="ae-case-text-link" href={p.websiteUrl} target="_blank" rel="noopener noreferrer">Mở website <span aria-hidden="true">↗</span></a>}
      {!previewable&&!p.websiteUrl&&<a className="ae-case-text-link" href="#case-story">Khám phá nghiên cứu <span aria-hidden="true">↓</span></a>}
     </div>
    </div>
   </div>
   <div className="ae-case-hero-image"><ProjectArtwork project={p}/><div className="ae-case-image-credit"><span>{p.updatedLabel}</span><span>{hasScreenshots?"ẢNH GIAO DIỆN ĐƯỢC PHÉP CÔNG BỐ":"ĐỒ HỌA NHẬN DIỆN / KHÔNG PHẢI SCREENSHOT"}</span></div></div>
  </header>
  <div className="ae-case-facts">
   <div><span>01 / LĨNH VỰC</span><strong>{p.category}</strong></div>
   <div><span>02 / PHẠM VI</span><strong>{p.kind==="research"?"Nghiên cứu đang kiểm định":"Dự án do người sáng lập phát triển"}</strong></div>
   <div><span>03 / HIỆN TRẠNG</span><strong>{p.status}</strong></div>
  </div>
  <section id="case-story" className="ae-case-narrative">
   <div className="ae-case-section-heading"><span className="ae-micro">01 / THE CONTEXT</span><h2>Mỗi dự án bắt đầu<br/>từ <em>một câu hỏi.</em></h2></div>
   <div className="ae-case-story-grid">
    <article className="ae-case-story-lead"><span>KHỞI ĐẦU</span><p>{p.introduction}</p></article>
    <article><span>THÁCH THỨC</span><h3>Điều cần giải quyết.</h3><p>{p.challenge}</p></article>
    <article><span>HƯỚNG TIẾP CẬN</span><h3>Cách chúng mình xây dựng.</h3><p>{p.approach}</p></article>
   </div>
  </section>
  <section className="ae-case-capabilities">
   <div><span className="ae-micro">02 / WHAT WAS BUILT</span><h2>Từ định hướng<br/><em>đến thực thi.</em></h2></div>
   <div className="ae-case-capability-list">{p.activities.map((activity,index)=><div key={activity}><span>{String(index+1).padStart(2,"0")}</span><strong>{activity}</strong></div>)}</div>
  </section>
  <section className="ae-case-visuals">
   <div className="ae-case-visuals-head"><span className="ae-micro">03 / DESIGN RECORD</span><h2>{hasScreenshots?"Nhìn gần hơn.":"Về những gì được phép chia sẻ."}</h2><p>{hasScreenshots?"Một số màn hình thực tế đã được lựa chọn để giới thiệu trải nghiệm và chi tiết thiết kế.":"Dự án chưa có ảnh giao diện được duyệt công bố; phần giới thiệu chỉ nêu phạm vi và mục tiêu nghiên cứu."}</p></div>
   <ProjectGallery project={p}/>
  </section>
  <section className="ae-case-result"><span className="ae-micro">04 / CURRENT STATE</span><h2>Không chỉ là<br/><em>bản trình bày.</em></h2><p>{p.outcome}</p><div className="ae-case-technology">{p.technologies.map(t=><span key={t}>{t}</span>)}</div></section>
  <nav className="ae-case-next" aria-label="Dự án khác"><div><span className="ae-micro">MORE SELECTED WORK</span><h2>Tiếp tục khám phá.</h2></div><div className="ae-case-next-links">{others.map(item=><Link href={"/projects/"+item.slug} key={item.slug}><span>{item.title}</span><small>{item.category}</small><strong aria-hidden="true">↗</strong></Link>)}</div></nav>
  <div className="ae-case-footer"><Link href="/projects">← Tất cả dự án</Link><Link href="/contact">Trao đổi với Athena ↗</Link></div>
 </div>;
}