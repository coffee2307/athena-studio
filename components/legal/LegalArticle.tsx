import Link from "next/link";
import type {ReactNode} from "react";
export function LegalArticle({label,title,updated,children}:{label:string;title:string;updated:string;children:ReactNode}){
 return <div className="page-shell">
  <section className="page-hero legal-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> THÔNG TIN VÀ CHÍNH SÁCH</p>
   <h1>{title}<em>.</em></h1>
   <div className="page-hero-lede"><p>{label}</p><span className="legal-update">CẬP NHẬT: {updated}</span></div>
  </div></section>
  <section className="page-section"><div className="container legal-layout">
   <aside className="legal-aside"><p>PHÁP LÝ / ATHENA</p><Link href="/phap-ly">Tổng quan</Link><Link href="/phap-ly/quyen-rieng-tu">Quyền riêng tư</Link><Link href="/phap-ly/dieu-khoan">Điều khoản sử dụng</Link><Link href="/phap-ly/cookie">Cookie</Link><Link href="/phap-ly/chinh-sach-dich-vu">Chính sách dịch vụ</Link></aside>
   <article className="legal-content">
    <div className="legal-notice" role="note"><strong>Tài liệu đang được rà soát</strong><p>Đây là nội dung thông tin sơ bộ về website Athena. Trước khi vận hành thương mại và thu thập thông tin khách hàng, các chính sách phải được xác nhận theo pháp nhân, dịch vụ và hạ tầng thực tế.</p></div>
    {children}
    <p className="legal-contact">Nếu cần làm rõ nội dung, liên hệ <a href="mailto:coffee2307@gmail.com">coffee2307@gmail.com</a>.</p>
   </article>
  </div></section>
 </div>;
}
