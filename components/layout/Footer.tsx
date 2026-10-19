import Link from "next/link";
import { navigation } from "@/data/navigation";
import { offerings } from "@/lib/offerings";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="athena-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-heading">
            <p className="micro-label"><span className="signal-dot" /> HAVE SOMETHING IN MIND?</p>
            <h2>Hãy tạo nên<br /><em>điều tiếp theo.</em></h2>
            <Link href="/contact" className="footer-big-link">Bắt đầu cùng Athena <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="footer-side"><div className="foot-col"><p className="foot-label">KHÁM PHÁ</p>{navigation.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}<Link href="/contact">Liên hệ</Link></div><div className="foot-col"><p className="foot-label">CHUYÊN MÔN</p>{offerings.map((item) => <Link href={"/services/" + item.slug} key={item.slug}>{item.shortTitle}</Link>)}</div></div>
        </div>
        <div className="footer-bottom"><span className="footer-brand">ATHENA<span>®</span></span><span>Independent digital solutions studio.</span><span>© {new Date().getFullYear()} Athena Studio</span><span>{siteConfig.email ? <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a> : "Vietnam · Working remotely"}</span></div>
      </div>
    </footer>
  );
}
