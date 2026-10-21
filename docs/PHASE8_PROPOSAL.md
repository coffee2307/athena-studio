# ATHENA STUDIO — ĐỀ XUẤT PHASE 8
## Tích hợp phát hành, vận hành thực tế và sẵn sàng thương mại
Ngày soạn: 20/10/2026 · **Phạm vi Phase 8 đã được chủ dự án duyệt để triển khai vào 20/10/2026.** Vẫn yêu cầu kiểm định và phê duyệt riêng cho production, DNS, chi phí, migration trên dữ liệu thật và release SHA.
Cơ sở: [Master roadmap được duyệt](ATHENA_MASTER_ROADMAP.md), nguyên gốc kết thúc tại Phase 7 và đã được bổ sung Phase 8 sau chấp thuận ngày 20/10/2026. Việc chấp thuận phạm vi **không tự động cho phép** giải ngân, deploy production, DNS, merge main hoặc migration trên dữ liệu thật.

## 1. Quyết định và sự thật hiện tại

Athena có bốn trụ cột: thiết kế và phát triển website; Website Care; AI Integration; Product Lab/Micro-SaaS. Các Phase 0–7 đã xây dựng nhiều tính năng và vượt các cửa kiểm thử mã nguồn, nhưng nghiệm thu vận hành không tương đương nghiệm thu build/CI.

| Hạng mục | Đã có bằng chứng | Điều kiện còn thiếu |
|---|---|---|
| UI, portfolio, nội dung, motion | Nhiều route Next.js và kiểm thử Playwright/axe, Lighthouse lab trên localhost | Duyệt nội dung/hình ảnh/bản quyền, kiểm tra người dùng và accessibility thủ công |
| API tư vấn và Website Care | Validate, chống spam theo thiết kế, fail-closed khi thiếu provider | Supabase, email thật, Turnstile, rate limit thật, domain sender, lưu/xóa dữ liệu và kiểm tra khôi phục |
| Auth / Google | Luồng đăng ký/đăng nhập và database RLS có bài test offline | Supabase Auth, SMTP, Google OAuth, session/cookie thực tế, hai user A/B trên staging |
| Client Dashboard | Dữ liệu dự án, ticket, file và phân quyền SQL, kiểm thử PostgreSQL cục bộ | Migrations trên staging, private Storage, signed URL, restore, thao tác tài khoản thật |
| SitePulse Phase 7 | CLI pilot có giới hạn quyền, bằng chứng local và các test | Pilot PHAM có **một** phép thử không nhận HTTP; nguyên nhân chưa được xác minh; chưa có phỏng vấn/chi phí/willingness-to-pay |
| Release & source control | Chuỗi Draft PR trên GitHub, CI cho mỗi đợt | `main` còn ở phiên bản trước; chưa tích hợp chuỗi để phát hành, chưa có staging/rollback thật |
| Business/Legal | Hình thức liên hệ và chính sách mẫu | Xác minh thông tin pháp lý, quyền công bố, hợp đồng/điều khoản, xử lý dữ liệu, đơn vị chịu trách nhiệm |

**Không được nói Phase 7 đã đạt nghiệm thu thương mại hoặc Phase 8 đã được duyệt chỉ vì Phase 7 đã PASS CI.** Có thể chuẩn bị phần việc Phase 8 độc lập với pilot, nhưng khóa phát hành thương mại cho đến khi có đủ chứng cứ.

## 2. Mục tiêu và cấu trúc đề xuất

Mục tiêu Phase 8 là chuyển Athena từ **mã nguồn đã kiểm thử** sang **nền tảng có thể chứng minh độ tin cậy và nhận khách hàng có trách nhiệm**, với hai luồng phát hành tách biệt:
- **Track A — Website studio V1:** trang công khai, portfolio minh bạch và tiếp nhận tư vấn thực tế. Ưu tiên hoàn thành và vận hành ít rủi ro.
- **Track B — Tài khoản và Product Lab V2:** Auth, Dashboard, SitePulse; chỉ mở dần khi đã kiểm tra phân quyền, phương án dữ liệu và chứng minh nhu cầu. SitePulse không bắt buộc phải ra mắt để website studio hoạt động.

