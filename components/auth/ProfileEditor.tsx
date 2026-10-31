"use client";
import {createAuthClient} from "better-auth/react";
import {useState,type FormEvent} from "react";
export function ProfileEditor({name}:{name:string}){
 const [value,setValue]=useState(name);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState<"idle"|"saved"|"error">("idle");
 async function save(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const next=value.trim();
  if(next.length<2||next.length>80||busy)return;
  setBusy(true);setStatus("idle");
  try{
   const client=createAuthClient({baseURL:window.location.origin,basePath:"/api/identity"});
   const result=await client.updateUser({name:next});
   if(result.error)setStatus("error");
   else{setStatus("saved");window.dispatchEvent(new Event("athena:session-changed"));}
  }catch{setStatus("error");}
  finally{setBusy(false);}
 }
 return <form onSubmit={save} className="athena-profile-form">
  <label htmlFor="athena-profile-name">Tên hiển thị</label>
  <input id="athena-profile-name" value={value} onChange={e=>{setValue(e.target.value);setStatus("idle");}} autoComplete="name" minLength={2} maxLength={80} required/>
  <button type="submit" className="pill-link pill-dark" disabled={busy||value.trim().length<2}>{busy?"Đang lưu…":"Lưu tên hiển thị "}</button>
  <span role="status" className={status==="error"?"athena-profile-error":"athena-profile-status"}>{status==="saved"?"Đã cập nhật hồ sơ.":status==="error"?"Không thể cập nhật, vui lòng thử lại.":""}</span>
 </form>;
}
