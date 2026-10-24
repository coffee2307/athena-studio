import Link from "next/link";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {publicProjects} from "@/data/projects";
export const metadata={title:"Dự án & sản phẩm số | Athena Studio",description:"Khám phá PHAM, ECONITH và Digital Creators — các sản phẩm số và nghiên cứu thực hiện bởi người sáng lập Athena."};
export default function ProjectsPage(){return <main className="athena-projects-page phase0-projects" id="main-content">
 <header className="phase0-projects-hero"><div className="phase0-projects-top"><span>ATHENA STUDIO / SELECTED WORKS</span><span>DESIGN / BUILD / EXPERIMENT — 2026</span></div>
 <div className="phase0-projects-lead"><h1>Ý tưởng.<br/><em>Thành trải nghiệm.</em></h1><p>Những sản phẩm được xây dựng để khám phá thiết kế, công nghệ và cách con người tương tác với thế giới số. Mỗi dự án có một ngôn ngữ riêng.</p></div>
 <div className="phase0-projects-bottom"><span>01 / SELECTED WORKS</span><a href="#phase0-works">CUỘN ĐỂ KHÁM PHÁ ↓</a></div></header>
 <section id="phase0-works" className="phase0-projects-work"><div className="phase0-projects-work-title"><span>01 / DỰ ÁN</span><h2>Từ bản sắc.<br/>Đến tương tác.</h2><p>Website thương hiệu, nghiên cứu công nghệ và trải nghiệm 3D. Mỗi dự án đều được mô tả theo trạng thái thực tế.</p></div><PortfolioDirectory items={publicProjects}/></section>
 <section className="phase0-projects-cta"><div><span>02 / EXPLORE MORE</span><h2>Không chỉ xem.<br/><em>Hãy trải nghiệm.</em></h2><p>21 website mẫu — từ một câu chuyện biên tập đến trải nghiệm không gian 3D.</p></div><Link href="/services/web-development/templates">Khám phá 21 mẫu ↗</Link></section>
 <p className="phase0-projects-note">Đây là các sản phẩm của người sáng lập hoặc dự án nghiên cứu, không phải danh sách khách hàng của Athena. Mã nguồn riêng tư PHAM và ECONITH không được công khai.</p>
 </main>;}