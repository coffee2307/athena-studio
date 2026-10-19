import Link from "next/link";
import {publicProjects,projects} from "@/data/projects";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Dự án","Một số dự án cá nhân và nghiên cứu của founder Athena Studio, có dẫn nguồn và phân loại vai trò rõ ràng.", "/du-an");
export default function ProjectsPage(){
 return <div className="page-shell">
  <section className="page-hero portfolio-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> LƯU TRỮ DỰ ÁN / CÁCH CHÚNG TÔI HỌC VÀ XÂY DỰNG</p>
   <h1>Những điều<br/><em>đang kiến tạo.</em></h1>
   <div className="page-hero-lede"><p>Mỗi dự án là một hành trình từ câu hỏi đến giải pháp. Ở đây, Athena giới thiệu những dự án của founder và nghiên cứu kỹ thuật, không trình bày chúng như hợp đồng khách hàng studio.</p><Link className="pill-link pill-dark" href="/lien-he">Trao đổi dự án ↗</Link></div>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="case-section-head"><div><p className="section-index"><span className="index-circle">01</span> HỒ SƠ DỰ ÁN</p><h2>Quan sát.<br/><em>Đối chiếu. Khám phá.</em></h2></div><p>Thông tin được dẫn nguồn từ repository công khai. Các hình đại diện bên dưới là đồ họa trình bày, không phải ảnh chụp sản phẩm.</p></div>
   <PortfolioDirectory items={publicProjects}/>
   <div className="portfolio-caveat"><strong>Minh bạch về vai trò</strong><p>Dự án của founder và dự án nghiên cứu không đồng nghĩa là dự án do Athena nhận phát triển cho khách hàng. {projects.filter(p=>p.visibility==="review").map(p=>p.title).join(", ")} đang chờ xác minh và chưa có case study công khai.</p></div>
  </div></section>
  <section className="closing-block"><div className="container closing-inner"><p className="eyebrow">MỘT DỰ ÁN MỚI?</p><h2>Ý tưởng tiếp theo<br/><em>có thể là của bạn.</em></h2><Link href="/lien-he" className="pill-link pill-light">Liên hệ Athena ↗</Link><span aria-hidden="true" className="closing-watermark">ATHENA</span></div></section>
 </div>;
}
