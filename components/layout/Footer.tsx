import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return <footer className="site-footer"><div className="page-container footer-grid"><div><Image className="footer-logo" src="/branding/logo-wordmark-white.svg" alt="Athena" width={112} height={112} /><p className="small footer-muted">Digital Product Studio</p></div><div><p className="eyebrow">Navigation</p><nav className="footer-nav" aria-label="Footer navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></div><div><p className="eyebrow">Start a conversation</p><a className="footer-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div><div className="page-container footer-bottom"><span className="small">© {new Date().getFullYear()} Athena Studio</span><span className="small">Made with intent</span></div></footer>;
}
