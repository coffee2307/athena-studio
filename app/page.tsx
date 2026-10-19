import Link from "next/link";
import Image from "next/image";
import { HeroField } from "@/components/experience/HeroField";
import { offerings } from "@/lib/offerings";
import {featuredProjects} from "@/data/projects";
import {ProjectCard} from "@/components/portfolio/ProjectCard";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(undefined, "Athena Studio — thiết kế website, chăm sóc website, tích hợp AI và phát triển công cụ số. Chúng tôi kiến tạo những giải pháp có chiều sâu cho doanh nghiệp.", "/");

const steps = [
  { n: "01", title: "Lắng nghe", detail: "Hiểu điều bạn cần giải quyết, không chỉ điều bạn muốn xây dựng." },
  { n: "02", title: "Định hình", detail: "Cùng xác định định hướng, giải pháp và phạm vi phù hợp." },
  { n: "03", title: "Kiến tạo", detail: "Thiết kế và phát triển có kiểm thử, phản hồi theo từng mốc." },
  { n: "04", title: "Đồng hành", detail: "Bàn giao, hỗ trợ vận hành và liên tục cải thiện." },
];

export default function HomePage() {
  return <>
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="container hero-topline"><span className="eyebrow"><span className="eyebrow-dot"/> STUDIO THIẾT KẾ & CÔNG NGHỆ ĐỘC LẬP</span><span className="eyebrow hero-year">TỪ VIỆT NAM · ĐẾN MỌI NƠI</span></div>
      <div className="container hero-frame">
        <div className="hero-copy">
          <p className="hero-overline">THẤU HIỂU. THIẾT KẾ. KIẾN TẠO.</p>
          <h1 id="hero-title">Nhìn xa.<br/><span>Kiến tạo</span><br/><em>khác biệt.</em></h1>
          <div className="hero-lower">
            <p>Chúng tôi kết hợp tư duy thiết kế và công nghệ để biến những bài toán của doanh nghiệp thành trải nghiệm số có ý nghĩa.</p>
            <Link className="pill-link pill-dark" href="/lien-he">Bắt đầu dự án <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <HeroField/>
      </div>
      <div className="container hero-bottom"><span>ATHENA / 001</span><span>CUỘN ĐỂ KHÁM PHÁ <span aria-hidden="true">↓</span></span></div>
    </section>

    <div className="manifesto-band"><div className="container">
      <span>THIẾT KẾ CÓ CHỦ ĐÍCH</span><span className="manifesto-symbol" aria-hidden="true">✳</span><span>CÔNG NGHỆ CÓ CHIỀU SÂU</span><span className="manifesto-symbol" aria-hidden="true">✳</span><span>GIÁ TRỊ CÓ THỂ KIỂM CHỨNG</span>
    </div></div>

    <section className="section-space section-intro">
      <div className="container intro-grid">
        <p className="section-index reveal"><span className="index-circle">01</span> TƯ DUY ATHENA</p>
        <div className="intro-content reveal">
          <h2>Công nghệ tốt không chỉ <em>hoạt động.</em><br/>Nó phải <span>có ý nghĩa.</span></h2>
          <div className="intro-bottom"><p>Không bắt đầu bằng một giao diện có sẵn hay một công nghệ đang thịnh hành. Athena bắt đầu bằng câu hỏi: điều gì thực sự cần được cải thiện cho con người và doanh nghiệp?</p><Link className="underlined-link" href="/ve-athena">Tìm hiểu Athena <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>

    <section className="section-space portfolio-featured" aria-labelledby="featured-projects-heading">
      <div className="container">
        <div className="case-section-head reveal">
          <div><p className="section-index"><span className="index-circle">02</span> DỰ ÁN VÀ NGHIÊN CỨU</p><h2 id="featured-projects-heading">Những hành trình<br/><em>đang được viết.</em></h2></div>
          <p>Khám phá các sản phẩm và dự án nghiên cứu của founder Athena, được phân loại rõ ràng theo vai trò và trạng thái thực tế.</p>
        </div>
        <div className="portfolio-grid">{featuredProjects.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div>
        <div className="featured-footer"><p>Dự án của founder và dự án nghiên cứu không đồng nghĩa với hợp đồng khách hàng của Athena.</p><Link href="/du-an" className="underlined-link">Xem toàn bộ dự án ↗</Link></div>
      </div>
    </section>

    <section className="section-space services-block">
      <div className="container">
        <div className="section-heading reveal"><div><p className="section-index"><span className="index-circle">03</span> LĨNH VỰC CHUYÊN MÔN</p><h2>Bốn hướng đi.<br/><em>Một tầm nhìn.</em></h2></div><p>Từ xây dựng sản phẩm đến vận hành và tích hợp AI — mọi giải pháp đều cần rõ mục tiêu và có khả năng phát triển lâu dài.</p></div>
        <div className="service-directory">{offerings.map(s=><Link key={s.slug} className="directory-row reveal" href={"/dich-vu/"+s.slug}>
          <span className="directory-number">{s.index} / 04</span>
          <div className="directory-title"><strong>{s.shortTitle}</strong><span>{s.description}</span></div>
          <span className="directory-arrow" aria-hidden="true">↗</span>
        </Link>)}</div>
        <div className="service-footer"><span>HỆ GIẢI PHÁP ATHENA</span><Link href="/dich-vu" className="underlined-link">Khám phá dịch vụ ↗</Link></div>
      </div>
    </section>

    <section className="section-space product-feature"><div className="container product-split">
      <div className="product-copy reveal">
        <p className="section-index"><span className="index-circle">04</span> XƯỞNG SẢN PHẨM</p>
        <span className="product-state"><span className="eyebrow-dot"/> ĐANG NGHIÊN CỨU</span>
        <h2>Những công cụ nhỏ.<br/><em>Giá trị lớn.</em></h2>
        <p>Athena cũng nghiên cứu những sản phẩm Micro-SaaS giúp công việc mỗi ngày trở nên đơn giản hơn. Chúng tôi chỉ công bố sản phẩm khi đã được kiểm chứng.</p>
        <Link className="pill-link pill-dark" href="/san-pham">Khám phá sản phẩm <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="product-visual reveal" aria-label="Minh họa định hướng sản phẩm SitePulse đang nghiên cứu">
        <div className="pv-top"><span>ATHENA / XƯỞNG SẢN PHẨM</span><span>Ý TƯỞNG · 001</span></div>
        <div className="pv-center">
          <div className="pv-trace"><svg viewBox="0 0 460 320" role="presentation" aria-hidden="true"><path d="M0 160H75L104 125L131 204L166 156H223L251 107L288 210L320 161H460" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          <div className="pv-card"><div className="pv-card-mini">CHƯA RA MẮT</div><Image src="/branding/logo-symbol-black.svg" alt="" width={54} height={54}/><strong>SitePulse</strong><span>Giám sát website · Ý tưởng</span></div>
        </div>
        <div className="pv-bottom"><span>NGHIÊN CỨU → THỬ NGHIỆM → PHÁT TRIỂN</span><span aria-hidden="true">↗</span></div>
      </div>
    </div></section>

    <section className="section-space method-block"><div className="container">
      <div className="section-heading reveal"><div><p className="section-index"><span className="index-circle">05</span> PHƯƠNG PHÁP LÀM VIỆC</p><h2>Rõ ràng từ<br/><em>đầu đến cuối.</em></h2></div><p>Chúng tôi tin sự minh bạch, khả năng đo lường và cộng tác tốt quan trọng không kém một giao diện đẹp.</p></div>
      <div className="method-grid">{steps.map(step=><div className="method-item reveal" key={step.n}><span>{step.n} / 04</span><div className="method-line"/><h3>{step.title}</h3><p>{step.detail}</p></div>)}</div>
    </div></section>

    <section className="closing-block"><div className="container closing-inner">
      <p className="eyebrow"><span className="eyebrow-dot"/> CÙNG BẮT ĐẦU MỘT ĐIỀU MỚI</p>
      <h2>Ý tưởng của bạn.<br/><em>Chúng ta cùng làm.</em></h2>
      <Link href="/lien-he" className="pill-link pill-light">Trao đổi về dự án <span aria-hidden="true">↗</span></Link>
      <span className="closing-watermark" aria-hidden="true">ATHENA</span>
    </div></section>
  </>;
}
