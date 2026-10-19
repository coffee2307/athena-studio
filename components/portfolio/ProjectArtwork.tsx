import Image from "next/image";
import type { Project } from "@/types/project";

export function ProjectArtwork({project,compact=false}:{project:Project;compact?:boolean}) {
  return <div className={`portfolio-art art-${project.artwork}${compact?" art-compact":""}`} aria-label={`Đồ họa chữ minh họa cho dự án ${project.title}, không phải ảnh chụp giao diện sản phẩm`}>
    <div className="art-header"><span>ATHENA / LƯU TRỮ DỰ ÁN</span><span>KHÔNG PHẢI ẢNH CHỤP SẢN PHẨM</span></div>
    <div className="art-center">
      {project.artwork==="pham"?<><span className="pham-large">PHAM</span><span className="art-project-caption">THƯƠNG HIỆU / CÔNG NGHỆ</span></>:
        project.artwork==="econith"?<><div className="econith-orbit" aria-hidden="true"><span/></div><span className="econith-large">ECONITH</span><span className="art-project-caption">NGHIÊN CỨU ĐỊNH LƯỢNG</span></>:
          <><Image src="/branding/logo-symbol-black.svg" width={95} height={95} alt=""/><span className="art-project-caption">DỰ ÁN ĐANG RÀ SOÁT</span></>}
    </div>
    <div className="art-bottom"><span>{project.category}</span><span>ĐỒ HỌA GIỚI THIỆU / 001</span></div>
  </div>;
}
