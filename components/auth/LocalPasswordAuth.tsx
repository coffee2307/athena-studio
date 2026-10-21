"use client";
import {useEffect,useState,type FormEvent} from "react";
import {createAuthClient} from "better-auth/react";
import Link from "next/link";
type Mode="login"|"signup";
const auth=()=>createAuthClient({baseURL:window.location.origin,basePath:"/api/identity"});
export function LocalPasswordAuth({mode}:{mode:Mode}){
 const [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[info,setInfo]=useState("");
 useEffect(()=>{setReady(true);auth().getSession().then(x=>{if(x.data?.session)window.location.replace("/account-preview");}).catch(()=>{});},[]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;
  const v=new FormData(e.currentTarget);const email=String(v.get("email")||"").trim().toLowerCase();
  const password=String(v.get("password")||"");const name=String(v.get("name")||"").trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<12||(mode==="signup"&&name.length<2)){
   setError("Vui lòng nhập email hợp lệ, tên tối thiểu 2 ký tự và mật khẩu tối thiểu 12 ký tự.");return;
  }
  setBusy(true);setError("");setInfo("");
  try{
   const c=auth();
   const response=mode==="signup"
     ?await c.signUp.email({email,password,name})
     :await c.signIn.email({email,password});
   if(response.error){setError(mode==="login"?"Không thể đăng nhập. Kiểm tra email, mật khẩu hoặc thử lại sau.":"Không thể tạo tài khoản. Email có thể đã được sử dụng hoặc hệ thống đang giới hạn yêu cầu.");return;}
   const session=await c.getSession();
   if(!session.data?.user){setError("Chưa xác minh được phiên đăng nhập. Vui lòng thử lại.");return;}
   setInfo("Đã tạo phiên đăng nhập thử nghiệm.");window.location.assign("/account-preview");
  }catch{setError("Không kết nối được máy chủ xác thực cục bộ. Vui lòng thử lại.");}
  finally{setBusy(false);}
 }
 return <div className="auth-panel">
  <p className="small-index">ATHENA / MÔI TRƯỜNG THỬ NGHIỆM NỘI BỘ</p>
  <h1>{mode==="login"?"Đăng nhập":"Tạo tài khoản"}<em>.</em></h1>
  <p className="auth-description">Tài khoản thử nghiệm thực sự được lưu vào cơ sở dữ liệu cục bộ và có phiên đăng nhập. Đây chưa phải tài khoản khách hàng trên website công khai; không cấp quyền dự án và email chưa được xác minh.</p>
  <form method="post" className="auth-form" onSubmit={submit} aria-busy={busy}>
   {mode==="signup"&&<label>Họ tên<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Tên của bạn"/></label>}
   <label>Email<input type="email" name="email" autoComplete="email" required maxLength={200} placeholder="ten@example.com"/></label>
   <label>Mật khẩu<input type="password" name="password" autoComplete={mode==="signup"?"new-password":"current-password"} minLength={12} required placeholder="Tối thiểu 12 ký tự"/></label>
   <button className="pill-link pill-dark auth-submit" disabled={!ready||busy} type="submit">{busy?"Đang kiểm tra…":mode==="login"?"Đăng nhập →":"Tạo tài khoản →"}</button>
  </form>
  {error&&<p className="auth-notice is-error" role="alert">{error}</p>}
  {info&&<p className="auth-notice" role="status">{info}</p>}
  <p className="auth-alternate">{mode==="login"?<>Chưa có tài khoản thử nghiệm? <Link href="/signup">Đăng ký</Link></>:<>Đã có tài khoản thử nghiệm? <Link href="/login">Đăng nhập</Link></>}</p>
  <p className="auth-footnote">Không dùng mật khẩu thật của bất kỳ tài khoản nào trong môi trường thử nghiệm này.</p>
 </div>;
}