### Workstream 8A — Release integration và quản trị thay đổi (ưu tiên P0; độ phức tạp cao)
**Mục tiêu:** tạo một release candidate duy nhất có truy xuất commit, thay vì deploy trực tiếp từ chuỗi Draft PR.
**Phạm vi:** kiểm tra toàn bộ PR #2–#12 và phụ thuộc; xác định thứ tự tích hợp, tình trạng review, khác biệt so với `main`, xung đột và phát hiện thông tin nhạy cảm; lập bản ghi release SHA; thống nhất tài liệu, điều khoản, route và phiên bản Node/Next.
**Frontend/UX:** xác minh nhận diện Athena, sitemap/noindex đúng, không phát sinh đổi màu/animation không được chấp thuận; kiểm thử desktop/mobile.
**Backend/DB:** chặn bật feature flag khi chưa đủ điều kiện, xác minh migration không phá dữ liệu cũ; không áp dụng migration live.
**Công cụ:** Git/GitHub Actions, ESLint, TypeScript, Playwright, axe-core, Lighthouse, npm audit. Không cần thay framework.
**Rủi ro:** PR chain chưa merge, drift giữa branch và main; rollback khó nếu migration đã chạy. Xử lý bằng nhánh tích hợp riêng, tag/commit bất biến, CI đầy đủ và không deploy khi thiếu sign-off.
**Bàn giao:** sơ đồ chuỗi PR, release-candidate diff, changelog, checklist restore/rollback.
**Nghiệm thu:** build sạch từ lockfile; lint/types/unit/E2E/axe/smoke/audit đạt; review diff và phê duyệt release SHA. Mọi thao tác merge vào main cần ủy quyền riêng.
**Phụ thuộc:** kết quả review Phase 0–7; chủ dự án xác nhận nội dung phát hành.

### Workstream 8B — Staging, Auth/lead và kiểm định dữ liệu thật (ưu tiên P0; độ phức tạp rất cao)
**Mục tiêu:** chứng minh API tư vấn và tài khoản hoạt động với dịch vụ thật **trên môi trường staging cô lập**.
**Phạm vi:** kiến trúc/staging hosting và DNS tạm, Supabase project, SMTP sender, Resend, Turnstile và Upstash theo quyết định tài chính; Google OAuth client; quy trình secret management và migration versioning.
**Frontend/UX:** trạng thái biểu mẫu gửi thật, xác minh email, khôi phục tài khoản, lỗi/empty/loading, dashboard touch/mobile và thông báo tiếng Việt.
**Backend/DB:** migration Phase 3, 5, 6 theo thứ tự được duyệt; real Auth/JWT/PostgREST, signed Storage URL, role admin/studio; rate limit, idempotency, email failure, cross-tenant A/B, lỗi upload và retention. Tránh dữ liệu nhạy cảm thật ở staging.
**Công cụ:** Supabase, Google OAuth, Resend/SMTP, Turnstile, Upstash (chỉ nếu được duyệt); Playwright và kiểm thử API/SQL.
**Rủi ro:** lộ service-role key, gửi email nhầm, quyền truy cập chéo, chi phí vượt ngân sách hoặc mất dữ liệu. Mặc định flags OFF, key trong secret manager, kho dữ liệu staging riêng và quy trình hủy cô lập.
**Bàn giao:** biến môi trường mẫu không chứa secret, migration log, kết quả test A/B, email/OAuth callback/rollback, hướng dẫn gỡ bỏ an toàn.
**Nghiệm thu:** hai tài khoản test độc lập xác minh/khôi phục/đăng xuất; khách A không thấy bất kỳ dữ liệu/file của B; lead thật được nhận và thông báo hoặc báo thất bại chính xác; backup phục hồi được test.
**Phụ thuộc:** chủ dự án duyệt tài khoản provider, domain staging, kinh phí, dữ liệu và người có thẩm quyền quản trị.

