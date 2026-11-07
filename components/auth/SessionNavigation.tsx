"use client";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faKey} from "@fortawesome/free-solid-svg-icons";
import {useAuthSession} from "@/components/auth/AuthSessionProvider";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";

export function SessionNavigation({mobile=false}:{mobile?:boolean}){
 const session=useAuthSession();
 const {language}=useAthenaLanguage();
 const en=language==="en";
 if(session.status==="loading")
  return <span className={mobile?"agency-auth-loading mobile":"agency-auth-loading"} role="status"
   aria-label={en?"Checking sign-in status":"Đang kiểm tra phiên đăng nhập"}>
   {mobile?(en?"Checking account…":"Đang kiểm tra tài khoản…"):null}
  </span>;
 if(session.status==="authenticated"){
  const initials=session.name?Array.from(session.name)[0].toLocaleUpperCase("vi"):"A";
  return <Link href="/profile" className={mobile?"agency-mobile-profile":"agency-profile-link"}
   aria-label={en?"My Profile":"Hồ sơ cá nhân"} title={session.name||(en?"My Profile":"Hồ sơ cá nhân")}>
   <span className="agency-profile-avatar" aria-hidden="true">{initials}</span>
   <span>{en?"Profile":"Hồ sơ"}</span>
  </Link>;
 }
 return mobile
  ? <><Link className="agency-mobile-signin" href="/login"><FontAwesomeIcon icon={faUser} aria-hidden="true" style={{width:17,height:17}}/> {en?"Sign In":"Đăng nhập"}</Link><Link className="agency-mobile-signup" href="/signup"><FontAwesomeIcon icon={faKey} aria-hidden="true" style={{width:17,height:17}}/> {en?"Sign Up":"Đăng ký"}</Link></>
  : <><Link className="agency-auth-link" href="/login">{en?"Sign In":"Đăng nhập"}</Link><Link className="agency-register-link" href="/signup">{en?"Sign Up":"Đăng ký"}</Link></>;
}
