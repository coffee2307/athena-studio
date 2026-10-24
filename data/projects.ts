import type {Project} from "@/types/project";

/** Public case studies contain only owner-approved descriptive and visual data.
 * Never include source repository URLs or internal architecture evidence in props. */
export const projects:Project[]=[
 {
  slug:"pham",title:"PHAM",kicker:"THƯƠNG HIỆU / TRẢI NGHIỆM THƯƠNG MẠI ĐIỆN TỬ",
  category:"Website thời trang",kind:"founder",status:"đang phát triển",visibility:"published",featured:true,
  summary:"Website thời trang có giao diện biên tập đặc trưng, trang sản phẩm tương tác và hệ thống trình bày đợt phát hành giới hạn.",
  introduction:"PHAM là thương hiệu riêng của founder Athena. Trang web công khai được phát triển theo hướng thương mại điện tử cao cấp, ưu tiên việc khám phá sản phẩm, kể câu chuyện thiết kế và điều hướng từ cảm nhận thị giác đến thông tin đặt hàng.",
  challenge:"Kết hợp bản sắc thời trang độc lập với trải nghiệm web hoạt động trên desktop và điện thoại; giới thiệu một sản phẩm có nhiều lớp nội dung mà không gây rối cho người xem.",
  approach:"Tổ chức hero chuyển động tương tác, khu vực khám phá PHAM-001, ảnh và màn hình thông tin sản phẩm, lựa chọn kích cỡ, cùng cách trình bày trạng thái đợt phát hành. Thiết kế nhấn mạnh tính nhất quán trên những điểm chạm chính.",
  outcome:"Trang chủ và trang chi tiết PHAM-001 đang hiển thị công khai. Ảnh chụp bên dưới ghi lại giao diện thực tại thời điểm đối chiếu; không đồng nghĩa hệ thống thanh toán đã mở bán hoặc đã có doanh thu.",
  technologies:["Shopify","Thiết kế giao diện","Responsive","Tương tác sản phẩm"],
  activities:["Thiết kế trải nghiệm thương hiệu","Trang sản phẩm PHAM-001","Điều hướng và trình bày sản phẩm","Thiết kế trải nghiệm mobile"],
  websiteUrl:"https://phamofficial.com/",
  gallery:[
   {src:"/portfolio/pham-desktop.webp",alt:"Ảnh chụp trang chủ PHAM trên desktop với giao diện thời trang đen trắng và sản phẩm PHAM-001",caption:"Trang chủ PHAM — desktop, chụp từ website công khai ngày 21/10/2026",rightsVerified:true},
   {src:"/portfolio/pham-product.webp",alt:"Ảnh chụp trang PHAM-001 với hình áo khoác và trải nghiệm Inspect the Form",caption:"Giao diện khám phá sản phẩm PHAM-001 — desktop",rightsVerified:true},
   {src:"/portfolio/pham-mobile.webp",alt:"Ảnh chụp trang chủ PHAM trên màn hình điện thoại",caption:"Trang chủ PHAM — giao diện điện thoại",rightsVerified:true},
   {src:"/portfolio/pham-product-mobile.webp",alt:"Ảnh chụp trang PHAM-001 trên điện thoại",caption:"Trang sản phẩm PHAM-001 — giao diện điện thoại",rightsVerified:true}
  ],
  artwork:"pham",updatedLabel:"Giao diện thực tế · 21/10/2026"
 },
 {
  slug:"econith",title:"ECONITH",kicker:"NGHIÊN CỨU / PHÂN TÍCH ĐỊNH LƯỢNG",category:"Nghiên cứu công nghệ",
  kind:"research",status:"nghiên cứu",visibility:"published",featured:true,
  summary:"Hệ thống nghiên cứu dữ liệu thị trường, mô phỏng và đánh giá tín hiệu định lượng với các cổng kiểm định an toàn.",
  introduction:"ECONITH là hệ thống nghiên cứu đang được phát triển và kiểm định bởi founder. Nội dung giới thiệu tập trung vào chức năng, mục tiêu của từng luồng phân tích và giới hạn nghiên cứu, không công bố thuật toán hoặc mã nguồn riêng.",
  challenge:"Tổ chức dữ liệu, kiểm định tín hiệu và mô phỏng trong cùng một quy trình đủ minh bạch để phân biệt kết quả nghiên cứu với giao dịch thực tế.",
  approach:"Định hướng kết hợp dashboard, trạng thái nguồn dữ liệu, báo cáo kiểm thử, phân tích tín hiệu và các cơ chế kiểm soát việc mở tính năng nhạy cảm. Chỉ những giao diện không chứa dữ liệu và cấu hình nội bộ mới được phép đưa lên hồ sơ công khai.",
  outcome:"Các khối nghiên cứu và kiểm thử đang được tiếp tục hoàn thiện. Chưa có ảnh chụp dashboard đã được duyệt công bố và chưa có cơ sở khẳng định lợi nhuận giao dịch thực.",
  technologies:["Nghiên cứu dữ liệu","Dashboard","Kiểm định mô hình","Quản lý rủi ro"],
  activities:["Luồng thu thập và kiểm chứng dữ liệu","Phân tích tín hiệu","Báo cáo kiểm thử","Giao diện giám sát"],
  gallery:[],
  artwork:"econith",updatedLabel:"Nghiên cứu · Chưa công bố ảnh giao diện"
 },
 {
  slug:"digital-creators",title:"Digital Creators",kicker:"IMMERSIVE WEB / SÁNG TẠO SỐ",
  category:"Website sáng tạo tương tác",kind:"founder",status:"đang phát triển",visibility:"published",featured:false,
  summary:"Một website kể chuyện qua Rubik 3D, tranh nét cọ và thành phố khối lắp ghép tương tác theo cuộn.",
  introduction:"Digital Creators là dự án website giới thiệu đề xuất câu lạc bộ sáng tạo số; không phải công việc đã bàn giao cho khách hàng hoặc câu lạc bộ đang hoạt động.",
  challenge:"Xây trải nghiệm ba chiều có chiều sâu nhưng tương thích thiết bị yếu và di động.",
  approach:"React, Three.js và React Three Fiber; cảnh tải riêng theo trang, WebGL theo cuộn và phương án giảm chuyển động.",
  outcome:"Website giới thiệu mô phỏng chức năng đăng ký, không tiếp nhận thông tin cá nhân hoặc vận hành backend.",
  technologies:["React","TypeScript","Three.js","Immersive 3D"],activities:["Rubik 3D theo cuộn","Tranh xuất hiện bằng nét cọ","Thành phố khối 3D","Mobile và reduced-motion"],
  websiteUrl:"/template-demos/digital-creators",gallery:[],artwork:"digital-creators",updatedLabel:"Immersive interactive concept · 2026"
 },
 {
  slug:"qrio",title:"Qrio",kicker:"DỰ ÁN ĐANG XÁC MINH",category:"Dự án cá nhân",
  kind:"founder",status:"đang phát triển",visibility:"review",featured:false,
  summary:"Đang rà soát quyền và tài sản được phép công bố.",introduction:"Chưa đủ tư liệu đã duyệt.",
  challenge:"Chưa xác minh.",approach:"Chưa xác minh.",outcome:"Chưa xác minh.",
  technologies:[],activities:[],gallery:[],artwork:"qrio",updatedLabel:"Chờ rà soát",
 }
];
export const publicProjects=projects.filter(p=>p.visibility==="published");
export const featuredProjects=publicProjects.filter(p=>p.featured);
export function getProjectBySlug(slug:string){return publicProjects.find(p=>p.slug===slug);}
export function getAllProjectDrafts(){return projects;}
