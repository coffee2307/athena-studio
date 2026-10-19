"use client";
import {FormEvent,useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {TurnstileField} from "@/components/forms/TurnstileField";
type Props={configured:boolean;contactEmail:string;siteKey:string};
type Status="idle"|"sending"|"success"|"error";
export function ContactForm({configured,contactEmail,siteKey}:Props){
 const [status,setStatus]=useState<Status>("idle"),[message,setMessage]=useState(""),[reference,setReference]=useState("");
 const [service,setService]=useState(""),[captcha,setCaptcha]=useState("");
 const updateCaptcha=useCallback((token:string)=>setCaptcha(token),[]);
 useEffect(()=>{const x=new URLSearchParams(window.location.search).get("service");if(x&&["web-development","website-care","ai-integration","micro-saas","other"].includes(x))setService(x);},[]);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!configured||status==="sending"||!captcha)return;
  const form=event.currentTarget;
  const payload={...Object.fromEntries(new FormData(form)),captcha,consent:(new FormData(form)).get("consent")==="yes"};
  setStatus("sending");setMessage("");
  try{
   const response=await fetch("/api/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const data:unknown=await response.json();
   const result=data&&typeof data==="object"?data as Record<string,unknown>:{};
   if(!response.ok)throw Error(typeof result.error==="string"?result.error:"Không thể gửi yêu cầu. Vui lòng thử lại.");
   if(result.ignored===true)throw Error("Không thể xác nhận yêu cầu. Vui lòng thử lại hoặc liên hệ email.");
   setStatus("success");setReference(typeof result.reference==="string"?result.reference:"");
   setMessage(typeof result.message==="string"?result.message:"Yêu cầu đã được lưu.");
   form.reset();setService("");setCaptcha("");
  }catch(e){setStatus("error");setMessage(e instanceof Error?e.message:"Có lỗi xảy ra. Vui lòng liên hệ qua email.");}
 }
 return <div className="contact-box">
  <p className="small-index">BẮT ĐẦU DỰ ÁN / ATHENA</p><h2>Chia sẻ về<br/><em>dự án của bạn.</em></h2>
  <p>Gửi nhu cầu tư vấn, chúng tôi sẽ xem xét và phản hồi khi có thể. Không gửi mật khẩu, mã truy cập hay dữ liệu nhạy cảm.</p>
  {configured?<form className="inquiry-form" onSubmit={submit}>
   <div className="field-pair"><label>Họ tên <span>*</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Tên của bạn"/></label><label>Địa chỉ email <span>*</span><input name="email" required type="email" maxLength={200} autoComplete="email" placeholder="email@example.com"/></label></div>
   <label>Đơn vị / doanh nghiệp<input name="company" maxLength={120} autoComplete="organization" placeholder="Không bắt buộc"/></label>
   <label>Dịch vụ quan tâm <span>*</span><select name="service" required value={service} onChange={e=>setService(e.target.value)}><option value="" disabled>Chọn một lĩnh vực</option><option value="web-development">Thiết kế website</option><option value="website-care">Chăm sóc website</option><option value="ai-integration">Tích hợp AI</option><option value="micro-saas">Công cụ Micro-SaaS</option><option value="other">Chưa xác định</option></select></label>
   <label>Mô tả dự án <span>*</span><textarea name="message" required rows={5} minLength={20} maxLength={4000} placeholder="Bạn muốn xây dựng hoặc cải thiện điều gì?"/></label>
   <div className="trap-field" aria-hidden="true"><label>Trang web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <label className="privacy-consent"><input type="checkbox" name="consent" required value="yes"/><span>Tôi đồng ý để Athena sử dụng thông tin này nhằm phản hồi yêu cầu. Xem <Link href="/phap-ly/quyen-rieng-tu" target="_blank" rel="noopener noreferrer">thông tin quyền riêng tư</Link>.</span></label>
   <TurnstileField siteKey={siteKey} onToken={updateCaptcha}/>
   <button className="pill-link pill-dark form-submit" type="submit" disabled={status==="sending"||!captcha}>{status==="sending"?"Đang ghi nhận…":"Gửi yêu cầu"} <span aria-hidden="true">↗</span></button>
   {message&&<div className={status==="error"?"form-status form-error":"form-status"} role={status==="error"?"alert":"status"}><p>{message}</p>{reference&&<p>Mã tham chiếu: <strong>{reference}</strong></p>}</div>}
   <p className="form-privacy">Dữ liệu chỉ được nhận khi việc lưu trữ và chống spam đã cấu hình đầy đủ.</p>
  </form>:<div className="form-offline" role="status">
   <strong>Biểu mẫu đang được cấu hình an toàn.</strong>
   <p>Để bảo đảm không thất lạc dữ liệu khách hàng, Athena tạm nhận yêu cầu trực tiếp qua email cho đến khi cơ sở dữ liệu, hệ thống xác minh và gửi thông báo được kích hoạt.</p>
   <a href={"mailto:"+contactEmail+"?subject="+encodeURIComponent("Yêu cầu tư vấn Athena Studio")} className="pill-link pill-dark">Gửi email trực tiếp <span aria-hidden="true">↗</span></a>
  </div>}
  <p className="contact-notice">Bạn cũng có thể liên hệ bằng điện thoại, Zalo hoặc WhatsApp qua các liên kết bên cạnh.</p>
 </div>;
}
