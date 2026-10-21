import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata(
 "Quy trình làm việc",
 "Quy trình hợp tác với Athena Studio: tiếp nhận yêu cầu, khảo sát, thống nhất phạm vi, triển khai, kiểm thử, bàn giao và hỗ trợ sau bàn giao.",
 "/quy-trinh"
);
const stages=[
 {n:"01",title:"Tiếp nhận và xác định bài toán",description:"Khách mô tả việc đang gặp khó khăn, website hiện tại (nếu có), đối tượng sử dụng và kết quả mong muốn.",deliverable:"Bản tóm tắt nhu cầu, các câu hỏi cần làm rõ.",customer:"Mô tả vấn đề và người phụ trách trao đổi.",studio:"Làm rõ mục tiêu, không ép chọn dịch vụ trước khi hiểu nhu cầu."},
 {n:"02",title:"Khảo sát hiện trạng và phương án",description:"Đối chiếu nội dung, chức năng, tích hợp, thiết bị, quyền truy cập và những ràng buộc kỹ thuật có liên quan.",deliverable:"Phương án và danh sách hạng mục ưu tiên.",customer:"Cung cấp tài liệu được phép chia sẻ, không gửi mật khẩu qua form.",studio:"Nêu những việc làm được, chưa chắc chắn và phụ thuộc bên thứ ba."},
 {n:"03",title:"Báo giá và chốt phạm vi",description:"Hai bên thống nhất đầu ra, lịch trình dự kiến, số vòng chỉnh sửa, tiêu chí nghiệm thu, thanh toán và quyền sở hữu sau bàn giao.",deliverable:"Đề xuất phạm vi công việc và thỏa thuận được xác nhận.",customer:"Duyệt phương án, mức ngân sách và đầu mối phản hồi.",studio:"Không phát sinh hạng mục có phí nếu chưa được thống nhất."},
 {n:"04",title:"Thiết kế, phát triển và cập nhật",description:"Phát triển theo các mốc đã duyệt, có bản xem trước để phản hồi đúng giai đoạn; hạn chế chỉnh sửa phạm vi không kiểm soát.",deliverable:"Bản thiết kế/bản thử và cập nhật tiến độ.",customer:"Phản hồi theo các mốc đã thống nhất.",studio:"Đưa sản phẩm vào môi trường thử nghiệm, không tự ý thay production."},
 {n:"05",title:"Kiểm thử và nghiệm thu",description:"Kiểm tra các luồng quan trọng trên desktop/mobile, điều hướng, bảo mật cơ bản, lỗi hiển thị và những tiêu chí đo lường có thể kiểm chứng.",deliverable:"Danh sách kiểm thử, lỗi còn lại và bản nghiệm thu.",customer:"Thử những tình huống sử dụng thực tế.",studio:"Sửa lỗi thuộc phạm vi; giải thích giới hạn chưa xử lý."},
 {n:"06",title:"Bàn giao và hỗ trợ",description:"Bàn giao tài sản và tài khoản theo quyền sở hữu đã thống nhất; cung cấp hướng dẫn sử dụng và phạm vi hỗ trợ sau bàn giao.",deliverable:"Tài khoản/quyền truy cập, tài liệu bàn giao và hướng dẫn.",customer:"Xác nhận việc tiếp nhận và đầu mối vận hành.",studio:"Hỗ trợ theo phạm vi bảo hành hoặc gói chăm sóc đã ký."}
];
const faqs=[
 ["Tôi chưa biết chọn dịch vụ nào?","Bạn có thể gửi tình trạng hiện tại và mục tiêu. Athena sẽ trao đổi xem nên làm website mới, nâng cấp website cũ hay chỉ cải thiện một bước trong quy trình."],
 ["Có cần chuẩn bị tài liệu kỹ thuật không?","Không. Một mô tả ngắn về vấn đề, URL website (nếu có), thời hạn mong muốn và ngân sách dự kiến là đủ để bắt đầu trao đổi."],
 ["Bao lâu có báo giá và khi nào triển khai?","Thời gian phụ thuộc độ rõ của yêu cầu và mức độ khảo sát cần thiết. Athena chỉ xác nhận thời hạn sau khi đã trao đổi phạm vi, không công bố thời gian cố định khi chưa có cơ sở."],
 ["Tôi có được quản lý website sau bàn giao không?","Quyền quản trị, tài liệu, tài khoản hosting/domain và quyền sở hữu mã nguồn hoặc thiết kế phải được ghi rõ trong thỏa thuận trước triển khai."],
 ["Athena có bảo trì sau khi hoàn thành không?","Có thể trao đổi gói bảo trì hoặc hỗ trợ sau bàn giao. Thời hạn, nội dung hỗ trợ và chi phí phụ thuộc từng thỏa thuận; không ngầm bao gồm mọi yêu cầu tương lai."],
 ["Tôi cần bảo mật dữ liệu dự án?","Không gửi mật khẩu hoặc khóa API qua biểu mẫu. Các cách chia sẻ thông tin, quyền truy cập giới hạn, NDA (nếu cần) và lưu trữ chỉ triển khai sau khi được hai bên đồng ý."],
];
export default function WorkflowPage(){
 return <div className="page-shell agency-process-page">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> CÁCH ATHENA HỢP TÁC</p>
   <h1>Làm rõ đầu ra<br/><em>trước khi bắt đầu.</em></h1>
   <div className="page-hero-lede"><p>Để khách biết mình cần chuẩn bị gì, nhận gì ở từng bước và khi nào cần đưa ra quyết định. Quy trình thực tế sẽ được điều chỉnh theo quy mô dự án và thỏa thuận.</p>
    <Link className="pill-link pill-dark" href="/lien-he">Mô tả nhu cầu <Icon name="arrow-up-right" size={19}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="agency-process-head"><p className="section-index"><span className="index-circle">01</span> TỪ YÊU CẦU ĐẾN BÀN GIAO</p>
    <h2>Sáu bước để công việc <span>có thể kiểm soát.</span></h2></div>
   <div className="agency-process-list">
    {stages.map(s=><article className="agency-process-step" key={s.n}>
     <span className="agency-process-index">{s.n}</span>
     <div><h3>{s.title}</h3><p>{s.description}</p>
      <div className="agency-process-deliverable"><Icon name="check" size={18}/><strong>Đầu ra:</strong> {s.deliverable}</div>
     </div>
     <div className="agency-process-roles"><p><strong>Khách hàng</strong>{s.customer}</p><p><strong>Athena</strong>{s.studio}</p></div>
    </article>)}
   </div>
  </div></section>
  <section className="page-section agency-section-muted"><div className="container">
   <p className="section-index"><span className="index-circle">02</span> MINH BẠCH THƯƠNG MẠI</p>
   <div className="agency-process-head"><h2>Không có <span>báo giá tùy tiện.</span></h2>
    <p>Giá và lịch triển khai phụ thuộc hiện trạng, số lượng trang/tính năng, tích hợp, nội dung, bàn giao và mức hỗ trợ. Không đưa ra con số rẻ nhất chỉ để thu hút khách.</p></div>
   <Link href="/bao-gia" className="agency-outline-cta">Xem cách Athena lập báo giá <Icon name="arrow-right" size={18}/></Link>
  </div></section>
  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">03</span> CÂU HỎI THƯỜNG GẶP</p>
   <h2 className="agency-faq-title">Trước khi hợp tác,<br/><span>bạn có thể muốn biết.</span></h2>
   <div className="agency-faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<Icon name="chevron-down" size={20}/></summary><p>{a}</p></details>)}</div>
  </div></section>
  <section className="agency-final-cta"><div className="container"><p>ĐÃ CÓ MỘT VẤN ĐỀ CỤ THỂ?</p><h2>Gửi tình trạng thực tế.<br/>Nhận hướng trao đổi phù hợp.</h2><Link href="/lien-he">Bắt đầu bằng yêu cầu tư vấn <Icon name="arrow-up-right" size={18}/></Link></div></section>
 </div>;
}
