import Link from "next/link";
import {notFound} from "next/navigation";
import {Icon} from "@/components/ui/Icon";
import {TemplatePreviewControls} from "@/components/templates/TemplatePreviewControls";
import {getTemplate,templates} from "@/lib/templates";
import {createMetadata} from "@/lib/metadata";
import "@/app/templates.css";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return templates.map(template=>({slug:template.slug}));}
export async function generateMetadata({params}:Props){const {slug}=await params;const item=getTemplate(slug);return item?createMetadata(item.title,item.description,`/templates/${item.slug}`):createMetadata("Mẫu website");}
export default async function TemplateDetailPage({params}:Props){
 const {slug}=await params;const item=getTemplate(slug);if(!item)notFound();
 const requestHref=`/contact?service=web-development&template=${encodeURIComponent(item.slug)}`;
 return <div className="page-shell template-detail">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><Link href="/services/web-development/templates">THƯ VIỆN MẪU</Link><span aria-hidden="true"> / </span>{item.category.toLocaleUpperCase("vi")}</p>
   <h1>{item.title}<br/><em>{item.style} / {item.industry}</em></h1>
   <div className="page-hero-lede"><p>{item.description} Có thể thay đổi màu sắc, nội dung, cấu trúc trang và chức năng theo nhu cầu đã thống nhất.</p><Link href={requestHref} className="pill-link pill-dark">Chọn mẫu này <Icon name="arrow-up-right" size={18}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container template-detail-grid">
   <div><TemplatePreviewControls template={item}/><p className="template-preview-disclaimer">Bản dựng giao diện khái niệm để chọn định hướng. Đây chưa phải website đã triển khai hoặc bản demo chức năng.</p></div>
   <aside className="template-detail-aside"><p className="section-index"><span className="index-circle">01</span> THÔNG TIN MẪU / {item.version}</p><h2>Một nền tảng<br/><em>có thể cá nhân hóa.</em></h2><p>{item.purpose}. Chọn hướng này để Athena hiểu phong cách mong muốn; nội dung, hình ảnh và tính năng sẽ được xác định cùng bạn.</p>
    <h3>Trang có thể xây dựng</h3><ul>{item.pages.map(page=><li key={page}>{page}</li>)}</ul>
    <h3>Đặc trưng thiết kế</h3><ul>{item.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
    <div className="template-detail-actions"><Link href={requestHref} className="pill-link pill-dark">Yêu cầu tư vấn mẫu này <Icon name="arrow-up-right" size={18}/></Link><Link href="/services/web-development/templates" className="underlined-link">Quay lại thư viện <Icon name="arrow-right" size={17}/></Link></div>
   </aside>
  </div></section>
 </div>;
}
