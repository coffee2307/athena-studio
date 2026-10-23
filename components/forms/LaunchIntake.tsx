"use client";
import {useState} from "react";
import {createInquiryEmailDraft} from "@/lib/contact-email-draft";
import {briefBudgets,briefTimelines} from "@/lib/project-brief";
import {siteConfig} from "@/lib/constants";
import {Icon} from "@/components/ui/Icon";
import Link from "next/link";

const services=[
 {id:"web-development",title:"Website mới",detail:"Website giới thiệu, landing page, bán hàng, thư viện mẫu"},
 {id:"website-care",title:"Chăm sóc website",detail:"Sửa lỗi, cải thiện giao diện, tốc độ và bảo trì"},
 {id:"ai-integration",title:"Tích hợp AI",detail:"Tự động hóa công việc có kiểm duyệt và kiểm định"},
 {id:"other",title:"Cần tư vấn",detail:"Chưa chắc đâu là giải pháp phù hợp"}
] as const;
const stages=["Dịch vụ","Phạm vi","Thông tin liên hệ"] as const;

export function LaunchIntake(){
 const [step,setStep]=useState(0);
 const [service,setService]=useState("");
 const [goal,setGoal]=useState("");
 const [details,setDetails]=useState("");
 const [budget,setBudget]=useState("");
 const [timeline,setTimeline]=useState("");
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [error,setError]=useState("");
 const [copied,setCopied]=useState(false);
 const [draft,setDraft]=useState<ReturnType<typeof createInquiryEmailDraft>|null>(null);
 function invalidate(){setDraft(null);setError("");setCopied(false);}
 function next(){
  setError("");
  if(step===0&&!service){setError("Hãy chọn một lĩnh vực để tiếp tục.");return;}
  if(step===1&&details.trim().length<20){setError("Vui lòng mô tả vấn đề tối thiểu 20 ký tự.");return;}
  if(step<2){setStep(step+1);return;}
  try{
   const built=createInquiryEmailDraft({name,email,service,message:details,projectGoal:goal,budget,timeline},siteConfig.email);
   setDraft(built);setCopied(false);
  }catch(e){setError(e instanceof Error?e.message:"Vui lòng kiểm tra thông tin đã nhập.");}
 }
 async function copy(){
  if(!draft)return;
  try{await navigator.clipboard.writeText("Chủ đề: "+draft.subject+"\n\n"+draft.body);setCopied(true);setError("");}
  catch{setError("Không thể sao chép tự động. Hãy chọn phần nội dung bên dưới để sao chép.");}
 }
 return <div className="launch-flow">
  <div className="launch-flow-progress" aria-label="Tiến độ chuẩn bị yêu cầu">
   {stages.map((label,i)=><div key={label} className={step===i?"is-active":i<step?"is-complete":""}><span>0{i+1}</span><strong>{label}</strong></div>)}
  </div>
  <div className="launch-flow-body">
   {step===0&&<fieldset className="launch-flow-fieldset"><legend>Bạn đang cần giải quyết việc gì?</legend><p>Chọn hướng gần nhất. Athena sẽ trao đổi lại phạm vi trước khi báo giá.</p><div className="launch-service-grid">{services.map((s,i)=><button key={s.id} type="button" aria-pressed={service===s.id} onClick={()=>{setService(s.id);invalidate();}}><span>0{i+1}</span><strong>{s.title}</strong><small>{s.detail}</small><Icon name={service===s.id?"check":"arrow-up-right"} size={19}/></button>)}</div></fieldset>}
   {step===1&&<fieldset className="launch-flow-fieldset"><legend>Hãy mô tả dự án của bạn.</legend><p>Không gửi tài khoản đăng nhập, API key, mật khẩu hoặc thông tin nhạy cảm.</p>
    <label>Mục tiêu chính <span>(không bắt buộc)</span><input value={goal} onChange={e=>{setGoal(e.target.value);invalidate();}} maxLength={600} placeholder="Ví dụ: có website giới thiệu dịch vụ và nhận liên hệ"/></label>
    <label>Vấn đề hiện tại và kết quả mong muốn <span>*</span><textarea value={details} onChange={e=>{setDetails(e.target.value);invalidate();}} required minLength={20} maxLength={3500} rows={6} placeholder="Mô tả công việc, các trang hoặc tính năng cần có, website hiện tại (nếu có)..." /></label>
    <div className="launch-field-row"><label>Ngân sách định hướng <select value={budget} onChange={e=>{setBudget(e.target.value);invalidate();}}><option value="">Chưa xác định</option>{briefBudgets.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label><label>Thời gian mong muốn <select value={timeline} onChange={e=>{setTimeline(e.target.value);invalidate();}}><option value="">Chưa xác định</option>{briefTimelines.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label></div>
    <p className="launch-flow-footnote">Thông tin ngân sách và thời hạn chỉ để định hướng trao đổi, không phải báo giá hay cam kết bàn giao.</p>
   </fieldset>}
   {step===2&&<fieldset className="launch-flow-fieldset"><legend>Cách Athena liên hệ lại với bạn.</legend><p>Thông tin được dùng để tạo bản nháp email ngay trên thiết bị. Website không tự gửi hoặc lưu bản nháp.</p><div className="launch-field-row"><label>Họ tên <span>*</span><input value={name} onChange={e=>{setName(e.target.value);invalidate();}} autoComplete="name" maxLength={100} placeholder="Tên của bạn"/></label><label>Email liên hệ <span>*</span><input type="email" value={email} onChange={e=>{setEmail(e.target.value);invalidate();}} autoComplete="email" maxLength={200} placeholder="email@example.com"/></label></div>
    <div className="launch-summary"><strong>Tóm tắt yêu cầu</strong><div><span>Dịch vụ</span><b>{services.find(s=>s.id===service)?.title||"Chưa chọn"}</b></div><div><span>Mục tiêu</span><b>{goal||"Trao đổi thêm"}</b></div><div><span>Ngân sách</span><b>{briefBudgets.find(b=>b.value===budget)?.label||"Chưa xác định"}</b></div><div><span>Thời gian</span><b>{briefTimelines.find(t=>t.value===timeline)?.label||"Chưa xác định"}</b></div></div>
   </fieldset>}
   {error&&<p className="launch-flow-error" role="alert">{error}</p>}
   {draft&&<div className="launch-draft" role="status"><div><Icon name="check" size={22}/><strong>Đã chuẩn bị bản nháp — chưa gửi</strong></div><p>Chọn “Mở ứng dụng email” và tự xác nhận gửi. Athena chưa nhận được yêu cầu cho đến khi bạn gửi thư.</p><label htmlFor="launch-draft-preview">Xem lại nội dung</label><textarea id="launch-draft-preview" readOnly value={"Chủ đề: "+draft.subject+"\n\n"+draft.body} rows={9}/><div className="launch-draft-actions"><a href={draft.href} className="launch-flow-primary">Mở ứng dụng email <Icon name="arrow-up-right" size={18}/></a><button type="button" onClick={copy} className="launch-flow-secondary"><Icon name="copy" size={17}/>{copied?"Đã sao chép":"Sao chép bản nháp"}</button></div></div>}
   <div className="launch-flow-actions">{step>0&&<button type="button" className="launch-flow-back" onClick={()=>{setStep(step-1);invalidate();}}><Icon name="arrow-right" size={17}/> Quay lại</button>}{!draft&&<button type="button" className="launch-flow-primary" onClick={next}>{step<2?"Tiếp tục":"Chuẩn bị email yêu cầu"} <Icon name="arrow-right" size={18}/></button>}</div>
  </div>
  <div className="launch-flow-privacy"><Icon name="shield" size={18}/><p>Không cần đăng ký tài khoản. Không có thanh toán, đăng ký dịch vụ tự động hay dữ liệu lưu trên máy chủ trong quy trình này. <Link href="/legal/privacy">Quyền riêng tư</Link>.</p></div>
 </div>;
}
