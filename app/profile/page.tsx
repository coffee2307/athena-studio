import {headers} from "next/headers";
import {redirect,notFound} from "next/navigation";
import Link from "next/link";
import {standaloneAuth} from "@/lib/identity/server";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {ProfileEditor} from "@/components/auth/ProfileEditor";
import {GitHubRepositoryPanel} from "@/components/auth/GitHubRepositoryPanel";
import {LocalSignOut} from "@/components/auth/LocalSignOut";

export const dynamic="force-dynamic";
export const metadata={title:"Hồ sơ của tôi — Athena Studio",robots:{index:false,follow:false}};
function formattedDate(value:Date|string|undefined){
 if(!value)return null;
 const d=new Date(value);
 if(Number.isNaN(d.valueOf()))return null;
 return new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d);
}
export default async function Profile(){
 if(!standaloneIdentityConfig())notFound();
 const auth=standaloneAuth();
 if(!auth)notFound();
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user)redirect("/login?next=%2Fprofile");
 const user=session.user;
 const initials=Array.from(user.name||user.email||"A")[0].toLocaleUpperCase("vi");
 const memberSince=formattedDate(user.createdAt);
 return <div className="athena-profile-page">
  <div className="container athena-profile-wrap">
   <div className="athena-profile-breadcrumb"><Link href="/">ATHENA STUDIO</Link><span aria-hidden="true">/</span><span>Tài khoản của tôi</span></div>
   <section className="athena-profile-hero" aria-labelledby="athena-profile-title">
    <div className="athena-profile-hero-top">
     <span className="athena-profile-eyebrow"><span className="athena-profile-led" aria-hidden="true"/> KHÔNG GIAN CÁ NHÂN</span>
     <LocalSignOut/>
    </div>
    <div className="athena-profile-hero-main">
     <div className="athena-profile-large-avatar" aria-hidden="true">{initials}</div>
     <div className="athena-profile-identity">
      <p>RẤT VUI ĐƯỢC GẶP BẠN</p>
      <h1 id="athena-profile-title">{user.name}</h1>
      <span>{user.email}</span>
     </div>
    </div>
    <div className="athena-profile-hero-bottom">
     <span><span aria-hidden="true">◈</span> Tài khoản cá nhân</span>
     <span>{memberSince?"Tham gia ngày "+memberSince:"Athena Studio"}</span>
    </div>
   </section>
   <nav className="athena-profile-tabs" aria-label="Mục hồ sơ">
    <a href="#personal-information">Thông tin cá nhân <span aria-hidden="true">↗</span></a>
    <a href="#account-security">Tài khoản & bảo mật <span aria-hidden="true">↗</span></a>
   </nav>
   <div className="athena-profile-grid">
    <section className="athena-profile-card" id="personal-information" aria-labelledby="personal-heading">
     <p className="athena-profile-section-number">01 / THÔNG TIN CÁ NHÂN</p>
     <h2 id="personal-heading">Chỉnh sửa hồ sơ<span>.</span></h2>
     <p className="athena-profile-card-lead">Thông tin này giúp Athena nhận diện bạn khi trao đổi và hỗ trợ.</p>
     <ProfileEditor name={user.name}/>
    </section>
    <section className="athena-profile-card athena-profile-card-muted" id="account-security" aria-labelledby="security-heading">
      <p className="athena-profile-section-number">02 / TÀI KHOẢN & BẢO MẬT</p>
      <h2 id="security-heading">Trạng thái tài khoản<span>.</span></h2>
      <div className="athena-profile-field"><span>Địa chỉ email</span><strong>{user.email}</strong></div>
      <div className="athena-profile-field"><span>Xác minh email</span><strong className={user.emailVerified?"athena-profile-verified":"athena-profile-unverified"}><span aria-hidden="true">●</span> {user.emailVerified?"Đã xác minh":"Chưa xác minh"}</strong></div>
      <div className="athena-profile-field"><span>Quyền truy cập</span><strong>Cá nhân · Chưa cấp quyền dự án</strong></div>
     </section>
     <GitHubRepositoryPanel/>
      <section className="athena-profile-support" aria-labelledby="project-heading">
      <div className="athena-profile-support-icon" aria-hidden="true">↗</div>
      <p className="athena-profile-section-number">03 / DỰ ÁN VÀ HỖ TRỢ</p>
      <h2 id="project-heading">Bắt đầu một<br/>dự án mới?</h2>
      <p>Không gian dự án khách hàng chưa được kích hoạt trên bản thử nghiệm. Bạn vẫn có thể trao đổi trực tiếp với Athena về nhu cầu của mình.</p>
      <Link href="/contact">Trao đổi với Athena <span aria-hidden="true">↗</span></Link>
     </section>
   </div>
   <div className="athena-profile-disclaimer"><span aria-hidden="true">●</span> Môi trường thử nghiệm nội bộ · Chưa mở quyền truy cập dự án khách hàng</div>
  </div>
 </div>;
}
