"use client";
import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {useAuthSession} from "@/components/auth/AuthSessionProvider";
export function SessionNavigation({mobile=false}:{mobile?:boolean}){
 const session=useAuthSession();
 if(session.status==="loading")return <span className={mobile?"agency-auth-loading mobile":"agency-auth-loading"} aria-label="Đang kiểm tra phiên đăng nhập"/>;
 if(session.status==="authenticated"){
  const initials=session.name?Array.from(session.name)[0].toLocaleUpperCase("vi"):"A";
  return <Link href="/profile" className={mobile?"agency-mobile-profile":"agency-profile-link"} aria-label="Hồ sơ cá nhân" title={session.name||"Hồ sơ cá nhân"}>
   <span className="agency-profile-avatar" aria-hidden="true">{initials}</span>
   <span>Hồ sơ</span>
  </Link>;
 }
 return mobile
  ? <><Link className="agency-mobile-signin" href="/login"><Icon name="user" size={17}/> Đăng nhập</Link><Link className="agency-mobile-signup" href="/signup">Đăng ký <Icon name="arrow-up-right" size={16}/></Link></>
  : <><Link className="agency-auth-link" href="/login"><Icon name="user" size={17}/> Đăng nhập</Link><Link className="agency-register-link" href="/signup">Đăng ký</Link></>;
}
