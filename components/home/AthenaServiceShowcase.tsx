import Image from "next/image";
import Link from "next/link";
import {offerings} from "@/lib/offerings";

type Mode="home"|"catalog";
const services=offerings.filter(item=>item.slug!=="micro-saas");

function ServiceScene({slug}:{slug:string}){
 if(slug==="web-development")return <div className="dna-scene dna-scene-web" aria-label="Ảnh giao diện website mẫu do Athena thiết kế">
  <div className="dna-browser-bar"><i/><i/><i/><span>studio / website preview</span></div>
  <div className="dna-browser-preview"><Image src="/template-previews/creative-studio.jpg" alt="Ảnh giao diện website Creative Studio trong thư viện Athena" fill sizes="(max-width:760px) 90vw, 35vw" style={{objectFit:"contain",objectPosition:"center top"}}/></div>
  <span className="dna-scene-tag">DESIGN / DEVELOPMENT</span>
 </div>;
 if(slug==="website-care")return <div className="dna-scene dna-scene-care" aria-label="Quy trình chăm sóc website: kiểm tra, xác định ưu tiên, khắc phục">
  <div className="dna-care-board"><div className="dna-care-top"><span>WEBSITE CARE</span><span className="dna-care-pulse"/></div>
   <div className="dna-care-lines"><div><span className="dna-care-index">01</span><strong>Kiểm tra</strong><span className="dna-care-mark">✓</span></div><div><span className="dna-care-index">02</span><strong>Ưu tiên</strong><span className="dna-care-mark">✓</span></div><div><span className="dna-care-index">03</span><strong>Khắc phục</strong><span className="dna-care-mark dna-care-pending">→</span></div></div>
   <p>Rõ vấn đề. Rõ cách xử lý.</p>
  </div>
  <span className="dna-scene-tag">MAINTAIN / IMPROVE</span>
 </div>;
 return <div className="dna-scene dna-scene-ai" aria-label="Luồng tự động hóa AI có bước kiểm tra của con người">
  <div className="dna-ai-graph"><div className="dna-ai-node"><small>01 / INPUT</small><strong>Tài liệu</strong></div><span aria-hidden="true">→</span><div className="dna-ai-node dna-ai-node-focus"><small>02 / PROCESS</small><strong>AI hỗ trợ</strong></div><span aria-hidden="true">→</span><div className="dna-ai-node"><small>03 / VERIFY</small><strong>Con người</strong></div></div>
  <span className="dna-scene-tag">CONNECT / AUTOMATE</span>
 </div>;
}

export function AthenaServiceShowcase({mode="home"}:{mode?:Mode}){
 return <div className={"dna-services-grid dna-services-grid-"+mode}>
  {services.map((service,i)=><article className={"dna-service-card dna-service-"+service.slug} key={service.slug}>
   <div className="dna-service-scene"><ServiceScene slug={service.slug}/></div>
   <div className="dna-service-body">
    <div className="dna-service-head"><span>{String(i+1).padStart(2,"0")} / 03</span><span>{service.eyebrow}</span></div>
    <h3>{service.shortTitle}</h3>
    <p>{service.description}</p>
    <div className="dna-service-tags">{service.features.slice(0,2).map(label=><span key={label}>{label}</span>)}</div>
    <Link className="dna-service-cta" href={"/services/"+service.slug}>Khám phá dịch vụ <span aria-hidden="true">→</span></Link>
   </div>
  </article>)}
 </div>;
}
