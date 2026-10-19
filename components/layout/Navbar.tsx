"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onOutside = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [open]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="athena-header" ref={headerRef}>
      <div className="container nav-shell">
        <Link href="/" aria-label="Athena Studio — Trang chủ" className="brand-lockup">
          <span className="brand-symbol" aria-hidden="true">A<span className="brand-symbol-dot">.</span></span>
          <span className="brand-wordmark">ATHENA<span>STUDIO</span></span>
        </Link>
        <nav className={open ? "nav-links nav-links-open" : "nav-links"} id="primary-nav" aria-label="Điều hướng chính">
          {navigation.map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-current" : ""}>{item.label}</Link>)}
          <Link className="nav-mobile-contact" href="/contact">Bắt đầu dự án <span aria-hidden="true">↗</span></Link>
        </nav>
        <Link href="/contact" className="nav-contact">Bắt đầu dự án <span aria-hidden="true">↗</span></Link>
        <button className="mobile-toggle" type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-controls="primary-nav" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="toggle-line" /><span className="toggle-line" />
        </button>
      </div>
    </header>
  );
}
