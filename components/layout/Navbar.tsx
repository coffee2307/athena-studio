"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import {authSettings} from "@/lib/auth/config";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keydown);
    };
  }, [open]);

  return <header className="athena-header" ref={headerRef}>
    <div className="container nav-shell">
      <Link href="/" aria-label="Athena Studio — Trang chủ" className="brand-lockup">
        <span className="brand-symbol"><Image src="/branding/logo-symbol-black.svg" alt="" width={52} height={52} priority /></span>
        <span className="brand-wordmark">ATHENA<span>STUDIO</span></span>
      </Link>
      <nav className={open ? "nav-links nav-links-open" : "nav-links"} id="primary-nav" aria-label="Điều hướng chính">
        {navigation.map(item => <Link href={item.href} key={item.href} className={pathname === item.href ? "nav-current" : ""}>{item.label}</Link>)}
        {authSettings().enabled&&<Link href="/dang-nhap">Tài khoản</Link>}
        <Link className="nav-mobile-contact" href="/lien-he">Liên hệ hợp tác <span aria-hidden="true">↗</span></Link>
      </nav>
      {authSettings().enabled&&<Link href="/dang-nhap" className="nav-account">Tài khoản ↗</Link>}
      <Link href="/lien-he" className="nav-contact"><span>Gửi nhu cầu</span><span aria-hidden="true">↗</span></Link>
      <button type="button" className={open ? "mobile-toggle toggle-open" : "mobile-toggle"} aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
        <span/><span/>
      </button>
    </div>
  </header>;
}
