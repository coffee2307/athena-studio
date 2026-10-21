import Link from "next/link";
export function AuthUnavailable(){
 return <div className="auth-panel auth-unavailable">
  <p className="small-index">ATHENA / TÀI KHOẢN</p>
  <h1>Đang hoàn thiện<em>.</em></h1>
  <p className="auth-description">Hệ thống tài khoản chưa được kích hoạt vì dịch vụ xác thực và các điều kiện bảo mật cần được cấu hình, kiểm định trước. Hiện chưa thể đăng ký hoặc đăng nhập.</p>
  <div className="auth-info">
   <span>TRẠNG THÁI</span>
   <strong>Chưa tiếp nhận đăng ký</strong>
   <p>Không có dữ liệu tài khoản giả, phiên đăng nhập mô phỏng hoặc quyền truy cập không được xác minh.</p>
  </div>
  <Link className="pill-link pill-dark" href="/contact">Liên hệ Athena ↗</Link>
 </div>;
}
