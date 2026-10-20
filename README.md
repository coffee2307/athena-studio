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


## Phase 3 — Tiếp nhận tư vấn và nâng cấp chuyển động

- [Quy trình tiếp nhận, vận hành an toàn và cấu hình](docs/PHASE3_INTAKE_OPERATIONS.md)
- [Database schema cho Supabase](docs/db/phase3_inquiries.sql)
- [Báo cáo kiểm thử Phase 3](docs/PHASE3_QA.md)

Trải nghiệm chuyển động đã mở rộng trên các trang: hiệu ứng reveal theo viewport (kể cả thẻ dự án thêm mới sau khi lọc), stagger, text entrance, hover tương tác, progress bar cuộn trang, con trỏ trang trí trên desktop. Giữ fallback hiển thị đầy đủ nếu không có JavaScript hoặc khi bật giảm chuyển động.

Form Phase 3 dùng **Supabase private records, Resend notification, Cloudflare Turnstile và Upstash Redis shared rate limiting**. Không có credentials được commit. Muốn kích hoạt cần toàn bộ biến trong `.env.example`, migration SQL, quyền quản lý thông tin, kiểm chứng gửi email và xác minh hostname. Khi thiếu, website hiển thị liên kết email trực tiếp và API trả 503 (không giả vờ nhận). Không yêu cầu người dùng mua dịch vụ nếu chưa duyệt phương án chi phí.

## Phase 4 — Kiểm định và chuẩn bị phát hành (chưa production)

- [Kết quả kiểm định Phase 4](docs/PHASE4_QA.md)
- [Lighthouse baseline đo trên localhost](docs/PHASE4_PERFORMANCE_BASELINE.md)
- [Runbook phát hành, giám sát và khôi phục](docs/PHASE4_RELEASE_RUNBOOK.md)

Bổ sung kiểm thử trình duyệt Chromium desktop/mobile và Firefox, axe-core accessibility, bộ HTTP security header, trang lỗi tiếng Việt, hai endpoint `/api/health` (liveness) và `/api/readiness` (chỉ kiểm tra cấu hình intake). Chạy `npm run test:e2e` sau khi `npm run build` và cài browser bằng `npx playwright install chromium firefox`. Chạy đo Lighthouse với `node scripts/lighthouse-baseline.mjs http://127.0.0.1:3199` trên production server được khởi động riêng tại port 3199.

**Trạng thái phát hành: NO-GO.** Hệ thống tư vấn chưa được bật vì chưa có dịch vụ ngoài và phê duyệt pháp lý. Không có staging online, RUM p75, bản sao lưu phục hồi được xác minh hoặc giám sát uptime đã kích hoạt. Việc kiểm thử và tài liệu ở Phase 4 không tự động cho phép merge vào `main` hay triển khai DNS/production.

## Phase 5 — Tài khoản & phân quyền (chưa bật đăng ký thật)

- [Kiến trúc Supabase Auth, hướng dẫn Google OAuth và điều kiện kích hoạt](docs/PHASE5_AUTH_ARCHITECTURE.md)
- [Báo cáo QA Phase 5](docs/PHASE5_QA.md)
- [Database migration (Supabase/PostgreSQL)](docs/db/phase5_identity.sql)
- [Bộ kiểm thử RLS thực qua PGlite](tests/rls-isolation.test.mjs)

Các trang mới: `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`, `/tai-khoan`, `/tai-khoan/doi-mat-khau`, `/quan-tri` và OAuth/email callbacks. Hệ thống quản lý vai trò không lấy quyền từ dữ liệu người dùng có thể tự sửa. `NEXT_PUBLIC_ATHENA_AUTH_ENABLED=false` mặc định; không có Supabase SMTP, Google OAuth hoặc database production được kích hoạt. Không được bật true cho môi trường công khai trước kiểm thử staging và phê duyệt pháp lý.

## Phase 6 — Client Dashboard & Operations (bảo vệ bằng phân quyền)

- [Kiến trúc dự án, hỗ trợ, tài liệu, thông báo và hướng dẫn triển khai](docs/PHASE6_OPERATIONS.md)
- [Báo cáo QA, kiểm thử RLS và các điều kiện nghiệm thu](docs/PHASE6_QA.md)
- [Migration bảng dự án, ticket, cột mốc, thông báo và audit](docs/db/phase6_operations.sql)
- [Migration Supabase Storage bucket riêng tư](docs/db/phase6_storage.sql)
- [Kiểm thử phân quyền thực bằng PGlite](tests/operations-rls.test.mjs) và [kiểm thử Storage RLS](tests/operations-storage.test.mjs)

