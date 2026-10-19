"use client";
import { FormEvent, useEffect, useState } from "react";
type Props={configured:boolean;contactEmail:string};
type State="idle"|"sending"|"success"|"error";
export function ContactForm({configured,contactEmail}:Props){
 const [state,setState]=useState<State>("idle");
 const [message,setMessage]=useState("");
 const [service,setService]=useState("");
 useEffect(()=>{const value=new URLSearchParams(window.location.search).get("service");if(value&&["web-development","website-care","ai-integration","micro-saas","other"].includes(value))setService(value);},[]);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(!configured||state==="sending")return;
  const form=event.currentTarget;const fields=Object.fromEntries(new FormData(form).entries());
  setState("sending");setMessage("");
  try{
   const response=await fetch("/api/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(fields)});
   if(!response.ok)throw new Error(response.status===429?"Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau.":"Không thể gửi yêu cầu lúc này. Hãy thử lại hoặc liên hệ trực tiếp.");
   form.reset();setState("success");setMessage("Yêu cầu đã được tiếp nhận. Athena sẽ phản hồi khi có thể.");
  }catch(error){setState("error");setMessage(error instanceof Error?error.message:"Đã xảy ra sự cố khi gửi yêu cầu.");}
 }
 return <div className="contact-box">
  <p className="small-index">BIỂU MẪU TƯ VẤN / ATHENA</p><h2>Chia sẻ về<br/><em>dự án của bạn.</em></h2>
  <p>Hãy mô tả ngắn về ý tưởng hoặc bài toán cần giải quyết. Không gửi mật khẩu, mã truy cập hay dữ liệu nhạy cảm.</p>
  {configured?<form className="inquiry-form" onSubmit={submit}>
   <div className="field-pair"><label>Họ tên <span>*</span><input name="name" required maxLength={100} autoComplete="name" placeholder="Tên của bạn"/></label><label>Địa chỉ email <span>*</span><input name="email" required type="email" maxLength={200} autoComplete="email" placeholder="email@example.com"/></label></div>
   <label>Đơn vị / doanh nghiệp<input name="company" maxLength={120} autoComplete="organization" placeholder="Không bắt buộc"/></label>
   <label>Dịch vụ quan tâm <span>*</span><select name="service" required value={service} onChange={e=>setService(e.target.value)}><option value="" disabled>Chọn một lĩnh vực</option><option value="web-development">Thiết kế website</option><option value="website-care">Chăm sóc website</option><option value="ai-integration">Tích hợp AI</option><option value="micro-saas">Công cụ Micro-SaaS</option><option value="other">Chưa xác định</option></select></label>
   <label>Mô tả dự án <span>*</span><textarea name="message" required rows={5} minLength={20} maxLength={4000} placeholder="Điều gì bạn đang muốn xây dựng hoặc cải thiện?"/></label>
   <div className="trap-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <button type="submit" className="pill-link pill-dark form-submit" disabled={state==="sending"}>{state==="sending"?"Đang gửi yêu cầu…":"Gửi yêu cầu"} <span aria-hidden="true">↗</span></button>
   <p className="form-privacy">Thông tin chỉ dùng để phản hồi và trao đổi về yêu cầu bạn gửi.</p>
   {message&&<p role={state==="error"?"alert":"status"} className={state==="error"?"form-status form-error":"form-status"}>{message}</p>}
  </form>:<div className="form-offline" role="status"><strong>Biểu mẫu đang được cấu hình.</strong><p>Hệ thống gửi email chưa sẵn sàng. Để tránh thất lạc thông tin, Athena tạm thời không nhận yêu cầu qua biểu mẫu.</p><a className="pill-link pill-dark" href={"mailto:"+contactEmail}>Gửi email trực tiếp <span aria-hidden="true">↗</span></a></div>}
  <p className="contact-notice">Nếu liên quan website đang hoạt động, hãy cho biết nền tảng và mục tiêu quan trọng nhất.</p>
 </div>;
}