### Workstream 8C — Bảo mật, ổn định, khả năng tiếp cận và quy trình trực vận hành (ưu tiên P0; cao)
**Mục tiêu:** có căn cứ cho GO/NO-GO thay vì chỉ căn cứ điểm Lighthouse và tỷ lệ unit test.
**Phạm vi:** threat model (auth, SSRF SitePulse, file upload, contact abuse), CSP trade-off, server logs/alert no-PII, giám sát trạng thái, backup/restore, incident runbook, DPA/retention và quy trình hỗ trợ khách.
**Frontend/UX:** keyboard, screen reader, 200–400% zoom, màn hình cảm ứng, reduced-motion và lỗi focus; hiệu năng trên mạng thực tế.
**Backend/hạ tầng:** uptime alert riêng, SLO nội bộ sau khi có dữ liệu, rotation key, secure cookies, cache/no-store, restore rehearsal, giữ audit trail, hạn chế các chức năng chưa thử nghiệm.
**Công cụ:** Playwright/axe, Lighthouse, công cụ monitoring được chủ dự án chọn; RUM chỉ khi đã duyệt quyền riêng tư.
**Rủi ro:** hiểu nhầm bài axe là chứng nhận WCAG, TBT là INP, nguồn đo 1 máy là uptime toàn cầu. Công bố đúng mức độ bằng chứng.
**Bàn giao:** threat matrix, bằng chứng restore, incident simulation, accessibility QA log, phát hành rollback checklist.
**Nghiệm thu:** không còn lỗi bảo mật mức nghiêm trọng/cao chưa xử lý hoặc chưa được chấp thuận ngoại lệ; restore thử được; đủ người trực và phương án xử lý sự cố; chốt quyền dữ liệu và giữ/xóa hồ sơ.
**Phụ thuộc:** staging 8B và chủ dự án/đầu mối vận hành.

### Workstream 8D — Dịch vụ thương mại và thực chứng SitePulse (ưu tiên P1; trung bình–cao)
**Mục tiêu:** Athena có lời chào dịch vụ rõ ràng, có thể thực thi; chỉ thương mại hóa Micro-SaaS khi đủ bằng chứng.
**Phạm vi:** gói thiết kế website, Website Care và AI Integration: phạm vi, đầu ra, SLA *có thể thực hiện*, điều kiện cung cấp, báo giá/đề nghị hợp tác; quy trình lead → tư vấn → đề xuất → bàn giao → hỗ trợ. Không tạo doanh thu/kết quả giả.
**SitePulse:** tiếp tục pilot PHAM đang có **một phép kiểm tra không nhận HTTP**, phân loại lỗi lần sau, thực hiện thủ công dưới quyền đã xác nhận, không vượt quota; bổ sung tối đa 1–2 website khác **sau khi có phép riêng**; phỏng vấn 5–10 người, đo chi phí và cảnh báo sai, thử báo cáo khách hàng.
**Frontend/UX:** CTA dịch vụ rõ, giá minh bạch nếu đã có cấu trúc thật và xét pháp lý; không thêm checkout đăng ký thuê bao giả.
**Backend/hạ tầng:** báo giá/tài liệu là dữ liệu thực, lưu bản đồng ý theo retention; billing chỉ thiết kế sau khi có nhu cầu, pháp lý và bên cung cấp dịch vụ được duyệt.
**Công cụ:** thống kê bằng chứng và phỏng vấn, bộ báo cáo SitePulse; không mặc định mua analytics/billing.
**Rủi ro:** thị trường cạnh tranh, công suất vận hành một người, lời cam kết quá mức, hồ sơ doanh nghiệp/thuế/thanh toán chưa đủ. Ưu tiên khách dịch vụ trước, SaaS sau.
**Bàn giao:** service catalog, quy trình vận hành, template báo giá/hợp đồng để rà soát pháp lý, nghiên cứu giá và báo cáo pilot.
**Nghiệm thu:** có cuộc trao đổi và dữ liệu được phép lưu thực tế; có bằng chứng khách muốn dùng thử/nhận báo giá; chốt chi phí và người chịu trách nhiệm. Không được gắn nhãn "kinh doanh thành công" từ số lượng giao diện hoàn thiện.
**Phụ thuộc:** SitePulse field validation và chấp thuận của chủ domain; thông tin pháp lý/kinh doanh.

## 3. Thứ tự thực hiện và mốc GO/NO-GO

