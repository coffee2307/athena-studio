import type {ReactNode} from "react";
import Link from "next/link";
import Image from "next/image";

export function AuthShell({children}:{children:ReactNode}){
 return <div className="athena-auth-screen">
  <section className="athena-auth-card" aria-label="Tài khoản Athena Studio">
   <div className="athena-auth-card-top">
    <Link href="/" className="athena-auth-brand" aria-label="Athena Studio — về trang chủ">
     <Image src="/branding/logo-symbol-black.svg" width={37} height={37} alt=""/>
     <span>ATHENA <small>STUDIO</small></span>
    </Link>
    <Link href="/" className="athena-auth-back">Về trang chủ <span aria-hidden="true">↗</span></Link>
   </div>
   <div className="athena-auth-card-body">{children}</div>
   <div className="athena-auth-card-foot"><span>ATHENA STUDIO</span><span>THIẾT KẾ · CÔNG NGHỆ</span></div>
  </section>
 </div>;
}
