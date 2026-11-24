"use client";
import {useState} from "react";
import Link from "next/link";
import s from "./NESTWalkthrough.module.css";

const areas=[
 {name:"Khu sinh hoạt",code:"LIVING",focus:"Cách ánh sáng đi qua căn phòng",question:"Cửa sổ đón nắng hướng nào? Bàn ghế có cản lối đi lại?",image:0,caption:"Hãy nhìn hướng sáng trước khi nhìn cách trang trí."},
 {name:"Góc nghỉ",code:"RETREAT",focus:"Khoảng yên tĩnh và sự riêng tư",question:"Có đủ yên tĩnh để đọc sách, nghỉ ngơi hoặc làm việc tập trung?",image:1,caption:"Sự riêng tư là một phần của công năng."},
 {name:"Kết nối",code:"FLOW",focus:"Khoảng chuyển tiếp giữa các khu vực",question:"Việc di chuyển giữa các phòng có tự nhiên và thoải mái không?",image:2,caption:"Sơ đồ đẹp chưa chắc là một ngôi nhà thuận tiện."}
];
export function NESTWalkthrough({basePath,assetBase,images}:{basePath:string;assetBase:string;images:string[]}){
 const [active,setActive]=useState(0);
 const [inspected,setInspected]=useState<boolean[]>([false,false,false]);
 const selected=areas[active],image=(i:number)=>assetBase+images[i%images.length];
 return <section className={s.walkthrough} aria-labelledby="nest-walkthrough-title">
 <header className={s.eyebrow}><span>GHI CHÉP VỀ KHÔNG GIAN SỐNG</span><span>SƠ ĐỒ MINH HỌA, KHÔNG PHẢI CĂN HỘ THẬT</span></header>
 <div className={s.opening}><h2 id="nest-walkthrough-title">Một căn nhà,<br/><em>nhiều cách quan sát.</em></h2><p>Khám phá ba khu vực trong sơ đồ giả lập. Những câu hỏi nhỏ dưới đây giúp trải nghiệm xem nhà rõ ràng hơn mà không cần dựa vào thông số quảng cáo.</p></div>
 <div className={s.workspace}>
  <div className={s.planArea}><div className={s.planCaption}><strong>SƠ ĐỒ CÔNG NĂNG</strong><span>CHỌN KHU VỰC ĐỂ KHÁM PHÁ</span></div><div className={s.plan} role="group" aria-label="Sơ đồ không gian mang tính minh họa">
   <button className={s.roomLiving} type="button" aria-pressed={active===0} onClick={()=>setActive(0)}><span>01</span><strong>Phòng sinh hoạt</strong></button>
   <button className={s.roomQuiet} type="button" aria-pressed={active===1} onClick={()=>setActive(1)}><span>02</span><strong>Góc nghỉ</strong></button>
   <button className={s.roomPassage} type="button" aria-pressed={active===2} onClick={()=>setActive(2)}><span>03</span><strong>Liên kết</strong></button>
  </div><div className={s.legend}><span>◻ SƠ ĐỒ MANG TÍNH MINH HỌA, KHÔNG CÓ TỶ LỆ THỰC</span><span>HƯỚNG QUAN SÁT / 0{active+1}</span></div></div>
  <article className={s.insight}><div className={s.visual}><img key={active} src={image(selected.image)} alt={"Minh họa khu vực "+selected.name}/><span>{selected.code} / 0{active+1}</span></div><div className={s.summary} aria-live="polite"><small>ĐIỀU ĐÁNG QUAN SÁT</small><h3>{selected.focus}</h3><p>{selected.question}</p><blockquote>{selected.caption}</blockquote><label className={s.check}><input type="checkbox" checked={inspected[active]} onChange={e=>setInspected(v=>v.map((x,i)=>i===active?e.target.checked:x))}/><span>Đã xem nội dung khu vực này</span></label></div></article>
 </div>
 <footer className={s.end}><div><span>ĐÃ KHÁM PHÁ {inspected.filter(Boolean).length}/03 KHU VỰC</span><div aria-label="Tiến độ khám phá">{inspected.map((x,i)=><span key={i} className={x?s.done:""}/>)}</div></div><Link href={basePath+"/work"}>Xem toàn bộ hồ sơ không gian </Link></footer>
 </section>;
}