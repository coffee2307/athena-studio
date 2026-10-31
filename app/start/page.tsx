import Link from "next/link";
import {LaunchIntake} from "@/components/forms/LaunchIntake";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Bắt đầu dự án","Chọn hướng dịch vụ, mô tả nhu cầu và chuẩn bị email tư vấn với Athena Studio. Không cần tạo tài khoản hoặc gửi dữ liệu lên máy chủ.","/start");
export default function StartProjectPage(){
 return <div className="page-shell launch-page">
  <section className="launch-hero"><div className="container launch-hero-grid">
   <div><p className="section-index"><span className="index-circle">01</span> KHỞI ĐẦU MỘT DỰ ÁN</p><h1>Cho chúng tôi biết<br/><em>điều bạn cần.</em></h1><p>Không cần bản mô tả kỹ thuật. Chỉ cần ba bước để xác định lĩnh vực, phạm vi và chuẩn bị một email tư vấn rõ ràng.</p></div>
   <div className="launch-hero-side"><span>ATHENA / NEW INQUIRY</span><strong>01—03</strong><p>Trước khi báo giá, Athena sẽ khảo sát công việc và làm rõ những điều có thể bàn giao. Đây không phải đơn đặt hàng.</p></div>
  </div></section>
  <section className="launch-workspace"><div className="container launch-workspace-grid">
   <LaunchIntake/>
   <aside className="launch-aside">
    <div className="launch-aside-sticky"><span className="launch-aside-kicker">TRƯỚC KHI BẮT ĐẦU</span><h2>Minh bạch từ đầu.</h2>
     <div className="launch-assurance"><span>01</span><div><h3>Khảo sát trước khi báo giá</h3><p>Không cam kết thời hạn hoặc kết quả khi chưa thống nhất phạm vi.</p></div></div>
     <div className="launch-assurance"><span>02</span><div><h3>Không bắt buộc tạo tài khoản</h3><p>Gửi yêu cầu qua ứng dụng email của bạn, không cần mở hệ thống thành viên.</p></div></div>
     <div className="launch-assurance"><span>03</span><div><h3>Không thu tiền tự động</h3><p>Bất kỳ khoản thanh toán nào cũng cần đề xuất và điều khoản được xác nhận riêng.</p></div></div>
     <p className="launch-aside-help">Bạn muốn liên hệ trực tiếp? <Link href="/contact">Xem thông tin liên hệ <Icon name="arrow-right" size={15}/></Link></p>
    </div>
   </aside>
  </div></section>
 </div>;
}
