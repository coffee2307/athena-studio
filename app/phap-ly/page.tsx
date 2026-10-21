import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {Icon} from "@/components/ui/Icon";
export const metadata=createMetadata("Thông tin pháp lý","Tìm hiểu quyền riêng tư, cookie, điều khoản website và chính sách dịch vụ của Athena Studio.","/phap-ly");
const resources=[
 {href:"/phap-ly/quyen-rieng-tu",title:"Quyền riêng tư",desc:"Dữ liệu liên hệ được xử lý thế nào, quyền yêu cầu và bảo vệ thông tin dự án."},
 {href:"/phap-ly/dieu-khoan",title:"Điều khoản sử dụng",desc:"Điều kiện sử dụng website, thông tin dự án công khai, tài khoản và giới hạn trách nhiệm."},
 {href:"/phap-ly/cookie",title:"Cookie và lưu trữ",desc:"Cookie thiết yếu, cookie phiên, dịch vụ bên ngoài và cách quản lý lựa chọn trên trình duyệt."},
 {href:"/phap-ly/chinh-sach-dich-vu",title:"Chính sách dịch vụ",desc:"Khảo sát, báo giá, quyền sở hữu, nghiệm thu, bàn giao, bảo trì và chi phí bên thứ ba."}
];
export default function LegalHome(){return <div className="page-shell">
 <section className="page-hero"><div className="container"><p className="page-kicker"><span className="eyebrow-dot"/> THÔNG TIN VÀ CHÍNH SÁCH</p>
  <h1>Rõ ràng về<br/><em>quyền và trách nhiệm.</em></h1>
  <div className="page-hero-lede"><p>Trước khi liên hệ hoặc hợp tác, bạn có thể xem cách Athena tiếp nhận thông tin, mô tả dịch vụ và bàn giao sản phẩm. Nội dung về pháp nhân, lưu giữ dữ liệu và điều khoản thương mại cần được xác nhận trước khi chính thức kinh doanh.</p></div>
 </div></section>
 <section className="page-section"><div className="container">
  <div className="legal-cards">{resources.map((r,i)=><Link key={r.href} href={r.href}><span>{String(i+1).padStart(2,"0")} / CHÍNH SÁCH</span>
   <h2>{r.title}</h2><p>{r.desc}</p><strong>Đọc nội dung <Icon name="arrow-right" size={16}/></strong></Link>)}</div>
  <div className="agency-legal-disclosure"><Icon name="shield" size={22}/><p>Các trang này mô tả những gì đã triển khai và dự kiến, không được coi là tuyên bố rằng Athena đã hoàn tất mọi điều kiện pháp lý hoặc vận hành thương mại. Thông tin chưa được xác nhận sẽ không được tự suy đoán.</p></div>
 </div></section>
 </div>}
