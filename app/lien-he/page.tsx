import {createMetadata} from "@/lib/metadata";
import {ContactForm} from "@/components/forms/ContactForm";
import {siteConfig} from "@/lib/constants";
import {isInquiryEnabled} from "@/lib/inquiry/config";
export const dynamic="force-dynamic";
export const metadata=createMetadata("Liên hệ","Liên hệ Athena Studio để trao đổi về website, chăm sóc website, tích hợp AI hoặc Micro-SaaS.","/lien-he");
export default function ContactPage(){
 const configured=isInquiryEnabled();
 return <div className="page-shell"><section className="page-hero"><div className="container">
  <p className="page-kicker"><span className="eyebrow-dot"/> BẮT ĐẦU MỘT CUỘC TRÒ CHUYỆN</p>
  <h1>Bạn có<br/><em>một ý tưởng?</em></h1>
  <div className="page-hero-lede"><p>Hãy chia sẻ vấn đề bạn muốn giải quyết. Chúng ta có thể cùng tìm hướng đi phù hợp trước khi bàn đến công nghệ.</p></div>
 </div></section>
 <section className="page-section"><div className="container contact-area">
  <div><p className="section-index"><span className="index-circle">01</span> THÔNG TIN LIÊN HỆ</p>
   <h2 style={{marginTop:27}}>Câu chuyện bắt đầu từ đây.</h2>
   <p className="contact-note">Dù bạn cần website mới, chăm sóc hệ thống đang vận hành hay tìm hướng tích hợp AI, Athena luôn bắt đầu bằng việc lắng nghe.</p>
   <div className="contact-grid"><div><span>EMAIL</span><strong><a href={"mailto:"+siteConfig.email}>{siteConfig.email}</a></strong></div>
   <div><span>ĐIỆN THOẠI</span><strong><a href="tel:+84965747147">{siteConfig.phone}</a></strong></div></div>
   <div className="contact-social"><a href="https://zalo.me/0965747147" target="_blank" rel="noopener noreferrer">Nhắn qua Zalo ↗</a><a href="https://wa.me/84965747147" target="_blank" rel="noopener noreferrer">Nhắn qua WhatsApp ↗</a></div>
   <p className="contact-note" style={{fontSize:12}}>Các liên kết nhắn tin chỉ hoạt động nếu có tài khoản tương ứng trên số này.</p>
   <div className="intake-steps"><p className="small-index">QUY TRÌNH TIẾP NHẬN</p>
   <div><span>01</span><p>Gửi thông tin cơ bản và nhu cầu.</p></div><div><span>02</span><p>Athena xem xét phạm vi và phản hồi.</p></div>
   <div><span>03</span><p>Trao đổi phương án và báo giá riêng khi phù hợp.</p></div></div>
  </div>
  <ContactForm configured={configured} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY||""} contactEmail={siteConfig.email}/>
 </div></section></div>;
}
