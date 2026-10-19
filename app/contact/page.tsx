import { createMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/constants";

export const metadata = createMetadata("Liên hệ", "Trao đổi với Athena Studio về website, Website Care, tích hợp AI và Micro-SaaS.");

export default function ContactPage() {
 const configured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL && process.env.CONTACT_FROM_EMAIL);
 return <div className="page-shell"><section className="page-hero"><div className="container"><p className="page-kicker"><span className="signal-dot" /> START A CONVERSATION</p><h1>Let&apos;s make<br /><em>it happen.</em></h1><div className="page-hero-lede"><p>Cho chúng tôi biết bạn đang xây dựng điều gì. Hãy bắt đầu từ bài toán cần giải quyết — những chi tiết kỹ thuật có thể cùng làm rõ sau.</p></div></div></section>
 <section className="page-section"><div className="container contact-area"><div><p className="section-index"><span className="index-circle">01</span> GET IN TOUCH</p><h2 style={{marginTop:28}}>Every great<br /><em>project starts here.</em></h2><p className="contact-note">Dù là một website mới, hệ thống cần chăm sóc hay một quy trình muốn ứng dụng AI, Athena sẽ cùng bạn xác định bước tiếp theo phù hợp.</p><div className="contact-grid"><div><span>01 / DỊCH VỤ</span><strong>Web · Care · AI · SaaS</strong></div><div><span>02 / HÌNH THỨC</span><strong>Hợp tác từ xa</strong></div></div>{siteConfig.email && <p className="contact-note">Email: <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a></p>}</div><ContactForm configured={configured} contactEmail={siteConfig.email} /></div></section></div>;
}
