import Link from "next/link";
import {createMetadata} from "@/lib/metadata";
import {requireAdmin} from "@/lib/auth/authorization";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Khu vực quản trị"),robots:{index:false,follow:false}};
export default async function Admin(){
 await requireAdmin();
 return <div className="page-shell account-page"><div className="container">
  <p className="page-kicker">ATHENA / QUẢN TRỊ XÁC MINH</p>
  <h1>Quản trị<br/><em>trong kiểm soát.</em></h1>
  <p className="account-lede">Danh tính đã được đối chiếu với quyền quản trị trong database. Chức năng quản lý khách hàng, phân quyền thành viên, dự án và tài liệu chưa được bật; đây không phải dashboard dữ liệu thật.</p>
  <div className="auth-info"><span>TRẠNG THÁI VẬN HÀNH</span><strong>Giao diện quản trị đang được phát triển</strong><p>Mọi thay đổi vai trò hiện phải do người vận hành có quyền cao thực hiện và ghi nhận qua cơ sở dữ liệu bảo mật.</p></div>
  <Link className="pill-link pill-dark" href="/tai-khoan">Về hồ sơ cá nhân ↗</Link>
 </div></div>;
}
