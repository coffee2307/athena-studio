import Image from "next/image";
import Link from "next/link";
import type {WorldSection} from "./WorldSite";

type World="creative-studio"|"architecture-studio"|"auto-showroom";
type Page=Exclude<WorldSection,"home">;
type Moment={index:string;title:string;description:string;photo:number;photoLabel:string};
type Direction={name:string;discipline:string;pages:Record<Page,Moment>};
const directions:Record<World,Direction>={
 "creative-studio":{
  name:"SORA / STUDIO",discipline:"ART DIRECTION · BRANDING · DIGITAL",
  pages:{
   work:{index:"01 / PORTFOLIO",title:"Mỗi ý tưởng có một ngôn ngữ riêng.",description:"Một tuyển chọn các dự án và nghiên cứu thị giác — xem hình ảnh, bối cảnh và chủ đích thiết kế.",photo:2,photoLabel:"THE WORK"},
   services:{index:"02 / EXPERTISE",title:"Từ chiến lược đến một thế giới thị giác.",description:"Tìm hiểu cách studio tiếp cận nhận diện, chỉ đạo nghệ thuật và trải nghiệm số trong bản demo.",photo:5,photoLabel:"THE PRACTICE"},
   about:{index:"03 / STUDIO",title:"Làm khác biệt bằng sự quan sát.",description:"Điều tạo nên một studio không nằm ở những hiệu ứng lớn, mà ở cách từng quyết định kết nối với nhau.",photo:4,photoLabel:"THE PEOPLE & PROCESS"},
   contact:{index:"04 / CONVERSATION",title:"Một dự án thú vị bắt đầu từ cuộc trao đổi.",description:"Biểu mẫu bên dưới mô phỏng hành trình liên hệ; chưa gửi dữ liệu hay tạo yêu cầu thực tế.",photo:3,photoLabel:"LET'S CREATE"},
   detail:{index:"05 / CASE STUDY",title:"Đi sâu hơn vào quá trình hình thành ý tưởng.",description:"Khám phá dự án qua ảnh, phương pháp và các nguyên tắc sáng tạo — nội dung của website mẫu.",photo:2,photoLabel:"BEHIND THE PROJECT"}
  }
 },
 "architecture-studio":{
  name:"MỘC / ARCHITECTURE",discipline:"ARCHITECTURE · INTERIORS · MATERIALS",
  pages:{
   work:{index:"01 / PROJECTS",title:"Không gian được nhìn từ cuộc sống bên trong.",description:"Những góc nhìn về ánh sáng, tỷ lệ và công năng trong bộ hồ sơ công trình minh họa.",photo:5,photoLabel:"SELECTED SPACES"},
   services:{index:"02 / DESIGN PRACTICE",title:"Mọi bản vẽ đều bắt đầu bằng nhu cầu sống.",description:"Từ tổ chức mặt bằng đến vật liệu, đây là cách một dịch vụ kiến trúc được giới thiệu rõ ràng.",photo:3,photoLabel:"SPACE & MATERIAL"},
   about:{index:"03 / PHILOSOPHY",title:"Kiến trúc là nghệ thuật của những khoảng trống.",description:"Giữ lại nhịp sống, ánh sáng tự nhiên và sự tĩnh lặng trong mỗi lựa chọn thiết kế.",photo:4,photoLabel:"OUR APPROACH"},
   contact:{index:"04 / START A PROJECT",title:"Kể về nơi bạn muốn gọi là nhà.",description:"Dùng biểu mẫu mô phỏng để trải nghiệm bước trao đổi nhu cầu ban đầu với một studio kiến trúc.",photo:5,photoLabel:"CONVERSATION"},
   detail:{index:"05 / PROJECT NOTES",title:"Từng tỷ lệ nhỏ góp phần tạo nên công trình.",description:"Một hồ sơ dự án minh họa với ảnh không gian, vật liệu và câu chuyện thiết kế.",photo:3,photoLabel:"PROJECT JOURNAL"}
  }
 },
 "auto-showroom":{
  name:"VELAR / BLACK VELOCITY",discipline:"PERFORMANCE DESIGN · MATERIAL · AERO",
  pages:{
   work:{index:"01 / DESIGN STUDIES",title:"THE MACHINE. THREE PERSPECTIVES.",description:"Ba chương nhìn vào cùng một mẫu xe 3D: hình dáng, vật liệu và khí động học. Ảnh phụ trợ chỉ minh họa phong cách showroom.",photo:5,photoLabel:"FORM / MATERIAL / AERO"},
   services:{index:"02 / INTERACTION",title:"ENGINEERED FOR EXPERIENCE.",description:"Quan sát mô hình thật với camera có chủ đích, chuyển động có thể đảo chiều và chế độ dự phòng khi không có WebGL.",photo:1,photoLabel:"INTERACTION STUDY"},
   about:{index:"03 / DESIGN LANGUAGE",title:"PRECISION IN EVERY LINE.",description:"Đen graphite, tương phản kim loại và nhịp đường chéo tạo nên ngôn ngữ thị giác BLACK VELOCITY.",photo:4,photoLabel:"DESIGN PHILOSOPHY"},
   contact:{index:"04 / ENQUIRY",title:"YOUR NEXT PERSPECTIVE.",description:"Trải nghiệm biểu mẫu demo về concept thiết kế. Không có giao dịch, lịch hẹn hoặc tư vấn xe thực tế.",photo:3,photoLabel:"CONCEPT ENQUIRY"},
   detail:{index:"05 / DETAIL STUDY",title:"BEYOND THE SURFACE.",description:"Đi sâu vào đường nét, vật liệu và ngoại thất trong nghiên cứu concept, không dùng thông số hiệu năng tự tạo.",photo:2,photoLabel:"DETAIL IN FOCUS"}
  }
 }
};
export function WorldSubpageFeature({slug,section}:{slug:string;section:WorldSection}){
 if(!(slug in directions)||section==="home"||slug==="auto-showroom")return null;
 const world=slug as World;
 const direction=directions[world];
 const moment=direction.pages[section as Page];
 const root="/template-demos/"+slug;
 return <aside className={"ix-subpage-feature ix-subpage-"+world+" ix-subpage-"+section}
  aria-label={"Giới thiệu "+moment.index}>
  <div className="ix-subpage-feature-copy">
   <div className="ix-subpage-feature-kicker"><span>{direction.name}</span><span>{moment.index}</span></div>
   <div className="ix-subpage-statement">
    <span className="ix-subpage-discipline">{direction.discipline}</span>
    <h2>{moment.title}</h2>
    <p>{moment.description}</p>
   </div>
   <div className="ix-subpage-feature-bottom">
    <span>ATHENA / DEMONSTRATION SITE</span>
    <Link href={root+"/experience"}>{world==="auto-showroom"?"OPEN CINEMATIC STUDY":"KHÁM PHÁ KHÔNG GIAN 3D"} <span aria-hidden="true"></span></Link>
   </div>
  </div>
  <div className="ix-subpage-feature-art">
   <Image src={root+"/image-"+moment.photo+".jpg"} alt={"Hình ảnh minh họa "+moment.photoLabel} fill
    sizes="(max-width:760px) 100vw, 36vw" loading="lazy" quality={world==="creative-studio"?75:78} unoptimized={world==="creative-studio"}/>
   <span>{moment.photoLabel} / 2026</span>
  </div>
 </aside>;
}
