import Image from "next/image";
import Link from "next/link";

type World="creative-studio"|"architecture-studio"|"auto-showroom";
type ArtDirection={eyebrow:string;title:string;description:string;first:number;second:number;firstLabel:string;secondLabel:string;cta:string;theme:string};
const art:Record<World,ArtDirection>={
 "creative-studio":{
  eyebrow:"SORA / VISUAL LAB",title:"Ý tưởng không ở yên trong một khung hình.",
  description:"Từ chất liệu, góc máy đến hệ nhận diện: một tuyển chọn thị giác cho những ý tưởng cần được cảm nhận, không chỉ được giới thiệu.",
  first:2,second:4,firstLabel:"STUDY 01 / FORM",secondLabel:"STUDY 02 / DIRECTION",
  cta:"Đi sâu vào từng dự án",theme:"studio"
 },
 "architecture-studio":{
  eyebrow:"MỘC / MATERIAL JOURNAL",title:"Bề mặt. Ánh sáng. Khoảng thở.",
  description:"Một công trình không chỉ có phối cảnh tổng thể. Những chi tiết vật liệu và không gian ở tỷ lệ con người tạo nên câu chuyện của nó.",
  first:4,second:3,firstLabel:"MATERIAL / 01",secondLabel:"SPACE / 02",
  cta:"Xem hồ sơ công trình",theme:"architecture"
 },
 "auto-showroom":{
  eyebrow:"BLACK VELOCITY / MATERIAL STUDIES",title:"EVERY SURFACE COUNTS.",
  description:"Ánh sáng lướt qua hình khối thấp, lớp sơn graphite và những chi tiết carbon. Hai ảnh dưới đây là tư liệu minh họa ngôn ngữ thiết kế, không phải hình chụp xe McLaren trong mô hình.",
  first:1,second:4,firstLabel:"FORM / 01",secondLabel:"MATERIAL / 02",
  cta:"KHÁM PHÁ DESIGN STUDIES",theme:"automotive"
 }
};

export function WorldEditorialInterlude({slug}:{slug:World}){
 const data=art[slug];
 const root="/template-demos/"+slug;
 if(slug==="auto-showroom")return <section className="ix-editorial ix-editorial-automotive ix-editorial-minimal" aria-labelledby="ix-editorial-title-auto-showroom">
  <div className="ix-editorial-minimal-head"><span>02 / DESIGN LANGUAGE</span><span>FORM — MATERIAL — MOTION</span></div>
  <div className="ix-editorial-minimal-body"><h2 id="ix-editorial-title-auto-showroom">LESS NOISE.<br/><em>MORE FORM.</em></h2><div><p>Ba góc nhìn về cùng một hình khối. Không cần thêm ảnh chụp xe khi chính mô hình 3D đã có thể xoay và khám phá.</p><Link href={root+"/work"}>KHÁM PHÁ DESIGN STUDIES <span aria-hidden="true">↗</span></Link></div></div>
  <div className="ix-editorial-minimal-foot"><span>01 / SILHOUETTE</span><span>02 / MATERIAL</span><span>03 / AERODYNAMICS</span></div>
 </section>;
 return <section className={"ix-editorial ix-editorial-"+data.theme} aria-labelledby={"ix-editorial-title-"+slug}>
  <div className="ix-editorial-heading">
   <span className="ix-editorial-eyebrow">02 / {data.eyebrow}</span>
   <h2 id={"ix-editorial-title-"+slug}>{data.title}</h2>
   <div className="ix-editorial-intro">
    <p>{data.description}</p>
    <Link href={root+"/work"}>{data.cta}<span aria-hidden="true">↗</span></Link>
   </div>
  </div>
  <div className="ix-editorial-photo-grid">
   <figure className="ix-editorial-feature">
    <Image src={root+"/image-"+data.first+".jpg"} alt={"Tuyển chọn hình ảnh "+data.firstLabel} fill sizes="(max-width:760px) 100vw, 58vw" loading="lazy" quality={slug==="creative-studio"?75:78} unoptimized={slug==="creative-studio"}/>
    <figcaption><span>01 / 02</span><span>{data.firstLabel}</span></figcaption>
   </figure>
   <figure className="ix-editorial-secondary">
    <Image src={root+"/image-"+data.second+".jpg"} alt={"Chi tiết "+data.secondLabel} fill sizes="(max-width:760px) 88vw, 30vw" loading="lazy" quality={78} unoptimized={slug==="creative-studio"}/>
    <figcaption><span>02 / 02</span><span>{data.secondLabel}</span></figcaption>
   </figure>
  </div>
 </section>;
}
