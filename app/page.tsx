import Link from "next/link";
import { offerings } from "@/lib/offerings";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(undefined, "Athena Studio — đối tác thiết kế website, vận hành website, tích hợp AI và xây dựng công cụ Micro-SaaS cho doanh nghiệp.");

const stages = [
  { no: "01", title: "Understand", body: "Hiểu doanh nghiệp, khách hàng và vấn đề cần giải quyết." },
  { no: "02", title: "Shape", body: "Định hình giải pháp, phạm vi và trải nghiệm." },
  { no: "03", title: "Build", body: "Thiết kế, phát triển và kiểm thử qua từng mốc." },
  { no: "04", title: "Evolve", body: "Bàn giao, đo lường và tiếp tục cải tiến." },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-noise" aria-hidden="true" />
        <div className="container hero-topline"><span className="micro-label"><span className="signal-dot" /> INDEPENDENT DIGITAL SOLUTIONS STUDIO</span><span className="micro-label hero-year">BASED IN VIETNAM / WORKING EVERYWHERE</span></div>
        <div className="container hero-frame">
          <div className="hero-copy">
            <p className="hero-overline">DESIGN. ENGINEERING. INTELLIGENCE.</p>
            <h1 id="hero-title">Beyond<br /><span>the ordinary</span><span className="hero-period">.</span></h1>
            <div className="hero-lower"><p>Chúng tôi biến ý tưởng thành trải nghiệm số khác biệt — thiết kế có chủ đích, công nghệ có chiều sâu và hệ thống được xây để phát triển lâu dài.</p><Link className="pill-link pill-light" href="/contact">Khởi động dự án <span aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="hero-art" aria-label="Tác phẩm đồ họa trừu tượng lấy cảm hứng từ một cấu trúc số chuyển động">
            <div className="art-grid" aria-hidden="true" />
            <div className="art-orbit art-orbit-one" aria-hidden="true" />
            <div className="art-orbit art-orbit-two" aria-hidden="true" />
            <div className="art-planet" aria-hidden="true"><div className="planet-highlight" /></div>
            <div className="art-cross art-cross-one" aria-hidden="true">+</div>
            <div className="art-cross art-cross-two" aria-hidden="true">+</div>
            <div className="art-annotation art-ann-top">ATH / DIGITAL OBJECT 001<br />FORM FOLLOWS PURPOSE</div>
            <div className="art-annotation art-ann-bottom">SYNTHESIS<br />IN PROGRESS ↗</div>
            <div className="art-coordinates" aria-hidden="true">06° 12&apos; 24. 86″</div>
          </div>
        </div>
        <div className="container hero-bottom"><span>01 — INTRODUCTION</span><span>SCROLL TO EXPLORE <b aria-hidden="true">↓</b></span></div>
      </section>

      <div className="manifesto-band"><div className="container"><span>Independent by nature.</span><span>Intentional by design.</span><span>Built to make an impact.</span></div></div>

      <section className="section-space section-intro" id="about">
        <div className="container intro-grid">
          <div><p className="section-index"><span className="index-circle">01</span> WHAT WE BELIEVE</p></div>
          <div><h2>Great digital experiences are <span>never accidental.</span></h2><div className="intro-bottom"><p>Không chỉ xây một website hay tích hợp một công cụ. Athena kết nối thiết kế, kỹ thuật và tư duy sản phẩm để tạo nên những giải pháp có ích, dễ vận hành và sẵn sàng mở rộng.</p><Link href="/studio" className="underlined-link">Khám phá Athena <span aria-hidden="true">↗</span></Link></div></div>
        </div>
      </section>

      <section className="services-block section-space" id="expertise">
        <div className="container"><div className="section-heading"><div><p className="section-index light"><span className="index-circle">02</span> OUR EXPERTISE</p><h2>What we <em>do.</em></h2></div><p>Bốn năng lực cốt lõi. Một cách tiếp cận nhất quán: tạo ra giá trị thực cho doanh nghiệp.</p></div>
        <div className="service-directory">{offerings.map((item) =>
          <Link key={item.slug} href={"/services/" + item.slug} className="directory-row"><span className="directory-number">{item.index} / 04</span><div className="directory-title"><strong>{item.title}</strong><span>{item.description}</span></div><span className="directory-arrow" aria-hidden="true">↗</span></Link>)}</div>
        <div className="service-footer"><span>EXPERTISE, NOT EXCESS.</span><Link href="/services" className="underlined-link">Xem tất cả dịch vụ ↗</Link></div></div>
      </section>

      <section className="product-feature section-space">
        <div className="container product-split">
          <div className="product-copy"><p className="section-index"><span className="index-circle">03</span> ATHENA PRODUCT LAB</p><span className="product-state"><span className="signal-dot" /> EXPLORATION STAGE</span><h2>Small tools.<br /><em>Real impact.</em></h2><p>Chúng tôi cũng tự xây dựng những sản phẩm Micro-SaaS tập trung vào các vấn đề cụ thể. Bắt đầu từ nhu cầu thật, kiểm chứng trước khi mở rộng.</p><Link href="/products" className="pill-link pill-dark">Khám phá Product Lab <span aria-hidden="true">↗</span></Link></div>
          <div className="product-visual" aria-label="Minh họa giao diện sản phẩm thử nghiệm SitePulse">
            <div className="pv-top"><span><i /> ATHENA LAB / 001</span><span>PREVIEW · CONCEPT</span></div>
            <div className="pv-center"><div className="pv-ring"><div className="pv-ring-inner"><span>01</span><small>SITEPULSE</small></div></div><div className="pv-diagram"><span>MONITOR</span><span>DETECT</span><span>REPORT</span></div></div>
            <div className="pv-bottom"><span>WEBSITE RELIABILITY, REIMAGINED.</span><span>↗</span></div>
          </div>
        </div>
      </section>

      <section className="method-block section-space"><div className="container">
        <div className="section-heading method-heading"><div><p className="section-index"><span className="index-circle">04</span> HOW WE WORK</p><h2>Clarity at <em>every step.</em></h2></div><p>Một quy trình gọn gàng, minh bạch và có thể kiểm chứng — từ ý tưởng đầu tiên đến vận hành thực tế.</p></div>
        <div className="method-grid">{stages.map((stage) => <div className="method-item" key={stage.no}><span>{stage.no} — 04</span><div className="method-line" /><h3>{stage.title}</h3><p>{stage.body}</p></div>)}</div>
      </div></section>

      <section className="closing-block"><div className="container closing-inner"><p className="micro-label"><span className="signal-dot" /> THE NEXT CHAPTER STARTS HERE</p><h2>Have an idea?<br /><em>Let&apos;s make it matter.</em></h2><Link href="/contact" className="pill-link pill-light">Trao đổi về dự án <span aria-hidden="true">↗</span></Link><span className="closing-watermark" aria-hidden="true">A</span></div></section>
    </>
  );
}
