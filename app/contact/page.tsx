import {createMetadata} from "@/lib/metadata";
import {ContactForm} from "@/components/forms/ContactForm";
import {siteConfig} from "@/lib/constants";
import {contactChannels} from "@/lib/contact-channels";
import {Icon} from "@/components/ui/Icon";
import {isInquiryEnabled} from "@/lib/inquiry/config";

export const dynamic="force-dynamic";
export const metadata=createMetadata("Yêu cầu tư vấn","Gửi địa chỉ website, vấn đề cần xử lý và mục tiêu của doanh nghiệp tới Athena. Liên hệ trực tiếp qua email hoặc biểu mẫu khi được kích hoạt.","/contact");

export default function ContactPage(){
 const configured=isInquiryEnabled();
 return <div className="page-shell">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> YÊU CẦU TƯ VẤN / ATHENA STUDIO</p>
   <h1>Bạn đang cần<br/><em>giải quyết điều gì?</em></h1>
   <div className="page-hero-lede"><p>Gửi thông tin cơ bản để Athena hiểu nhu cầu trước khi đề xuất công việc. Không cần tài liệu kỹ thuật hay mô tả quá dài.</p></div>
  </div></section>
  <section className="page-section"><div className="container contact-area">
   <div><p className="section-index"><span className="index-circle">01</span> CHUẨN BỊ TRƯỚC KHI LIÊN HỆ</p>
    <h2 className="contact-help-title">Ba điều giúp trao đổi nhanh hơn.</h2>
    <div className="intake-steps contact-help-steps">
     <div><span>01</span><p><strong>Hiện trạng:</strong> link website hoặc mô tả quy trình đang dùng (nếu có).</p></div>
     <div><span>02</span><p><strong>Vấn đề:</strong> điều đang chậm, lỗi, tốn thời gian hoặc khiến khách khó liên hệ.</p></div>
     <div><span>03</span><p><strong>Ưu tiên:</strong> kết quả mong muốn, thời hạn và khoảng ngân sách dự kiến nếu bạn đã xác định.</p></div>
    </div>
    <p className="contact-note">Athena sẽ xem xét nhu cầu để trao đổi hướng xử lý và phạm vi có thể thực hiện. Chi phí, tiến độ và hạng mục sẽ được thống nhất riêng; không đưa ra cam kết chưa khảo sát.</p>
    <div className="contact-grid">
     <div><span>EMAIL</span><strong><a href={"mailto:"+siteConfig.email}>{siteConfig.email}</a></strong></div>
     <div><span>ĐIỆN THOẠI</span><strong><a href="tel:+84965747147">{siteConfig.phone}</a></strong></div>
    </div>
    <div className="contact-social agency-contact-links">
     <a href={contactChannels.phone}><Icon name="phone" size={18}/> Gọi điện</a>
     <a href={contactChannels.email}><Icon name="mail" size={18}/> Gửi email</a>
     {contactChannels.zalo&&<a href={contactChannels.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo <Icon name="arrow-right" size={16}/></a>}
     {contactChannels.whatsapp&&<a href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <Icon name="arrow-right" size={16}/></a>}
    </div>

   </div>
   <ContactForm configured={configured} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY||""}/>
  </div></section>
 </div>;
}
