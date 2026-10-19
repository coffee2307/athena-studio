# ATHENA STUDIO

Website studio thiết kế và công nghệ độc lập, sử dụng **Next.js 15**, **React 19** và **TypeScript**. Các lĩnh vực gồm phát triển website, chăm sóc website, tích hợp AI và nghiên cứu công cụ Micro-SaaS. Website đang phát triển theo roadmap đã phê duyệt, **chưa đưa lên production**.

## Tài liệu chính thức
- [Roadmap Phase 0–7 đã phê duyệt](docs/ATHENA_MASTER_ROADMAP.md) — nguồn tham chiếu ưu tiên khi bắt đầu phiên làm việc mới.
- [Audit kiến trúc/bảo mật Phase 0](docs/PHASE0_ARCHITECTURE_AUDIT.md) và [QA Phase 0](docs/PHASE0_QA.md).
- [Design & motion Phase 1](docs/PHASE1_DESIGN_SYSTEM.md) và [QA Phase 1](docs/PHASE1_QA.md).
- [Kiến trúc Portfolio, quyền công bố Phase 2](docs/PHASE2_PORTFOLIO_GUIDE.md) và [QA Phase 2](docs/PHASE2_QA.md).

## Khởi chạy và kiểm tra
Yêu cầu Node.js 24, npm.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:smoke
npm audit --omit=dev --audit-level=high
```

Chạy local tại `http://localhost:3000`. GitHub Actions kiểm tra tương tự trên pull request.

## Các route được sử dụng
| Đường dẫn | Mục đích |
|---|---|
| `/` | Hero và tổng quan Athena |
| `/du-an` | Portfolio của founder và các dự án nghiên cứu có bằng chứng |
| `/du-an/[slug]` | Case study PHAM, ECONITH; Qrio đang chờ nguồn và ẩn |
| `/dich-vu` | Bốn dịch vụ và nhóm giải pháp |
| `/dich-vu/[slug]` | Mô tả chi tiết từng dịch vụ |
| `/san-pham` | Product Lab (SitePulse chỉ là ý tưởng) |
| `/ve-athena` | Giới thiệu và triết lý |
| `/lien-he` | Thông tin liên hệ và biểu mẫu có điều kiện |
| `/phap-ly` | Thông tin pháp lý bản nháp, cần rà soát |
| `/phap-ly/quyen-rieng-tu` | Thông tin quyền riêng tư dự kiến |
| `/phap-ly/dieu-khoan` | Điều khoản sử dụng dự kiến |
| `/phap-ly/cookie` | Chính sách cookie/lưu trữ hiện tại |
| `/api/inquiry` | API tiếp nhận khách hàng, chưa mở khi email chưa cấu hình |

Các đường dẫn cũ (`/work`, `/services`, `/products`, `/studio`, `/contact`) chuyển hướng vĩnh viễn sang phiên bản tiếng Việt.

## Portfolio và nguồn dữ liệu
Mô hình dữ liệu ở `types/project.ts` và danh mục ở `data/projects.ts`. Mỗi entry yêu cầu phân loại `founder | research | client`, trạng thái, quyền công bố, nguồn minh chứng, vai trò, thách thức, tiếp cận và kết quả *được xác nhận*. Mặc định dự án chưa duyệt phải có `visibility:"review"`. Không tự biến dự án founder thành dự án khách hàng Athena.

PHAM có repository `coffee2307/pham-store` với theme Shopify; ECONITH có repository `coffee2307/econith` ở trạng thái nghiên cứu; Qrio chưa được đối chiếu và không có case study public. Ảnh đại diện là đồ họa CSS của Athena, không phải ảnh chụp sản phẩm hoặc chứng cứ kết quả.

## SEO và production
`NEXT_PUBLIC_SITE_URL` chỉ đặt thành **tên miền HTTPS đã xác minh** khi được phê duyệt; cấu hình hiện tại từ chối indexing ở môi trường chưa có origin production. Metadata, canonical (khi có origin HTTPS), OG và sitemap lấy từ URL tiếng Việt. Script `node scripts/generate-og-image.mjs` tạo ảnh Open Graph từ nhận diện cú Athena.

## Liên hệ
Email công khai: `coffee2307@gmail.com`. Điện thoại: `0965747147`. Nút Zalo và WhatsApp cần xác thực bằng tài khoản thực của chủ dự án. Form cần cấu hình `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL` trong `.env.local` (không commit). Khi chưa cấu hình, form không nhận dữ liệu để tránh mất yêu cầu. Cần bổ sung kiểm soát spam phân tán trước production.

## Ranh giới triển khai
Không merge `main`, thay đổi DNS, thuê hosting, phát sinh chi phí hoặc triển khai production khi chưa có sự phê duyệt riêng. Các bước tiếp theo theo roadmap: Phase 3 tiếp nhận và vận hành dịch vụ; Phase 4 kiểm định và chuẩn bị phát hành; Phase 5–7 tài khoản, dashboard và Micro-SaaS.
