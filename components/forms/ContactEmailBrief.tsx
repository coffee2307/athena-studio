"use client";
import {useEffect,useState,type FormEvent} from "react";
import {createInquiryEmailDraft} from "@/lib/contact-email-draft";
import {siteConfig} from "@/lib/constants";
import {Icon} from "@/components/ui/Icon";

import {ProjectBriefFields} from "@/components/forms/ProjectBriefFields";
import {briefFieldsFromForm} from "@/lib/project-brief";
import type {Template} from "@/lib/templates";

type Draft=ReturnType<typeof createInquiryEmailDraft>;
export function ContactEmailBrief({template,defaultService=""}:{template?:Pick<Template,"title"|"slug"|"version">;defaultService?:string}){
 const [draft,setDraft]=useState<Draft|null>(null);
 const [error,setError]=useState("");
 const [copied,setCopied]=useState(false);
 const templateService=template?"web-development":defaultService;
 const [service,setService]=useState(templateService);
 useEffect(()=>setService(templateService),[templateService]);
 function prepare(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setError("");setCopied(false);
  const data=new FormData(event.currentTarget);
  try{
   setDraft(createInquiryEmailDraft({
    name:String(data.get("name")||""),
    email:String(data.get("email")||""),
    service:String(data.get("service")||""),
    message:String(data.get("message")||""),
    ...briefFieldsFromForm(data),
    template:template?.title,templateSlug:template?.slug,templateVersion:template?.version
   },siteConfig.email));
  }catch(e){setDraft(null);setError(e instanceof Error?e.message:"Thông tin chưa hợp lệ.");}
 }
 async function copy(){
  if(!draft)return;
  try{
   await navigator.clipboard.writeText("Chủ đề: "+draft.subject+"\n\n"+draft.body);
   setCopied(true);setError("");
  }catch{setError("Không thể sao chép tự động. Hãy chọn phần nội dung bên dưới để sao chép.");}
 }
 return <div className="athena-email-brief">
  <div className="athena-email-brief-heading">
   <span>SOẠN NỘI DUNG CỤ THỂ</span>
   <p>Bạn có thể chuẩn bị thư ngay tại đây. Athena không nhận hoặc lưu dữ liệu từ biểu mẫu này.</p>
  </div>
  <form className="inquiry-form athena-email-brief-form" onSubmit={prepare} onChange={()=>{setDraft(null);setCopied(false);setError("");}}>
   <div className="field-pair">
    <label>Họ tên <span>*</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Tên của bạn"/></label>
    <label>Email liên hệ <span>*</span><input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="email@example.com"/></label>
   </div>
   <label>Dịch vụ quan tâm <span>*</span>
    <select name="service" required value={template?"web-development":service} onChange={event=>setService(event.target.value)}>
     <option value="" disabled>Chọn dịch vụ</option>
     <option value="web-development">Thiết kế website</option>
     <option value="website-care">Chăm sóc website</option>
     <option value="ai-integration">Tích hợp AI</option>
     <option value="micro-saas">Công cụ Micro-SaaS</option>
     <option value="other">Chưa xác định</option>
    </select>
   </label>
   <ProjectBriefFields/>
   <label>Nhu cầu và mục tiêu <span>*</span>
    <textarea name="message" minLength={20} maxLength={4000} required rows={4} placeholder="Tình trạng hiện tại, điều cần cải thiện và kết quả bạn mong muốn."/>
   </label>
   <button className="pill-link pill-dark athena-email-brief-prepare" type="submit">Chuẩn bị nội dung email <Icon name="arrow-right" size={18}/></button>
  </form>
  {draft&&<div className="athena-email-brief-result" role="status">
   <strong>Đã chuẩn bị bản nháp — chưa gửi</strong>
   <p>Bạn cần mở ứng dụng email và tự xác nhận gửi. Nội dung bên dưới chỉ được xử lý trong trình duyệt.</p>
   <label htmlFor="athena-draft-preview">Nội dung bản nháp</label>
   <textarea id="athena-draft-preview" readOnly value={"Chủ đề: "+draft.subject+"\n\n"+draft.body} rows={8}/>
   <div className="athena-email-brief-actions">
    <a className="pill-link pill-dark" href={draft.href}>Mở ứng dụng email <Icon name="arrow-right" size={17}/></a>
    <button type="button" onClick={copy} className="pill-link athena-email-copy"><Icon name="copy" size={17}/> {copied?"Đã sao chép":"Sao chép bản nháp"}</button>
   </div>
  </div>}
  {error&&<p className="athena-email-brief-error" role="alert">{error}</p>}
 </div>;
}
