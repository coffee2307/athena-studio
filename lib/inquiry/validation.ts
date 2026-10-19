export const serviceIds=["web-development","website-care","ai-integration","micro-saas","other"] as const;
export type InquiryService=(typeof serviceIds)[number];
export type InquiryPayload={
 name:string; email:string; company:string; service:InquiryService;
 message:string; consent:boolean; website:string; captcha:string;
};
export type ParseResult={ok:true;value:InquiryPayload}|{ok:false;error:string};
const text=(value:unknown,max:number)=>{
 if(typeof value!=="string")return null;
 const s=value.trim();
 if(s.length>max||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(s))return null;
 return s;
};
export function parseInquiry(value:unknown):ParseResult{
 if(!value||typeof value!=="object"||Array.isArray(value))return {ok:false,error:"Dữ liệu không hợp lệ."};
 const input=value as Record<string,unknown>;
 const name=text(input.name,100),email=text(input.email,200)?.toLowerCase();
 const company=text(input.company??"",120),service=text(input.service,60),message=text(input.message,4000);
 const website=text(input.website??"",300),captcha=text(input.captcha,2048);
 if(name===null||email===null||company===null||service===null||message===null||website===null||captcha===null||
 name.length<2||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!serviceIds.includes(service as InquiryService)||message.length<20||
 input.consent!==true) return {ok:false,error:"Vui lòng kiểm tra các trường bắt buộc và xác nhận chính sách bảo mật."};
 return {ok:true,value:{name,email,company,service:service as InquiryService,message,consent:true,website,captcha}};
}
export function escapeHtml(value:string){
 return value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]||character));
}
export function formatMail(item:InquiryPayload,reference:string){
 const fields=[["Mã yêu cầu",reference],["Họ tên",item.name],["Email",item.email],["Đơn vị",item.company||"—"],["Dịch vụ",item.service],["Nội dung",item.message]];
 return "<h2>Yêu cầu tư vấn mới — Athena Studio</h2>"+fields.map(([key,val])=>
 `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(val).replace(/\n/g,"<br>")}</p>`).join("");
}
