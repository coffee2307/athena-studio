# Athena Studio — báo cáo thực hiện nâng cấp 22/10/2026

## Phạm vi và quyết định

Thực hiện kế hoạch nâng cấp template library và starter trên nhánh tính năng hiện có, nối tiếp PR #39. Giữ `main` nguyên trạng; PR chỉ sẵn sàng để review. Không merge, deploy, bật provider, gửi lead thay khách hoặc tạo dữ liệu production.

Baseline local trước đợt này: `3641105` (`feat: add template library and starter scaffold`). Baseline remote PR #39: `ff1b9e9`; hai commit có cùng tree `38bd96d`.

## Kết quả theo hạng mục

1. **Luồng template và giao diện:** lựa chọn mẫu tiếp tục hiện rõ ở trang liên hệ dù inquiry server tắt; bộ lọc, tìm kiếm, sắp xếp, điều khiển preview bằng bàn phím và ticker/reduced-motion được kiểm chứng ở desktop/mobile. Axe trên các trang công khai, thư viện, chi tiết template và auth đạt sau khi sửa tương phản.
2. **Starter:** bổ sung preset TypeScript cho tám phong cách với layout và nội dung riêng. `StarterHome` chỉ hiện section/CTA khi module tương ứng có dữ liệu hoặc địa chỉ liên hệ; không tạo form giả, auth giả hay thanh toán giả. CLI từ chối path trong repo, symlink/thư mục ghi đè, module không hỗ trợ, cờ lạ/trùng và email không hợp lệ; chuỗi cấu hình được serialize an toàn.
3. **Project brief:** mục tiêu, khoảng ngân sách và timeline là tùy chọn; template title/slug/version được đưa vào brief. Link chỉ có dịch vụ cũng điền đúng lựa chọn trong email brief. Bản nháp email yêu cầu người dùng tự gửi. Khi gửi qua cấu hình hiện có, toàn bộ message phải dưới 4.000 ký tự; quá giới hạn báo lỗi để người dùng chỉnh, không cắt nội dung.
4. **Khả năng tiếp cận và responsive:** đã thêm kiểm tra axe, keyboard, reduced-motion và overflow tại 360/390/768/1440px. Bản kiểm tra đầu phát hiện tương phản thấp ở disclaimer, metadata và số lượng mẫu; đã tăng tương phản và xác nhận lại.
5. **Release/rollback:** tài liệu template ghi rõ checklist staging, health, backup/restore, migrations và canary có thể đảo ngược. Production gate chưa mở.

## Bằng chứng kiểm thử

- Unit: `npm run test:unit` — **130 đạt, 0 lỗi, 1 skip có chủ đích**.
- Lint: `npm run lint` — **0 lỗi, 0 cảnh báo**.
- TypeScript: `npm run typecheck` — đạt.
- Production build: `npm run build` — đạt sau sửa tương phản.
- Smoke: `npm run test:smoke` — đạt.
- Chromium desktop/mobile: **166 đạt, 0 lỗi, 4 skip theo điều kiện thiết bị** trên toàn bộ E2E. Trong đó 58 test axe, auth, lựa chọn mẫu, tạo brief, không gửi inquiry, keyboard, reduced motion và overflow đạt.
- Starter: `creative-studio`, `modern-corporate` và `commerce-standard` đều qua cài độc lập, typecheck, build và HTTP/anchor smoke.
- Visual QA: đã chụp và xem thư viện, trang mẫu và liên hệ tại 1440×1000 và 390×844; các trang không tràn ngang.
- GitHub Actions run `39777641527` cho PR #39 đã đạt **7/7 jobs**, gồm browser/accessibility, lint/type/unit/build/audit, ba starter độc lập, PostgreSQL và container VPS.

Các log local tạm thời nằm trong `.qa/upgrade-20261022/` và không được commit. Chỉ kết luận các mục đang chờ sau khi đọc exit code và báo cáo cuối của tiến trình.

## Rà soát cuối và cổng phát hành

- Lượt review độc lập không phát hiện lỗi Critical/Important. Ba nhận xét Minor đã được xử lý: giữ dịch vụ từ URL, mã hóa recipient mailto và bật module nội dung cho template campaign. Hai kỳ vọng menu E2E cũ đã được đồng bộ với các mục hiện có.
- Các lượt GitHub Actions trên PR #39 đều đạt **7/7 jobs**, gồm browser/accessibility, lint/type/unit/build/audit, ba starter độc lập, PostgreSQL và container VPS.
- PR #39 vẫn là draft sẵn sàng review. Merge hoặc deploy production cần quyết định riêng.
