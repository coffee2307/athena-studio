import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {createMetadata} from "@/lib/metadata";

export const metadata=createMetadata(
 "Sản phẩm số đang nghiên cứu",
 "Khám phá SitePulse và các sản phẩm số Athena đang nghiên cứu. Thông tin rõ ràng về tiến độ, phạm vi và điều chưa được triển khai.",
 "/products"
);
const capabilities=[
 {number:"01",title:"Kiểm tra phản hồi HTTP",description:"Ghi nhận trạng thái phản hồi của tên miền được phê duyệt."},
 {number:"02",title:"Nhật ký có thể đối chiếu",description:"Lưu kết quả kiểm tra để người vận hành có bằng chứng xác minh."},
 {number:"03",title:"Báo cáo dễ đọc",description:"Tóm tắt kết quả và những điểm cần kiểm tra tiếp theo."}
];
export default function ProductsPage(){
 return <div className="athena-products-page">
  <section className="athena-products-intro" aria-labelledby="products-heading">
   <div className="container">
    <div className="athena-product-breadcrumb"><Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><span>Sản phẩm</span></div>
    <div className="athena-products-heading">
     <div><p className="section-index"><span className="index-circle">01</span> ATHENA PRODUCT LAB</p><h1 id="products-heading">Những công cụ nhỏ.<br/><span>Cho vấn đề thật.</span></h1></div>
     <div className="athena-products-intro-aside"><p>Chúng tôi nghiên cứu những công cụ số giúp doanh nghiệp theo dõi, hiểu và xử lý công việc rõ ràng hơn. Chỉ giới thiệu những khả năng đã có cơ sở kiểm chứng.</p><span>RESEARCH / WORK IN PROGRESS</span></div>
    </div>
   </div>
  </section>

  <section className="athena-products-showcase" aria-labelledby="sitepulse-heading">
   <div className="container">
    <div className="athena-products-section-top"><div><span>01 — DỰ ÁN ĐANG THỬ NGHIỆM</span><p>Không phải sản phẩm thương mại đang mở bán.</p></div><span>PRODUCT / 001</span></div>
    <article className="athena-product-card">
     <div className="athena-product-copy">
      <div className="athena-product-topline"><span className="athena-product-status"><i aria-hidden="true"/> NGUYÊN MẪU NỘI BỘ</span><span>ATHENA / SITEPULSE</span></div>
      <h2 id="sitepulse-heading">SitePulse<span>.</span></h2>
      <p className="athena-product-purpose">Biết website phản hồi ra sao. Có bằng chứng trước khi xử lý.</p>
      <p className="athena-product-desc">Một công cụ nghiên cứu dành cho Website Care: kiểm tra phản hồi HTTP của website được phê duyệt, ghi nhận kết quả và hỗ trợ nhân sự đối chiếu sự cố.</p>
      <div className="athena-product-facts">
       <div><span>ĐẦU VÀO</span><strong>Địa chỉ HTTPS được phép kiểm tra</strong></div>
       <div><span>ĐẦU RA</span><strong>Trạng thái, nhật ký và tóm tắt</strong></div>
       <div><span>TÌNH TRẠNG</span><strong>Thử nghiệm nội bộ, chưa phát hành</strong></div>
      </div>
      <div className="athena-product-actions"><Link href="/products/sitepulse" className="athena-product-primary">Khám phá SitePulse <Icon name="arrow-up-right" size={18}/></Link><Link href="/contact" className="athena-product-secondary">Trao đổi về nhu cầu <Icon name="arrow-right" size={17}/></Link></div>
     </div>
     <div className="athena-product-visual" aria-label="Hình minh họa giao diện báo cáo SitePulse, không phải dữ liệu giám sát thời gian thực">
      <div className="athena-product-window">
       <div className="athena-product-window-top"><span><i/><i/><i/></span><span>SITEPULSE / DEMO INTERFACE</span><span>V0.1 / CONCEPT</span></div>
       <div className="athena-product-window-body">
        <div className="athena-product-window-label">WEBSITE RESPONSE / RESEARCH PREVIEW</div>
        <h3>Overview<span>.</span></h3>
        <div className="athena-product-sample">
         <span>WEBSITE ĐƯỢC MINH HỌA</span><strong>example.com</strong><span>KHÔNG CÓ PHÉP ĐO TRỰC TIẾP</span>
        </div>
        <div className="athena-product-mini-grid"><div><span>HTTP RESPONSE</span><strong>—</strong><small>Chưa thực hiện kiểm tra</small></div><div><span>THỜI GIAN ĐÁP ỨNG</span><strong>—</strong><small>Chưa có dữ liệu</small></div></div>
        <div className="athena-product-window-bottom"><span>WORKFLOW PREVIEW</span><span>Kiểm tra → Xác minh → Báo cáo</span></div>
       </div>
      </div>
      <div className="athena-product-visual-foot"><span>FIG. 01 — MINH HỌA GIAO DIỆN</span><span>KHÔNG PHẢI HỆ THỐNG ĐANG THEO DÕI TRỰC TIẾP</span></div>
     </div>
    </article>
   </div>
  </section>

  <section className="athena-products-capabilities" aria-labelledby="products-capabilities-heading">
   <div className="container">
    <div className="athena-products-cap-head"><p className="section-index"><span className="index-circle">02</span> ĐỊNH HƯỚNG NGHIÊN CỨU</p><h2 id="products-capabilities-heading">Rõ đầu vào.<br/><span>Rõ điều cần kiểm chứng.</span></h2></div>
    <div className="athena-product-cap-list">{capabilities.map(item=><article key={item.number}><span>{item.number} / 03</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
   </div>
  </section>

  <section className="athena-products-next"><div className="container athena-products-next-inner"><div><p className="section-index"><span className="index-circle">03</span> CÙNG XÁC ĐỊNH NHU CẦU</p><h2>Một vấn đề thực tế<br/>đáng để giải quyết?</h2><p>SitePulse chưa mở đăng ký công khai hoặc thu phí. Nếu website của bạn cần được theo dõi và kiểm tra có hệ thống, hãy chia sẻ vấn đề để Athena cân nhắc hướng phát triển phù hợp.</p></div><Link href="/contact" className="athena-product-primary">Trao đổi ý tưởng sản phẩm <Icon name="arrow-up-right" size={18}/></Link></div></section>
 </div>;
}
