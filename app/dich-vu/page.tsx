import {Icon} from "@/components/ui/Icon";
import Link from "next/link";
import {offerings} from "@/lib/offerings";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata("Dịch vụ","Thiết kế website, bảo trì website và tích hợp AI cho doanh nghiệp. Xem vấn đề phù hợp, phạm vi công việc và đầu ra trước khi yêu cầu báo giá.","/dich-vu");

export default function ServicesPage(){
 const services=offerings.filter(item=>item.slug!=="micro-saas");
 return <div className="page-shell">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> DỊCH VỤ ATHENA STUDIO</p>
   <h1>Bạn cần giải quyết<br/><em>vấn đề nào?</em></h1>
   <div className="page-hero-lede"><p>Chúng tôi tập trung vào ba nhu cầu cụ thể: xây website mới, cải thiện website đang vận hành và thử nghiệm AI để giảm việc thủ công. Chọn một dịch vụ để xem công việc cùng đầu ra có thể bàn giao.</p><Link href="/lien-he" className="pill-link pill-dark">Trình bày nhu cầu <Icon name="arrow-up-right" size={18}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">01</span> NHU CẦU / PHẠM VI / ĐẦU RA</p>
   <div className="client-solution-grid service-solution-grid">
    {services.map(s=><article className="client-solution-card reveal" key={s.slug}>
     <div className="client-solution-top"><span>{s.index} / 03</span><span>{s.eyebrow}</span></div>
     <h2>{s.shortTitle}</h2>
     <p className="client-solution-label">VẤN ĐỀ THƯỜNG GẶP</p><p className="client-solution-problem">{s.challenge}</p>
     <p className="client-solution-label">PHẠM VI CÓ THỂ BÀN GIAO</p><p className="client-solution-delivery">{s.output}</p>
     <Link href={"/dich-vu/"+s.slug} className="client-solution-link">Xem chi tiết công việc <Icon name="arrow-up-right" size={18}/></Link>
    </article>)}
   </div>
   <div className="client-service-boundary">
    <div><h2>Chưa rõ nên chọn gì?</h2><p>Gửi địa chỉ website (nếu có), điều đang gây khó khăn và mục tiêu ưu tiên. Athena sẽ trao đổi phạm vi phù hợp trước khi báo giá.</p></div>
    <Link href="/lien-he" className="pill-link pill-dark">Trao đổi nhu cầu <Icon name="arrow-up-right" size={18}/></Link>
   </div>
   <p className="client-solution-note">Chi phí và thời gian thực hiện phụ thuộc tình trạng hiện tại, quyền truy cập, yêu cầu cụ thể và những gì được thống nhất. Không có cam kết tăng doanh thu hay hiệu quả chưa được kiểm chứng.</p>
  </div></section>
  <section className="client-lab-band"><div className="container client-lab-inner">
   <div><p className="section-index"><span className="index-circle">02</span> NGHIÊN CỨU, CHƯA MỞ BÁN</p><h2>Product Lab <span>không phải dịch vụ thương mại đang mở.</span></h2><p>Các công cụ Micro-SaaS hiện thuộc phạm vi nghiên cứu. Trạng thái từng ý tưởng được công bố riêng để tránh nhầm lẫn với dịch vụ đã sẵn sàng triển khai.</p></div>
   <Link href="/san-pham" className="underlined-link">Xem Product Lab <Icon name="arrow-up-right" size={18}/></Link>
  </div></section>
 </div>;
}
