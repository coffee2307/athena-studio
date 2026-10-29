import Image from "next/image";
import type {Project} from "@/types/project";
import {Icon} from "@/components/ui/Icon";

export function ProjectGallery({project}:{project:Project}){
 const items=project.gallery.filter(item=>item.rightsVerified);
 if(!items.length)return <div className="ae-article-no-image" role="note">
  <Icon name="shield" size={24}/><div><h3>Chưa có ảnh giao diện được phép công bố</h3><p>Hồ sơ chỉ giới thiệu phạm vi và tiến độ nghiên cứu. Athena không công bố dashboard hay dữ liệu nội bộ chưa được duyệt.</p></div>
 </div>;
 return <div className="ae-article-gallery">
  {items.map((item,i)=>{
   const mobile=/-mobile(?:-hires)?\./.test(item.src);
   const dimensions=mobile?{width:1170,height:2532}:{width:2880,height:1800};
   return <figure className={"ae-article-figure "+(mobile?"is-portrait":"is-landscape")} key={item.src}>
    <div className={"dna-gallery-stage "+(mobile?"dna-gallery-phone":"dna-gallery-desktop")}>
     <a className="ae-article-image-link" href={item.src} target="_blank" rel="noopener noreferrer" aria-label={"Mở ảnh gốc: "+item.alt}>
      <Image src={item.src} {...dimensions} alt={item.alt} unoptimized sizes={mobile?"(max-width: 760px) 85vw, 380px":"(max-width: 760px) 100vw, 940px"} loading="lazy"/>
     </a>
    </div>
    <figcaption><span><strong>Hình {i+1}.</strong> {item.caption}</span>
     <a className="dna-gallery-original" href={item.src} target="_blank" rel="noopener noreferrer">Xem kích thước gốc</a>
    </figcaption>
   </figure>;
  })}
 </div>;
}
