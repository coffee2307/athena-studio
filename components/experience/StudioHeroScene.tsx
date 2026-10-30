"use client";
import {useState} from "react";
const scenes={
 process:[
  {label:"01–02",title:"Lắng nghe",detail:"Nhu cầu và hiện trạng"},
  {label:"03–04",title:"Tạo hình",detail:"Phạm vi, bản thử và phản hồi"},
  {label:"05–06",title:"Bàn giao",detail:"Kiểm thử và hỗ trợ"}
 ],
 about:[
  {label:"01",title:"Website",detail:"Bản sắc đi cùng chức năng"},
  {label:"02",title:"Care",detail:"Hệ thống được chăm sóc"},
  {label:"03",title:"AI",detail:"Tự động hóa có kiểm chứng"}
 ]
} as const;
export function StudioHeroScene({mode}:{mode:"process"|"about"}){
 const [active,setActive]=useState(0);
 const items=scenes[mode];
 return <div className={"dna02-page-hero-scene dna02-page-hero-"+mode} aria-label={mode==="process"?"Ba chặng trong hành trình hợp tác":"Ba lĩnh vực Athena hỗ trợ"}>
  <div className="dna02-page-scene-head"><span>{mode==="process"?"ATHENA / THE PROCESS":"ATHENA / CREATIVE ENGINEERING"}</span><span>0{active+1} / 03</span></div>
  <div className="dna02-page-scene-art" aria-hidden="true"><i/><strong>{items[active].label}</strong><span>✳</span></div>
  <div className="dna02-page-scene-options" role="group" aria-label="Khám phá các lĩnh vực">
   {items.map((s,i)=><button type="button" key={s.label} onClick={()=>setActive(i)} aria-pressed={active===i}>{s.title}</button>)}
  </div>
  <p className="dna02-page-scene-caption" aria-live="polite">{items[active].detail}</p>
 </div>;
}
