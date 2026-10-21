import {headers} from "next/headers";
import {notFound,redirect} from "next/navigation";
import Link from "next/link";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {standaloneAuth} from "@/lib/identity/server";
import {LocalSignOut} from "@/components/auth/LocalSignOut";
export const dynamic="force-dynamic";
export const metadata={title:"Tài khoản thử nghiệm — Athena",robots:{index:false,follow:false}};
export default async function AccountPreview(){
 if(!standaloneIdentityConfig()?.localPassword)notFound();
 const auth=standaloneAuth();
 if(!auth)notFound();
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user)redirect("/login");
 return <div className="page-shell auth-page"><div className="container" style={{paddingBlock:90,maxWidth:700}}>
  <p className="small-index">ATHENA / PHIÊN XÁC THỰC CỤC BỘ</p>
  <h1>Đã đăng nhập<em>.</em></h1>
  <p style={{marginBlock:20}}>Xin chào <strong>{session.user.name}</strong>.</p>
  <p>Email đăng ký: <strong>{session.user.email}</strong></p>
  <p style={{marginBlock:20,lineHeight:1.9}}>Phiên đăng nhập thực được lưu trong Better Auth và cơ sở dữ liệu SQLite cục bộ. Email chưa được xác minh. Không có quyền xem dự án khách hàng hoặc quản trị; những chức năng đó sẽ chỉ mở sau khi xác thực và phân quyền trên hạ tầng chính thức.</p>
  <LocalSignOut/>
  <p style={{marginTop:24}}><Link href="/">← Về trang chủ Athena</Link></p>
 </div></div>;
}
