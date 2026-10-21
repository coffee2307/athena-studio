export type Offering = {
  slug: string;
  index: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  challenge: string;
  output: string;
  details: string;
  features: string[];
  deliverables: string[];
  startingAt: string;
  cadence: string;
};
export const offerings: Offering[] = [
  {
    slug: "web-development", index: "01", eyebrow: "THIẾT KẾ / PHÁT TRIỂN",
    title: "Thiết kế và phát triển website", shortTitle: "Thiết kế website",
    subtitle: "Một website không chỉ cần đẹp. Nó cần tạo ra giá trị.",
    description: "Xây website giúp khách hàng tìm thông tin, hiểu sản phẩm và liên hệ hoặc đặt mua thuận tiện.",
    challenge: "Bạn chưa có website, website cũ khó dùng trên điện thoại hoặc khách truy cập không biết phải làm gì tiếp theo.",
    output: "Trang giới thiệu, landing page hoặc website bán hàng theo phạm vi; giao diện di động, nút liên hệ rõ ràng, cấu trúc SEO cơ bản và hướng dẫn quản trị.",
    details: "Từ trang giới thiệu, landing page đến cửa hàng trực tuyến và ứng dụng web theo yêu cầu. Mỗi dự án bắt đầu bằng việc hiểu doanh nghiệp, người dùng và trải nghiệm cần tạo ra.",
    features: ["Thiết kế giao diện theo thương hiệu", "Tối ưu đa thiết bị và tốc độ", "Kết nối hệ thống quản lý nội dung", "Nền tảng tối ưu tìm kiếm"],
    deliverables: ["Khảo sát và xác định phạm vi", "Thiết kế giao diện desktop và mobile", "Lập trình, kiểm thử và tối ưu", "Bàn giao và hướng dẫn vận hành"],
    startingAt: "Báo giá theo dự án", cadence: "Phí triển khai",
  },
  {
    slug: "website-care", index: "02", eyebrow: "VẬN HÀNH / BẢO TRÌ",
    title: "Chăm sóc và bảo trì website", shortTitle: "Chăm sóc website",
    subtitle: "Website cần được chăm sóc cả sau ngày ra mắt.",
    description: "Kiểm tra và xử lý những vấn đề vận hành website trong phạm vi có thể xác minh và thỏa thuận.",
    challenge: "Website tải chậm, phát sinh lỗi, cần cập nhật thường xuyên hoặc chưa có người chịu trách nhiệm sao lưu và kiểm tra.",
    output: "Rà soát hiện trạng và mức độ ưu tiên; kế hoạch sửa lỗi, cập nhật, sao lưu hoặc theo dõi định kỳ theo gói đã thống nhất.",
    details: "Tùy theo nền tảng và quy mô website, Athena đánh giá những điểm cần theo dõi, lên lịch sao lưu, cập nhật và hỗ trợ xử lý sự cố trong phạm vi thỏa thuận.",
    features: ["Theo dõi khả năng truy cập", "Lập kế hoạch sao lưu và cập nhật", "Kiểm tra an toàn hệ thống", "Báo cáo tình trạng định kỳ"],
    deliverables: ["Đánh giá website ban đầu", "Kế hoạch chăm sóc phù hợp", "Theo dõi các hạng mục theo thỏa thuận", "Báo cáo và hỗ trợ kỹ thuật"],
    startingAt: "Theo gói chăm sóc", cadence: "Dịch vụ định kỳ",
  },
  {
    slug: "ai-integration", index: "03", eyebrow: "TRÍ TUỆ NHÂN TẠO / KẾT NỐI",
    title: "Tích hợp trí tuệ nhân tạo", shortTitle: "Tích hợp AI",
    subtitle: "Đưa AI vào quy trình thực tế, không chỉ thêm một chatbot.",
    description: "Thử nghiệm AI cho các bước công việc cụ thể, có kiểm tra kết quả và quyền kiểm soát của con người.",
    challenge: "Nhân sự phải tra cứu, tổng hợp tài liệu, nhập dữ liệu hoặc trả lời các câu hỏi giống nhau nhiều lần.",
    output: "Bản mô tả quy trình, nguyên mẫu trợ lý hoặc luồng tự động hóa, bước kiểm tra thủ công và tiêu chí đánh giá trước khi đưa vào sử dụng.",
    details: "Chúng tôi khảo sát bài toán trước khi lựa chọn mô hình AI và công cụ phù hợp. Giải pháp có thể là trợ lý kiến thức, xử lý tài liệu, tổng hợp báo cáo và quy trình tự động có điểm kiểm soát của con người.",
    features: ["Trợ lý tra cứu tri thức", "Tự động hóa công việc lặp lại", "Kết nối CRM và hệ thống hiện có", "Quy trình có bước phê duyệt"],
    deliverables: ["Phân tích bài toán và dữ liệu", "Thiết kế luồng xử lý", "Thử nghiệm trước khi triển khai", "Hướng dẫn vận hành và giám sát"],
    startingAt: "Báo giá theo yêu cầu", cadence: "Triển khai và duy trì",
  },
  {
    slug: "micro-saas", index: "04", eyebrow: "SẢN PHẨM / NGHIÊN CỨU",
    title: "Công cụ phần mềm chuyên biệt", shortTitle: "Micro-SaaS",
    subtitle: "Những công cụ nhỏ giải quyết vấn đề đến nơi.",
    description: "Các công cụ chuyên biệt đang trong giai đoạn nghiên cứu; chưa phải dịch vụ đặt mua hoặc sản phẩm phát hành.",
    challenge: "Có nhu cầu phần mềm riêng chưa được công cụ hiện tại giải quyết tốt.",
    output: "Nghiên cứu nhu cầu, đề xuất ý tưởng và thu thập phản hồi; chưa cam kết có sản phẩm thương mại.",
    details: "Xưởng sản phẩm Athena là nơi kiểm chứng và xây dựng các ý tưởng phần mềm. Sản phẩm chưa phát hành sẽ được ghi rõ trạng thái nghiên cứu, không nhận thanh toán trước khi sẵn sàng.",
    features: ["Công cụ tập trung một nhu cầu", "Trải nghiệm sử dụng đơn giản", "Chú trọng quyền riêng tư", "Kiến trúc có thể phát triển"],
    deliverables: ["Khảo sát nhu cầu thực tế", "Giới thiệu ý tưởng nghiên cứu", "Thu thập góp ý thử nghiệm", "Công bố khi sản phẩm sẵn sàng"],
    startingAt: "Đang nghiên cứu", cadence: "Sản phẩm độc lập",
  },
];
export function getOffering(slug: string) { return offerings.find(item=>item.slug===slug); }
