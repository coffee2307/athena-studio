# Athena Studio — Thiết kế & Công nghệ

Website Next.js / React / TypeScript của Athena Studio, gồm bốn nhóm dịch vụ: **thiết kế website**, **chăm sóc website**, **tích hợp trí tuệ nhân tạo** và **nghiên cứu công cụ Micro-SaaS**.

## Trạng thái dự án

- **Phase 0**: đã xây nền tảng CI/test, cập nhật bản vá dependency, lưu roadmap và đánh giá kiến trúc.
- **Phase 1**: giao diện **White Edition**, logo cú chính thức, typography và nội dung tiếng Việt, Hero Athena Intelligence Field, chuyển động và giao diện responsive.
- **Phase 2–4**: Portfolio xác thực, vận hành tiếp nhận khách hàng, kiểm định production; **chưa hoàn tất**.
- **Phase 5–7**: xác thực, dashboard khách hàng, Micro-SaaS thương mại; **chưa triển khai**.

### Tài liệu chuẩn và báo cáo
- [Roadmap chính thức được phê duyệt](docs/ATHENA_MASTER_ROADMAP.md)
- [Kiến trúc và bảo mật Phase 0](docs/PHASE0_ARCHITECTURE_AUDIT.md)
- [Kiểm thử Phase 0](docs/PHASE0_QA.md)
- [Design System và Motion Phase 1](docs/PHASE1_DESIGN_SYSTEM.md)
- [Kiểm thử Phase 1](docs/PHASE1_QA.md)

## Chạy cục bộ

Yêu cầu Node.js 24 và npm.

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

Ứng dụng mặc định tại `http://localhost:3000`.

## Cấu hình email

Sao chép `.env.example` thành `.env.local` (tệp này được Git bỏ qua). Cần cấu hình `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL` và tên miền người gửi đã xác minh để gửi yêu cầu tư vấn. Khi chưa cấu hình, form **không giả vờ gửi thành công**; khách có thể dùng liên kết `mailto:coffee2307@gmail.com`. Trước production, API cần kiểm soát spam phân tán và kiểm thử gửi email thật.

## Danh mục URL

- `/`: trang chủ và đồ họa Hero.
- `/services`: bốn nhóm dịch vụ.
- `/services/[slug]`: thông tin chi tiết.
- `/products`: Product Lab, sản phẩm nghiên cứu.
- `/studio`: giới thiệu và tư duy thiết kế.
- `/contact`: liên hệ, Zalo, WhatsApp và form có điều kiện.
- `/api/inquiry`: tiếp nhận tư vấn ở server (cần cấu hình).
- `/manifest.webmanifest`, `/sitemap.xml`, `/robots.txt`.

## Nhận diện

Logo cú tại `public/branding/logo-symbol-black.svg` là vector chính thức. Để tạo lại icon SVG, favicon ICO và PNG cho thiết bị:

```bash
node scripts/generate-brand-icons.mjs
```

Trang công khai sử dụng tiếng Việt với thuật ngữ kỹ thuật cần thiết. Giao diện nền trắng–đen, Hero đồ họa hội tụ lấy cảm hứng từ cú Athena; không sử dụng tài sản thương hiệu PHAM. Hỗ trợ bàn phím, thiết bị cảm ứng và `prefers-reduced-motion`.

## Giới hạn và nguyên tắc công bố

Các dự án PHAM, Qrio và ECONITH chỉ được thêm vào Portfolio sau khi xác minh vai trò, quyền công bố và thông tin có bằng chứng. SitePulse hiện là ý tưởng chưa ra mắt. Không có đăng nhập giả, báo giá đã chốt, kết quả khách hàng bịa đặt hay thanh toán trước sản phẩm chưa hoạt động.

Không tự động merge, triển khai production, sửa DNS hoặc đăng ký dịch vụ có phí nếu chưa có phê duyệt riêng của chủ dự án.
