# ATHENA PHASE 8 — BẢNG KIỂM CHỨNG BASELINE / GO-NO-GO

**Ngày rà soát:** 20/10/2026. **Đây là snapshot tài liệu trước khi Phase 8 được phê duyệt.**
Quy ước: `CODE PASS` = mã và kiểm thử offline đạt; `PENDING` = chưa có bằng chứng thực địa; `BLOCKED` = không thể nghiệm thu nếu thiếu quyền/thiết lập bên ngoài; `NO-GO` = không đủ điều kiện kích hoạt.

| Gate | Trạng thái đã có bằng chứng | Bằng chứng/đầu ra | Điều kiện nghiệm thu còn thiếu | Quyết định |
|---|---|---|---|---|
| R0 — Phạm vi Phase 8 | Roadmap gốc kết thúc Phase 7 | `ATHENA_MASTER_ROADMAP.md` | Chủ dự án duyệt phạm vi Phase 8 mới | **PENDING** |
| R1 — Hợp nhất source | Các thay đổi ở chuỗi PR #2–#12 | Git branches, Draft PR/CI | Code review, xác định release SHA và tích hợp vào nhánh riêng, kiểm thử từ sạch | **PENDING** |
| R2 — Public website | Next.js static/SSR, unit/Playwright, Lighthouse lab | `PHASE4_QA.md`, `PHASE4_PERFORMANCE_BASELINE.md` | Hosting thật, quyền portfolio, device testing, real CWV p75 | **PENDING** |
| R3 — Lead intake | Fail-closed backend, chống spam theo thiết kế | `PHASE4_RELEASE_RUNBOOK.md` | Gửi email thật, database, Turnstile/Upstash, retries, retention | **BLOCKED** |
| R4 — Google/Email Auth | Auth routes, SSR, offline RLS | `PHASE5_QA.md`, `PHASE5_AUTH_ARCHITECTURE.md` | Supabase/SMTP/Google OAuth, real sessions | **BLOCKED** |
| R5 — Client Dashboard | PostgreSQL RLS A/B local, Playwright | `PHASE6_QA.md`, `PHASE6_OPERATIONS.md` | Real Supabase staging, Storage, signed URL, A/B JWT, restore | **BLOCKED** |
| R6 — SitePulse | Operator-only checker, authorization and PHAM one failed transport check | `PHASE7_QA.md`, `PHASE71_QA.md`, PHAM evidence *private* | Các lần đo đã được phép khác, giải thích lỗi, false positives, chi phí, phỏng vấn | **PENDING** |
| R7 — Security/a11y | Header/axe/Playwright automatic, audit runtime | `PHASE4_QA.md` và CI các PR | Human keyboard/screen reader, CSP hardening decision, live vuln validation | **PENDING** |
| R8 — Data protection/backup | Quy trình đề xuất | `PHASE4_RELEASE_RUNBOOK.md` | Owner data policy, test restore staging, rotate secrets, operational owner | **BLOCKED** |
| R9 — Legal and commercial | Dịch vụ được giới thiệu | `ATHENA_MASTER_ROADMAP.md` | Pháp lý, quyền truyền thông, hợp đồng/phạm vi, thanh toán và hỗ trợ | **PENDING** |
| R10 — Production deploy | Chưa có phê duyệt riêng | Không có release manifest chính thức | G0–G9 và riêng lệnh owner cho release SHA, DNS, cost, rollback | **NO-GO** |

## Những bằng chứng TUYỆT ĐỐI không suy diễn

- `npm run build` và CI thành công không chứng minh đã có Supabase/Auth/SMTP hoạt động.
- Lighthouse lab và axe tự động không chứng nhận CWV p75 thực tế hoặc WCAG hoàn chỉnh.
- Lần đầu SitePulse không nhận HTTP status (`connection_or_tls_error`) **không** chứng minh PHAM đang offline.
- Dữ liệu khách hàng, doanh thu, chốt hợp đồng và sẵn sàng trả phí chưa được kiểm chứng.
- Website PHAM và DNS chưa được thay đổi; bản Phase 8 chỉ là đề xuất.

## Cách cập nhật khi bắt đầu

Với mỗi gate, ghi thêm trong báo cáo nghiệm thu: `date`, `environment`, `commit SHA`, `operator`, `test commands`, `expected/actual`, `evidence location`, `sign-off`. Không thay cột quyết định bằng `PASS` nếu chỉ thêm mã mà không có bằng chứng cho hành vi thật.

**Chủ dự án không cần thao tác thủ công để tạo tài liệu này.** Quyết định phê duyệt phạm vi Phase 8, mở chi phí và thay đổi production vẫn là hành động riêng của chủ dự án.
