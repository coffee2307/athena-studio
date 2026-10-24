"use client";
import Image from "next/image";
import Link from "next/link";
import type {WorldSection} from "./WorldSite";

type Slug="creative-studio"|"architecture-studio"|"auto-showroom";
type Config={label:string;tag:string;image:number;caption:string;story:string;work:string};
const config:Record<Slug,Config>={
 "creative-studio":{label:"SORA / CREATIVE STUDIO",tag:"IDENTITY · ART DIRECTION · DIGITAL",image:4,caption:"Một góc nhìn, nhiều khả năng.",story:"Thương hiệu bắt đầu bằng cảm xúc, sống bằng hệ thống và được ghi nhớ bằng những chi tiết.",work:"Khám phá các dự án sáng tạo qua hình ảnh, bố cục và câu chuyện thiết kế."},
 "architecture-studio":{label:"MỘC / ARCHITECTURE",tag:"SPACE · MATERIAL · LIGHT",image:5,caption:"Kiến trúc là trải nghiệm sống.",story:"Tỷ lệ, vật liệu và ánh sáng góp phần quyết định cảm giác của một không gian.",work:"Các công trình được giới thiệu bằng ảnh, bối cảnh và cách tiếp cận thiết kế."},
 "auto-showroom":{label:"VELAR / CONCEPT MOTORS",tag:"DESIGN · MOTION · PERFORMANCE",image:5,caption:"Mỗi góc nhìn có một câu chuyện.",story:"Những đường nét thiết kế, vật liệu và hiệu suất được đặt trong ngữ cảnh trải nghiệm.",work:"Khám phá bộ sưu tập xe concept. Đây là dữ liệu minh họa, không phải đại lý hoặc nhà sản xuất chính thức."}
};
const titles:Record<WorldSection,string>={home:"TRANG CHỦ",work:"BỘ SƯU TẬP",services:"PHẠM VI DỊCH VỤ",about:"CÂU CHUYỆN",contact:"KẾT NỐI",detail:"CHI TIẾT DỰ ÁN"};
export function WorldSubpageFeature({slug,section}:{slug:string;section:WorldSection}){
 if(!(slug in config)||section==="home")return null;
 const key=slug as Slug;
 const meta=config[key];
 const isDetail=section==="detail";
 return <aside className={"ix-subpage-feature ix-subpage-"+key} aria-label={"Giới thiệu "+titles[section]}>
  <div className="ix-subpage-feature-copy">
   <div className="ix-subpage-feature-kicker"><span>{meta.label}</span><span>{titles[section]} / 2026</span></div>
   <h2>{section==="about"?meta.story:section==="work"||isDetail?meta.work:meta.caption}</h2>
   <div className="ix-subpage-feature-bottom"><span>{meta.tag}</span>
    <Link href={"/template-demos/"+slug+"/experience"}>KHÁM PHÁ KHÔNG GIAN 3D <span aria-hidden="true">↗</span></Link>
   </div>
  </div>
  <div className="ix-subpage-feature-art">
   <Image src={"/template-demos/"+slug+"/image-"+meta.image+".jpg"} alt={"Hình ảnh chủ đề "+meta.label} fill
    sizes="(max-width:760px) 100vw, 34vw" loading="lazy"/>
   <span>CURATED VISUAL / ATHENA STUDIO</span>
  </div>
 </aside>;
}