1. **P8-G0 — Duyệt phạm vi mới: ĐÃ ĐẠT 20/10/2026.** Chủ dự án đã phê duyệt mở rộng roadmap, cho phép bắt đầu 8A. Quyền vận hành vẫn được kiểm soát bằng các cổng xác minh và release thực tế.
2. **P8-G1 — Branch integration:** rà soát các Draft PR, tạo nhánh tích hợp tách biệt, CI xanh. Không merge vào main khi chưa được cho phép.
3. **P8-G2 — Staging riêng:** sau khi duyệt host/provider/budget, kiểm thử migration, Auth, lead, backup A/B; mọi cờ mở public vẫn OFF.
4. **P8-G3 — Business/legal + operations:** xác minh tên/đại diện chịu trách nhiệm, quyền nội dung, privacy/cookies, dữ liệu, incident/backup và nhân sự xử lý lead.
5. **P8-G4 — GO/NO-GO từng track:** website studio V1 có thể GO riêng khi đạt tiêu chí; Auth/Dashboard V2 và SitePulse SaaS tiếp tục NO-GO nếu chưa đủ bằng chứng.
6. **P8-G5 — Production riêng:** chỉ sau chỉ thị chấp thuận release SHA, DNS, host, cost cap, thời điểm và người vận hành; tuyệt đối không tự thực hiện từ PR kế hoạch.

Không cam kết ngày kết thúc hoặc ngân sách khi chưa có nền tảng staging và lịch kiểm thử thực tế. Các workstream có thể chạy song song phần lập tài liệu, không chạy song song các migration hoặc bật tính năng chưa được nghiệm thu.

## 4. Các công việc chỉ chủ dự án/người đại diện cần làm

| Việc | Khi nào | Mức ưu tiên |
|---|---|---|
| Xác nhận thêm Phase 8 vào master roadmap, ưu tiên Track A/B | **Đã phê duyệt 20/10/2026** | P0 — hoàn thành |
| Duyệt chiến lược release: giữ chuỗi PR hay tích hợp review có kiểm soát | Trước khi merge | P0 |
| Xác minh pháp nhân/đại diện, điều khoản, quyền dùng logo, nội dung portfolio | Trước website thương mại | P0 |
| Chọn hosting/staging region, URL và ngân sách **trần chi**; cho phép tạo provider | Trước 8B | P0 |
| Cấp quyền truy cập Supabase, sender mail, Google OAuth, anti-spam và secret qua kênh an toàn | Trong 8B, không đưa secret vào chat | P0 |
| Quyết định chính sách dữ liệu, số ngày lưu, backup và ai xử lý sự cố | Trước 8C và nhận lead thật | P0 |
| Tham gia/giới thiệu 5–10 người cần Website Care và quyền kiểm tra domain bổ sung | Trong 8D | P1 |
| Phê duyệt deploy/DNS/chi phí cuối, thống nhất rollback | Chỉ sau GO | P0 |

## 5. Tiêu chí hoàn thành Phase 8

**Không dùng một điểm số tổng hợp để thay thế cổng nghiệm thu.** Phase 8 chỉ được coi là hoàn thành khi:
- Track A có release candidate được review, staging trải nghiệm và tiếp nhận lead thật có kiểm thử, có khả năng khôi phục, đáp ứng pháp lý và được chủ dự án duyệt phát hành.
- Track B nếu chọn phát hành: Auth và Dashboard qua real-provider tests/RLS A-B/Storage/SMTP/OAuth; nếu không phát hành thì phải được đánh dấu trì hoãn rõ, flags OFF.
- SitePulse chỉ được coi là MVP thương mại khi có phê duyệt riêng và field/cost/customer validation; nguyên mẫu vẫn có thể giữ ở Product Lab công khai với trạng thái chưa bán.
- Các kết quả đo/khách hàng/doanh thu/chỉ số ổn định đều có nguồn bằng chứng và ngày tháng; không dùng số mô phỏng.

**Phạm vi Phase 8 đã được chủ dự án phê duyệt ngày 20/10/2026.** Các cổng staging/production, chi phí, DNS, bảo mật, migration, danh tính nhà cung cấp và release SHA vẫn yêu cầu bằng chứng tương ứng; không coi đây là chấp thuận triển khai mù hoặc cam kết kết quả.
