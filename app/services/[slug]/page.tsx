import Link from "next/link";
import { notFound } from "next/navigation";
import { getOffering, offerings } from "@/lib/offerings";
import { createMetadata } from "@/lib/metadata";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() {return offerings.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}:PageProps) { const {slug}=await params; const item=getOffering(slug); return item ? createMetadata(item.shortTitle,item.description):createMetadata("Dịch vụ"); }
export default async function ServiceDetail({params}:PageProps) {
  const {slug}=await params;const item=getOffering(slug);if(!item)notFound();
  return <div className="page-shell">
    <section className="page-hero"><div className="container"><p className="page-kicker"><span className="eyebrow-dot"/> DỊCH VỤ ATHENA / {item.index} TRÊN 04</p><h1>{item.shortTitle}<br/><em>cùng Athena.</em></h1><div className="page-hero-lede"><p>{item.subtitle}</p><Link href="/contact" className="pill-link pill-dark">Bắt đầu trao đổi ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><div className="detail-intro"><div><p className="section-index"><span className="index-circle">01</span> CÁCH TIẾP CẬN</p><h2>Thiết kế theo<br/><em>nhu cầu thực tế.</em></h2></div><p className="lead-text">{item.details}</p></div><div className="detail-tile-grid">{item.features.map((feature,i)=><div className="detail-tile" key={feature}><span>{String(i+1).padStart(2,"0")} / NĂNG LỰC</span><h3>{feature}</h3></div>)}</div></div></section>
    <section className="page-section detail-dark"><div className="container"><p className="section-index"><span className="index-circle">02</span> PHẠM VI BÀN GIAO</p><div className="detail-intro" style={{marginTop:40}}><h2>Rõ từng bước.<br/><em>Chắc từng phần.</em></h2><p className="lead-text">Mọi dự án được xác định phạm vi và tiêu chí nghiệm thu trước khi bắt đầu. Các hạng mục có thể thay đổi theo mục tiêu, quy mô và nền tảng của khách hàng.</p></div><div className="delivery-grid">{item.deliverables.map((deliverable,i)=><div className="delivery-item" key={deliverable}><span>{String(i+1).padStart(2,"0")}</span>{deliverable}</div>)}</div><div className="detail-price"><div><p>{item.cadence.toUpperCase()} / THÔNG TIN THAM KHẢO</p><strong>{item.startingAt}</strong></div><Link href={"/contact?service="+encodeURIComponent(item.slug)} className="pill-link pill-light">Yêu cầu báo giá ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><p className="section-index"><span className="index-circle">03</span> GIẢI PHÁP KHÁC</p><h2>Một đối tác.<br/><em>Nhiều khả năng.</em></h2><div className="offer-list">{offerings.filter(o=>o.slug!==slug).slice(0,2).map(o=><Link className="offer-card" href={"/services/"+o.slug} key={o.slug}><div className="service-meta"><span>{o.index} / ATHENA</span><span>{o.eyebrow}</span></div><h3>{o.shortTitle}</h3><p>{o.description}</p><div className="card-bottom"><span>Khám phá</span><span>↗</span></div></Link>)}</div></div></section>
  </div>;
}
