import Link from "next/link";
import {publicProjects} from "@/data/projects";
import {PortfolioDirectory} from "@/components/portfolio/PortfolioDirectory";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Dự án","Xem ảnh giao diện thực tế, các chức năng và phạm vi của các sản phẩm và hướng nghiên cứu đang giới thiệu.","/projects");
export default function ProjectsPage(){
 return <div className="page-shell">
  <section className="page-hero portfolio-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> DỰ ÁN / GIAO DIỆN / CHỨC NĂNG</p>
   <h1>Sản phẩm có thể xem.<br/><em>Công việc có thể hiểu.</em></h1>
   <div className="page-hero-lede"><p>Thay vì chỉ liệt kê công nghệ, Athena giới thiệu sản phẩm qua hình ảnh, chức năng và bài toán. Mỗi hồ sơ tập trung vào bài toán, trải nghiệm và những khả năng được phát triển.</p>
    <Link className="pill-link pill-dark" href="/contact">Trao đổi dự án <Icon name="arrow-up-right" size={18}/></Link>
   </div>
  </div></section>
  <section className="page-section"><div className="container">
   <div className="case-section-head"><div><p className="section-index"><span className="index-circle">01</span> SẢN PHẨM / TÍNH NĂNG / TRẠNG THÁI</p>
    <h2>Nhìn thấy <span>những gì đã làm.</span></h2></div>
    <p>Khám phá giao diện thương mại điện tử PHAM và hệ thống nghiên cứu định lượng ECONITH qua các điểm nổi bật của từng sản phẩm.</p>
   </div>
   <PortfolioDirectory items={publicProjects}/>
  </div></section>
  <section className="closing-block"><div className="container closing-inner">
   <p className="eyebrow">DỰ ÁN TIẾP THEO</p><h2>Bạn muốn làm<br/><span>một sản phẩm như thế nào?</span></h2>
   <Link href="/contact" className="pill-link pill-light">Trao đổi nhu cầu <Icon name="arrow-up-right" size={18}/></Link>
   <span className="closing-watermark" aria-hidden="true">ATHENA</span>
  </div></section>
 </div>;
}
