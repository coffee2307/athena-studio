"use client";

import Link from "next/link";
import {useId,useState,type FormEvent} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

type Section="work"|"detail"|"services"|"about"|"contact";
type Props={section:Section;itemIndex?:number;world:DemoCopy;extra:WorldDetail};
const base="/template-demos/auto-showroom";
const Pad=({number}:{number:string})=><span className="velar-index">{number} / VELAR</span>;
const Arrow=()=> <span aria-hidden="true">↗</span>;
function Breadcrumb({label}:{label:string}){
 return <nav className="velar-crumb" aria-label="Đường dẫn trang"><Link href={base}>VELAR</Link><span>/</span><span>{label}</span></nav>;
}

export function AutoShowroomSubpages({section,itemIndex=1,world,extra}:Props){
 const current=Math.max(0,Math.min(itemIndex-1,world.cards.length-1));
 const card=world.cards[current];
 const next=(current+1)%world.cards.length;
 const [submitted,setSubmitted]=useState(false);
 const uid=useId();
 const detailUrl=(index:number)=>base+"/work/"+(index+1);
 const title="BLACK VELOCITY";
 const closing=<p className="velar-disclaimer">VELAR là trải nghiệm showroom tương tác mô phỏng. Mô hình 3D không đại diện cho một mẫu xe được phân phối hay thông số kỹ thuật được xác minh.</p>;
 return <main className={"velar-pages velar-"+section} id="world-main" data-sector="automotive">
  {section==="work"&&<>
   <section className="velar-work-head">
    <Breadcrumb label="Design studies"/>
    <div className="velar-work-title"><div><Pad number="01"/><h1>ONE CAR.<br/><em>THREE READINGS.</em></h1></div><p>Không cần ba bộ ảnh của cùng một mô hình. Khám phá ba khía cạnh của một ngôn ngữ thiết kế, hoặc mở trực tiếp chiếc xe 3D để tự tìm góc nhìn của bạn.</p></div>
    <Link className="velar-primary" href={base+"/experience"}>TƯƠNG TÁC VỚI MÔ HÌNH 3D <Arrow/></Link>
   </section>
   <section className="velar-work-index" aria-label="Ba hướng nghiên cứu">
    {world.cards.map((item,index)=><Link href={detailUrl(index)} className="velar-study-row" key={item.title}>
     <span className="velar-study-number">0{index+1}</span><div><small>{item.label}</small><h2>{item.title}</h2><p>{item.text}</p></div><span className="velar-row-arrow"><Arrow/></span>
    </Link>)}
   </section>
   <div className="velar-work-end"><span>FORM / SURFACE / AERODYNAMICS</span><span>01 — 03</span></div>
   {closing}
  </>}
  {section==="detail"&&<>
   <section className="velar-detail-head">
    <Breadcrumb label={"Study 0"+(current+1)}/>
    <div className="velar-detail-back"><Link href={base+"/work"}>← TRỞ LẠI DESIGN STUDIES</Link><Pad number={"0"+(current+1)}/></div>
    <span className="velar-detail-tag">{card.label}</span>
    <h1>{card.title}</h1><p>{card.text}</p>
   </section>
   <section className="velar-detail-body">
    <div className="velar-detail-poster" aria-label="Đồ họa nghiên cứu hình khối">
     <span>V / {title}</span><strong>0{current+1}</strong><i aria-hidden="true"/>
     <small>OBSERVE THE FORM<br/>NOT ANOTHER SCREENSHOT</small>
    </div>
    <div className="velar-detail-notes"><Pad number="DESIGN NOTE"/><h2>{extra.services[current]?.title??"Detail in motion"}</h2><p>{extra.services[current]?.detail??extra.approach}</p><p>{extra.approach}</p><Link className="velar-inline" href={base+"/experience"}>QUAN SÁT TRỰC TIẾP TRÊN XE 3D <Arrow/></Link></div>
   </section>
   <Link href={detailUrl(next)} className="velar-detail-next"><span>NEXT PERSPECTIVE / 0{next+1}</span><strong>{world.cards[next].title}</strong><Arrow/></Link>{closing}
  </>}
  {section==="services"&&<>
   <section className="velar-services-head"><Breadcrumb label="Experience design"/><Pad number="02"/><h1>DESIGNED<br/><em>TO EXPLORE.</em></h1><p>Một showroom số được xây quanh việc quan sát, chuyển động và cảm nhận vật liệu — không phải những hiệu ứng phô trương.</p></section>
   <section className="velar-process" aria-label="Thành phần trải nghiệm">
    <div className="velar-process-title"><span>THE EXPERIENCE</span><h2>Ít giao diện.<br/>Nhiều không gian.</h2><Link className="velar-inline" href={base+"/experience"}>MỞ SHOWROOM 3D <Arrow/></Link></div>
    <div className="velar-process-list">{extra.services.map((item,index)=><details key={item.number} open={index===0}><summary><span>0{index+1}</span><strong>{item.title}</strong><span aria-hidden="true">+</span></summary><p>{item.detail}</p><small>{item.outcome}</small></details>)}</div>
   </section>
   <div className="velar-process-bottom"><span>INTERACTION / RESPONSIVE / MATERIAL</span><Link href={base+"/contact"}>GỬI YÊU CẦU DEMO <Arrow/></Link></div>{closing}
  </>}
  {section==="about"&&<>
   <section className="velar-about-head"><Breadcrumb label="Design philosophy"/><Pad number="03"/><span className="velar-overline">A STUDY IN RESTRAINT</span><h1>LESS NOISE.<br/><em>MORE FORM.</em></h1><p>BLACK VELOCITY là bản trình diễn cách một trải nghiệm xe 3D có thể trở nên tập trung: cho phép đường nét, chiều sâu và vật liệu tự kể câu chuyện.</p></section>
   <section className="velar-about-principles"><div><span>OUR POINT OF VIEW</span><h2>Không gian để<br/>nhìn kỹ hơn.</h2><p>{extra.story}</p></div><ol>{extra.principles.map((item,index)=><li key={item}><span>0{index+1}</span><strong>{item}</strong></li>)}</ol></section>
   <section className="velar-about-close"><span>THE ONLY SHOWROOM THAT MATTERS IS THE ONE YOU CAN EXPLORE.</span><Link className="velar-primary" href={base+"/experience"}>TRẢI NGHIỆM 3D <Arrow/></Link></section>{closing}
  </>}
  {section==="contact"&&<>
   <section className="velar-contact-head"><Breadcrumb label="Enquiry"/><Pad number="04"/><h1>LET&apos;S TALK<br/><em>EXPERIENCE.</em></h1><p>Chia sẻ hướng trải nghiệm bạn muốn thử. Đây là biểu mẫu mô phỏng, không gửi dữ liệu hay tạo yêu cầu tư vấn xe thực tế.</p></section>
   <section className="velar-contact-main">
    <aside><span>01 / YOUR ENQUIRY</span><h2>Start with<br/>one idea.</h2><p>{extra.contactIntro}</p><div><strong>DEMO STATUS</strong><span>Không gửi dữ liệu lên máy chủ.</span></div></aside>
    <form onSubmit={(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setSubmitted(true);}}>
     <div className="velar-form-pair"><label htmlFor={uid+"-name"}>Tên của bạn *<input id={uid+"-name"} autoComplete="name" required minLength={2} placeholder="Họ và tên"/></label><label htmlFor={uid+"-email"}>Email *<input id={uid+"-email"} type="email" autoComplete="email" required placeholder="ten@example.com"/></label></div>
     <label htmlFor={uid+"-topic"}>Nội dung quan tâm *<select id={uid+"-topic"} required defaultValue=""><option value="" disabled>Chọn một hướng trải nghiệm</option>{extra.services.map(item=><option key={item.number} value={item.title}>{item.title}</option>)}<option value="other">Trao đổi khác</option></select></label>
     <label htmlFor={uid+"-message"}>Lời nhắn *<textarea id={uid+"-message"} minLength={10} required rows={5} placeholder="Bạn muốn khám phá điều gì?"/></label>
     <p className="velar-form-note">Mọi thao tác chỉ được mô phỏng ngay trên trình duyệt. Không có yêu cầu, thanh toán hay lịch hẹn thực tế.</p>
     <button type="submit" className="velar-primary">THỬ GỬI YÊU CẦU <Arrow/></button>
     {submitted&&<p role="status" className="velar-success">Đã mô phỏng gửi thành công. Không có dữ liệu nào được chuyển đi.</p>}
    </form>
   </section>{closing}
  </>}
 </main>;
}
