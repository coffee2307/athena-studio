"use client";
import {useState} from "react";
import Link from "next/link";
import s from "./WellnessJournal.module.css";

const moments=[
 {name:"Một khoảng yên",duration:"05 phút",purpose:"Tạm dừng",task:"Đặt điện thoại sang một bên. Ngồi ở nơi thoải mái và quan sát những âm thanh xung quanh.",caption:"Một khoảng trống nhỏ giữa các công việc.",image:2},
 {name:"Một chút chuyển động",duration:"15 phút",purpose:"Vận động nhẹ",task:"Chọn những động tác dễ chịu hoặc đi bộ chậm. Không cần theo đuổi một con số hoàn hảo.",caption:"Để cơ thể tự tìm nhịp phù hợp.",image:3},
 {name:"Một góc của riêng mình",duration:"20 phút",purpose:"Chăm sóc",task:"Sắp lại một góc nhỏ, mở cửa lấy ánh sáng và chuẩn bị điều gì đó mình thích.",caption:"Chăm sóc không nhất thiết phải phức tạp.",image:4}
];
export function WellnessJournal({basePath,assetBase,images}:{basePath:string;assetBase:string;images:string[]}){
 const [selected,setSelected]=useState(0);
 const current=moments[selected];
 const photo=(i:number)=>assetBase+images[i%images.length];
 return <div className={s.journal}>
  <section className={s.chapter} aria-labelledby="an-nhien-moments-title">
   <div className={s.intro}><p>MỘT NHẬT KÝ NHỎ / CARE JOURNAL</p><h2 id="an-nhien-moments-title">Ngày hôm nay,<br/><em>bạn muốn dành thời gian</em><br/>cho điều gì?</h2><span>Không có lịch trình bắt buộc. Hãy chọn một khoảnh khắc phù hợp với bạn.</span></div>
   <div className={s.workspace}>
    <figure className={s.ambient}><img key={selected} src={photo(current.image)} alt={"Ảnh minh họa cho "+current.name}/><figcaption><span>AN NHIÊN / {current.duration}</span><span>{current.purpose}</span></figcaption></figure>
    <div className={s.entry}>
     <p>CHỌN MỘT KHOẢNG DỪNG</p>
     <div className={s.options} role="group" aria-label="Chọn khoảng thời gian">{moments.map((x,i)=><button type="button" key={x.name} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>{x.duration}</span><strong>{x.name}</strong><span aria-hidden="true">{selected===i?"●":"○"}</span></button>)}</div>
     <div className={s.reading} aria-live="polite"><span>GỢI Ý / {current.purpose}</span><h3>{current.caption}</h3><p>{current.task}</p></div>
     <Link href={basePath+"/work/"+(selected+1)}>Đọc thêm về khoảnh khắc này <span aria-hidden="true">→</span></Link>
    </div>
   </div>
  </section>
  <section className={s.lastWord}><div><span>NOTES FROM A QUIETER DAY</span><p>Những điều giản dị<br/>cũng xứng đáng có chỗ<br/><em>trong một ngày bận rộn.</em></p><small>Nội dung là gợi ý sinh hoạt chung, không thay thế tư vấn sức khỏe.</small></div><img src={photo(1)} alt="Không gian yên tĩnh minh họa"/></section>
 </div>;
}