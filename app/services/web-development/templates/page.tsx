import Image from "next/image";
import Link from "next/link";
import {TemplateGallery} from "@/components/templates/TemplateGallery";
import {templates,templateIndustries,templateStyles} from "@/lib/templates";
import {getTemplatePreviewSrc} from "@/lib/template-preview-image";

export const metadata={
 title:"Thư viện mẫu website | Athena Studio",
 description:"Khám phá các website mẫu tương tác theo ngành nghề, phong cách và trải nghiệm. Xem trước trực tiếp trước khi thiết kế riêng."
};

export default function TemplatesPage(){
 return <div className="templates-page dna-library-page">
  <section className="dna-library-hero"><div className="container dna-library-intro">
    <div className="dna-library-copy">
     <p className="dna-eyebrow">ATHENA / WEBSITE COLLECTION</p>
     <h1>Chọn cảm hứng.<br/><em>Tạo chất riêng.</em></h1>
     <p>Khám phá {templates.length} hướng thiết kế có website demo thật. Mỗi mẫu là điểm xuất phát — giao diện cuối cùng được tạo theo bản sắc của bạn.</p>
     <div className="dna-library-actions"><a className="dna-button dna-button-primary" href="#template-collection">Khám phá mẫu</a><Link className="dna-button dna-button-quiet" href="/contact?service=web-development">Trao đổi ý tưởng</Link></div>
    </div>
    <div className="dna-library-gallery" aria-label="Ảnh giao diện từ hai website mẫu của Athena">
     <div className="dna-library-frame dna-library-frame-main"><div className="dna-library-frame-top"><i/><i/><i/><span>creative / preview</span></div><div className="dna-library-frame-media"><Image src={getTemplatePreviewSrc("creative-studio")} alt="Ảnh chụp website mẫu Creative Studio" fill priority sizes="(max-width:760px) 82vw, 45vw" style={{objectFit:"contain",objectPosition:"center top"}}/></div></div>
     <div className="dna-library-frame dna-library-frame-side"><div className="dna-library-frame-top"><i/><i/><i/><span>pet / preview</span></div><div className="dna-library-frame-media"><Image src={getTemplatePreviewSrc("pet-store")} alt="Ảnh chụp website mẫu Pet Store" fill sizes="(max-width:760px) 35vw, 20vw" style={{objectFit:"contain",objectPosition:"center top"}}/></div></div>
     <div className="dna-library-stamp">{String(templates.length).padStart(2,"0")} <span>WEBSITE<br/>CONCEPTS</span></div>
    </div>
  </div></section>
  <TemplateGallery templates={templates} industries={templateIndustries} styles={templateStyles}/>
 </div>;
}
