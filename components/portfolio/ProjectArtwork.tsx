import Image from "next/image";
import type {Project} from "@/types/project";

export function ProjectArtwork({project,compact=false}:{project:Project;compact?:boolean}){
 const cover=project.gallery.find(item=>item.rightsVerified);
 if(cover)return <div className={compact?"agency-real-art is-compact":"agency-real-art"}>
  <Image src={cover.src} alt={cover.alt} fill sizes={compact?"(max-width: 700px) 100vw, 46vw":"(max-width: 700px) 100vw, 1000px"} quality={85}/>
  <span className="agency-screenshot-tag">ẢNH CHỤP GIAO DIỆN THỰC TẾ</span>
 </div>;
 return <div className={`portfolio-art art-${project.artwork}${compact?" art-compact":""}`}
  aria-label={`Đồ họa nhận diện dự án ${project.title}; ảnh giao diện chưa được duyệt công bố`}>
  <div className="art-header"><span>ATHENA / DỰ ÁN NGHIÊN CỨU</span><span>CHƯA CÓ ẢNH GIAO DIỆN ĐƯỢC DUYỆT</span></div>
  <div className="art-center">
   {project.artwork==="econith"?<><div className="econith-orbit" aria-hidden="true"><span/></div><span className="econith-large">ECONITH</span><span className="art-project-caption">NGHIÊN CỨU ĐỊNH LƯỢNG</span></>:
    <><Image src="/branding/logo-symbol-black.svg" width={95} height={95} alt=""/><span className="art-project-caption">ĐANG RÀ SOÁT</span></>}
  </div>
  <div className="art-bottom"><span>{project.category}</span><span>ĐỒ HỌA NHẬN DIỆN / KHÔNG PHẢI SCREENSHOT</span></div>
 </div>;
}
