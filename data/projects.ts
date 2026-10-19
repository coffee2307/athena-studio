import type { Project } from "@/types/project";

/**
 * A published entry MUST have independently traceable source and owner-approved
 * classification. Client delivery/revenue claims may never be inferred from a repo.
 * Entries marked review are never returned by getPublishedProjects().
 */
export const projects: Project[] = [
  {
    slug:"pham",title:"PHAM",kicker:"THƯƠNG HIỆU / TRẢI NGHIỆM SỐ",category:"Thương mại điện tử",
    kind:"founder",status:"đang phát triển",visibility:"published",featured:true,
    summary:"Hệ thống trải nghiệm thương hiệu thời trang và thương mại điện tử phát triển trên Shopify.",
    introduction:"PHAM là thương hiệu thời trang riêng của founder. Repository công khai cho thấy hệ thống theme Shopify được tùy biến sâu và cấu trúc quản lý các đợt phát hành sản phẩm (Edition). Đây là dự án của founder, không phải hợp đồng khách hàng độc lập do Athena thực hiện.",
    challenge:"Xây dựng trải nghiệm trực tuyến có bản sắc riêng cho thương hiệu, đồng thời thiết kế các luồng đặt hàng, phát hành giới hạn và vận hành có kiểm soát.",
    approach:"Repository sử dụng Shopify Liquid và các thành phần theme tùy chỉnh. Tài liệu dự án mô tả kiến trúc Edition, trạng thái đặt chỗ, quy trình hoàn tất thanh toán và kết nối Cloudflare Worker/D1 với Shopify. Những nội dung đó phản ánh thiết kế hệ thống trong mã nguồn, không chứng minh đã triển khai thương mại thành công.",
    outcome:"Đã có mã nguồn theme tùy biến và tài liệu quy trình Edition. Việc phát hành, giao hàng, doanh thu hoặc số khách hàng thực tế chưa được xác minh để công bố tại Athena.",
    outcomeNote:"Kết quả trình bày là hiện vật mã nguồn và tài liệu, không phải chỉ số thương mại.",
    technologies:["Shopify Liquid","JavaScript","CSS","Cloudflare Worker / D1 (theo tài liệu kiến trúc)"],
    activities:["Thiết kế trải nghiệm thương hiệu","Phát triển theme Shopify","Kiến trúc quy trình Edition","Tổ chức tài liệu triển khai"],
    sourceUrl:"https://github.com/coffee2307/pham-store",
    websiteUrl:undefined,gallery:[],responsibility:"Dự án riêng của founder Athena; không ghi nhận là khách hàng của studio.",
    evidenceNote:"Đối chiếu repository pham-store: các thư mục sections/, templates/, layout/ và docs/PHAM_EDITION_SYSTEM.md. Trạng thái production phải được xác nhận riêng.",
    artwork:"pham",updatedLabel:"Đối chiếu nguồn · 10/2026"
  },
  {
    slug:"econith",title:"ECONITH",kicker:"NGHIÊN CỨU / HỆ THỐNG ĐỊNH LƯỢNG",category:"Nghiên cứu công nghệ",
    kind:"research",status:"nghiên cứu",visibility:"published",featured:true,
    summary:"Nền tảng nghiên cứu định lượng, dữ liệu thị trường và mô phỏng kinh tế đang được kiểm định.",
    introduction:"ECONITH là một dự án nghiên cứu công nghệ do founder phát triển. Repository công khai chứa các miền xử lý dữ liệu và định lượng, mô phỏng World, API và giao diện điều khiển; đây không phải một dịch vụ giao dịch đã được chứng minh lợi nhuận.",
    challenge:"Tách biệt dữ liệu thị trường thực và môi trường mô phỏng, tổ chức pipeline nghiên cứu có thể kiểm định, đồng thời giới hạn hành vi tự động khi chưa đạt yêu cầu an toàn.",
    approach:"Mã nguồn và README mô tả Quant với các tầng dữ liệu, tín hiệu, kiểm soát rủi ro và dashboard; World phục vụ nghiên cứu kịch bản. Tài liệu ghi rõ trạng thái SIM/DEMO và giới hạn của tự động hóa, đánh giá khoa học và quá trình huấn luyện.",
    outcome:"Repository có kiến trúc, công cụ nghiên cứu và quy trình kiểm định được mô tả. Không có đủ bằng chứng để khẳng định độ chính xác dự báo, lợi nhuận thật hoặc vận hành tự động an toàn trong production.",
    outcomeNote:"Kết quả công bố chỉ phản ánh chức năng và tài liệu kỹ thuật đã đối chiếu.",
    technologies:["Python","TypeScript","Mô hình dữ liệu","Dashboard","API"],
    activities:["Nghiên cứu hệ thống định lượng","Kiến trúc dữ liệu","Mô phỏng và kiểm định","Giao diện giám sát"],
    sourceUrl:"https://github.com/coffee2307/econith",
    gallery:[],responsibility:"Dự án nghiên cứu của founder; không phải dự án bàn giao cho khách hàng Athena.",
    evidenceNote:"Đối chiếu README trên nhánh main tại 10/2026; README có mốc báo cáo 13/09/2026 và không đại diện cho kiểm thử production hiện tại.",
    artwork:"econith",updatedLabel:"Đối chiếu nguồn · 10/2026"
  },
  {
    slug:"qrio",title:"Qrio",kicker:"DỰ ÁN / ĐANG XÁC MINH",category:"Dự án cá nhân",
    kind:"founder",status:"đang phát triển",visibility:"review",featured:false,
    summary:"Thông tin đang chờ xác minh trước khi công bố.",
    introduction:"Chưa đủ tài liệu để xuất bản case study.",
    challenge:"Chưa xác minh.",approach:"Chưa xác minh.",outcome:"Chưa xác minh.",
    outcomeNote:"Không công bố thành tích khi thiếu bằng chứng.",technologies:[],activities:[],
    gallery:[],responsibility:"Đang chờ founder xác nhận vai trò và tài sản được phép công bố.",
    evidenceNote:"Không tìm thấy repository công khai coffee2307/qrio tại thời điểm audit.",artwork:"qrio",updatedLabel:"Chờ rà soát"
  }
];
export const publicProjects=projects.filter(p=>p.visibility==="published"&&Boolean(p.sourceUrl));
export const featuredProjects=publicProjects.filter(p=>p.featured);
export function getProjectBySlug(slug:string):Project|undefined {return publicProjects.find(p=>p.slug===slug);}
export function getAllProjectDrafts():Project[]{return projects;}
