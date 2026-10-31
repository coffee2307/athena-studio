"use client";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Icon} from "@/components/ui/Icon";
const pages=[
 {href:"/",label:"Trang chủ"},
 {href:"/services",label:"Dịch vụ"},
 {href:"/services/web-development/templates",label:"Mẫu website"},
 {href:"/projects",label:"Dự án"},
 {href:"/contact",label:"Liên hệ"}
];
export function AuthNavigation(){
 const path=usePathname();
 const next=path==="/signup"?{href:"/login",label:"Đăng nhập"}:{href:"/signup",label:"Tạo tài khoản"};
 return <header className="auth-navigation">
  <div className="container auth-navigation-inner">
   <Link href="/" className="auth-navigation-brand" aria-label="Athena Studio — Trang chủ">
    <Image src="/branding/logo-symbol-black.svg" width={38} height={38} alt=""/>
    <span>ATHENA <b>STUDIO</b></span>
   </Link>
   <nav className="auth-navigation-links" aria-label="Điều hướng trên trang tài khoản">
    {pages.map(page=><Link key={page.href} href={page.href}>{page.label}</Link>)}
   </nav>
   <Link href={next.href} className="auth-navigation-switch">{next.label}<Icon name="arrow-right" size={15}/></Link>
   <details className="auth-navigation-mobile">
    <summary aria-label="Mở điều hướng trang tài khoản"><Icon name="menu" size={20}/><span>Menu</span></summary>
    <nav aria-label="Điều hướng tài khoản trên điện thoại">
     {pages.map(page=><Link key={page.href} href={page.href}>{page.label}<Icon name="arrow-right" size={16}/></Link>)}
     <Link href={next.href} className="auth-navigation-mobile-action">{next.label}<Icon name="arrow-right" size={16}/></Link>
    </nav>
   </details>
  </div>
 </header>;
}
