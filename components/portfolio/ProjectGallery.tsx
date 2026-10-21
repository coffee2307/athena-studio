import Image from "next/image";
import type {Project} from "@/types/project";
import {Icon} from "@/components/ui/Icon";

export function ProjectGallery({project}:{project:Project}){
 const items=project.gallery.filter(item=>item.rightsVerified);
 if(!items.length)return <div className="agency-gallery-awaiting" role="note">
  <Icon name="shield" size={25}/>
  <div><h3>Ảnh giao diện chưa được phép công bố</h3>
   <p>Hồ sơ hiện mô tả chức năng và phạm vi nghiên cứu. Athena chưa đăng tải ảnh dashboard, thông tin truy cập hoặc dữ liệu nội bộ của dự án.</p>
  </div>
 </div>;
 return <div className="agency-project-gallery">
  {items.map((item,i)=><figure key={item.src} className={i===0?"agency-gallery-item is-featured":"agency-gallery-item"}>
   <div className="agency-gallery-image">
    <Image src={item.src} alt={item.alt} fill
     sizes={i===0?"(max-width: 780px) 100vw, 1200px":"(max-width: 780px) 100vw, 570px"}
     quality={85}/>
   </div>
   <figcaption><span>{String(i+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span>{item.caption}</figcaption>
  </figure>)}
 </div>;
}