Đã xây các tuyến `/tai-khoan/du-an`, `/tai-khoan/du-an/[id]`, `/tai-khoan/ho-tro`, `/tai-khoan/ho-tro/[id]`, `/quan-tri`, `/quan-tri/du-an`, `/quan-tri/ho-tro`, cùng endpoint tải tài liệu riêng tư. Chưa có một dashboard khách hàng vận hành trên dịch vụ thật cho đến khi được chủ dự án xác minh.

**Chốt triển khai độc lập:** `ATHENA_OPERATIONS_ENABLED=false` mặc định và là biến môi trường **server-side**. Chỉ bật khi cả Phase 5 authentication, ba migration và kiểm thử PostgREST/Supabase Storage đã được nghiệm thu. Không chuyển các biến môi trường quan trọng thành `NEXT_PUBLIC_*`. Thao tác và UI tiếp tục chặn khi cấu hình chưa được phê duyệt. Không triển khai DNS/production, merge main hoặc mua dịch vụ khi chưa có ủy quyền riêng.

## Phase 7 — Product Lab / SitePulse technical pilot

- [Competitor study, business validation and pilot checklist](docs/PHASE7_PRODUCT_VALIDATION.md)
- [QA gates and limitations](docs/PHASE7_QA.md)
- [SitePulse browser page](app/san-pham/sitepulse/page.tsx)
- [HTTP probe module and regression tests](lib/sitepulse/core.mjs)

SitePulse is an **operator-only, explicitly approved-domain HTTP probe**, **disabled by default**. `npm run sitepulse:check` records real sampled HTTP results only when enabled by an authorized operator; `npm run sitepulse:summary` summarizes local JSONL measurements. No scheduled checks, live alerts, customer dashboard, payment collection, fake uptime or production release. The user's approval is required before probing any external website or incurring hosting costs.
Bản báo cáo tiếng Việt có thể xuất qua `npm run sitepulse:report`; kết quả dựa trên nhật ký đã đo (không phải chỉ số SLA). Không có dữ liệu đo thật được commit.

### Phase 7.1 — Ủy quyền và chuẩn bị pilot SitePulse

- [Runbook kiểm tra website có phép](docs/PHASE71_PILOT_RUNBOOK.md)
- [Bộ phỏng vấn người vận hành website](docs/PHASE71_INTERVIEW_KIT.md)
- [Mẫu hồ sơ đồng ý (để mặc định chưa phê duyệt)](docs/PHASE71_CONSENT_TEMPLATE.json)

Bật SitePulse phải có hồ sơ chấp thuận ngoài Git và `.qa/sitepulse-consent.json` khớp chính xác target, thời hạn và quota. Không chạy website bên ngoài nếu chưa có quyền. Tỷ lệ HTTP 2xx theo mẫu không phải SLA. `main`, production, DNS và chi phí không thay đổi.

### Phase 7.2 — Đề xuất pilot cho PHAM Official (chưa được phê duyệt)

- [Phạm vi, tần suất và cổng phê duyệt](docs/PHASE72_PHAM_PILOT_PROPOSAL.md)
- [Mẫu xác nhận PHAM mặc định bị từ chối](docs/PHASE72_PHAM_CONSENT_DRAFT.json)
- Chạy `npm run sitepulse:pham-plan` để xem **đề xuất hoàn toàn ngoại tuyến**, không gửi request HTTP/DNS và không kích hoạt SitePulse. Phải nhận phê duyệt riêng trước lần kiểm tra thật.

## Phase 8 — đã được duyệt phạm vi, đang triển khai 8A

Chủ dự án đã phê duyệt mở rộng [Phase 8](docs/PHASE8_PROPOSAL.md) và bắt đầu workstream 8A tích hợp release. Xem [bảng GO/NO-GO](docs/PHASE8_ACCEPTANCE_MATRIX.md), [báo cáo tích hợp 8A](docs/PHASE8A_INTEGRATION_REPORT.md), [bằng chứng QA 8A](docs/PHASE8A_QA.md) và chạy `npm run release:verify` để xác minh chuỗi commit, tệp riêng tư và các cờ tắt mặc định. Chưa bật Auth, Dashboard, SitePulse công khai; chưa merge `main`, DNS, hosting hoặc thanh toán.

## Phase 8B — Staging preflight (cấu hình, chưa kết nối dịch vụ thật)

- [Runbook môi trường staging và các cổng kiểm định](docs/PHASE8B_STAGING_RUNBOOK.md)
- `npm run staging:inventory`: xem các điều kiện cấu hình còn thiếu mà không lộ secrets. Dự kiến NO-GO khi chưa cấu hình provider.
- `npm run staging:preflight`: chỉ xác nhận đủ cấu hình để **bắt đầu kiểm định staging**, không thay thế email thật, OAuth, RLS A/B, backup hay phê duyệt vận hành.
- Không áp dụng migration, bật Auth/Dashboard, tạo provider, đổi DNS hoặc phát sinh chi phí bằng các lệnh trên.
