import Image from "next/image";
import type {Project} from "@/types/project";
import {Icon} from "@/components/ui/Icon";

export function ProjectGallery({project}:{project:Project}){
 const items=project.gallery.filter(item=>item.rightsVerified);
 if(!items.length)return <div className="ae-article-no-image" role="note">
  <Icon name="shield" size={24}/><div><h3>Chưa có ảnh giao diện được phép công bố</h3><p>Hồ sơ chỉ giới thiệu phạm vi công việc và tiến độ nghiên cứu. Athena không công bố dashboard, thông tin truy cập hoặc dữ liệu nội bộ chưa được duyệt.</p></div>
 </div>;
 return <div className="ae-article-gallery">
  {items.map((item,i)=>{
   const mobile=/(?:-mobile\.webp|mobile\.)/.test(item.src);
   const landscape=mobile?false:true;
   const dimensions=mobile?{width:390,height:844}:{width:1440,height:900};
   return <figure className={"ae-article-figure "+(landscape?"is-landscape":"is-portrait")} key={item.src}>
    <a className="ae-article-image-link" href={item.src} target="_blank" rel="noopener noreferrer" aria-label={"Mở ảnh gốc: "+item.alt}>
     <Image src={item.src} {...dimensions} alt={item.alt} unoptimized sizes={landscape?"(max-width: 760px) 100vw, 940px":"(max-width: 760px) 85vw, 420px"}/>
    </a>
    <figcaption><strong>Hình {i+1}.</strong> {item.caption}<span> Xem ảnh gốc ↗</span></figcaption>
   </figure>;
  })}
 </div>;
}