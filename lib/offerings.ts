export type Offering = {
  slug: string;
  index: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  details: string;
  features: string[];
  deliverables: string[];
  startingAt: string;
  cadence: string;
};

export const offerings: Offering[] = [
  {
    slug: "web-development", index: "01", eyebrow: "BUILD / EXPERIENCE",
    title: "Web Design & Development", shortTitle: "Thiết kế website",
    subtitle: "Một website không chỉ để hiện diện. Nó phải tạo ra giá trị.",
    description: "Thiết kế và phát triển website có chiến lược, giàu bản sắc, nhanh, rõ ràng và phù hợp với mục tiêu kinh doanh.",
    details: "Từ landing page, website doanh nghiệp đến cửa hàng thương mại điện tử và ứng dụng web theo yêu cầu. Mỗi dự án bắt đầu bằng việc hiểu sản phẩm và hành trình khách hàng, không phải chọn sẵn một giao diện.",
    features: ["Brand-led interface design", "Responsive & performance", "Commerce & CMS integration", "SEO foundations"],
    deliverables: ["Khảo sát và cấu trúc nội dung", "Thiết kế giao diện desktop / mobile", "Xây dựng và kiểm thử", "Bàn giao, hướng dẫn vận hành"],
    startingAt: "Theo phạm vi", cadence: "Phí triển khai",
  },
  {
    slug: "website-care", index: "02", eyebrow: "MAINTAIN / RELIABILITY",
    title: "Website Care", shortTitle: "Chăm sóc website",
    subtitle: "Website của bạn cần được chăm sóc cả sau ngày ra mắt.",
    description: "Bảo trì, theo dõi và hỗ trợ kỹ thuật định kỳ để website luôn an toàn, ổn định và sẵn sàng phục vụ khách hàng.",
    details: "Thiết kế các gói chăm sóc phù hợp với nền tảng, quy mô và mức độ quan trọng của website. Chúng tôi ưu tiên giám sát chủ động, sao lưu có khả năng khôi phục và báo cáo minh bạch.",
    features: ["Uptime & incident monitoring", "Backups & update planning", "Security hygiene", "Monthly care reporting"],
    deliverables: ["Kiểm tra hiện trạng ban đầu", "Kế hoạch bảo trì và sao lưu", "Theo dõi sự cố theo phạm vi gói", "Báo cáo định kỳ, hỗ trợ kỹ thuật"],
    startingAt: "Theo gói", cadence: "Hằng tháng",
  },
  {
    slug: "ai-integration", index: "03", eyebrow: "CONNECT / INTELLIGENCE",
    title: "AI Integration", shortTitle: "Tích hợp AI",
    subtitle: "Đưa AI vào đúng quy trình. Không chỉ thêm một chatbot.",
    description: "Kết nối AI với dữ liệu và hệ thống doanh nghiệp để giảm thao tác lặp lại, cải thiện phản hồi và mở ra cách làm việc mới.",
    details: "Khảo sát tác vụ thực tế trước khi lựa chọn mô hình và công cụ. Giải pháp có thể bao gồm trợ lý tri thức nội bộ, xử lý tài liệu, phân loại yêu cầu và workflow tự động hóa có bước phê duyệt của con người.",
    features: ["AI knowledge assistants", "Workflow automation", "CRM & API integration", "Human-in-the-loop safeguards"],
    deliverables: ["Đánh giá bài toán và dữ liệu", "Thiết kế luồng xử lý", "Triển khai thử nghiệm có đo lường", "Tài liệu vận hành và giám sát"],
    startingAt: "Theo bài toán", cadence: "Triển khai + duy trì",
  },
  {
    slug: "micro-saas", index: "04", eyebrow: "PRODUCT / SCALE",
    title: "Micro-SaaS Products", shortTitle: "Công cụ Micro-SaaS",
    subtitle: "Những công cụ nhỏ. Những vấn đề được giải quyết đến nơi.",
    description: "Phát triển các sản phẩm phần mềm gọn nhẹ, tập trung vào một nhu cầu cụ thể và dễ đưa vào công việc hằng ngày.",
    details: "Athena Product Lab là nơi chúng tôi thử nghiệm, kiểm chứng và xây dựng các công cụ số độc lập. Những sản phẩm chưa phát hành được ghi rõ trạng thái phát triển, không nhận thanh toán trước.",
    features: ["Focused utilities", "Self-service experience", "Privacy-first foundations", "Subscription-ready architecture"],
    deliverables: ["Theo dõi tiến độ sản phẩm", "Đăng ký quan tâm qua liên hệ", "Thử nghiệm với nhóm người dùng phù hợp", "Công bố giá khi sẵn sàng"],
    startingAt: "Đang phát triển", cadence: "Sản phẩm độc lập",
  },
];

export function getOffering(slug: string) {
  return offerings.find((offering) => offering.slug === slug);
}
