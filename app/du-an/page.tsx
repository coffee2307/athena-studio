import Link from "next/link";
import {publicProjects,projects} from "@/data/projects";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Dự án","Xem ảnh giao diện thực tế, các chức năng và phạm vi của những dự án founder và nghiên cứu đã được phép công bố.","/du-an");
export default function ProjectsPage(){
 return <div className="page-shell">
  <section className="page-hero portfolio-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> DỰ ÁN / GIAO DIỆN / CHỨC NĂNG</p>
   <h1>Sản phẩm có thể xem.<br/><em>Công việc có thể hiểu.</em></h1>
   <div className="page-hero-lede"><p>Thay vì chỉ liệt kê công nghệ, Athena giới thiệu sản phẩm qua hình ảnh, chức năng và bài toán. Các dự án founder và dự án nghiên cứu được phân loại riêng, không giả làm hợp đồng khách hàng.</p>
    <Link className="pill-link pill-dark" href="/lien-he">Trao đổi dự án <Icon name="arrow-up-right" size={18}/></Link>
   </div>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="case-section-head"><div><p className="section-index"><span className="index-circle">01</span> SẢN PHẨM / TÍNH NĂNG / TRẠNG THÁI</p>
    <h2>Nhìn thấy <span>những gì đã làm.</span></h2></div>
    <p>PHAM có ảnh chụp giao diện trực tiếp từ website công khai. ECONITH đang chờ ảnh dashboard được duyệt, không đưa mã nguồn hoặc dữ liệu nội bộ lên trang.</p>
   </div>
   <PortfolioDirectory items={publicProjects}/>
   <div className="portfolio-caveat"><strong>Minh bạch về vai trò</strong>
    <p>Dự án founder và nghiên cứu không đồng nghĩa dự án Athena đã bàn giao cho khách hàng. {projects.filter(p=>p.visibility==="review").map(p=>p.title).join(", ")} đang chờ quyền công bố hình ảnh và nội dung nên chưa có trang công khai.</p>
   </div>
  </div></section>
  <section className="closing-block"><div className="container closing-inner">
   <p className="eyebrow">DỰ ÁN TIẾP THEO</p><h2>Bạn muốn làm<br/><span>một sản phẩm như thế nào?</span></h2>
   <Link href="/lien-he" className="pill-link pill-light">Trao đổi nhu cầu <Icon name="arrow-up-right" size={18}/></Link>
   <span className="closing-watermark" aria-hidden="true">ATHENA</span>
  </div></section>
 </div>;
}
