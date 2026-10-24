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
  name:"VELAR / CONCEPT",discipline:"AUTOMOTIVE · DETAIL · MOTION",
  pages:{
   work:{index:"01 / COLLECTION",title:"Khám phá thiết kế trước khi chọn một hành trình.",description:"Xem ba mẫu xe concept, hình ảnh và thông tin trình diễn. Không có giao dịch mua bán thật.",photo:5,photoLabel:"THE COLLECTION"},
   services:{index:"02 / SHOWROOM",title:"Một showroom được thiết kế quanh trải nghiệm.",description:"Từ cách giới thiệu xe đến đặt lịch lái thử giả lập, mỗi bước cần rõ ràng và dễ thao tác.",photo:1,photoLabel:"DESIGN EXPERIENCE"},
   about:{index:"03 / DESIGN LANGUAGE",title:"Cảm xúc bắt đầu từ một đường nét.",description:"Một ngôn ngữ hình ảnh tập trung vào tỷ lệ thân xe, ánh sáng và chuyển động.",photo:4,photoLabel:"THE DESIGN"},
   contact:{index:"04 / ENQUIRY",title:"Hành trình tiếp theo bắt đầu bằng một câu hỏi.",description:"Các yêu cầu, thông tin xe và lịch hẹn chỉ mang tính mô phỏng của thư viện Athena.",photo:3,photoLabel:"GET IN TOUCH"},
   detail:{index:"05 / VEHICLE STUDY",title:"Từng chi tiết đều đáng nhìn kỹ.",description:"Khám phá các góc nhìn ngoại thất và mô tả xe concept; thông số chỉ có tính minh họa.",photo:2,photoLabel:"IN FOCUS"}
  }
 }
};
export function WorldSubpageFeature({slug,section}:{slug:string;section:WorldSection}){
 if(!(slug in directions)||section==="home")return null;
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
    <Link href={root+"/experience"}>KHÁM PHÁ KHÔNG GIAN 3D <span aria-hidden="true">↗</span></Link>
   </div>
  </div>
  <div className="ix-subpage-feature-art">
   <Image src={root+"/image-"+moment.photo+".jpg"} alt={"Hình ảnh minh họa "+moment.photoLabel} fill
    sizes="(max-width:760px) 100vw, 36vw" loading="lazy" quality={78}/>
   <span>{moment.photoLabel} / 2026</span>
  </div>
 </aside>;
}
