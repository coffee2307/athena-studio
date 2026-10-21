import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {Icon} from "@/components/ui/Icon";
export const metadata=createMetadata("Về Athena","Athena Studio là studio thiết kế và công nghệ độc lập, tập trung vào website, cải thiện hệ thống hiện có và ứng dụng AI với phạm vi minh bạch.","/ve-athena");
const principles=[
 {title:"Hiểu vấn đề trước khi chọn công nghệ",text:"Không mặc định mọi bài toán đều cần website mới hay AI. Athena bắt đầu từ hiện trạng, người sử dụng và mục tiêu có thể xác minh."},
 {title:"Khách biết rõ sẽ nhận được gì",text:"Đề xuất cần mô tả màn hình, tính năng, hạng mục kiểm thử, quyền bàn giao và những phụ thuộc bên ngoài. Không dùng lời hứa chung chung thay cho phạm vi."},
 {title:"Thiết kế và vận hành phải đi cùng nhau",text:"Trải nghiệm đẹp chỉ có ý nghĩa khi dễ thao tác, hoạt động tốt trên thiết bị thực tế, có bảo mật, sao lưu và kế hoạch duy trì phù hợp."},
 {title:"Giữ riêng dữ liệu và mã nguồn cần bảo vệ",text:"Portfolio công khai những gì đã được phép giới thiệu. Dữ liệu khách hàng, quyền truy cập quản trị và repository không được mở chỉ để làm minh chứng năng lực."}
];
export default function StudioPage(){return <div className="page-shell agency-about-page">
 <section className="page-hero"><div className="container">
  <p className="page-kicker"><span className="eyebrow-dot"/> ATHENA STUDIO / THIẾT KẾ & CÔNG NGHỆ</p>
  <h1>Đối tác cho những<br/><em>vấn đề số cụ thể.</em></h1>
  <div className="page-hero-lede"><p>Athena là studio độc lập do founder xây dựng, tập trung vào thiết kế website, cải thiện hệ thống đang dùng và nghiên cứu những ứng dụng AI hữu ích. Quy mô và năng lực thực hiện được trao đổi phù hợp từng dự án, không dựa trên số liệu khách hàng hoặc thành tích chưa xác minh.</p>
   <Link className="pill-link pill-dark" href="/lien-he">Gửi nhu cầu <Icon name="arrow-up-right" size={18}/></Link></div>
 </div></section>
 <section className="page-section"><div className="container">
  <div className="agency-process-head"><p className="section-index"><span className="index-circle">01</span> CHÚNG TÔI GIÚP ĐƯỢC GÌ?</p>
   <h2>Ba hướng hỗ trợ <span>có thể triển khai.</span></h2></div>
  <div className="agency-price-grid">
   <article className="agency-price-card"><span>01 / WEBSITE</span><h3>Thiết kế và phát triển</h3><p>Trang giới thiệu, landing page, cửa hàng hoặc giao diện theo nhu cầu đã thống nhất.</p><Link className="agency-outline-cta" href="/dich-vu/web-development">Tìm hiểu <Icon name="arrow-right" size={16}/></Link></article>
   <article className="agency-price-card"><span>02 / VẬN HÀNH</span><h3>Chăm sóc website</h3><p>Rà soát, sửa lỗi và bảo trì hệ thống hiện tại trên cơ sở quyền truy cập và phạm vi được xác nhận.</p><Link className="agency-outline-cta" href="/dich-vu/website-care">Tìm hiểu <Icon name="arrow-right" size={16}/></Link></article>
   <article className="agency-price-card"><span>03 / AI</span><h3>Tự động hóa có kiểm chứng</h3><p>Đánh giá công việc lặp lại, thử nghiệm nguyên mẫu và thiết kế bước kiểm tra của con người.</p><Link className="agency-outline-cta" href="/dich-vu/ai-integration">Tìm hiểu <Icon name="arrow-right" size={16}/></Link></article>
  </div>
 </div></section>
 <section className="page-section agency-section-muted"><div className="container">
  <p className="section-index"><span className="index-circle">02</span> NGUYÊN TẮC LÀM VIỆC</p>
  <h2 className="agency-faq-title">Cách Athena <span>ra quyết định.</span></h2>
  <div className="agency-about-principles">{principles.map((item,i)=><article key={item.title}>
   <span>{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
 </div></section>
 <section className="page-section"><div className="container">
  <div className="agency-process-head"><div><p className="section-index"><span className="index-circle">03</span> NĂNG LỰC MINH HỌA</p>
   <h2>Xem dự án, <span>không chỉ nghe giới thiệu.</span></h2></div>
   <p>PHAM là sản phẩm của founder có ảnh giao diện thực; ECONITH là hệ thống nghiên cứu đang kiểm định. Các hồ sơ chỉ dùng nội dung được phép công bố và không biến dự án riêng thành hợp đồng khách hàng.</p></div>
  <div className="agency-case-actions"><Link href="/du-an" className="agency-outline-cta">Xem hồ sơ dự án <Icon name="arrow-right" size={18}/></Link>
   <Link href="/quy-trinh" className="agency-outline-cta">Xem quy trình hợp tác <Icon name="arrow-right" size={18}/></Link></div>
 </div></section>
 <section className="agency-final-cta"><div className="container"><p>KHI BẠN CÓ MỘT BÀI TOÁN THỰC TẾ</p><h2>Trao đổi tình trạng hiện tại.<br/>Làm rõ phương án phù hợp.</h2><Link href="/lien-he">Liên hệ Athena <Icon name="arrow-up-right" size={18}/></Link></div></section>
 </div>}
