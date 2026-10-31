import Link from "next/link";
import {notFound} from "next/navigation";
import {Icon} from "@/components/ui/Icon";
import {TemplatePreviewControls} from "@/components/templates/TemplatePreviewControls";
import {getTemplate,templates} from "@/lib/templates";
import {createMetadata} from "@/lib/metadata";
import "@/app/templates.css";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return templates.map(template=>({slug:template.slug}));}
export async function generateMetadata({params}:Props){const {slug}=await params;const item=getTemplate(slug);return item?createMetadata(item.title+" — demo website",item.description,"/templates/"+item.slug):createMetadata("Mẫu website");}
export default async function TemplateDetailPage({params}:Props){
 const {slug}=await params;const item=getTemplate(slug);if(!item)notFound();
 const requestHref="/contact?service=web-development&template="+encodeURIComponent(item.slug);
 return <div className="page-shell template-detail">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><Link href="/services/web-development/templates">THƯ VIỆN MẪU</Link><span aria-hidden="true"> / </span>{item.category.toLocaleUpperCase("vi")}</p>
   <h1>{item.title}<br/><em>{item.style} / {item.industry}</em></h1>
   <div className="page-hero-lede"><p>{item.description} Mở demo để thử bộ lọc, điều hướng và các tương tác mô phỏng; nội dung, ảnh và chức năng có thể được thay theo dự án.</p><Link href={item.demoPath} className="pill-link pill-dark" target="_blank">Mở demo toàn trang <Icon name="arrow-right" size={18}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container template-detail-grid">
   <div><TemplatePreviewControls template={item}/><p className="template-preview-disclaimer">Đây là website demo hoạt động độc lập. Biểu mẫu, đặt lịch và thanh toán chỉ mô phỏng, không gửi dữ liệu hoặc tạo giao dịch thật.</p></div>
   <aside className="template-detail-aside"><p className="section-index"><span className="index-circle">01</span> PHẠM VI MẪU / {item.version}</p><h2>{item.title}<br/><em>làm riêng cho bạn.</em></h2><p>{item.purpose}. Mẫu giúp bạn trải nghiệm một hướng triển khai trước khi chốt nội dung, chức năng, tích hợp và tiêu chuẩn bàn giao.</p>
    <div className="template-scope-metrics"><div><span>NGÂN SÁCH DỰ KIẾN</span><strong>{item.estimatedPrice}</strong></div><div><span>HƯỚNG CHẤT LƯỢNG</span><strong>{item.qualityTier}</strong></div></div>
    <h3>Phạm vi tham khảo</h3><ul>{item.pages.map(page=><li key={page}>{page}</li>)}</ul>
    <h3>Điểm nổi bật</h3><ul>{item.features.slice(0,4).map(feature=><li key={feature}>{feature}</li>)}</ul>
    <p className="template-reference-note">Hướng thiết kế được phát triển lại bởi Athena, có tham khảo mẫu mã nguồn mở {item.reference.name} theo giấy phép MIT.</p>
    <div className="template-detail-actions"><Link href={requestHref} className="pill-link pill-dark">Yêu cầu tùy biến mẫu này <Icon name="arrow-right" size={18}/></Link><Link href="/services/web-development/templates" className="underlined-link">Quay lại thư viện <Icon name="arrow-right" size={17}/></Link></div>
   </aside>
  </div></section>
 </div>;
}
