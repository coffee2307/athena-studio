"use client";
import Image from "next/image";
import {useCallback,useEffect,useRef,useState} from "react";
import {Icon} from "@/components/ui/Icon";
import {contactChannels,consultationEmail,consultationGmail,consultationOutlook,consultationText} from "@/lib/contact-channels";
type Channel="phone"|"zalo"|"whatsapp"|"email";
const channels:{id:Channel;label:string;href:string;qr?:string;icon?:string}[]=[
 {id:"phone",label:"Gọi điện",href:contactChannels.phone,qr:"/qr/phone.png"},
 {id:"zalo",label:"Zalo",href:contactChannels.zalo,qr:"/qr/zalo.png",icon:"/branding/zalo-provided.svg"},
 {id:"whatsapp",label:"WhatsApp",href:contactChannels.whatsapp,qr:"/qr/whatsapp.png",icon:"/branding/whatsapp-provided.svg"},
 {id:"email",label:"Email",href:consultationEmail}
];
export function ContactDock(){
 const [active,setActive]=useState<Channel|null>(null);
 const [copied,setCopied]=useState(false);
 const closer=useRef<HTMLButtonElement>(null);
 const previous=useRef<HTMLElement|null>(null);
 const close=useCallback(()=>{setActive(null);previous.current?.focus();},[]);
 useEffect(()=>{
  const open=(e:Event)=>{
   const channel=(e as CustomEvent<{channel:Channel}>).detail?.channel;
   if(channels.some(c=>c.id===channel)){
    previous.current=document.activeElement as HTMLElement;
    setCopied(false);setActive(channel);
   }
  };
  window.addEventListener("athena:open-contact",open);
  return()=>window.removeEventListener("athena:open-contact",open);
 },[]);
 useEffect(()=>{
  if(!active)return;
  const old=document.body.style.overflow;document.body.style.overflow="hidden";
  closer.current?.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();close();}
   if(e.key==="Tab"){
    const focus=Array.from(document.querySelectorAll<HTMLElement>(".athena-contact-dialog a[href],.athena-contact-dialog button:not([disabled])"));
    if(!focus.length)return;
    const first=focus[0],last=focus[focus.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener("keydown",key);
  return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",key);};
 },[active,close]);
 function openChannel(e:React.MouseEvent<HTMLAnchorElement>,id:Channel){
  // Touchscreen/mobile: use the phone's native application when available.
  if(window.matchMedia("(hover: none) and (pointer: coarse)").matches)return;
  e.preventDefault();
  previous.current=e.currentTarget;setCopied(false);setActive(id);
 }
 async function copy(value:string){
  try{await navigator.clipboard.writeText(value);setCopied(true);}
  catch{setCopied(false);}
 }
 const choice=channels.find(c=>c.id===active);
 return <>
  <nav className="agency-contact-dock" aria-label="Liên hệ nhanh">
   {channels.filter(c=>c.id!=="email").map(c=><a key={c.id} href={c.href}
     className={"agency-contact-action agency-contact-action-"+c.id}
     aria-label={c.id==="phone"?"Gọi điện trực tiếp cho Athena":"Mở "+c.label+" với số liên hệ Athena"}
     target={c.id==="phone"?undefined:"_blank"} rel={c.id==="phone"?undefined:"noopener noreferrer"}
     onClick={e=>openChannel(e,c.id)}>
    {c.icon?<Image src={c.icon} width={31} height={31} alt="" aria-hidden="true"/>:<Icon name="phone" size={22}/>}
    <span>{c.id==="phone"?"Gọi ngay":c.label}</span>
   </a>)}
  </nav>
  {choice&&<div className="athena-contact-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}>
   <section className="athena-contact-dialog" role="dialog" aria-modal="true" aria-labelledby="athena-contact-title">
    <div className="athena-contact-head"><span>ATHENA / LIÊN HỆ TRỰC TIẾP</span>
     <button ref={closer} aria-label="Đóng cửa sổ liên hệ" onClick={close}><Icon name="x" size={20}/></button>
    </div>
    <div className="athena-contact-tabs" role="group" aria-label="Chọn kênh liên hệ">
     {channels.map(c=><button key={c.id} type="button" className={active===c.id?"is-active":""}
       onClick={()=>{setCopied(false);setActive(c.id);}} aria-pressed={active===c.id}>{c.label}</button>)}
    </div>
    <h2 id="athena-contact-title">{active==="email"?"Soạn yêu cầu tư vấn":active==="phone"?"Gọi Athena trực tiếp":"Liên hệ qua "+choice.label}</h2>
    {active==="email"?<>
     <p>Chọn ứng dụng email trên web, hoặc sao chép nội dung thư để gửi thủ công. Không cần cài ứng dụng email trên máy tính.</p>
     <div className="athena-email-address">coffee2307@gmail.com</div>
     <div className="athena-contact-buttons">
      <a href={consultationGmail} target="_blank" rel="noopener noreferrer" className="athena-contact-primary">Soạn bằng Gmail <Icon name="arrow-up-right" size={16}/></a>
      <a href={consultationOutlook} target="_blank" rel="noopener noreferrer">Soạn bằng Outlook <Icon name="arrow-up-right" size={16}/></a>
      <a href={consultationEmail}>Mở ứng dụng email <Icon name="arrow-up-right" size={16}/></a>
      <button onClick={()=>copy(consultationText)}>Sao chép nội dung thư <Icon name="arrow-right" size={16}/></button>
     </div>
    </>:<>
     <p>{active==="phone"?"Dùng điện thoại quét mã QR để mở bàn phím gọi điện đã điền sẵn số.":"Quét mã QR bằng camera điện thoại hoặc nhấn nút bên dưới để mở "+choice.label+"."}</p>
     {choice.qr&&<div className="athena-contact-qr"><Image src={choice.qr} alt={"Mã QR liên hệ "+choice.label} width={186} height={186} unoptimized/></div>}
     <strong className="athena-contact-number">0965 747 147</strong>
     <div className="athena-contact-buttons">
      <a href={choice.href} target={active==="phone"?undefined:"_blank"} rel={active==="phone"?undefined:"noopener noreferrer"} className="athena-contact-primary">
       {active==="phone"?"Mở ứng dụng gọi điện":"Mở "+choice.label} <Icon name="arrow-up-right" size={16}/>
      </a>
      <button onClick={()=>copy("0965747147")}>Sao chép số điện thoại <Icon name="arrow-right" size={16}/></button>
     </div>
    </>}
    <p className="athena-copy-feedback" role="status">{copied?"Đã sao chép vào bộ nhớ tạm.":""}</p>
   </section>
  </div>}
 </>;
}
