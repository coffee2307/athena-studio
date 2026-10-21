import Link from "next/link";
import Image from "next/image";
import {navigation} from "@/data/navigation";
import {offerings} from "@/lib/offerings";
import {siteConfig} from "@/lib/constants";
import {contactChannels} from "@/lib/contact-channels";
import {Icon} from "@/components/ui/Icon";

export function Footer(){
 return <footer className="athena-footer agency-footer">
  <div className="container">
   <div className="agency-footer-cta">
    <div><p className="eyebrow"><span className="eyebrow-dot"/> TRAO ĐỔI NHU CẦU WEBSITE HOẶC TỰ ĐỘNG HÓA</p>
     <h2>Cần một giải pháp<br/><span>phù hợp với bạn?</span></h2>
     <p>Gửi vấn đề đang gặp, website hiện tại nếu có và kết quả mong muốn. Athena sẽ trao đổi khả năng thực hiện và phạm vi trước khi chốt báo giá.</p></div>
    <Link href="/lien-he" className="agency-footer-cta-button">Gửi yêu cầu tư vấn <Icon name="arrow-up-right" size={20}/></Link>
   </div>
   <div className="agency-footer-main">
    <div className="agency-footer-brand">
     <Link href="/" className="agency-footer-brand-lockup">
      <Image src="/branding/logo-symbol-black.svg" width={52} height={52} alt=""/>
      <span>ATHENA <small>STUDIO</small></span>
     </Link>
     <p>Thiết kế website, chăm sóc vận hành và thử nghiệm ứng dụng AI cho quy trình doanh nghiệp. Một đầu mối để trao đổi từ khảo sát đến bàn giao.</p>
     <div className="agency-footer-contact">
      <a href={contactChannels.phone}><Icon name="phone" size={18}/>{siteConfig.phone}</a>
      <a href={contactChannels.email}><Icon name="mail" size={18}/>{siteConfig.email}</a>
      {contactChannels.zalo&&<a href={contactChannels.zalo} target="_blank" rel="noopener noreferrer"><Icon name="message" size={18}/>Chat Zalo</a>}
      {contactChannels.whatsapp&&<a href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="message" size={18}/>WhatsApp</a>}
     </div>
    </div>
    <div className="agency-footer-column"><h3>KHÁM PHÁ</h3>
     {navigation.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}
     <Link href="/lien-he">Liên hệ</Link>
    </div>
    <div className="agency-footer-column"><h3>GIẢI PHÁP</h3>
     {offerings.filter(s=>s.slug!=="micro-saas").map(s=><Link key={s.slug} href={"/dich-vu/"+s.slug}>{s.shortTitle}</Link>)}
     <Link href="/san-pham">Product Lab · Đang nghiên cứu</Link>
    </div>
    <div className="agency-footer-column"><h3>HỖ TRỢ</h3>
     <Link href="/quy-trinh">Quy trình hợp tác</Link>
     <Link href="/bao-gia">Cách lập báo giá</Link>
     <Link href="/dang-nhap">Đăng nhập</Link>
     <Link href="/dang-ky">Đăng ký</Link>
     <Link href="/phap-ly/quyen-rieng-tu">Quyền riêng tư</Link>
     <Link href="/phap-ly/dieu-khoan">Điều khoản sử dụng</Link>
     <Link href="/phap-ly/chinh-sach-dich-vu">Chính sách dịch vụ</Link>
     <Link href="/phap-ly/cookie">Cookie</Link>
    </div>
   </div>
   <div className="agency-footer-bottom">
    <span>© {new Date().getFullYear()} Athena Studio · Thiết kế và công nghệ độc lập</span>
    <span>Thông tin dự án được phân loại theo nguồn gốc và quyền công bố</span>
    <Link href="/phap-ly">Thông tin pháp lý <Icon name="arrow-right" size={14}/></Link>
   </div>
  </div>
 </footer>;
}
