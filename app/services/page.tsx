import Link from "next/link";
import { offerings } from "@/lib/offerings";
import { createMetadata } from "@/lib/metadata";
export const metadata = createMetadata("Dịch vụ", "Các giải pháp Athena: thiết kế website, chăm sóc website, tích hợp AI và nghiên cứu công cụ Micro-SaaS.");
export default function ServicesPage() {
  return <div className="page-shell">
    <section className="page-hero"><div className="container"><p className="page-kicker"><span className="eyebrow-dot"/> GIẢI PHÁP CỦA ATHENA / 01—04</p><h1>Công nghệ<br/><em>có mục đích.</em></h1><div className="page-hero-lede"><p>Từ ý tưởng đến vận hành, Athena kết hợp tư duy thiết kế và kỹ thuật để xây những giải pháp hữu ích cho doanh nghiệp.</p><Link href="/contact" className="pill-link pill-dark">Trao đổi nhu cầu ↗</Link></div></div></section>
    <section className="page-section"><div className="container"><p className="section-index"><span className="index-circle">01</span> BỐN LĨNH VỰC</p><div className="offer-list">{offerings.map(o=><Link key={o.slug} href={"/services/"+o.slug} className="offer-card reveal"><div className="service-meta"><span>ATHENA / {o.index}</span><span>{o.eyebrow}</span></div><h3>{o.shortTitle}</h3><p>{o.description}</p><div className="card-bottom"><span>Khám phá giải pháp</span><span aria-hidden="true">↗</span></div></Link>)}</div></div></section>
    <section className="closing-block"><div className="container closing-inner"><p className="eyebrow">BẮT ĐẦU TỪ BÀI TOÁN CỦA BẠN</p><h2>Giải pháp phù hợp.<br/><em>Kết quả ý nghĩa.</em></h2><Link href="/contact" className="pill-link pill-light">Yêu cầu tư vấn ↗</Link><span className="closing-watermark" aria-hidden="true">ATHENA</span></div></section>
  </div>;
}
