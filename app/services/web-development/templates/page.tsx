import Link from "next/link";
import {TemplateGallery} from "@/components/templates/TemplateGallery";
import {templates,templateIndustries,templateStyles} from "@/lib/templates";

export const metadata={
 title:"Thư viện mẫu website | Athena Studio",
 description:"Trải nghiệm các mẫu website tương tác do Athena thiết kế, xem trước trên nhiều thiết bị và chọn hướng phù hợp cho thương hiệu."
};

export default function TemplatesPage(){
 return <div className="templates-page">
  <section className="templates-intro">
   <div className="templates-intro-top"><span>ATHENA STUDIO / WEB DESIGN</span><span>THE DESIGN LIBRARY — 2026</span></div>
   <div className="templates-intro-grid">
    <div><p className="templates-intro-label">BỘ SƯU TẬP GIAO DIỆN</p><h1>Chọn cảm hứng.<br/><em>Tạo bản sắc riêng.</em></h1></div>
    <div className="templates-intro-aside"><span className="templates-intro-number">{String(templates.length).padStart(2,"0")}<small>WEBSITE CONCEPTS</small></span><p>Mỗi mẫu là một website demo có thể truy cập, cuộn trang và thử tương tác. Khám phá phong cách, xem phạm vi triển khai và hình dung phiên bản dành riêng cho doanh nghiệp của bạn.</p><Link href="/contact?service=web-development">Tạo website của bạn</Link></div>
   </div>
   <div className="templates-intro-bottom"><span>KHÁM PHÁ THEO LĨNH VỰC & PHONG CÁCH</span><span>CUỘN ĐỂ XEM BỘ SƯU TẬP ↓</span></div>
  </section>
  <TemplateGallery templates={templates} industries={templateIndustries} styles={templateStyles}/>
 </div>
}
