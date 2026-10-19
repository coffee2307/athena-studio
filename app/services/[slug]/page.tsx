import Link from "next/link";
import { notFound } from "next/navigation";
import { getOffering, offerings } from "@/lib/offerings";
import { createMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return offerings.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = getOffering(slug);
  return item ? createMetadata(item.title, item.description) : createMetadata("Dịch vụ");
}
export default async function ServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const item = getOffering(slug);
  if (!item) notFound();
  return <div className="page-shell">
    <section className="page-hero"><div className="container"><p className="page-kicker"><span className="signal-dot" /> ATHENA SERVICES / {item.index} OF 04</p><h1>{item.title.split(" ").slice(0, -1).join(" ")}<br /><em>{item.title.split(" ").at(-1)}.</em></h1><div className="page-hero-lede"><p>{item.subtitle}</p><Link href="/contact" className="pill-link pill-light">Bắt đầu trao đổi ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><div className="detail-intro"><div><p className="section-index"><span className="index-circle">01</span> THE APPROACH</p><h2>Built around<br /><em>your needs.</em></h2></div><p className="lead-text">{item.details}</p></div><div className="detail-tile-grid">{item.features.map((feature, i) => <div className="detail-tile" key={feature}><span>0{i + 1} / CAPABILITY</span><h3>{feature}</h3></div>)}</div></div></section>
    <section className="page-section detail-dark"><div className="container"><p className="section-index"><span className="index-circle">02</span> OUR DELIVERABLES</p><div className="detail-intro" style={{marginTop:40}}><h2>Clear scope.<br /><em>Real outcomes.</em></h2><p className="lead-text" style={{color:"#b5c2b4"}}>Chúng tôi xác định phạm vi và tiêu chí nghiệm thu trước khi triển khai. Các đầu việc cụ thể sẽ được điều chỉnh theo quy mô, nền tảng và nhu cầu của từng dự án.</p></div><div className="delivery-grid">{item.deliverables.map((deliverable, i) => <div className="delivery-item" key={deliverable}><span>0{i + 1}</span>{deliverable}</div>)}</div><div className="detail-price"><div><p>{item.cadence.toUpperCase()} / INDICATIVE ONLY</p><strong>{item.startingAt}</strong></div><Link className="pill-link pill-light" href={"/contact?service=" + encodeURIComponent(item.slug)}>Yêu cầu báo giá ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><p className="section-index"><span className="index-circle">03</span> EXPLORE MORE</p><h2>Different needs.<br /><em>One partner.</em></h2><div className="offer-list">{offerings.filter((other) => other.slug !== slug).slice(0,2).map((other) => <Link className="offer-card" href={"/services/" + other.slug} key={other.slug}><div className="service-meta"><span>{other.index} / ATHENA</span><span>{other.eyebrow}</span></div><h3>{other.title}</h3><p>{other.description}</p><div className="card-bottom"><span>Khám phá</span><span>↗</span></div></Link>)}</div></div></section>
  </div>;
}
