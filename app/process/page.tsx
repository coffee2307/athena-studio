import {ProcessBlueprint} from "@/components/experience/ProcessBlueprint";
import {ProcessJourney} from "@/components/experience/ProcessJourney";
import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata(
 "Quy trình làm việc",
 "Quy trình hợp tác với Athena Studio: tiếp nhận yêu cầu, khảo sát, thống nhất phạm vi, triển khai, kiểm thử, bàn giao và hỗ trợ sau bàn giao.",
 "/process"
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
 return <main className="dna04-process">
  <section className="dna04-process-intro"><div className="container"><div className="dna04-process-index"><span>ATHENA / THE WORKING METHOD</span><span>EST. BY PROBLEM, NOT BY TEMPLATE</span></div>
   <div className="dna04-process-intro-grid"><div><p>THE MAKING OF AN IDEA</p><h1>Từ một<br/><em>câu hỏi.</em><br/>Đến sản phẩm.</h1></div><div className="dna04-process-intro-aside"><div className="dna04-process-track" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div><p>Chúng tôi không mở đầu bằng một mẫu giao diện. Trước tiên cần hiểu vấn đề, thống nhất đầu ra, rồi từng bước xây dựng và kiểm chứng.</p><a href="#journey">Khám phá sáu bước <span aria-hidden="true">↓</span></a></div></div>
  </div></section>
  <section id="journey" className="dna04-process-journey"><div className="container"><ProcessBlueprint stages={stages}/></div></section>
  <section className="dna04-process-commercial"><div className="container"><span>BEFORE WE START / A CLEAR AGREEMENT</span><div><h2>Không có<br/><em>chi phí mơ hồ.</em></h2><p>Mỗi báo giá dựa trên phạm vi, mức độ phức tạp, tích hợp, nội dung, tiêu chí nghiệm thu và phương án hỗ trợ. Không tự phát sinh công việc có phí khi chưa được xác nhận.</p><Link href="/pricing">Cách Athena xây dựng báo giá →</Link></div></div></section>
  <section className="dna04-process-questions"><div className="container"><div className="dna04-section-heading"><span>THE QUESTIONS / 06</span><h2>Trước khi hợp tác,<br/><em>bạn nên biết.</em></h2></div><div className="dna04-process-accordion">{faqs.map(([q,a],i)=><details key={q}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}<b aria-hidden="true">+</b></summary><p>{a}</p></details>)}</div></div></section>
  <section className="dna04-process-ending"><div className="container"><span>THE NEXT STEP IS YOURS</span><h2>Hãy gửi vấn đề.<br/><em>Chúng tôi giúp làm rõ hướng đi.</em></h2><Link href="/contact">Bắt đầu bằng cuộc trao đổi →</Link></div></section>
 </main>;
}
