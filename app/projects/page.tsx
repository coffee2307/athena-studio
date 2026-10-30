import Link from "next/link";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {publicProjects} from "@/data/projects";

export const metadata={title:"Dự án đã xây dựng | Athena Studio",description:"Khám phá PHAM, ECONITH và Digital Creators: các dự án do người sáng lập Athena Studio phát triển. Hình ảnh công khai và hồ sơ từng dự án."};

export default function ProjectsPage(){
 return <div className="ae-projects dna-work-page">
  <header className="dna-work-hero">
   <div className="container dna-work-hero-grid">
    <div className="dna-work-heading"><p className="dna-eyebrow">SELECTED PROJECTS / 2026</p>
     <h1>Ý tưởng thật.<br/><em>Thế giới riêng.</em></h1>
     <p>Ba dự án, ba hướng sáng tạo — từ thời trang đến công nghệ và trải nghiệm tương tác. Mỗi dự án đều có câu chuyện riêng.</p>
     <a className="dna-button dna-button-primary" href="#selected-projects">Khám phá dự án</a>
    </div>
    <div className="dna-work-art" aria-label="Ba lĩnh vực sáng tạo của các dự án founder">
      <div className="dna-work-art-card dna-work-art-one"><span>01 / PHAM</span><strong>Form.<br/>Identity.</strong><small>Independent fashion</small></div>
      <div className="dna-work-art-card dna-work-art-two"><span>02 / ECONITH</span><strong>Data.<br/>Thinking.</strong><small>Quantitative research</small></div>
      <div className="dna-work-art-card dna-work-art-three"><span>03 / DIGITAL CREATORS</span><strong>Play.<br/>Create.</strong><small>Creative digital club</small></div>
    </div>
   </div>
  </header>
  <section id="selected-projects" className="ae-projects-work dna-work-list">
   <div className="container">
    <div className="dna-section-intro"><div><p className="dna-eyebrow">THỰC HIỆN BỞI NGƯỜI SÁNG LẬP ATHENA</p><h2>Chọn một dự án.<br/><em>Đi sâu vào câu chuyện.</em></h2></div>
     <p>Hình ảnh và nội dung được phép công bố, kèm phạm vi công việc và tình trạng triển khai.</p></div>
    <PortfolioDirectory items={publicProjects}/>
   </div>
  </section>
  <section className="dna-work-closer"><div className="container">
   <div><p className="dna-eyebrow">THƯ VIỆN WEBSITE</p><h2>Cảm hứng mới<br/>bắt đầu từ một bản demo.</h2></div>
   <Link className="dna-button dna-button-secondary" href="/services/web-development/templates">Khám phá các template</Link>
  </div></section>
  <footer className="ae-projects-disclosure">PHAM, ECONITH và Digital Creators là các dự án do người sáng lập thực hiện, không phải hợp đồng khách hàng. Mã nguồn riêng tư và dữ liệu nghiên cứu không được công bố.</footer>
 </div>;
}