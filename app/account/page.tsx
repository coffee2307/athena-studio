import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {requireUser,verifiedRole} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {saveProfile,signOut,signOutEverywhere} from "@/lib/auth/actions";
import {readNotification} from "@/lib/operations/actions";
import {operationsEnabled} from "@/lib/operations/access";
import {formatDate} from "@/lib/operations/models";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Hồ sơ tài khoản"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function Account({searchParams}:Props){
 const user=await requireUser();
 const client=await serverAuthClient();
 const opsOn=operationsEnabled();
 const [{data:profile},notifications,role]=await Promise.all([
  client!.from("athena_profiles").select("display_name").eq("id",user.id).maybeSingle(),
  opsOn?client!.from("athena_notifications").select("id,message,project_id,is_read,created_at").order("created_at",{ascending:false}).limit(15):Promise.resolve({data:[],error:null}),
  verifiedRole(user.id)
 ]);
 const {notice}=await searchParams;
 const state:Record<string,string>={
  saved:"Đã lưu thông tin hồ sơ.",invalid:"Thông tin nhập chưa hợp lệ.",
  error:"Chưa lưu được thay đổi. Vui lòng thử lại.",
  denied:"Tài khoản chưa được cấp quyền quản trị.",
  read:"Đã đánh dấu thông báo là đã đọc."
 };
 return <div className="page-shell account-page"><div className="container">
  <div className="account-top"><span className="page-kicker">ATHENA / TÀI KHOẢN ĐÃ XÁC MINH</span><form action={signOut}><button type="submit" className="auth-signout">Đăng xuất </button></form></div>
  <h1>Không gian<br/><em>của bạn.</em></h1>
  <p className="account-lede">Hồ sơ cá nhân, dự án và trao đổi hỗ trợ được giới hạn theo quyền truy cập thực tế của tài khoản.</p>
  {notice&&state[notice]&&<p className="auth-notice" role="status">{state[notice]}</p>}
  <div className="account-grid">
   <section className="account-section"><p className="small-index">01 / HỒ SƠ</p><h2>Thông tin của bạn</h2>
    <form action={saveProfile} className="auth-form"><label>Tên hiển thị<input name="display_name" defaultValue={profile?.display_name||""} required minLength={2} maxLength={80} autoComplete="name"/></label>
    <label>Email đã xác minh<input value={user.email||""} disabled readOnly/></label>
    <button className="pill-link pill-dark auth-submit" type="submit">Lưu thay đổi </button></form>
    <Link href="/account/change-password" className="auth-text-link">Đổi mật khẩu </Link>
    <form action={signOutEverywhere} className="account-signout-all"><button type="submit" className="auth-signout">Đăng xuất khỏi mọi thiết bị </button></form>
   </section>
   <section className="account-section account-status"><p className="small-index">02 / QUYỀN TRUY CẬP</p><h2>Không gian làm việc</h2>
    <div className="role-chip">{role==="admin"?"Quản trị viên Athena":role==="client"?"Khách hàng được mời":"Chưa được phân quyền dự án"}</div>
    <p>Quyền truy cập được kiểm tra từ bảng thành viên, không dựa vào thông tin mà người dùng tự chỉnh sửa.</p>
    {role==="admin"&&<Link href="/admin" className="auth-text-link">Đến bảng điều hành </Link>}
    <div className="account-pending"><span>HỆ THỐNG DỰ ÁN</span><strong>Dự án và hỗ trợ</strong>
     <p>{opsOn?"Xem cột mốc, tiến độ, tài liệu riêng tư và trao đổi được phân quyền.":"Chưa kích hoạt chức năng dự án vì hệ thống dữ liệu và quyền truy cập cần kiểm định đầy đủ trước khi mở."}</p>
     {opsOn&&<><Link className="auth-text-link" href="/account/projects">Dự án của bạn </Link>
      <Link className="auth-text-link" href="/account/support">Yêu cầu hỗ trợ </Link></>}
    </div>
   </section>
  </div>
  <section className="account-notifications" aria-labelledby="notifications-heading">
   <p className="small-index">03 / CẬP NHẬT</p>
   <h2 id="notifications-heading">Thông báo dự án.</h2>
   {!opsOn?<p className="account-notification-empty">Thông báo dự án chưa được kích hoạt.</p>:notifications.error?<div role="alert" className="ops-error">Chưa thể tải thông báo lúc này. Vui lòng thử lại.</div>:
    !notifications.data?.length?<p className="account-notification-empty">Chưa có thông báo từ những dự án được phân quyền.</p>:
    <div className="ops-simple-list">{notifications.data.map(n=><article className="account-notification" key={n.id}>
     <div><p>{n.message}</p><small>{formatDate(n.created_at)}</small><Link className="auth-text-link" href={"/account/projects/"+n.project_id}>Xem dự án </Link></div>
     {n.is_read?<span className="ops-status">Đã xem</span>:
      <form action={readNotification}><input type="hidden" name="id" value={n.id}/><button type="submit" className="auth-signout">Đánh dấu đã đọc</button></form>}
    </article>)}</div>}
  </section>
 </div></div>;
}
