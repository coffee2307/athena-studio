"use client";
import {useState,type FormEvent} from "react";
import Link from "next/link";
import {browserAuthClient} from "@/lib/auth/browser";
import {allowedDestination} from "@/lib/auth/config";
type Mode="login"|"signup"|"forgot"|"password";
export function AuthPanel({mode,googleEnabled=false}:{mode:Mode;googleEnabled?:boolean}){
 const [pending,setPending]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(pending)return;
  const fields=new FormData(event.currentTarget);
  const email=String(fields.get("email")||"").trim();
  const password=String(fields.get("password")||"");
  const fullName=String(fields.get("full_name")||"").trim();
  if(mode==="signup"&&(fullName.length<2||fullName.length>80||password.length<12)){
   setError(true);setMessage("Vui lòng nhập họ tên 2–80 ký tự và mật khẩu tối thiểu 12 ký tự.");return;
  }
  if(mode==="password"&&password.length<12){
   setError(true);setMessage("Mật khẩu mới phải có ít nhất 12 ký tự.");return;
  }
  setPending(true);setMessage("");setError(false);
  try{
   const client=browserAuthClient();
   if(mode==="login"){
    const r=await client.auth.signInWithPassword({email,password});
    if(r.error)throw r.error;
    window.location.assign("/tai-khoan");return;
   }
   if(mode==="signup"){
    const r=await client.auth.signUp({email,password,options:{
     data:{full_name:fullName},
     emailRedirectTo:window.location.origin+"/auth/callback?next="+encodeURIComponent("/tai-khoan")
    }});
    if(r.error)throw r.error;
    setMessage("Nếu địa chỉ hợp lệ, hãy kiểm tra hộp thư để xác minh tài khoản trước khi sử dụng.");
   }
   if(mode==="forgot"){
    const r=await client.auth.resetPasswordForEmail(email,{
     redirectTo:window.location.origin+"/auth/callback?next="+encodeURIComponent("/tai-khoan/doi-mat-khau")
    });
    if(r.error)throw r.error;
    setMessage("Nếu địa chỉ được đăng ký, chúng tôi sẽ gửi hướng dẫn khôi phục. Hãy kiểm tra email.");
   }
   if(mode==="password"){
    const r=await client.auth.updateUser({password});
    if(r.error)throw r.error;
    await client.auth.signOut({scope:"local"});
    setMessage("Mật khẩu đã được cập nhật. Phiên hiện tại đã được đóng. Vui lòng đăng nhập lại.");
   }
  }catch(err){
   setError(true);
   setMessage(mode==="login"?"Không thể đăng nhập. Vui lòng kiểm tra thông tin hoặc thử lại sau.":"Không thể hoàn tất yêu cầu. Vui lòng thử lại sau.");
   if(process.env.NODE_ENV==="development")console.warn("Authentication failed (no credentials logged):",err instanceof Error?err.name:"unknown");
  }finally{setPending(false);}
 }
 async function google(){
  if(pending||!googleEnabled)return;
  setPending(true);setMessage("");setError(false);
  try{
   const client=browserAuthClient();
   const next=allowedDestination(new URLSearchParams(window.location.search).get("next"));
   const {error:oauthError}=await client.auth.signInWithOAuth({
    provider:"google",options:{redirectTo:window.location.origin+"/auth/callback?next="+encodeURIComponent(next)}
   });
   if(oauthError)throw oauthError;
  }catch{setError(true);setMessage("Không thể mở đăng nhập Google. Vui lòng thử lại.");setPending(false);}
 }
 return <div className="auth-panel">
  <p className="small-index">ATHENA / BẢO MẬT TÀI KHOẢN</p>
  <h1>{mode==="login"?"Đăng nhập":mode==="signup"?"Tạo tài khoản":mode==="forgot"?"Khôi phục":"Mật khẩu mới"}<em>.</em></h1>
  <p className="auth-description">{mode==="login"?"Truy cập hồ sơ của bạn bằng tài khoản đã xác minh.":mode==="signup"?"Đăng ký để chuẩn bị sử dụng các dịch vụ khách hàng của Athena.":mode==="forgot"?"Nhập email để nhận hướng dẫn khôi phục mật khẩu.":"Vui lòng đặt mật khẩu mới để bảo vệ tài khoản."}</p>
  <form className="auth-form" onSubmit={submit}>
   {mode==="signup"&&<label>Họ và tên<input name="full_name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Tên của bạn"/></label>}
   {mode!=="password"&&<label>Địa chỉ email<input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="ten@example.com"/></label>}
   {mode!=="forgot"&&<label>{mode==="password"?"Mật khẩu mới":"Mật khẩu"}
    <input name="password" type="password" minLength={mode==="login"?1:12} required autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Tối thiểu 12 ký tự"/></label>}
   {mode==="login"&&<div className="auth-helper"><Link href="/quen-mat-khau">Quên mật khẩu?</Link></div>}
   <button className="pill-link pill-dark auth-submit" type="submit" disabled={pending}>{pending?"Đang xử lý…":mode==="login"?"Đăng nhập →":mode==="signup"?"Đăng ký →":mode==="forgot"?"Gửi hướng dẫn →":"Cập nhật mật khẩu →"}</button>
   {message&&<p className={error?"auth-notice is-error":"auth-notice"} role={error?"alert":"status"}>{message}</p>}
  </form>
  {(mode==="login"||mode==="signup")&&<>
   <div className="auth-separator"><span>HOẶC</span></div>
   <button type="button" className="auth-google" onClick={google} disabled={!googleEnabled||pending}>Tiếp tục với Google <span aria-hidden="true">↗</span></button>
   {!googleEnabled&&<p className="auth-footnote">Google OAuth sẽ khả dụng sau khi hoàn tất cấu hình và xác minh ứng dụng.</p>}
   <p className="auth-alternate">{mode==="login"?<>Chưa có tài khoản? <Link href="/dang-ky">Đăng ký</Link></>:<>Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập</Link></>}</p>
  </>}
  <p className="auth-footnote">Athena không bao giờ yêu cầu bạn chia sẻ mật khẩu qua email hoặc tin nhắn. Xem <Link href="/phap-ly/quyen-rieng-tu">chính sách quyền riêng tư</Link>.</p>
 </div>;
}
