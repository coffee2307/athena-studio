"use client";

import {useEffect,useState,type FormEvent} from "react";
import {createAuthClient} from "better-auth/react";
import {emailOTPClient} from "better-auth/client/plugins";

type Provider="google"|"github";
type Stage="email"|"code"|"authenticated";
const safeAuthClient=()=>createAuthClient({
 baseURL:window.location.origin,
 basePath:"/api/identity",
 plugins:[emailOTPClient()]
});

/**
 * Standalone local-only proof of the customer journey, independent of Supabase.
 * A verified Athena Identity session does NOT yet grant access to legacy portal.
 */
export function IndependentIdentityLab({
 googleEnabled,githubEnabled,otpEnabled
}:{googleEnabled:boolean;githubEnabled:boolean;otpEnabled:boolean}){
 const [email,setEmail]=useState("");
 const [otp,setOtp]=useState("");
 const [name,setName]=useState("");
 const [stage,setStage]=useState<Stage>("email");
 const [pending,setPending]=useState(false);
 useEffect(()=>{
  let mounted=true;
  safeAuthClient().getSession().then(({data})=>{
   if(mounted&&data?.user?.emailVerified)setStage("authenticated");
  }).catch(()=>{});
  return ()=>{mounted=false;};
 },[]);
 const [status,setStatus]=useState("");
 const [isError,setIsError]=useState(false);
 const [retryAt,setRetryAt]=useState(0);
 const [resendAt,setResendAt]=useState(0);
 const [clock,setClock]=useState(()=>Date.now());
 const cooldown=Math.max(0,Math.ceil((retryAt-clock)/1000));
 const resendCooldown=Math.max(0,Math.ceil((resendAt-clock)/1000));
 useEffect(()=>{
  if(Math.max(retryAt,resendAt)<=clock)return;
  const id=window.setInterval(()=>setClock(Date.now()),1000);
  return ()=>window.clearInterval(id);
 },[retryAt,resendAt,clock]);

 function failure(errorCode?:string){
  setIsError(true);
  if(errorCode==="TOO_MANY_REQUESTS"||errorCode==="RATE_LIMIT_EXCEEDED"){
   setStatus("Quá nhiều yêu cầu. Vui lòng kiểm tra lại sau thay vì gửi liên tục.");
   const now=Date.now();setClock(now);setRetryAt(now+90_000);
  }else if(errorCode==="INVALID_OTP"||errorCode==="OTP_EXPIRED"){
   setStatus("Mã xác minh không đúng hoặc đã hết hạn. Kiểm tra lại mã trong email.");
  }else if(errorCode==="TOO_MANY_ATTEMPTS"){
   setStatus("Bạn đã nhập sai mã quá nhiều lần. Hãy yêu cầu mã mới sau khi hệ thống cho phép.");
  }else{
   setStatus("Yêu cầu chưa thể hoàn tất. Vui lòng thử lại sau hoặc chọn phương thức khác.");
  }
 }
 async function requestOtp(event:FormEvent<HTMLFormElement>|null){
  event?.preventDefault();
  if(pending||!otpEnabled||cooldown>0||(stage==="code"&&resendCooldown>0))return;
  const target=email.trim();
  if(target.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)){
   setIsError(true);setStatus("Vui lòng kiểm tra lại địa chỉ email.");return;
  }
  setPending(true);setStatus("");setIsError(false);
  try{
   const client=safeAuthClient();
   const result=await client.emailOtp.sendVerificationOtp({email:target,type:"sign-in"});
   if(result.error){failure(result.error.code);return;}
   setStage("code");
   const now=Date.now();setClock(now);setResendAt(now+60_000);
   setStatus("Yêu cầu gửi mã đã được tiếp nhận. Kiểm tra hộp thư và thư mục spam; có thể gửi lại sau 60 giây.");
  }catch{failure();}
  finally{setPending(false);}
 }
 async function verifyOtp(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(pending||otp.length!==6||!/^\d{6}$/.test(otp))return;
  setPending(true);setStatus("");setIsError(false);
  try{
   const client=safeAuthClient();
   const result=await client.signIn.emailOtp({email:email.trim(),otp,name:name.trim()||undefined});
   if(result.error){failure(result.error.code);return;}
   // Consult actual session API, not a UI-only "success" flag.
   const verified=await client.getSession();
   if(!verified.data?.user||!verified.data.user.emailVerified){
    failure();return;
   }
   setStage("authenticated");
   setOtp("");
   setStatus("Phiên Athena Identity đã được xác nhận. Đây là môi trường thử nghiệm cục bộ.");
  }catch{failure();}
  finally{setPending(false);}
 }
 async function startSocial(provider:Provider){
  if(pending)return;
  setPending(true);setIsError(false);setStatus("");
  try{
   const client=safeAuthClient();
   const result=await client.signIn.social({provider,callbackURL:"/identity-lab"});
   if(result.error)failure(result.error.code);
  }catch{failure();}
  finally{setPending(false);}
 }
 async function signOut(){
  setPending(true);setStatus("");setIsError(false);
  try{
   const client=safeAuthClient();
   const result=await client.signOut();
   if(result.error){failure(result.error.code);return;}
   setStage("email");setOtp("");setStatus("Đã kết thúc phiên Athena Identity trên trình duyệt này.");
  }catch{failure();}
  finally{setPending(false);}
 }
 return <div className="identity-lab">
  <p className="small-index">ATHENA CORE / IDENTITY LAB</p>
  <h1>Truy cập <em>đơn giản.</em></h1>
  <p className="identity-lab-caption">Thử nghiệm đăng nhập độc lập: Google, GitHub hoặc email OTP. Không kết nối với tài khoản Supabase, chưa mở cho khách hàng.</p>
  {stage==="authenticated"?<>
   <div className="identity-lab-confirmed" role="status">Danh tính đã được xác minh. Quyền truy cập dự án vẫn cần được cấp riêng.</div>
   <button className="pill-link pill-dark identity-lab-button" type="button" disabled={pending} onClick={signOut}>Đăng xuất phiên thử nghiệm →</button>
  </>:<>
   {(googleEnabled||githubEnabled)&&<div className="identity-lab-social">
    {googleEnabled&&<button type="button" disabled={pending} onClick={()=>startSocial("google")}>Tiếp tục với Google ↗</button>}
    {githubEnabled&&<button type="button" disabled={pending} onClick={()=>startSocial("github")}>Tiếp tục với GitHub ↗</button>}
   </div>}
   {otpEnabled&&<form className="identity-lab-form" onSubmit={stage==="email"?requestOtp:verifyOtp} aria-busy={pending}>
    <label>Địa chỉ email
     <input type="email" required autoComplete="email" maxLength={254}
      value={email} onChange={e=>setEmail(e.target.value)} disabled={stage!=="email"||pending}
      placeholder="ban@example.com"/>
    </label>
    {stage==="code"&&<>
     <label>Tên hiển thị (tùy chọn)
      <input autoComplete="name" maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Tên của bạn"/>
     </label>
     <label>Mã xác minh gồm sáu chữ số
      <input inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required
       maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
       placeholder="000000"/>
     </label>
    </>}
    <button className="pill-link pill-dark identity-lab-button" type="submit" disabled={pending||(stage==="email"&&cooldown>0)}>
     {pending?"Đang xử lý…":stage==="email"&&cooldown>0?`Thử lại sau ${cooldown}s`:stage==="email"?"Nhận mã xác minh →":"Xác minh và đăng nhập →"}
    </button>
    {stage==="code"&&<>
     <button className="identity-lab-back" type="button" disabled={pending||resendCooldown>0||cooldown>0}
      onClick={()=>void requestOtp(null)}>
      {cooldown>0?`Giới hạn gửi mã (${cooldown}s)`:resendCooldown>0?`Gửi lại mã sau ${resendCooldown}s`:"Gửi lại mã xác minh"}
     </button>
     <button className="identity-lab-back" type="button" disabled={pending} onClick={()=>{setStage("email");setOtp("");setStatus("");}}>Dùng email khác</button>
    </>}
   </form>}
  </>}
  {status&&<p className={isError?"identity-lab-notice is-error":"identity-lab-notice"} role={isError?"alert":"status"}>{status}</p>}
  <p className="identity-lab-foot">Chỉ dành cho localhost. Đăng nhập GitHub không tự cấp quyền truy cập repository. Quyền repository phải được khách hàng cấp qua GitHub App riêng.</p>
 </div>;
}
