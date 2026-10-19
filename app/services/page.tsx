import Link from "next/link";
import { offerings } from "@/lib/offerings";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Dịch vụ", "Bốn nhóm dịch vụ Athena Studio: thiết kế website, Website Care, tích hợp AI và Micro-SaaS.");

export default function ServicesPage() {
  return <div className="page-shell">
    <section className="page-hero"><div className="container"><p className="page-kicker"><span className="signal-dot" /> OUR CAPABILITIES / 01—04</p><h1>Digital, with<br /><em>intention.</em></h1><div className="page-hero-lede"><p>Từ ý tưởng đến vận hành. Athena kết hợp thiết kế, kỹ thuật và tư duy sản phẩm để giải quyết những vấn đề thực tế của doanh nghiệp.</p><Link className="pill-link pill-light" href="/contact">Trao đổi nhu cầu ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><p className="section-index"><span className="index-circle">01</span> WHAT WE OFFER</p><div className="offer-list">{offerings.map((item) => <Link href={"/services/" + item.slug} key={item.slug} className="offer-card"><div className="service-meta"><span>ATHENA / {item.index}</span><span>{item.eyebrow}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="card-bottom"><span>Khám phá giải pháp</span><span aria-hidden="true">↗</span></div></Link>)}</div></div></section>
    <section className="closing-block"><div className="container closing-inner"><p className="micro-label"><span className="signal-dot" /> THE RIGHT SOLUTION STARTS WITH A CONVERSATION</p><h2>Start with<br /><em>a clear idea.</em></h2><Link href="/contact" className="pill-link pill-light">Nhận tư vấn dự án ↗</Link><span className="closing-watermark" aria-hidden="true">A</span></div></section>
  </div>;
}
