import Link from "next/link";
import {AthenaServiceShowcase} from "@/components/home/AthenaServiceShowcase";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Dịch vụ","Athena Studio thiết kế website, chăm sóc hệ thống và ứng dụng AI cho quy trình thực tế.","/services");

export default function ServicesPage(){
 return <div className="dna-services-page">
  <section className="dna-services-hero"><div className="container dna-services-heading">
   <div><p className="dna-eyebrow">GIẢI PHÁP / ATHENA STUDIO</p><h1>Chọn điều bạn<br/><em>muốn thay đổi.</em></h1></div>
   <div><p>Một website đáng nhớ, một hệ thống hoạt động ổn định hoặc một quy trình bớt thủ công. Bắt đầu từ đúng nhu cầu của bạn.</p><Link className="dna-button dna-button-primary" href="/start">Gửi yêu cầu</Link></div>
  </div></section>
  <section className="dna-services-catalog"><div className="container"><div className="dna-section-intro dna-services-catalog-heading"><div><p className="dna-eyebrow">01 / DỊCH VỤ</p><h2>Từ ý tưởng<br/><em>đến vận hành.</em></h2></div><p>Khám phá từng dịch vụ để xem phạm vi, quy trình và kết quả có thể bàn giao.</p></div><AthenaServiceShowcase mode="catalog"/></div></section>
  <section className="dna-services-closing"><div className="container dna-services-closing-inner">
   <div><p className="dna-eyebrow">02 / LÀM VIỆC CÙNG NHAU</p><h2>Bài toán của bạn<br/>không phải một mẫu có sẵn.</h2><p>Chúng mình sẽ xác định rõ nhu cầu, phạm vi và điều kiện triển khai trước khi đưa ra phương án hoặc báo giá.</p></div>
   <Link href="/contact" className="dna-button dna-button-secondary">Kể cho Athena nghe</Link>
  </div></section>
  <section className="dna-lab-notice"><div className="container"><p><strong>Product Lab</strong> — Các sản phẩm Micro-SaaS đang được nghiên cứu, chưa mở bán.</p><Link href="/products">Tìm hiểu thêm <span aria-hidden="true">→</span></Link></div></section>
 </div>;
}