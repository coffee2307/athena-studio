import {siteConfig} from "@/config/site";
import Link from "next/link";
export default function HomePage(){
 return <main className={`page-shell template-${siteConfig.variant}`}>
  <header className="site-header"><Link href="/" aria-label={`${siteConfig.name} — trang chủ`}>{siteConfig.name}</Link><nav aria-label="Điều hướng chính"><a href="#gioi-thieu">Giới thiệu</a><a href="#lien-he">Liên hệ</a></nav></header>
  <section className="hero"><p className="eyebrow">WEBSITE RIÊNG / {siteConfig.template.toUpperCase()}</p><h1>Không gian số<br/><em>của {siteConfig.name}.</em></h1><p>{siteConfig.description}</p><a className="action" href="#lien-he">Bắt đầu trao đổi ↗</a></section>
  <section className="content" id="gioi-thieu"><p className="eyebrow">NỀN TẢNG CÓ THỂ MỞ RỘNG</p><h2>Một điểm bắt đầu<br/>cho dự án riêng.</h2><p>Cấu trúc hiện tại bật các module đã chọn: {siteConfig.enabledModules.join(", ")||"chưa chọn module mở rộng"}.</p></section>
  <footer id="lien-he"><span>{siteConfig.name}</span><span>Liên hệ để bắt đầu dự án</span></footer>
 </main>;
}
