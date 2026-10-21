"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {contactChannels} from "@/lib/contact-channels";

export function ContactDock(){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!open)return;
  const onPointer=(e:PointerEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(false);};
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false);};
  document.addEventListener("pointerdown",onPointer);
  document.addEventListener("keydown",onKey);
  return()=>{document.removeEventListener("pointerdown",onPointer);document.removeEventListener("keydown",onKey);};
 },[open]);
 return <div className="agency-contact-dock" ref={ref}>
  <div className={open?"agency-dock-options is-open":"agency-dock-options"} id="athena-contact-channels" inert={!open}>
   <a href={contactChannels.phone}><Icon name="phone" size={18}/><span>Gọi điện</span></a>
   <a href={contactChannels.email}><Icon name="mail" size={18}/><span>Gửi email</span></a>
   {contactChannels.zalo&&<a href={contactChannels.zalo} target="_blank" rel="noopener noreferrer"><span className="agency-brand-icon">Z</span><span>Nhắn Zalo</span></a>}
   {contactChannels.whatsapp&&<a href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="message" size={18}/><span>WhatsApp</span></a>}
   <Link href="/lien-he"><Icon name="briefcase" size={18}/><span>Yêu cầu tư vấn</span></Link>
  </div>
  <button type="button" className="agency-dock-trigger" aria-label={open?"Đóng các kênh liên hệ":"Mở các kênh liên hệ"}
   aria-controls="athena-contact-channels" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
   <Icon name={open?"x":"message"} size={21}/><span>{open?"Đóng":"Liên hệ"}</span>
  </button>
 </div>;
}
