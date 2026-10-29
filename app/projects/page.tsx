import Link from "next/link";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {publicProjects} from "@/data/projects";

export const metadata={title:"Dự án tuyển chọn | Athena Studio",description:"Những dự án của người sáng lập Athena Studio: PHAM, ECONITH và Digital Creators. Xem giao diện thật, khám phá trải nghiệm tương tác và đọc hồ sơ."};

export default function ProjectsPage(){
 return <div className="ae-projects">
  <header className="ae-projects-hero">
   <div className="ae-projects-hero-top"><span>ATHENA / SELECTED WORK</span><span>INDEPENDENT PROJECTS — 2026</span></div>
   <div className="ae-projects-hero-body">
    <div className="ae-projects-headline"><span className="ae-micro">DESIGN × TECHNOLOGY × EXPERIMENT</span><h1>Đằng sau<br/><em>mỗi dự án.</em></h1></div>
    <div className="ae-projects-hero-aside"><p>Ba hướng thực hành: xây dựng thương hiệu thời trang, nghiên cứu định lượng và kể chuyện bằng website tương tác.</p><a href="#selected-projects">Xem các dự án <span aria-hidden="true">↓</span></a></div>
   </div>
   <div className="ae-projects-hero-bottom"><span>THỰC HIỆN BỞI NGƯỜI SÁNG LẬP ATHENA</span><span>SCROLL TO EXPLORE / 01—03</span></div>
  </header>
  <section id="selected-projects" className="ae-projects-work">
   <div className="ae-work-intro"><div><span className="ae-micro">01 / SELECTED PROJECTS</span><h2>Những thế giới<br/><em>đang thành hình.</em></h2></div><p>Chọn một dự án để xem bối cảnh, quyết định thiết kế, phạm vi triển khai và ảnh giao diện được phép công bố.</p></div>
   <PortfolioDirectory items={publicProjects}/>
  </section>
  <section className="ae-projects-outro">
   <div><span className="ae-micro">02 / EXPLORE THE LIBRARY</span><h2>Một thư viện.<br/><em>Nhiều phong cách.</em></h2></div>
   <div><p>Thư viện website mẫu của Athena là nơi trải nghiệm nhiều phong cách thiết kế theo từng ngành — độc lập với những dự án founder phía trên.</p><Link href="/services/web-development/templates">Xem thư viện template <span aria-hidden="true">↗</span></Link></div>
  </section>
  <footer className="ae-projects-disclosure">Các dự án PHAM, ECONITH và Digital Creators là sản phẩm/dự án nghiên cứu của người sáng lập, không phải hợp đồng khách hàng. Mã nguồn riêng PHAM và ECONITH không được công bố.</footer>
 </div>;
}