import {Icon} from "@/components/ui/Icon";
import Link from "next/link";
import {offerings} from "@/lib/offerings";
import {featuredProjects} from "@/data/projects";
import {ProjectCard} from "@/components/portfolio/ProjectCard";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata(
 undefined,
 "Athena Studio giúp doanh nghiệp thiết kế website, cải thiện website hiện có và tích hợp AI vào công việc. Xem vấn đề chúng tôi hỗ trợ, phạm vi bàn giao và cách gửi yêu cầu.",
 "/"
);

const services=offerings.filter(item=>item.slug!=="micro-saas");
const steps=[
 {number:"01",title:"Gửi vấn đề",detail:"Mô tả website hiện tại (nếu có), khó khăn đang gặp và điều bạn muốn cải thiện. Không cần viết tài liệu kỹ thuật."},
 {number:"02",title:"Xác định phạm vi",detail:"Athena trao đổi hướng xử lý, hạng mục có thể làm, những gì cần kiểm tra thêm và báo giá theo yêu cầu cụ thể."},
 {number:"03",title:"Triển khai và bàn giao",detail:"Thống nhất công việc trước khi bắt đầu; kiểm thử trên thiết bị phù hợp và bàn giao những hạng mục đã thỏa thuận."}
];

export default function HomePage(){
 return <>
  <section className="client-hero" aria-labelledby="hero-title">
   <div className="container">
    <p className="eyebrow client-hero-kicker"><span className="eyebrow-dot"/> WEBSITE · BẢO TRÌ · TỰ ĐỘNG HÓA AI</p>
    <div className="client-hero-grid">
     <div className="client-hero-copy">
      <h1 id="hero-title">Website chưa hiệu quả?<br/><span>Công việc còn thủ công?</span></h1>
      <p className="client-hero-lede">Athena hỗ trợ thiết kế website, cải thiện hệ thống hiện có và ứng dụng AI vào những công việc lặp lại. <strong>Bắt đầu từ vấn đề của bạn, không phải từ một công nghệ được chọn sẵn.</strong></p>
      <div className="client-hero-actions">
       <Link className="pill-link pill-dark" href="/lien-he">Gửi nhu cầu của bạn <Icon name="arrow-up-right" size={18}/></Link>
       <Link className="underlined-link" href="#giai-phap">Xem Athena hỗ trợ gì <Icon name="arrow-right" size={17} className="agency-down-icon"/></Link>
      </div>
      <p className="client-hero-helper">Chưa rõ cần giải pháp nào? Chỉ cần mô tả vấn đề đang gặp.</p>
     </div>
     <aside className="client-quick-nav" aria-label="Tìm giải pháp theo nhu cầu">
      <p className="client-quick-label">BẠN ĐANG CẦN GÌ?</p>
      <Link href="/dich-vu/web-development"><span className="client-quick-index">01</span><span><strong>Tôi cần website mới</strong><small>Trang giới thiệu, landing page, cửa hàng trực tuyến</small></span><Icon name="arrow-up-right" size={18}/></Link>
      <Link href="/dich-vu/website-care"><span className="client-quick-index">02</span><span><strong>Website hiện tại có vấn đề</strong><small>Chậm, lỗi, khó cập nhật hoặc thiếu người chăm sóc</small></span><Icon name="arrow-up-right" size={18}/></Link>
      <Link href="/dich-vu/ai-integration"><span className="client-quick-index">03</span><span><strong>Tôi muốn bớt việc thủ công</strong><small>Tra cứu nội bộ, xử lý tài liệu, tự động hóa quy trình</small></span><Icon name="arrow-up-right" size={18}/></Link>
      <p className="client-quick-foot">Chọn nhu cầu để xem phạm vi và đầu ra có thể triển khai.</p>
     </aside>
    </div>
   </div>
  </section>

  <section id="giai-phap" className="section-space client-solutions" aria-labelledby="solutions-title">
   <div className="container">
    <div className="client-section-heading reveal">
     <div><p className="section-index"><span className="index-circle">01</span> DỊCH VỤ CHO DOANH NGHIỆP</p>
      <h2 id="solutions-title">Vấn đề bạn gặp.<br/><span>Hướng xử lý cụ thể.</span></h2></div>
     <p>Chọn đúng nhu cầu để xem phần việc và kết quả bàn giao dự kiến. Chi phí, tiến độ và phạm vi được xác định sau khi hiểu hiện trạng.</p>
    </div>
    <div className="client-solution-grid">
     {services.map(s=><article className="client-solution-card reveal" key={s.slug}>
      <div className="client-solution-top"><span>{s.index} / 03</span><span>{s.eyebrow}</span></div>
      <h3>{s.shortTitle}</h3>
      <p className="client-solution-label">KHI NÀO BẠN CẦN?</p><p className="client-solution-problem">{s.challenge}</p>
      <p className="client-solution-label">ATHENA CÓ THỂ BÀN GIAO</p><p className="client-solution-delivery">{s.output}</p>
      <Link href={"/dich-vu/"+s.slug} className="client-solution-link">Xem phạm vi dịch vụ <Icon name="arrow-up-right" size={18}/></Link>
     </article>)}
    </div>
    <p className="client-solution-note">Không cam kết doanh thu hoặc hiệu quả khi chưa khảo sát và thống nhất chỉ số đo lường. Các đề xuất đều tùy thuộc dữ liệu, nền tảng và phạm vi thực tế.</p>
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
    <Link href="/lien-he" className="underlined-link">Xem cách liên hệ <Icon name="arrow-up-right" size={18}/></Link>
   </div>
  </div></section>

  <section className="section-space portfolio-featured" aria-labelledby="featured-projects-heading">
   <div className="container">
    <div className="case-section-head reveal">
     <div><p className="section-index"><span className="index-circle">03</span> SẢN PHẨM ĐÃ THỰC HIỆN / NGHIÊN CỨU</p>
      <h2 id="featured-projects-heading">Xem cách làm,<br/><span>không chỉ nghe giới thiệu.</span></h2></div>
     <p>Đây là sản phẩm do founder phát triển hoặc nghiên cứu, <strong>không phải danh sách hợp đồng khách hàng Athena</strong>. Mỗi hồ sơ nêu rõ vai trò và trạng thái hiện tại.</p>
    </div>
    <div className="portfolio-grid">{featuredProjects.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div>
    <div className="featured-footer"><p>Chúng tôi không gắn kết quả kinh doanh chưa được xác minh cho các dự án này.</p><Link href="/du-an" className="underlined-link">Xem hồ sơ dự án <Icon name="arrow-up-right" size={18}/></Link></div>
   </div>
  </section>

  <section className="client-lab-band" aria-label="Phòng nghiên cứu sản phẩm"><div className="container client-lab-inner">
   <div><p className="section-index"><span className="index-circle">04</span> PHÒNG NGHIÊN CỨU</p>
    <h2>Phần mềm chuyên biệt <span>đang được nghiên cứu.</span></h2>
    <p>Product Lab và SitePulse chưa được mở bán. Đây là hướng nghiên cứu, không phải dịch vụ có thể đặt mua ngay.</p></div>
   <Link href="/san-pham" className="underlined-link">Xem trạng thái sản phẩm <Icon name="arrow-up-right" size={18}/></Link>
  </div></section>

  <section className="closing-block"><div className="container closing-inner">
   <p className="eyebrow"><span className="eyebrow-dot"/> TRAO ĐỔI NHU CẦU THỰC TẾ</p>
   <h2>Đang gặp vấn đề<br/><span>với website hoặc quy trình?</span></h2>
   <p className="client-closing-copy">Hãy mô tả ngắn gọn điều đang gây khó khăn. Athena sẽ xem xét để trao đổi phạm vi và hướng xử lý phù hợp, không yêu cầu bạn phải chuẩn bị tài liệu kỹ thuật.</p>
   <Link href="/lien-he" className="pill-link pill-light">Gửi yêu cầu tư vấn <Icon name="arrow-up-right" size={18}/></Link>
   <span className="closing-watermark" aria-hidden="true">ATHENA</span>
  </div></section>
 </>;
}
