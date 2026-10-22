import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {TemplateGallery} from "@/components/templates/TemplateGallery";
import {templates,templateIndustries,templateStyles} from "@/lib/templates";
import {createMetadata} from "@/lib/metadata";
import "@/app/templates.css";

export const metadata=createMetadata("Mẫu website","Khám phá các hướng thiết kế website theo ngành, mục đích và phong cách. Chọn mẫu làm điểm bắt đầu cho dự án riêng của bạn.","/services/web-development/templates");
export default function WebsiteTemplatesPage(){
 return <div className="page-shell template-library">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> THƯ VIỆN ĐỊNH HƯỚNG / ATHENA STUDIO</p>
   <h1>Chọn một hướng đi.<br/><em>Tạo website của riêng bạn.</em></h1>
   <div className="page-hero-lede"><p>Khám phá các nền tảng thiết kế theo ngành, mục đích và phong cách. Mỗi mẫu là điểm khởi đầu để Athena điều chỉnh theo thương hiệu và cách doanh nghiệp vận hành.</p><Link href="/contact?service=web-development" className="pill-link pill-dark">Trao đổi nhu cầu <Icon name="arrow-up-right" size={18}/></Link></div>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="template-library-intro"><div><p className="section-index"><span className="index-circle">01</span> THƯ VIỆN MẪU / 08 HƯỚNG</p><h2>Khám phá theo<br/><em>cách bạn làm việc.</em></h2></div><p className="lead-text">Các bản xem trước thể hiện bố cục, typography và hệ thống giao diện của từng hướng. Hình ảnh và nội dung trong bản dựng là minh họa thiết kế, không phải dự án khách hàng hay website đã phát hành.</p></div>
   <TemplateGallery templates={templates} industries={templateIndustries} styles={templateStyles}/>
   <div className="template-personalize-note"><strong>Mẫu là điểm bắt đầu, không phải khuôn cố định.</strong><span>Athena sẽ cùng bạn làm rõ nội dung, nhận diện, tích hợp và chức năng cần thiết trước khi chốt phạm vi.</span></div>
  </div></section>
 </div>;
}
