"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import s from "./Sora.module.css";

const pages=[
 {eyebrow:"01 / NHẬN DIỆN",title:"Một dấu ấn",note:"Hình ảnh mang theo tính cách.",accent:"NẾP",index:1},
 {eyebrow:"02 / KHÔNG GIAN",title:"Một cảm giác",note:"Ánh sáng mở đầu câu chuyện.",accent:"LẶNG",index:3},
 {eyebrow:"03 / TRẢI NGHIỆM",title:"Một chuyển động",note:"Khi giao diện biết lắng nghe.",accent:"MÙA",index:4}
] as const;
export function SoraLivingCover({images,workHref}:{images:string[];workHref:string}){
 const [page,setPage]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 const gesture=useRef<{id:number;x:number;y:number;enabled:boolean}|null>(null);
 const next=(delta:number)=>setPage(p=>(p+delta+pages.length)%pages.length);
 const down=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(e.pointerType!=="mouse"||e.button!==0||!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
  gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,enabled:true};
  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.dataset.dragging="true";
 };
 const move=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!gesture.current||gesture.current.id!==e.pointerId||!gesture.current.enabled)return;
  const dx=Math.max(-58,Math.min(58,e.clientX-gesture.current.x));
  const dy=Math.max(-24,Math.min(24,e.clientY-gesture.current.y));
  stage.current?.style.setProperty("--sora-drag-x",dx+"px");
  stage.current?.style.setProperty("--sora-drag-y",dy+"px");
 };
 const up=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!gesture.current||gesture.current.id!==e.pointerId)return;
  const dx=e.clientX-gesture.current.x;
  gesture.current=null;
  e.currentTarget.dataset.dragging="false";
  stage.current?.style.setProperty("--sora-drag-x","0px");
  stage.current?.style.setProperty("--sora-drag-y","0px");
  if(Math.abs(dx)>45)next(dx<0?1:-1);
 };
 return <section className={s.livingHero} data-sora-ambient aria-label="Trang bìa tạp chí sáng tạo SORA">
  <div className={s.livingWords}>
   <div className={s.issueTop}><span>SORA / TẠP CHÍ SÁNG TẠO</span><span>ẤN BẢN 01 — 2026</span></div>
   <h1><span>Ý tưởng</span><br/><em>có đời</em><br/>sống riêng.</h1>
   <p>Không chỉ để ngắm nhìn. Mỗi ý tưởng đều có chất liệu, một cá tính và một câu chuyện để khám phá.</p>
   <div className={s.livingActions}><Link href={workHref} className={s.livingPrimary}>Khám phá tuyển tập <span aria-hidden="true">→</span></Link><a href="#sora-manifesto" className={s.livingSecondary}>Lật sang trang sau <span aria-hidden="true">↓</span></a></div>
   <div className={s.livingPagePicker} role="group" aria-label="Thay đổi trang bìa">
    {pages.map((p,i)=><button key={p.eyebrow} type="button" aria-label={"Xem "+p.eyebrow} aria-pressed={page===i} onClick={()=>setPage(i)}><span>0{i+1}</span><i/></button>)}
    <span className={s.livingHint}>Chọn một câu chuyện</span>
   </div>
  </div>
  <div className={s.livingVisual} data-sora-parallax data-cover={page}>
   <div className={s.livingArtboard} ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-dragging="false">
    <div className={s.livingGridTexture} aria-hidden="true"/>
    <div className={s.livingCardBehind} aria-hidden="true"><span>THƯ VIỆN / HÌNH ẢNH</span><strong>MAKE<br/>IT<br/>FEEL.</strong><small>một góc nhìn khác</small></div>
    <figure className={s.livingPhoto} key={"living-"+page}>
     <img src={images[pages[page].index]||images[0]} alt={"Bìa số "+(page+1)+": "+pages[page].title}/>
     <figcaption>{pages[page].eyebrow} <span>— {pages[page].title}</span></figcaption>
    </figure>
    <div className={s.livingPaperCutout} aria-hidden="true"><span>THE ART OF</span><strong>{pages[page].accent}</strong><small>{pages[page].note}</small></div>
    <div className={s.livingSeal} aria-hidden="true"><span>SORA<br/>ISSUE</span><strong>01</strong></div>
    <div className={s.livingMarginNote} aria-hidden="true">KẾT HỢP / THỬ NGHIỆM / KHÁM PHÁ</div>
   </div>
   <div className={s.livingArtworkControls}>
    <span className={s.dragHint}>KÉO ẢNH ĐỂ ĐỔI TRANG / HOẶC CHẠM NÚT</span>
    <div className={s.livingArrows}><button type="button" onClick={()=>next(-1)} aria-label="Trang bìa trước">←</button><button type="button" onClick={()=>next(1)} aria-label="Trang bìa tiếp theo">→</button></div>
   </div>
  </div>
  <div className={s.livingFolio} aria-hidden="true"><span>SORA / 01</span><span>HÌNH ẢNH • CÂU CHUYỆN • CHUYỂN ĐỘNG</span></div>
 </section>;
}
