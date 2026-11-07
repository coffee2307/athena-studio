"use client";

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {useAuthSession} from "@/components/auth/AuthSessionProvider";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";

type SessionNavigationProps = {mobile?: boolean; footer?: boolean};

export function SessionNavigation({mobile = false, footer = false}: SessionNavigationProps) {
 const session = useAuthSession();
 const {language} = useAthenaLanguage();
 const en = language === "en";
 const signIn = en ? "Sign In" : "Đăng nhập";
 const signUp = en ? "Sign Up" : "Đăng ký";

 if (session.status === "loading")
  return <span className={footer ? "agency-footer-auth-loading" : mobile ? "agency-auth-loading mobile" : "agency-auth-loading"} role="status"
   aria-label={en ? "Checking sign-in status" : "Đang kiểm tra phiên đăng nhập"}>
   {mobile || footer ? (en ? "Checking account…" : "Đang kiểm tra tài khoản…") : null}
  </span>;

 if (session.status === "authenticated") {
  const initials = session.name ? Array.from(session.name)[0].toLocaleUpperCase("vi") : "A";
  return <Link href="/profile" className={footer ? "agency-footer-profile" : mobile ? "agency-mobile-profile" : "agency-profile-link"}
   aria-label={en ? "My Profile" : "Hồ sơ cá nhân"} title={session.name || (en ? "My Profile" : "Hồ sơ cá nhân")}>
   <span className="agency-profile-avatar" aria-hidden="true">{initials}</span>
   <span>{en ? "Profile" : "Hồ sơ"}</span>
  </Link>;
 }

 if (footer) return <div className="agency-footer-account-actions" aria-label={en ? "Account" : "Tài khoản"}>
  <Link className="agency-footer-auth-button agency-footer-signin" href="/login">
   <FontAwesomeIcon icon={faUser} aria-hidden="true"/><span>{signIn}</span>
  </Link>
  <Link className="agency-footer-auth-button agency-footer-signup" href="/signup">
   <FontAwesomeIcon icon={faUserPlus} aria-hidden="true"/><span>{signUp}</span>
  </Link>
 </div>;

 return mobile
  ? <>
   <Link className="agency-mobile-signin" href="/login"><FontAwesomeIcon icon={faUser} aria-hidden="true"/><span>{signIn}</span></Link>
   <Link className="agency-mobile-signup" href="/signup"><FontAwesomeIcon icon={faUserPlus} aria-hidden="true"/><span>{signUp}</span></Link>
  </>
  : <>
   <Link className="agency-auth-link" href="/login"><FontAwesomeIcon icon={faUser} aria-hidden="true"/><span>{signIn}</span></Link>
   <Link className="agency-register-link" href="/signup"><FontAwesomeIcon icon={faUserPlus} aria-hidden="true"/><span>{signUp}</span></Link>
  </>;
}
