import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {requireUser,verifiedRole} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {saveProfile,signOut,signOutEverywhere} from "@/lib/auth/actions";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Hồ sơ tài khoản"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function Account({searchParams}:Props){
 const user=await requireUser();
 const client=await serverAuthClient();
 const {data:profile}=await client!.from("athena_profiles").select("display_name").eq("id",user.id).maybeSingle();
 const role=await verifiedRole(user.id);
 const {notice}=await searchParams;
 const state:{[name:string]:string}={
  saved:"Đã lưu thông tin hồ sơ.",invalid:"Tên hiển thị phải có từ 2 đến 80 ký tự.",
  error:"Chưa lưu được hồ sơ. Vui lòng kiểm tra cấu hình cơ sở dữ liệu.",
  denied:"Tài khoản chưa được cấp quyền quản trị."};
 return <div className="page-shell account-page"><div className="container">
  <div className="account-top"><span className="page-kicker">ATHENA / TÀI KHOẢN ĐÃ XÁC MINH</span><form action={signOut}><button type="submit" className="auth-signout">Đăng xuất ↗</button></form></div>
  <h1>Không gian<br/><em>của bạn.</em></h1>
  <p className="account-lede">Bạn có thể quản lý hồ sơ cá nhân. Các tính năng theo dõi dự án, trao đổi và tài liệu khách hàng sẽ được triển khai trong giai đoạn tiếp theo.</p>
  {notice&&state[notice]&&<p className="auth-notice" role="status">{state[notice]}</p>}
  <div className="account-grid">
   <section className="account-section"><p className="small-index">01 / HỒ SƠ</p><h2>Thông tin của bạn</h2>
    <form action={saveProfile} className="auth-form"><label>Tên hiển thị<input name="display_name" defaultValue={profile?.display_name||""} required minLength={2} maxLength={80} autoComplete="name"/></label>
    <label>Email đã xác minh<input value={user.email||""} disabled readOnly/></label>
    <button className="pill-link pill-dark auth-submit" type="submit">Lưu thay đổi ↗</button></form>
    <Link href="/tai-khoan/doi-mat-khau" className="auth-text-link">Đổi mật khẩu ↗</Link>
    <form action={signOutEverywhere} className="account-signout-all"><button type="submit" className="auth-signout">Đăng xuất khỏi mọi thiết bị ↗</button></form>
   </section>
   <section className="account-section account-status"><p className="small-index">02 / QUYỀN TRUY CẬP</p><h2>Không gian làm việc</h2>
    <div className="role-chip">{role==="admin"?"Quản trị viên Athena":role==="client"?"Khách hàng được mời":"Chưa được phân quyền dự án"}</div>
    <p>Quyền truy cập được xác thực từ bảng thành viên nội bộ, không dựa vào thông tin hồ sơ do người dùng tự chỉnh sửa.</p>
    {role==="admin"&&<Link href="/quan-tri" className="auth-text-link">Đến khu vực quản trị ↗</Link>}
    <div className="account-pending"><span>HỆ THỐNG DỰ ÁN</span><strong>Đang phát triển</strong><p>Chưa có dự án, hóa đơn hoặc dữ liệu khách hàng giả được cung cấp.</p></div>
   </section>
  </div>
 </div></div>;
}
