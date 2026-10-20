# Athena SitePulse — Phase 7.1: Pilot có ủy quyền

Ngày: 20/10/2026. Nguồn mã kế thừa Phase 7. Chưa có khách hàng/pilot được phê duyệt. Chưa thử website bên ngoài. KHÔNG dùng bản này như sản phẩm SaaS 24/7 hoặc báo cáo SLA.

## 1. Chốt quyền trước khi kiểm tra

1. Chủ website hoặc người được ủy quyền xác nhận bằng văn bản tên miền/path, thời gian, mục đích, quyền dừng và người liên hệ. Lưu chứng từ đồng ý ngoài Git.
2. Người vận hành đối chiếu chứng từ thực và lập tệp nội bộ .qa/sitepulse-consent.json theo mẫu PHASE71_CONSENT_TEMPLATE.json. Mã authorizationReference chỉ là mã đối chiếu tài liệu, không tự chứng minh quyền sở hữu; operatorAcknowledged chỉ được bật sau bước đối chiếu.
3. Chỉ chấp nhận 1–3 đích, đúng URL đã cấp phép, trong tối đa 14 ngày, tối thiểu 10 phút giữa hai lần đo và tối đa 16 lần kiểm tra mỗi đích mỗi 24 giờ. Mặc định 15 phút và 8 lượt.
4. Không lập cron. Không thăm dò domain bên thứ ba, domain không được phép, địa chỉ mạng nội bộ hoặc endpoint nhạy cảm. Mọi thao tác cần được người vận hành quyết định rõ ràng.

## 2. Cấu hình thử nghiệm

Sau khi được phê duyệt, sao chép file mẫu trong docs/PHASE71_CONSENT_TEMPLATE.json sang .qa/sitepulse-consent.json rồi chỉnh lại các thông tin thực tế. Tệp nằm trong thư mục .qa được Git ignore.

Ví dụ cấu hình PowerShell sau CHỈ minh họa cú pháp, example.com KHÔNG được xem là đã cho phép:

    cd 'F:\Athena Studio'
    $env:ATHENA_SITEPULSE_ENABLED='true'
    $env:ATHENA_SITEPULSE_APPROVED_HOSTS='example.com'
    $env:ATHENA_SITEPULSE_TARGETS_JSON='[{"id":"approved-site","label":"Website được cấp phép","url":"https://example.com/"}]'
    $env:ATHENA_SITEPULSE_CONSENT_FILE='.qa/sitepulse-consent.json'
    npm run sitepulse:check
    npm run sitepulse:summary
    npm run sitepulse:report

Chưa có tệp đồng ý hợp lệ, hết hạn hoặc URL sai: chương trình phải từ chối trước khi gửi HTTP. Một tệp khóa .qa/sitepulse-run.lock ngăn hai lượt đo đồng thời; chỉ xóa khóa còn sót sau khi xác minh tiến trình cũ đã kết thúc và kiểm tra log.

## 3. Dữ liệu và phản ứng

- Mỗi phép đo ghi mã pilot, mã website, thời điểm UTC, HTTP status, TTFB và mã lỗi vào JSONL; không ghi HTML/body hoặc credentials.
- HTTP 2xx chỉ nói rằng lần đo đó thành công, 3xx là trạng thái cần xem xét và không theo redirect, 4xx/5xx/timeout được xem là phép đo không đạt. Hai lần DOWN liên tiếp tạo tín hiệu kiểm tra chứ không chứng minh sự cố.
- Người vận hành xác minh qua trình duyệt hoặc log chủ website, phân biệt cảnh báo sai và lỗi thật. Không phát thông báo khách hàng tự động.
- Tổng hợp chỉ số theo từng mã pilot riêng biệt, không cộng gộp tùy ý và không gọi tỷ lệ thành công quan sát được là uptime SLA.
- Không đăng dữ liệu nội bộ, PII hoặc tài liệu ủy quyền lên Git/GitHub. Thiết lập lịch xóa/retention với chủ website trước khi thu thập dữ liệu.

## 4. Nghiệm thu và việc cần chủ dự án

Kiểm tra npm run lint, npm run typecheck, npm run test:unit, npm run build, npm run test:smoke, npm run test:e2e và npm run audit:runtime; xác nhận CI Linux riêng. Các bài thử mạng tự động chỉ dùng localhost và DNS giả lập.

Chủ dự án cần cung cấp hoặc xác nhận 1–3 website có quyền kiểm tra, đường dẫn được phép và thời hạn; đồng thời kết nối 5–10 người vận hành website tự nguyện trao đổi theo PHASE71_INTERVIEW_KIT.md. Chưa bật giám sát định kỳ, hosting trả phí, thông báo, dịch vụ khách hàng hay thanh toán khi chưa có phê duyệt riêng. Dữ liệu thực, chi phí thực và năng lực thương mại chưa được kiểm định.
