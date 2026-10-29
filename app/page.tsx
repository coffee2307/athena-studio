import {Icon} from "@/components/ui/Icon";
import {HomeTemplateShowcase} from "@/components/home/HomeTemplateShowcase";
import {AthenaHeroStage} from "@/components/home/AthenaHeroStage";
import {AthenaServiceShowcase} from "@/components/home/AthenaServiceShowcase";
import {ServiceTicker} from "@/components/experience/ServiceTicker";
import Link from "next/link";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata(
 undefined,
 "Athena Studio giúp doanh nghiệp thiết kế website, cải thiện website hiện có và tích hợp AI vào công việc. Xem vấn đề chúng tôi hỗ trợ, phạm vi bàn giao và cách gửi yêu cầu.",
 "/"
);

const steps=[
 {number:"01",title:"Gửi vấn đề",detail:"Mô tả website hiện tại (nếu có), khó khăn đang gặp và điều bạn muốn cải thiện. Không cần viết tài liệu kỹ thuật."},
 {number:"02",title:"Xác định phạm vi",detail:"Athena trao đổi hướng xử lý, hạng mục có thể làm, những gì cần kiểm tra thêm và báo giá theo yêu cầu cụ thể."},
 {number:"03",title:"Triển khai và bàn giao",detail:"Thống nhất công việc trước khi bắt đầu; kiểm thử trên thiết bị phù hợp và bàn giao những hạng mục đã thỏa thuận."}
];

export default function HomePage(){
 return <>
  <section className="dna-home-hero" aria-labelledby="hero-title">
   <div className="container dna-home-hero-grid">
    <div className="dna-home-hero-copy">
     <p className="dna-eyebrow"><span className="dna-dot"/> CREATIVE ENGINEERING STUDIO</p>
     <h1 id="hero-title">Ý tưởng của bạn.<br/><em>Thành trải nghiệm.</em></h1>
     <p>Website có bản sắc. Hệ thống vận hành tốt. AI phục vụ những công việc thực tế. Athena thiết kế và xây dựng từ nhu cầu của bạn.</p>
     <div className="dna-hero-actions"><Link className="dna-button dna-button-primary" href="/start">Bắt đầu dự án</Link><Link className="dna-button dna-button-quiet" href="/projects">Xem sản phẩm đã làm <span aria-hidden="true">→</span></Link></div>
     <span className="dna-hero-footnote">Từ định hướng, giao diện đến lập trình và bàn giao.</span>
    </div>
    <AthenaHeroStage/>
   </div>
  </section>
  <ServiceTicker/>
  <div className="athena-editorial-seam" aria-label="Nguyên tắc thực hiện"><div className="container athena-editorial-seam-inner"><span>Phạm vi rõ ràng</span><span>Kiểm thử trước bàn giao</span><span>Hỗ trợ theo thỏa thuận</span></div></div>


  <section id="giai-phap" className="dna-home-services" aria-labelledby="solutions-title">
   <div className="container">
    <div className="dna-section-intro"><div><p className="dna-eyebrow">01 / KHẢ NĂNG CỦA ATHENA</p><h2 id="solutions-title">Ba hướng giải quyết.<br/><em>Một trải nghiệm riêng.</em></h2></div><p>Không bắt đầu từ một mẫu có sẵn. Chúng mình hiểu vấn đề trước rồi chọn công nghệ, bố cục và cách triển khai phù hợp.</p></div>
    <AthenaServiceShowcase/>
    <div className="dna-after-services"><p>Không chắc mình cần gì? Chỉ cần mô tả vấn đề hiện tại.</p><Link className="dna-button dna-button-secondary" href="/contact">Trao đổi với Athena</Link></div>
   </div>
  </section>
  <section className="section-space method-block" aria-labelledby="method-title"><div className="container">
   <div className="client-section-heading reveal">
    <div><p className="section-index"><span className="index-circle">02</span> CÁCH HỢP TÁC</p>
     <h2 id="method-title">Bạn biết trước<br/><span>mình sẽ nhận gì.</span></h2></div>
    <p>Không yêu cầu bạn phải biết lập trình. Chúng tôi làm rõ bài toán, phạm vi, bước tiếp theo và giới hạn của giải pháp trước khi triển khai.</p>
   </div>
   <div className="method-grid">{steps.map(step=><div className="method-item reveal" key={step.number}><span>{step.number} / 03</span><div className="method-line"/><h3>{step.title}</h3><p>{step.detail}</p></div>)}</div>
   <div className="client-process-cta">
    <p><strong>Để trao đổi nhanh hơn:</strong> hãy gửi địa chỉ website (nếu có), vấn đề cần xử lý và mục tiêu ưu tiên. Có thể gửi trực tiếp qua email nếu biểu mẫu đang bảo trì.</p>
    <Link href="/contact" className="dna-button dna-button-secondary">Liên hệ Athena</Link>
   </div>
  </div></section>

  <HomeTemplateShowcase/>

  <section className="client-lab-band" aria-label="Phòng nghiên cứu sản phẩm"><div className="container client-lab-inner">
   <div><p className="section-index"><span className="index-circle">04</span> PHÒNG NGHIÊN CỨU</p>
    <h2>Phần mềm chuyên biệt <span>đang được nghiên cứu.</span></h2>
    <p>Product Lab và SitePulse chưa được mở bán. Đây là hướng nghiên cứu, không phải dịch vụ có thể đặt mua ngay.</p></div>
   <Link href="/products" className="dna-button dna-button-secondary">Khám phá Product Lab</Link>
  </div></section>

  <section className="closing-block"><div className="container closing-inner">
   <p className="eyebrow"><span className="eyebrow-dot"/> TRAO ĐỔI NHU CẦU THỰC TẾ</p>
   <h2>Đang gặp vấn đề<br/><span>với website hoặc quy trình?</span></h2>
   <p className="client-closing-copy">Hãy mô tả ngắn gọn điều đang gây khó khăn. Athena sẽ xem xét để trao đổi phạm vi và hướng xử lý phù hợp, không yêu cầu bạn phải chuẩn bị tài liệu kỹ thuật.</p>
   <Link href="/start" className="pill-link pill-light">Chuẩn bị yêu cầu tư vấn <Icon name="arrow-up-right" size={18}/></Link>
   <span className="closing-watermark" aria-hidden="true">ATHENA</span>
  </div></section>
 </>;
}
