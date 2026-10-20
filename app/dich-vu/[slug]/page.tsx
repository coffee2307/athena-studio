import Link from "next/link";
import {notFound} from "next/navigation";
import {getOffering,offerings} from "@/lib/offerings";
import {createMetadata} from "@/lib/metadata";

type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return offerings.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}:PageProps){
 const {slug}=await params;
 const item=getOffering(slug);
 return item?createMetadata(item.shortTitle,item.description,"/dich-vu/"+item.slug):createMetadata("Dịch vụ");
}

export default async function ServiceDetail({params}:PageProps){
 const {slug}=await params;
 const item=getOffering(slug);
 if(!item)notFound();
 const research=item.slug==="micro-saas";
 const related=offerings.filter(o=>o.slug!==slug&&o.slug!=="micro-saas").slice(0,2);
 return <div className="page-shell">
  <section className="page-hero"><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> {research?"NGHIÊN CỨU · CHƯA MỞ BÁN":"DỊCH VỤ ATHENA / "+item.index}</p>
   <h1>{item.shortTitle}<br/><em>{research?"đang nghiên cứu.":"cho nhu cầu thực tế."}</em></h1>
   <div className="page-hero-lede"><p>{item.challenge}</p><Link href={research?"/san-pham":"/lien-he?service="+encodeURIComponent(item.slug)} className="pill-link pill-dark">{research?"Xem trạng thái nghiên cứu":"Trao đổi nhu cầu"} <span aria-hidden="true">↗</span></Link></div>
  </div></section>

  <section className="page-section"><div className="container">
   <div className="detail-intro">
    <div><p className="section-index"><span className="index-circle">01</span> VẤN ĐỀ VÀ HƯỚNG XỬ LÝ</p><h2>Chúng tôi sẽ<br/><em>làm rõ điều gì?</em></h2></div>
    <div><p className="lead-text">{item.details}</p><p className="client-detail-output"><strong>{research?"Hướng nghiên cứu hiện tại:":"Đầu ra có thể bàn giao:"}</strong> {item.output}</p></div>
   </div>
   <div className="detail-tile-grid">{item.features.map((feature,i)=><div className="detail-tile" key={feature}><span>{String(i+1).padStart(2,"0")} / {research?"HƯỚNG NGHIÊN CỨU":"HẠNG MỤC"}</span><h3>{feature}</h3></div>)}</div>
  </div></section>

  <section className="page-section detail-dark"><div className="container">
   <p className="section-index"><span className="index-circle">02</span> {research?"TRẠNG THÁI NGHIÊN CỨU":"PHẠM VI CÔNG VIỆC"}</p>
   <div className="detail-intro" style={{marginTop:40}}>
    <h2>{research?"Chưa phải sản phẩm":"Những phần việc"}<br/><em>{research?"đã mở bán.":"được thống nhất."}</em></h2>
    <p className="lead-text">{research?"Các ý tưởng chưa được xác nhận là sản phẩm thương mại. Không nhận thanh toán cho những công cụ chưa phát hành.":"Đầu ra, giới hạn hỗ trợ, thời gian và chi phí chỉ được chốt sau khi xem xét tình trạng và yêu cầu cụ thể. Không hứa kết quả kinh doanh chưa kiểm chứng."}</p>
   </div>
   <div className="delivery-grid">{item.deliverables.map((deliverable,i)=><div className="delivery-item" key={deliverable}><span>{String(i+1).padStart(2,"0")}</span>{deliverable}</div>)}</div>
   <div className="detail-price"><div><p>{research?"TRẠNG THÁI":"HÌNH THỨC CHI PHÍ"}</p><strong>{item.startingAt}</strong></div>
    <Link href={research?"/san-pham":"/lien-he?service="+encodeURIComponent(item.slug)} className="pill-link pill-light">{research?"Xem Product Lab":"Trình bày yêu cầu để báo giá"} <span aria-hidden="true">↗</span></Link></div>
  </div></section>

  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">03</span> NHU CẦU LIÊN QUAN</p>
   <h2>Bạn cũng có thể<br/><em>cần những dịch vụ này.</em></h2>
   <div className="offer-list">{related.map(o=><Link className="offer-card" href={"/dich-vu/"+o.slug} key={o.slug}>
    <div className="service-meta"><span>{o.index} / ATHENA</span><span>{o.eyebrow}</span></div>
    <h3>{o.shortTitle}</h3><p>{o.challenge}</p>
    <div className="card-bottom"><span>Xem dịch vụ</span><span aria-hidden="true">↗</span></div>
   </Link>)}</div>
  </div></section>
 </div>;
}
