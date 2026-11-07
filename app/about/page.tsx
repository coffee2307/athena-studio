import {AboutStudioDesk} from "@/components/experience/AboutStudioDesk";
import {AboutPrinciples} from "@/components/experience/AboutPrinciples";
import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {Icon} from "@/components/ui/Icon";
export const metadata=createMetadata("Về Athena","Athena Studio là studio thiết kế và công nghệ độc lập, tập trung vào website, cải thiện hệ thống hiện có và ứng dụng AI với phạm vi minh bạch.","/about");
const principles=[
 {title:"Hiểu vấn đề trước khi chọn công nghệ",text:"Không mặc định mọi bài toán đều cần website mới hay AI. Athena bắt đầu từ hiện trạng, người sử dụng và mục tiêu có thể xác minh."},
 {title:"Khách biết rõ sẽ nhận được gì",text:"Đề xuất cần mô tả màn hình, tính năng, hạng mục kiểm thử, quyền bàn giao và những phụ thuộc bên ngoài. Không dùng lời hứa chung chung thay cho phạm vi."},
 {title:"Thiết kế và vận hành phải đi cùng nhau",text:"Trải nghiệm đẹp chỉ có ý nghĩa khi dễ thao tác, hoạt động tốt trên thiết bị thực tế, có bảo mật, sao lưu và kế hoạch duy trì phù hợp."},
 {title:"Giữ riêng dữ liệu và mã nguồn cần bảo vệ",text:"Portfolio công khai những gì đã được phép giới thiệu. Dữ liệu khách hàng, quyền truy cập quản trị và repository không được mở chỉ để làm minh chứng năng lực."}
];
export default function StudioPage(){
 return <main className="dna04-about">
  <section className="dna04-about-intro"><div className="container dna04-about-layout">
   <div className="dna04-about-copy"><p className="dna04-kicker"><span/> ATHENA / INDEPENDENT CREATIVE ENGINEERING</p><h1>Không chỉ<br/>làm website.<br/><em>Chúng tôi tạo<br/>trải nghiệm.</em></h1><p>Athena kết hợp thiết kế có bản sắc và kỹ thuật có thể kiểm chứng. Từ ý tưởng ban đầu đến sản phẩm thực sự sử dụng được.</p><div className="dna04-about-cta"><Link href="/projects">Xem dự án thực tế <span aria-hidden="true">→</span></Link><Link href="/contact">Bắt đầu trao đổi</Link></div><div className="dna04-about-footnote">Studio độc lập / Thiết kế · Web · AI</div></div>
   <AboutStudioDesk/>
  </div></section>
  <section className="dna04-about-principles-section"><div className="container">
   <div className="dna04-section-heading"><span>01 / THE WAY WE THINK</span><h2>Mọi quyết định<br/><em>đều có lý do.</em></h2><p>Bốn nguyên tắc giúp biến một cuộc trò chuyện thành sản phẩm có thể bàn giao, sử dụng và tiếp tục phát triển.</p></div>
   <AboutPrinciples principles={principles}/>
  </div></section>
  <section className="dna04-about-proof"><div className="container"><div className="dna04-about-proof-head"><span>02 / WORK IN THE OPEN</span><h2>Hãy xem những gì<br/><em>đã được xây dựng.</em></h2></div><div className="dna04-about-proof-grid">
   <Link href="/projects" className="dna04-about-proof-card"><span>PROJECT / 001</span><strong>PHAM</strong><p>Website và trải nghiệm thương hiệu thời trang do founder phát triển. Không phải hợp đồng khách hàng.</p><i>Khám phá dự án →</i></Link>
   <Link href="/projects" className="dna04-about-proof-card"><span>PROJECT / 002</span><strong>ECONITH</strong><p>Dự án nghiên cứu định lượng đang kiểm thử; minh họa cách Athena tiếp cận hệ thống dữ liệu và độ tin cậy.</p><i>Khám phá dự án →</i></Link>
   <div className="dna04-about-proof-note"><span>PROOF FIRST.</span><h3>Không số liệu tưởng tượng.<br/>Không portfolio giả.</h3><p>Các dự án founder được ghi đúng nguồn gốc. Mọi công bố về khách hàng phải có quyền sử dụng nội dung.</p></div>
  </div></div></section>
  <section className="dna04-about-ending"><div className="container"><span>03 / START SOMETHING REAL</span><h2>Có một vấn đề cần giải quyết?<br/><em>Chúng ta bắt đầu từ đó.</em></h2><Link href="/contact">Trao đổi với Athena <span aria-hidden="true">→</span></Link></div></section>
 </main>;
}
