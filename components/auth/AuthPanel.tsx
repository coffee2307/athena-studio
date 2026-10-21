"use client";
import {useEffect,useState,type FormEvent} from "react";
import Link from "next/link";
import {allowedDestination} from "@/lib/auth/config";
import {supabaseIdentityAdapter} from "@/lib/auth/provider-adapter";
import {
 cappedCooldown,classifyIdentityFailure,runIdentityAction,
 type IdentityAction,type IdentityFailure
} from "@/lib/core/auth/core";

type Mode="login"|"signup"|"forgot"|"password";

/** Customer-facing state and recovery belong to Athena, not to a vendor SDK. */
export function AuthPanel({mode,googleEnabled=false}:{mode:Mode;googleEnabled?:boolean}){
 const [pending,setPending]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState(false);
 const [failure,setFailure]=useState<IdentityFailure|null>(null);
 const [retryAt,setRetryAt]=useState(0);
 const [now,setNow]=useState(()=>Date.now());
 const cooldown=Math.max(0,Math.ceil((retryAt-now)/1000));
 useEffect(()=>{
  if(retryAt<=0)return;
  const id=window.setInterval(()=>setNow(Date.now()),1000);
  return ()=>window.clearInterval(id);
 },[retryAt]);

 function displayFailure(f:IdentityFailure){
  setError(true);setFailure(f);setMessage(f.message);
  const current=Date.now();
  setNow(current);
  setRetryAt(current+cappedCooldown(f.cooldownSeconds)*1000);
 }
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(pending||cooldown>0)return;
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
  setPending(true);setMessage("");setError(false);setFailure(null);
  let action:IdentityAction;
  const origin=window.location.origin;
  switch(mode){
   case "login":action={kind:"login",email,password};break;
   case "signup":action={kind:"signup",email,password,fullName,
    redirectTo:origin+"/auth/callback?next="+encodeURIComponent("/account")};break;
   case "forgot":action={kind:"forgot",email,
    redirectTo:origin+"/auth/callback?next="+encodeURIComponent("/account/change-password")};break;
   case "password":action={kind:"password",password};break;
  }
  try{
   const result=await runIdentityAction(supabaseIdentityAdapter(),action);
   if(!result.ok){displayFailure(result.failure);return;}
   if(mode==="login"){window.location.assign("/account");return;}
   if(mode==="signup")
    setMessage("Nếu địa chỉ đủ điều kiện đăng ký, hướng dẫn xác minh sẽ được gửi qua email. Vui lòng kiểm tra hộp thư và thư mục spam.");
   if(mode==="forgot")
    setMessage("Nếu địa chỉ đã đăng ký, chúng tôi sẽ gửi hướng dẫn khôi phục qua email. Vui lòng kiểm tra hộp thư.");
   if(mode==="password")
    setMessage("Mật khẩu đã được cập nhật và phiên đăng nhập cục bộ đã được đóng. Vui lòng đăng nhập lại.");
  }catch(err){
   displayFailure(classifyIdentityFailure(err,mode));
  }finally{setPending(false);}
 }
 async function google(){
  if(pending||!googleEnabled)return;
  setPending(true);setMessage("");setError(false);setFailure(null);
  try{
   const next=allowedDestination(new URLSearchParams(window.location.search).get("next"));
   const action:IdentityAction={kind:"google",redirectTo:window.location.origin+
    "/auth/callback?next="+encodeURIComponent(next)};
   const result=await runIdentityAction(supabaseIdentityAdapter(),action);
   if(!result.ok)displayFailure(result.failure);
  }catch(err){displayFailure(classifyIdentityFailure(err,"google"));}
  finally{setPending(false);}
 }
 const emailBlocked=failure?.kind==="email_quota"||failure?.kind==="throttled";
 return <div className="auth-panel">
  <p className="small-index">ATHENA / BẢO MẬT TÀI KHOẢN</p>
  <h1>{mode==="login"?"Đăng nhập":mode==="signup"?"Tạo tài khoản":mode==="forgot"?"Khôi phục":"Mật khẩu mới"}<em>.</em></h1>
  <p className="auth-description">{mode==="login"?"Truy cập hồ sơ của bạn bằng tài khoản đã xác minh.":mode==="signup"?"Đăng ký để chuẩn bị sử dụng các dịch vụ khách hàng của Athena.":mode==="forgot"?"Nhập email để nhận hướng dẫn khôi phục mật khẩu.":"Vui lòng đặt mật khẩu mới để bảo vệ tài khoản."}</p>
  <form className="auth-form" onSubmit={submit} aria-busy={pending}>
   {mode==="signup"&&<label>Họ và tên<input name="full_name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Tên của bạn"/></label>}
   {mode!=="password"&&<label>Địa chỉ email<input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="ten@example.com"/></label>}
   {mode!=="forgot"&&<label>{mode==="password"?"Mật khẩu mới":"Mật khẩu"}
    <input name="password" type="password" minLength={mode==="login"?1:12} required autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Tối thiểu 12 ký tự"/></label>}
   {mode==="login"&&<div className="auth-helper"><Link href="/forgot-password">Quên mật khẩu?</Link></div>}
   <button className="pill-link pill-dark auth-submit" type="submit" disabled={pending||cooldown>0}>
    {pending?"Đang xử lý…":cooldown>0?`Có thể thử lại sau ${cooldown}s`:mode==="login"?"Đăng nhập →":mode==="signup"?"Đăng ký →":mode==="forgot"?"Gửi hướng dẫn →":"Cập nhật mật khẩu →"}
   </button>
   {message&&<p className={error?"auth-notice is-error":"auth-notice"} role={error?"alert":"status"}>{message}</p>}
   {emailBlocked&&<div className="auth-recovery" role="note">
    <strong>Yêu cầu của bạn chưa được xác minh là hoàn tất.</strong>
    <p>Việc tạm dừng nút gửi chỉ tránh thao tác lặp lại trên thiết bị này; không bảo đảm nhà cung cấp đã hết giới hạn sau khi đếm ngược kết thúc.</p>
    {(mode==="signup"||mode==="login")&&googleEnabled
     ?<p>Nếu muốn, bạn có thể dùng nút đăng nhập Google bên dưới. Hai phương thức không tự động liên kết tài khoản.</p>
     :<p>Bạn có thể <Link href="/contact">liên hệ Athena</Link> nếu cần được hỗ trợ.</p>}
   </div>}
  </form>
  {(mode==="login"||mode==="signup")&&<>
   <div className="auth-separator"><span>HOẶC</span></div>
   <button type="button" className="auth-google" onClick={google} disabled={!googleEnabled||pending}>Tiếp tục với Google <span aria-hidden="true">↗</span></button>
   {!googleEnabled&&<p className="auth-footnote">Google OAuth sẽ khả dụng sau khi hoàn tất cấu hình và xác minh ứng dụng.</p>}
   <p className="auth-alternate">{mode==="login"?<>Chưa có tài khoản? <Link href="/signup">Đăng ký</Link></>:<>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></>}</p>
  </>}
  <p className="auth-footnote">Athena không bao giờ yêu cầu bạn chia sẻ mật khẩu qua email hoặc tin nhắn. Xem <Link href="/legal/privacy">chính sách quyền riêng tư</Link>.</p>
 </div>;
}
