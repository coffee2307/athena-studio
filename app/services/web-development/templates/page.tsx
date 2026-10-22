import Link from "next/link";
import {TemplateGallery} from "@/components/templates/TemplateGallery";
import {templates,templateIndustries,templateStyles} from "@/lib/templates";
export const metadata={title:"Mẫu website demo tương tác | Athena",description:"Khám phá 12 hướng thiết kế website với demo cuộn trang và tương tác trực tiếp."};
export default function TemplatesPage(){return <div><section className="templates-intro"><p className="eyebrow">THƯ VIỆN THIẾT KẾ / 12 HƯỚNG</p><h1>Chọn một hướng đi phù hợp.</h1><p>Mỗi mẫu mở ra một website demo có thể cuộn và thử tương tác, kèm phạm vi, mức giá tham khảo, chất lượng và liên kết trải nghiệm toàn trang. Ảnh trong demo được lưu cùng dự án; nội dung, đặt lịch và giỏ hàng chỉ mô phỏng thao tác.</p><Link href="/contact">Tư vấn thiết kế website</Link></section><TemplateGallery templates={templates} industries={templateIndustries} styles={templateStyles}/></div>}
