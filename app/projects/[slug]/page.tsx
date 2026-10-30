import Link from "next/link";
import {notFound} from "next/navigation";
import {publicProjects,getProjectBySlug} from "@/data/projects";
import {ProjectGallery} from "@/components/portfolio/ProjectGallery";
import {ProjectArtwork} from "@/components/portfolio/ProjectArtwork";
import {createMetadata} from "@/lib/metadata";

type Props={params:Promise<{slug:string}>};
const sections=[
 {id:"tong-quan",label:"Tổng quan"},
 {id:"boi-canh",label:"Bối cảnh & mục tiêu"},
 {id:"huong-giai-quyet",label:"Hướng triển khai"},
 {id:"chuc-nang",label:"Phạm vi thực hiện"},
 {id:"giao-dien",label:"Hình ảnh giao diện"},
 {id:"hien-trang",label:"Hiện trạng & giới hạn"},
 {id:"du-an-khac",label:"Dự án liên quan"}
] as const;
export function generateStaticParams(){return publicProjects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 return p?createMetadata(p.title+" | Hồ sơ dự án Athena",p.summary,`/projects/${p.slug}`):createMetadata("Không tìm thấy dự án");
}

export default async function ProjectArticle({params}:Props){
 const {slug}=await params;
 const p=getProjectBySlug(slug);
 if(!p)notFound();
 const others=publicProjects.filter(item=>item.slug!==p.slug);
 const hasScreenshots=p.gallery.some(item=>item.rightsVerified);
 return <div className="ae-article">
  <div className="ae-article-shell">
   <aside className="ae-article-navigation" aria-label="Mục lục hồ sơ dự án">
    <div className="ae-article-sticky">
     <Link className="ae-article-back" href="/projects">← Tất cả dự án</Link>
     <span className="ae-article-nav-title">Mục lục</span>
     <nav aria-label="Đi đến từng mục"><ol>{sections.map((s,i)=><li key={s.id}><a href={"#"+s.id}><small>{String(i+1).padStart(2,"0")}</small>{s.label}</a></li>)}</ol></nav>
     <p className="ae-article-nav-note">Hồ sơ công khai. Không bao gồm mã nguồn hay thông tin nội bộ của dự án.</p>
    </div>
   </aside>
   <article className="ae-article-body">
    <div className="ae-article-breadcrumb"><Link href="/projects">Dự án</Link><span aria-hidden="true">/</span><span>{p.title}</span></div>
    <header className="ae-article-header">
     <span className="ae-article-eyebrow">{p.kicker}</span>
     <h1>{p.title}</h1>
     <p className="ae-article-summary">{p.summary}</p>
     <div className="ae-article-meta"><span>Hồ sơ dự án do người sáng lập thực hiện</span><span>{p.updatedLabel}</span></div>
    </header>
    <figure className="ae-article-feature">
     <ProjectArtwork project={p}/>
     <figcaption>{hasScreenshots?"Hình đại diện: giao diện dự án đã được phép công bố.":"Đồ họa nhận diện dự án; không phải ảnh chụp sản phẩm."}<span>ATHENA / {p.slug.toUpperCase()}</span></figcaption>
    </figure>
    <details className="ae-article-mobile-toc"><summary>Mục lục bài viết <span aria-hidden="true">⌄</span></summary><nav aria-label="Mục lục trên điện thoại">{sections.map((s,i)=><a key={s.id} href={"#"+s.id}>{String(i+1).padStart(2,"0")} — {s.label}</a>)}</nav></details>
    <section id="tong-quan" className="ae-article-section">
     <h2>Tổng quan</h2>
     <p>{p.introduction}</p>
     <p className="ae-article-notice">Dự án được thực hiện bởi người sáng lập Athena Studio. Không phải dự án hợp đồng hoặc sản phẩm đã bàn giao cho khách hàng.</p>
    </section>
    <section id="boi-canh" className="ae-article-section"><h2>Bối cảnh & mục tiêu</h2><p>{p.challenge}</p></section>
    <section id="huong-giai-quyet" className="ae-article-section"><h2>Hướng triển khai</h2><p>{p.approach}</p></section>
    <section id="chuc-nang" className="ae-article-section">
     <h2>Phạm vi thực hiện</h2>
     <p>Những hạng mục và trải nghiệm được mô tả trong hồ sơ công khai:</p>
     <ul className="ae-article-activity-list">{p.activities.map(a=><li key={a}>{a}</li>)}</ul>
     <h3>Công nghệ và lĩnh vực</h3>
     <div className="ae-article-tech">{p.technologies.map(t=><span key={t}>{t}</span>)}</div>
    </section>
    <section id="giao-dien" className="ae-article-section ae-article-images">
     <h2>Hình ảnh giao diện</h2>
     <p>{hasScreenshots?"Các ảnh chụp từ giao diện đã được phép công bố, giữ nguyên tỷ lệ để không che khuất chữ, điều hướng hoặc sản phẩm. Chọn ảnh để mở ở kích thước gốc.":"Dự án chưa có ảnh giao diện được xác minh và duyệt công khai. Không sử dụng hình ảnh minh họa thay cho kết quả giao diện thực tế."}</p>
     <ProjectGallery project={p}/>
    </section>
    <section id="hien-trang" className="ae-article-section">
     <h2>Hiện trạng & giới hạn</h2><p>{p.outcome}</p>
     <p className="ae-article-notice">Các mô tả được cập nhật theo tiến độ dự án; không ngụ ý đã có hợp đồng, doanh thu hoặc hiệu quả kinh doanh/đầu tư được kiểm chứng.</p>
     {p.websiteUrl&&<a className="ae-article-website" href={p.websiteUrl} target="_blank" rel="noopener noreferrer">Truy cập website dự án <span aria-hidden="true">↗</span></a>}
    </section>
    <section id="du-an-khac" className="ae-article-section ae-article-related"><h2>Dự án liên quan</h2><ul>{others.map(item=><li key={item.slug}><Link href={"/projects/"+item.slug}><strong>{item.title}</strong><span>{item.category}</span><span aria-hidden="true">↗</span></Link></li>)}</ul></section>
    <footer className="ae-article-end"><Link href="/projects">← Quay lại thư viện dự án</Link><Link href="/contact">Liên hệ Athena ↗</Link></footer>
   </article>
   <aside className="ae-article-info" aria-label="Thông tin nhanh"><div className="ae-article-sticky">
    <span className="ae-article-info-label">THÔNG TIN DỰ ÁN</span>
    <dl>
     <div><dt>Tên</dt><dd>{p.title}</dd></div>
     <div><dt>Lĩnh vực</dt><dd>{p.category}</dd></div>
     <div><dt>Thực hiện</dt><dd>Người sáng lập Athena</dd></div>
     <div><dt>Tình trạng</dt><dd>{p.status}</dd></div>
     <div><dt>Minh họa</dt><dd>{hasScreenshots?"Ảnh giao diện đã duyệt":"Chưa công bố ảnh giao diện"}</dd></div>
    </dl>
    {p.websiteUrl&&<a href={p.websiteUrl} target="_blank" rel="noopener noreferrer">Website chính thức ↗</a>}
   </div></aside>
  </div>
 </div>;
}
