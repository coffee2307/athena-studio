"use client";
import {useState} from "react";
import s from "./Sora.module.css";

const topics=[
 {title:"Nhận diện thương hiệu",subtitle:"Thiết kế logo, bảng màu, kiểu chữ và các ấn phẩm thương hiệu.",monogram:"N",token:"LOGO & NHẬN DIỆN"},
 {title:"Website sáng tạo",subtitle:"Thiết kế giao diện, trang nội dung và các tính năng tương tác.",monogram:"W",token:"THIẾT KẾ WEBSITE"},
 {title:"Chiến dịch hình ảnh",subtitle:"Thiết kế ảnh quảng cáo, banner và bài đăng mạng xã hội.",monogram:"C",token:"HÌNH ẢNH QUẢNG BÁ"}
] as const;

export function SoraLetterDesk(){
 const [choice,setChoice]=useState(0);
 const [brief,setBrief]=useState("");
 const [copied,setCopied]=useState("");
 const text="SORA / "+topics[choice].title+"\n\n"+(brief.trim()||"Tôi muốn trao đổi về các hạng mục thiết kế và yêu cầu cụ thể.")+"\n\n— Thư nháp từ website demo SORA";
 const emailHref="mailto:?subject="+encodeURIComponent("SORA / "+topics[choice].title)+"&body="+encodeURIComponent(text);
 const copy=async()=>{
  try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(text);setCopied("Đã sao chép thư nháp.");}
  catch{setCopied("Trình duyệt không cho phép sao chép. Hãy chọn nội dung trong thư nháp để sao chép.");}
 };
 return <form className={s.letterDesk} onSubmit={e=>{e.preventDefault();window.location.href=emailHref;}} aria-label="Soạn thư gửi SORA">
  <fieldset className={s.letterSubjects}><legend>Bạn cần thiết kế nội dung gì?</legend>
   <p>Chọn một dịch vụ rồi mô tả yêu cầu của bạn.</p>
   <div className={s.letterOptions}>{topics.map((t,i)=><label className={s.letterOption} data-chosen={choice===i} key={t.title}>
    <input type="radio" name="sora-topic" value={t.title} checked={choice===i} onChange={()=>{setChoice(i);setCopied("");}}/>
    <span className={s.letterOptionArt} aria-hidden="true">{t.monogram}</span>
    <span className={s.letterOptionBody}><strong>{t.title}</strong><small>{t.subtitle}</small></span>
    <span className={s.letterOptionCheck} aria-hidden="true">{choice===i?"●":"○"}</span>
   </label>)}</div>
  </fieldset>
  <div className={s.letterWriting}><label htmlFor="sora-brief">Ý tưởng của bạn</label>
   <textarea id="sora-brief" value={brief} onChange={e=>{setBrief(e.target.value);setCopied("");}} maxLength={2000} placeholder="Ví dụ: Tôi cần website giới thiệu sản phẩm, trang liên hệ và biểu mẫu tư vấn." rows={5}/>
   <span className={s.letterCharacters}>{brief.length} / 2000</span>
  </div>
  <div className={s.letterPreview} aria-label="Xem trước nội dung thư">
   <div className={s.letterPreviewHeader}><span>THƯ NHÁP / SỐ 01</span><span>ĐƯỢC VIẾT BỞI BẠN</span></div>
   <div className={s.letterPreviewMain}><div className={s.letterPreviewMark} aria-hidden="true">{topics[choice].monogram}</div>
    <div><small>{topics[choice].token}</small><h2>{topics[choice].title}</h2><p>{brief.trim()||"Nội dung yêu cầu của bạn sẽ xuất hiện tại đây. Hãy ghi các hạng mục cần thiết kế và mục đích sử dụng."}</p></div>
   </div>
   <div className={s.letterPreviewFooter}>SORA / BẢN NHÁP YÊU CẦU THIẾT KẾ</div>
  </div>
  <div className={s.letterCommands}>
   <button type="button" onClick={copy} className={s.letterCopy}>Sao chép thư <span aria-hidden="true">⧉</span></button>
   <button type="submit" className={s.letterSend}>Soạn trong email <span aria-hidden="true">→</span></button>
  </div>
  <p className={s.letterStatus} role="status">{copied||"Bản mẫu không gửi dữ liệu lên máy chủ. Nút email mở trình soạn thư, không có địa chỉ nhận được thiết lập sẵn."}</p>
 </form>;
}
