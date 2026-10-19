import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import { offerings } from "@/lib/offerings";

export function Footer() {
  return <footer className="athena-footer">
    <div className="container">
      <div className="footer-upper">
        <p className="eyebrow"><span className="eyebrow-dot"/> BẠN CÓ Ý TƯỞNG MỚI?</p>
        <div className="footer-statement">
          <h2>Hãy cùng tạo<br/><span>điều khác biệt.</span></h2>
          <Link className="footer-round-link" href="/lien-he" aria-label="Bắt đầu dự án cùng Athena"><span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="footer-middle">
        <div className="footer-identity">
          <Image src="/branding/logo-symbol-black.svg" alt="" width={62} height={62}/>
          <div><strong>ATHENA STUDIO</strong><p>Studio thiết kế và công nghệ độc lập.<br/>Tập trung vào những giải pháp có giá trị thực.</p></div>
        </div>
        <div className="footer-links">
          <div><p>KHÁM PHÁ</p>{navigation.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}<Link href="/lien-he">Liên hệ</Link></div>
          <div><p>GIẢI PHÁP</p>{offerings.map(s => <Link key={s.slug} href={"/dich-vu/" + s.slug}>{s.shortTitle}</Link>)}</div>
        </div>
      </div>
      <nav className="footer-legal" aria-label="Thông tin pháp lý"><Link href="/phap-ly">Pháp lý</Link><Link href="/phap-ly/quyen-rieng-tu">Quyền riêng tư</Link><Link href="/phap-ly/dieu-khoan">Điều khoản</Link><Link href="/phap-ly/cookie">Cookie</Link></nav>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ATHENA STUDIO</span><span>Thiết kế tại Việt Nam · Hợp tác không giới hạn địa lý</span><a href="mailto:coffee2307@gmail.com">coffee2307@gmail.com ↗</a></div>
    </div>
  </footer>;
}
