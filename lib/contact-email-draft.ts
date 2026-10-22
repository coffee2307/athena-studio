import {composeInquiryMessage,type ProjectBriefFields} from "./project-brief.ts";
/**
 * Client-side email draft fallback. Does not transmit or store a lead.
 * The visitor must review and send the message in their own email client.
 */
export type EmailBriefFields={name:string;email:string;service:string;message:string}&ProjectBriefFields;
export function createInquiryEmailDraft(fields:EmailBriefFields,recipient:string){
 const name=fields.name.trim(),email=fields.email.trim(),service=fields.service.trim(),message=fields.message.trim();
 const inquiryMessage=composeInquiryMessage(message,fields);
 if(name.length<2||name.length>100)throw Error("Vui lòng nhập tên hợp lệ.");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>200)throw Error("Địa chỉ email không hợp lệ.");
 if(!["web-development","website-care","ai-integration","micro-saas","other"].includes(service))
  throw Error("Vui lòng chọn dịch vụ.");
 if(message.length<20||message.length>4000)throw Error("Vui lòng mô tả vấn đề từ 20 đến 4.000 ký tự.");
 const options:Record<string,string>={
  "web-development":"Thiết kế website",
  "website-care":"Chăm sóc website",
  "ai-integration":"Tích hợp AI",
  "micro-saas":"Phát triển công cụ Micro-SaaS",
  other:"Trao đổi dịch vụ"
 };
 const subject="Yêu cầu tư vấn Athena — "+options[service];
 const body=[
  "Xin chào Athena Studio,",
  "",
  "Họ tên: "+name,
  "Email liên hệ: "+email,
  "Dịch vụ quan tâm: "+options[service],
  "",
  "Vấn đề và mục tiêu:",
  inquiryMessage,
  "",
  "Vui lòng phản hồi qua email nêu trên.",
  "",
  "Thư này được soạn trên website nhưng chưa được gửi tự động."
 ].join("\n");
 return {subject,body,href:"mailto:"+recipient+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)};
}
