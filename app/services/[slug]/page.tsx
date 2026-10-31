import {ServiceVisualStage} from "@/components/experience/ServiceVisualStage";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getOffering,offerings} from "@/lib/offerings";
import {createMetadata} from "@/lib/metadata";
import {serviceFaqs} from "@/data/service-faq";
import {Icon} from "@/components/ui/Icon";

type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return offerings.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}:PageProps){
 const {slug}=await params;
 const item=getOffering(slug);
 return item?createMetadata(item.shortTitle,item.description,"/services/"+item.slug):createMetadata("Dịch vụ");
}

export default async function ServiceDetail({params}:PageProps){
 const {slug}=await params;
 const item=getOffering(slug);
 if(!item)notFound();
 const research=item.slug==="micro-saas";
 const related=offerings.filter(o=>o.slug!==slug&&o.slug!=="micro-saas").slice(0,2);
 return <div className="page-shell">
  <section className={"page-hero dna03-service-hero dna03-service-"+item.slug}><div className="container">
   <p className="page-kicker"><span className="eyebrow-dot"/> {research?"NGHIÊN CỨU · CHƯA MỞ BÁN":"DỊCH VỤ ATHENA / "+item.index}</p>
   <h1>{item.shortTitle}<br/><em>{research?"đang nghiên cứu.":"cho nhu cầu thực tế."}</em></h1>
   <div className="page-hero-lede"><p>{item.challenge}</p><Link href={research?"/products":"/contact?service="+encodeURIComponent(item.slug)} className="dna-button dna-button-primary">{research?"Xem trạng thái nghiên cứu":"Trao đổi nhu cầu"}</Link></div>
   {!research&&<ServiceVisualStage slug={item.slug}/>}
  </div></section>

  <section className="page-section"><div className="container">
   <div className="detail-intro">
    <div><p className="section-index"><span className="index-circle">01</span> VẤN ĐỀ VÀ HƯỚNG XỬ LÝ</p><h2>Chúng tôi sẽ<br/><em>làm rõ điều gì?</em></h2></div>
    <div><p className="lead-text">{item.details}</p><p className="client-detail-output"><strong>{research?"Hướng nghiên cứu hiện tại:":"Đầu ra có thể bàn giao:"}</strong> {item.output}</p></div>
   </div>
   <div className="detail-tile-grid">{item.features.map((feature,i)=><div className="detail-tile" key={feature}><span>{String(i+1).padStart(2,"0")} / {research?"HƯỚNG NGHIÊN CỨU":"HẠNG MỤC"}</span><h3>{feature}</h3></div>)}</div>
  </div></section>

  {item.slug==="web-development"&&<section className="page-section template-service-band"><div className="container template-personalize-note"><div><strong>Muốn xem các hướng giao diện trước?</strong><span>Khám phá thư viện mẫu theo ngành và phong cách, rồi chọn mẫu làm định hướng ban đầu.</span></div><Link className="pill-link pill-dark" href="/services/web-development/templates">Khám phá mẫu website</Link></div></section>}

  <section className="page-section detail-dark"><div className="container">
   <p className="section-index"><span className="index-circle">02</span> {research?"TRẠNG THÁI NGHIÊN CỨU":"PHẠM VI CÔNG VIỆC"}</p>
   <div className="detail-intro" style={{marginTop:40}}>
    <h2>{research?"Chưa phải sản phẩm":"Những phần việc"}<br/><em>{research?"đã mở bán.":"được thống nhất."}</em></h2>
    <p className="lead-text">{research?"Các ý tưởng chưa được xác nhận là sản phẩm thương mại. Không nhận thanh toán cho những công cụ chưa phát hành.":"Đầu ra, giới hạn hỗ trợ, thời gian và chi phí chỉ được chốt sau khi xem xét tình trạng và yêu cầu cụ thể. Không hứa kết quả kinh doanh chưa kiểm chứng."}</p>
   </div>
   <div className="delivery-grid">{item.deliverables.map((deliverable,i)=><div className="delivery-item" key={deliverable}><span>{String(i+1).padStart(2,"0")}</span>{deliverable}</div>)}</div>
   <div className="detail-price"><div><p>{research?"TRẠNG THÁI":"HÌNH THỨC CHI PHÍ"}</p><strong>{item.startingAt}</strong></div>
    <Link href={research?"/products":"/contact?service="+encodeURIComponent(item.slug)} className="dna-button dna-button-secondary">{research?"Xem Product Lab":"Trình bày yêu cầu để báo giá"}</Link></div>
  </div></section>

  {!research&&<section className="page-section agency-section-muted"><div className="container">
   <p className="section-index"><span className="index-circle">03</span> CÂU HỎI TRƯỚC KHI TRIỂN KHAI</p>
   <h2 className="agency-faq-title">Bạn cần biết gì <span>trước khi bắt đầu?</span></h2>
   <div className="agency-faq-list">{(serviceFaqs[item.slug]||[]).map(([q,a])=><details key={q}><summary>{q}<Icon name="chevron-down" size={19}/></summary><p>{a}</p></details>)}</div>
   <div className="agency-case-actions"><Link href="/process" className="agency-outline-cta">Xem quy trình hợp tác <Icon name="arrow-right" size={17}/></Link>
    <Link href="/pricing" className="agency-outline-cta">Cách lập báo giá <Icon name="arrow-right" size={17}/></Link></div>
  </div></section>}
  <section className="page-section"><div className="container">
   <p className="section-index"><span className="index-circle">04</span> NHU CẦU LIÊN QUAN</p>
   <h2>Bạn cũng có thể<br/><em>cần những dịch vụ này.</em></h2>
   <div className="offer-list">{related.map(o=><Link className="offer-card" href={"/services/"+o.slug} key={o.slug}>
    <div className="service-meta"><span>{o.index} / ATHENA</span><span>{o.eyebrow}</span></div>
    <h3>{o.shortTitle}</h3><p>{o.challenge}</p>
    <div className="card-bottom"><span>Xem dịch vụ</span><Icon name="arrow-right" size={18}/></div>
   </Link>)}</div>
  </div></section>
 </div>;
}
