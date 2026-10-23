import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {Icon} from "@/components/ui/Icon";

export const metadata=createMetadata("Báo giá dịch vụ","Cách Athena Studio xác định phạm vi và báo giá website, bảo trì và AI; các yếu tố ảnh hưởng chi phí, hạng mục bàn giao và cách gửi yêu cầu.","/pricing");
const groups=[
 {name:"Thiết kế website",need:"Mục đích website, số trang/mẫu trang, nội dung, mức tùy biến, đa ngôn ngữ và các tích hợp bán hàng hoặc liên hệ.",scope:"Thiết kế/triển khai giao diện, responsive, quản trị nội dung và những chức năng được ghi trong báo giá."},
 {name:"Chăm sóc website",need:"Nền tảng hiện tại, số trang, mức lỗi, quyền truy cập, tần suất cập nhật và lịch theo dõi.",scope:"Kiểm tra, phân loại lỗi, sửa và bảo trì theo các hạng mục và định kỳ được thống nhất."},
 {name:"Tích hợp AI",need:"Quy trình muốn tự động hóa, dữ liệu được phép dùng, người kiểm duyệt, số lượng thao tác và kết nối phần mềm.",scope:"Bản phân tích quy trình, nguyên mẫu, tiêu chí đánh giá chất lượng và hướng vận hành có giám sát."}
];
export default function Pricing(){
 return <div className="page-shell agency-pricing-page">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> BÁO GIÁ THEO PHẠM VI THỰC TẾ</p>
   <h1>Biết mình trả cho<br/><em>những công việc gì.</em></h1>
   <div className="page-hero-lede"><p>Athena chưa công bố bảng giá cố định khi chưa chuẩn hóa các gói và chi phí vận hành. Bạn sẽ nhận đề xuất theo hạng mục cụ thể, tránh báo giá đẹp nhưng thiếu phần việc quan trọng.</p><Link href="/start" className="pill-link pill-dark">Chuẩn bị yêu cầu báo giá <Icon name="arrow-up-right" size={18}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">01</span> NHỮNG YẾU TỐ CẦN BIẾT</p>
   <h2 className="agency-faq-title">Mỗi bài toán cần<br/><span>một phạm vi riêng.</span></h2>
   <div className="agency-price-grid">{groups.map((g,i)=><article key={g.name} className="agency-price-card">
    <span>{String(i+1).padStart(2,"0")} / DỊCH VỤ</span><h3>{g.name}</h3>
    <strong>Thông tin cần khảo sát</strong><p>{g.need}</p>
    <strong>Đầu ra cần được làm rõ</strong><p>{g.scope}</p>
   </article>)}</div>
  </div></section>
  <section className="page-section agency-section-muted"><div className="container">
   <p className="section-index"><span className="index-circle">02</span> MỘT BẢN ĐỀ XUẤT NÊN GỒM</p>
   <div className="agency-pricing-inclusions">{["Mục tiêu và phạm vi công việc","Danh sách màn hình/tính năng/hạng mục","Mốc thời gian và đầu mối xác nhận","Cách kiểm thử, nghiệm thu, bàn giao","Số vòng chỉnh sửa và điều kiện thay đổi phạm vi","Chi phí dịch vụ, chi phí bên thứ ba và điều khoản hỗ trợ"].map((item,i)=><div key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p><Icon name="check" size={19}/></div>)}</div>
   <p className="agency-pricing-caveat">Tên miền, hosting, dịch vụ email, API và các phần mềm thứ ba không mặc nhiên được bao gồm trong báo giá. Mỗi khoản phát sinh phải được thể hiện rõ trước khi bạn đồng ý.</p>
  </div></section>
  <section className="agency-final-cta"><div className="container"><p>KHÔNG CẦN TÀI LIỆU PHỨC TẠP</p><h2>Chỉ cần nói rõ<br/>điều bạn muốn giải quyết.</h2><Link href="/contact">Gửi tình trạng và mục tiêu <Icon name="arrow-up-right" size={18}/></Link></div></section>
 </div>;
}
