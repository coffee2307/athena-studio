import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("SitePulse — Nguyên mẫu giám sát website","Một công cụ đang được Athena thử nghiệm nội bộ cho dịch vụ Website Care: kiểm tra HTTP, lưu bằng chứng và lập báo cáo. Chưa mở đăng ký hoặc thanh toán.","/san-pham/sitepulse");
const phases=[
 {n:"01",title:"Kiểm tra có kiểm soát",desc:"Chỉ kiểm tra các tên miền HTTPS được chủ sở hữu cho phép. Ghi nhận mã HTTP, thời gian phản hồi và thời điểm kiểm tra."},
 {n:"02",title:"Lưu kết quả kiểm chứng",desc:"Lưu từng phép đo dạng JSON Lines riêng tư để người vận hành đối chiếu. Phân biệt sự cố, chuyển hướng và phản hồi bình thường."},
 {n:"03",title:"Báo cáo để hành động",desc:"Tổng hợp số lần kiểm tra thành công và sự cố liên tiếp. Đội Website Care sử dụng báo cáo để xác minh và xử lý thủ công."}
];
export default function SitePulsePage(){
 return <div className="page-shell sitepulse-page">
  <section className="page-hero sitepulse-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> ATHENA PRODUCT LAB / NGUYÊN MẪU KỸ THUẬT</p>
   <h1>Biết sớm.<br/><em>Xử lý rõ.</em></h1>
   <div className="page-hero-lede"><p>SitePulse đang được phát triển thành một công cụ hỗ trợ Website Care: không chỉ thấy trang web có phản hồi hay không, mà còn lưu bằng chứng để biết khi nào cần hành động.</p>
    <Link className="pill-link pill-dark" href="/lien-he?service=micro-saas">Trao đổi về nhu cầu ↗</Link></div>
   <div className="sitepulse-status"><span className="sitepulse-status-dot"/><span>CHƯA PHÁT HÀNH — KHÔNG CÓ GIÁM SÁT CÔNG KHAI ĐANG CHẠY</span></div>
  </div></section>
  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">01</span> CÁCH HOẠT ĐỘNG</p>
   <div className="sitepulse-diagram" role="img" aria-label="Quy trình ba bước: website được cấp phép, phép kiểm tra HTTP, nhật ký và hành động của nhân sự Website Care">
    <div><small>ĐÍCH ĐƯỢC XÁC MINH</small><strong>Website</strong><span>Chỉ tên miền đã phê duyệt</span></div>
    <span className="sitepulse-arrow" aria-hidden="true">→</span>
    <div><small>KIỂM TRA</small><strong>SitePulse</strong><span>HTTP · Trạng thái · TTFB</span></div>
    <span className="sitepulse-arrow" aria-hidden="true">→</span>
    <div><small>KẾT QUẢ NỘI BỘ</small><strong>Báo cáo</strong><span>Nhật ký · Xác minh · Xử lý</span></div>
   </div>
   <div className="sitepulse-step-grid">{phases.map(x=><article key={x.n}><span>{x.n} / PHƯƠNG PHÁP</span><h2>{x.title}</h2><p>{x.desc}</p></article>)}</div>
  </div></section>
  <section className="page-section detail-dark"><div className="container"><p className="section-index"><span className="index-circle">02</span> PHẠM VI NGUYÊN MẪU</p>
   <div className="detail-intro"><h2>Đo đúng.<br/><em>Không phóng đại.</em></h2>
    <p className="lead-text">Nguyên mẫu có bộ kiểm tra HTTP chạy thủ công trong môi trường vận hành nội bộ. SitePulse chưa cung cấp giám sát 24/7, cảnh báo tự động, báo cáo SLA, đăng ký trả phí hay dashboard khách hàng đang hoạt động.</p></div>
   <div className="sitepulse-boundaries">
    <div><span>ĐÃ XÂY DỰNG TRONG NGUYÊN MẪU</span><p>Kiểm tra endpoint HTTPS được duyệt, giới hạn thời gian và lượng dữ liệu tải, không theo redirect, hạn chế truy cập mạng nội bộ và lưu kết quả từng lần chạy.</p></div>
    <div><span>CHƯA TRIỂN KHAI</span><p>Lịch kiểm tra tự động, nhiều điểm đo, đối soát cảnh báo, gửi email, hợp đồng SLA, thanh toán, cơ sở dữ liệu đa khách hàng và đo độ ổn định ngoài thực tế.</p></div>
   </div>
  </div></section>
  <section className="page-section"><div className="container"><p className="section-index"><span className="index-circle">03</span> CÙNG KIỂM CHỨNG NHU CẦU</p>
   <div className="sitepulse-feedback"><div><h2>Website của bạn cần<br/><em>được theo dõi thế nào?</em></h2>
    <p>Chúng tôi muốn trao đổi với các chủ website, cửa hàng và doanh nghiệp nhỏ về việc phát hiện sự cố, chi phí downtime và nhu cầu nhận báo cáo bằng tiếng Việt. Cuộc trao đổi này không phải đăng ký gói dịch vụ.</p></div>
    <div><p>Ba điều Athena muốn tìm hiểu:</p><ol><li>Bạn đang kiểm tra website và phát hiện sự cố bằng cách nào?</li><li>Sự cố gần nhất ảnh hưởng công việc của bạn như thế nào?</li><li>Báo cáo hay hành động hỗ trợ nào thật sự đáng trả phí?</li></ol>
    <Link className="pill-link pill-dark" href="/lien-he?service=micro-saas">Chia sẻ trải nghiệm ↗</Link></div></div>
  </div></section>
 </div>;
}
