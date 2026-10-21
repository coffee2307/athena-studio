import {headers} from "next/headers";
import {redirect,notFound} from "next/navigation";
import Link from "next/link";
import {standaloneAuth} from "@/lib/identity/server";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {ProfileEditor} from "@/components/auth/ProfileEditor";
import {LocalSignOut} from "@/components/auth/LocalSignOut";
export const dynamic="force-dynamic";
export const metadata={title:"Hồ sơ của tôi — Athena Studio",robots:{index:false,follow:false}};
export default async function Profile(){
 if(!standaloneIdentityConfig())notFound();
 const auth=standaloneAuth();
 if(!auth)notFound();
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user)redirect("/login?next=%2Fprofile");
 const user=session.user;
 const initials=Array.from(user.name||user.email||"A")[0].toLocaleUpperCase("vi");
 return <div className="athena-profile-page">
  <div className="container athena-profile-wrap">
   <div className="athena-profile-top"><span className="page-kicker">ATHENA / KHÔNG GIAN CÁ NHÂN</span><LocalSignOut/></div>
   <div className="athena-profile-hero">
    <div className="athena-profile-large-avatar" aria-hidden="true">{initials}</div>
    <div><p className="small-index">TÀI KHOẢN CỦA BẠN</p><h1>Hồ sơ<span>.</span></h1><p>Xin chào, <strong>{user.name}</strong>. Quản lý thông tin tài khoản của bạn tại Athena Studio.</p></div>
   </div>
   <div className="athena-profile-grid">
    <section className="athena-profile-card">
     <p className="small-index">01 / THÔNG TIN CÁ NHÂN</p><h2>Chi tiết tài khoản</h2>
     <ProfileEditor name={user.name}/>
     <div className="athena-profile-field"><span>Email</span><strong>{user.email}</strong></div>
     <div className="athena-profile-field"><span>Trạng thái email</span><strong>{user.emailVerified?"Đã xác minh":"Chưa xác minh"}</strong></div>
    </section>
    <section className="athena-profile-card athena-profile-card-muted">
     <p className="small-index">02 / QUYỀN TRUY CẬP</p><h2>Dự án và dịch vụ</h2>
     <p>Đây là tài khoản thử nghiệm trên máy tính. Tài khoản chưa được cấp quyền truy cập dữ liệu dự án, hệ thống khách hàng hoặc quản trị Athena.</p>
     <div className="athena-profile-limited">Chưa liên kết không gian dự án</div>
     <Link href="/contact" className="athena-profile-contact-link">Trao đổi nhu cầu dịch vụ <span aria-hidden="true">↗</span></Link>
    </section>
   </div>
  </div>
 </div>;
}
