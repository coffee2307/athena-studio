import type {ReactNode} from "react";
import Link from "next/link";
export function AuthShell({children}:{children:ReactNode}){
 return <div className="page-shell auth-page">
  <div className="container auth-layout">
   <aside className="auth-aside">
    <Link href="/" className="auth-back">← Quay về Athena</Link>
    <div><p className="small-index">ATHENA STUDIO / NỀN TẢNG KHÁCH HÀNG</p>
      <h2>Ý tưởng lớn.<br/><em>Kết nối đúng.</em></h2>
      <p>Không gian làm việc dành cho những dự án được xây dựng bằng tư duy, thiết kế và công nghệ.</p></div>
    <span className="auth-aside-end">ATHENA / PHIÊN BẢN ĐANG PHÁT TRIỂN</span>
   </aside>
   <div className="auth-content">{children}</div>
  </div>
 </div>;
}
