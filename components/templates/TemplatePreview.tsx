import type {Template} from "@/lib/templates";

const productNames=["Mẫu 01","Mẫu 02","Mẫu 03"];
export function TemplatePreview({template,device="desktop"}:{template:Template;device?:"desktop"|"mobile"}){
 const variant=template.variant;
 return <div className="template-device-frame" data-device={device}>
  <div className={`template-site template-site-${variant}`} aria-label={`Bản dựng giao diện khái niệm: ${template.title}`}>
   <header className="template-site-nav"><strong>{variant==="fashion"?"ATELIER / 01":variant==="saas"?"NORTHSTAR":variant==="hospitality"?"MỘC BẾP":variant==="editorial"?"FIELDNOTES":variant==="portfolio"?"STUDIO / HỒ":variant==="campaign"?"FORM / 2026":variant==="commerce"?"OBJECTS": "NORTH & CO."}</strong><span>MENU　↗</span></header>
   {variant==="portfolio"&&<><section className="tpl-portfolio-hero"><small>INDEPENDENT CREATIVE PRACTICE</small><h3>Ý tưởng tốt<br/>cần không gian<br/><i>để xuất hiện.</i></h3><div className="tpl-orbit" aria-hidden="true">◎</div></section><div className="tpl-strip">CHỌN LỌC DỰ ÁN　—　2022 / 2026</div><div className="tpl-project-grid"><b>01 / CULTURE</b><b>02 / OBJECTS</b></div></>}
   {variant==="corporate"&&<><section className="tpl-corporate-hero"><small>THIẾT KẾ · KỸ THUẬT · VẬN HÀNH</small><h3>Hệ thống tốt<br/>giúp doanh nghiệp<br/>đi xa hơn.</h3><p>Giải pháp được thiết kế theo cách tổ chức của bạn.</p><span className="tpl-action">Tìm hiểu dịch vụ　↗</span></section><div className="tpl-metrics"><b>01 <small>STRATEGY</small></b><b>02 <small>DELIVERY</small></b><b>03 <small>SUPPORT</small></b></div></>}
   {variant==="commerce"&&<><section className="tpl-commerce-hero"><small>NEW COLLECTION / 2026</small><h3>Everyday<br/>objects.</h3><span>Khám phá bộ sưu tập　↗</span><div className="tpl-product-shelf">{productNames.map((name,index)=><b key={name} data-item={index}>{name}</b>)}</div></section><div className="tpl-caption">ĐƯỢC CHỌN CHO BẠN</div></>}
   {variant==="fashion"&&<><section className="tpl-fashion-hero"><small>COLLECTION Nº 01 — 2026</small><div className="tpl-fashion-shape"/><h3>Form<br/><i>follows feeling.</i></h3><span>KHÁM PHÁ BỘ SƯU TẬP　↓</span></section><div className="tpl-fashion-footer">ĐƯỢC TẠO RA ĐỂ ĐƯỢC GIỮ LẠI.</div></>}
   {variant==="saas"&&<><section className="tpl-saas-hero"><small>WORKSPACE / PRODUCT</small><h3>Ít thao tác hơn.<br/><i>Thấy rõ hơn.</i></h3><p>Một nền tảng gọn cho công việc cần kiểm soát.</p><div className="tpl-saas-screen"><span>OVERVIEW　·　PROJECTS　·　ACTIVITY</span><b>Work, in focus.</b><i/><i/><i/></div></section></>}
   {variant==="campaign"&&<><section className="tpl-campaign-hero"><small>CHƯƠNG TRÌNH / 09.26</small><h3>Đừng chờ<br/><u>đúng lúc.</u></h3><div className="tpl-campaign-bottom"><span>Một ngày gặp gỡ những người đang làm thật.</span><b>ĐĂNG KÝ　↗</b></div></section></>}
   {variant==="hospitality"&&<><section className="tpl-hospitality-hero"><small>NHÀ BẾP / TỪ 2018</small><h3>Bữa ăn<br/>đủ thong thả.</h3><p>Món theo mùa · Không gian thân mật</p><span className="tpl-action">Xem thực đơn　↗</span><div className="tpl-hospitality-table"/></section><div className="tpl-hours">MỞ CỬA　11:00 — 22:00　　ĐẶT CHỖ ↗</div></>}
   {variant==="editorial"&&<><section className="tpl-editorial-head"><small>ISSUE 08 / CULTURE & OBJECTS</small><h3>Những điều<br/>đáng để<br/><i>đọc chậm.</i></h3><div className="tpl-editorial-cover"><span>ESSAY　·　08 MIN READ</span><b>On making<br/>with care.</b></div></section><div className="tpl-editorial-line">BÀI VIẾT MỚI　　TƯ DUY / THIẾT KẾ / ĐỜI SỐNG</div></>}
  </div>
 </div>;
}
