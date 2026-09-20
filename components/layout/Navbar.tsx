"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { navigation } from "@/data/navigation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header"><div className="page-container nav-inner"><Link href="/" className="logo-link" aria-label="Athena home"><Image className="logo-wordmark" src="/branding/logo-wordmark-black.svg" alt="Athena" width={112} height={112} priority /></Link><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? "Close" : "Menu"}</span><span className="menu-icon" aria-hidden="true">{menuOpen ? "×" : "↘"}</span></button><nav id="site-navigation" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}</nav></div></header>;
}
