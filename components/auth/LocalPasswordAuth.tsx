"use client";
import {useEffect,useState,type FormEvent} from "react";
import {createAuthClient} from "better-auth/react";
import Link from "next/link";
type Mode="login"|"signup";
const auth=()=>createAuthClient({baseURL:window.location.origin,basePath:"/api/identity"});
function ProviderIcon({provider}:{provider:"google"|"github"}){
 if(provider==="github")return <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="currentColor"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.12c-3.1.67-3.76-1.32-3.76-1.32-.5-1.27-1.24-1.61-1.24-1.61-1.01-.7.08-.69.08-.69 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.58 1.21 3.21.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.23-5.06-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.14A10.8 10.8 0 0 1 12 6.34c.95 0 1.9.13 2.79.38 2.14-1.44 3.08-1.14 3.08-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.78 1.15 3 0 4.3-2.59 5.24-5.07 5.52.4.34.75 1.02.75 2.07v2.97c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>;
 return <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.25c0-.71-.06-1.39-.19-2.06H12v3.89h5.38a4.61 4.61 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.39l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.75-5.6-4.11H3.06v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.95a6 6 0 0 1 0-3.9V7.46H3.06a10 10 0 0 0 0 9.08l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.94c1.44 0 2.73.49 3.75 1.47l2.81-2.81A9.56 9.56 0 0 0 12 2a10 10 0 0 0-8.94 5.46l3.34 2.59C7.19 7.69 9.4 5.94 12 5.94Z"/></svg>;
}
export function LocalPasswordAuth({mode,googleEnabled=false,githubEnabled=false}:{mode:Mode;googleEnabled?:boolean;githubEnabled?:boolean}){
 const [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[info,setInfo]=useState("");
 useEffect(()=>{
  setReady(true);
  const errorCode=new URLSearchParams(window.location.search).get("error");
  const messages:Record<string,string>={
   invalid_code:"GitHub/Google không thể đổi mã ủy quyền thành phiên đăng nhập. Hãy mở luồng đăng nhập mới và kiểm tra Client ID/Secret đúng cùng OAuth App, callback trùng chính xác và mã chưa sử dụng.",
   state_mismatch:"Phiên xác thực đã hết hạn hoặc trạng thái đăng nhập không khớp. Hãy bắt đầu lại từ nút đăng nhập trên Athena.",
   state_security_mismatch:"Cookie xác thực không khớp. Hãy dùng một địa chỉ duy nhất: http://127.0.0.1:3182, không chuyển giữa localhost và 127.0.0.1.",
   email_not_verified:"Email tài khoản nhà cung cấp chưa được xác minh."
  };
  if(errorCode)setError(messages[errorCode]||"Đăng nhập OAuth chưa hoàn tất. Hãy thử lại và kiểm tra cấu hình nhà cung cấp.");
  if(!errorCode)auth().getSession().then(x=>{if(x.data?.session)window.location.replace("/profile");}).catch(()=>{});
 },[]);
 async function loginWith(provider:"google"|"github"){
  if(busy||!ready||(provider==="google"&&!googleEnabled)||(provider==="github"&&!githubEnabled))return;
  setBusy(true);setError("");setInfo("");
  try{
   const result=await auth().signIn.social({provider,callbackURL:window.location.origin+"/profile",errorCallbackURL:window.location.origin+"/login"});
   if(result.error)setError("Không thể kết nối "+(provider==="google"?"Google":"GitHub")+". Hãy thử lại hoặc dùng email và mật khẩu.");
  }catch{setError("Không khởi tạo được đăng nhập "+(provider==="google"?"Google":"GitHub")+".");}
  finally{setBusy(false);}
 }
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
   // The Better Auth server has accepted the sign-in and issued a response;
   // /profile independently verifies the session cookie on the server.
   setInfo("?ang m? h? s??");window.location.assign("/profile");
  }catch{setError("Không kết nối được máy chủ xác thực cục bộ. Vui lòng thử lại.");}
  finally{setBusy(false);}
 }
 return <div className="auth-panel">
  <p className="small-index">ATHENA / TÀI KHOẢN</p>
  <h1>{mode==="login"?"Đăng nhập":"Tạo tài khoản"}<em>.</em></h1>
  <p className="auth-description">{mode==="login"?"Đăng nhập để tiếp tục làm việc với Athena Studio.":"Tạo tài khoản để quản lý dự án và trao đổi cùng Athena Studio."}</p>
  <div className="athena-oauth-providers" role="group" aria-label="Đăng nhập bằng tài khoản khác">
   {(["google","github"] as const).map(provider=>{
    const enabled=provider==="google"?googleEnabled:githubEnabled;
    return <button className="athena-oauth-provider" key={provider} type="button" disabled={!ready||busy||!enabled}
     aria-label={"Tiếp tục với "+(provider==="google"?"Google":"GitHub")+(enabled?"":" (chưa kết nối)")}
     title={enabled?"Tiếp tục bằng "+(provider==="google"?"Google":"GitHub"):"Chưa cấu hình ứng dụng OAuth "+(provider==="google"?"Google":"GitHub")}
     onClick={()=>loginWith(provider)}>
     <ProviderIcon provider={provider}/><span>{provider==="google"?"Google":"GitHub"}</span>
     {!enabled&&<small>Chưa kết nối</small>}
    </button>;
   })}
  </div>
  {(!googleEnabled||!githubEnabled)&&<p className="athena-oauth-pending">Kết nối Google/GitHub chỉ hoạt động sau khi cấu hình ứng dụng OAuth. Bạn vẫn có thể sử dụng email và mật khẩu để kiểm thử.</p>}
  <div className="athena-auth-separator"><span>HOẶC TIẾP TỤC BẰNG EMAIL</span></div>
  <form method="post" className="auth-form" onSubmit={submit} aria-busy={busy}>
   {mode==="signup"&&<label>Họ tên<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Tên của bạn"/></label>}
   <label>Email<input type="email" name="email" autoComplete="email" required maxLength={200} placeholder="ten@example.com"/></label>
   <label>Mật khẩu<input type="password" name="password" autoComplete={mode==="signup"?"new-password":"current-password"} minLength={12} required placeholder="Tối thiểu 12 ký tự"/></label>
   <button className="pill-link pill-dark auth-submit" disabled={!ready||busy} type="submit">{busy?"Đang kiểm tra…":mode==="login"?"Đăng nhập →":"Tạo tài khoản →"}</button>
  </form>
  {error&&<p className="auth-notice is-error" role="alert">{error}</p>}
  {info&&<p className="auth-notice" role="status">{info}</p>}
  <p className="auth-alternate">{mode==="login"?<>Chưa có tài khoản thử nghiệm? <Link href="/signup">Đăng ký</Link></>:<>Đã có tài khoản thử nghiệm? <Link href="/login">Đăng nhập</Link></>}</p>
  <p className="auth-footnote">Bản thử nghiệm cục bộ. Không sử dụng mật khẩu đang dùng trên dịch vụ khác.</p>
 </div>;
}
