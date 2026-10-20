# ATHENA STUDIO — PHASE 7 PRODUCT LAB: SITEPULSE

Ngày: 20/10/2026 · Nhánh: `feat/athena-phase7-sitepulse-pilot-20261020`
Nền: Phase 6 `46fc89e` · **Trạng thái: nguyên mẫu kỹ thuật, chưa có xác nhận nhu cầu hoặc phát hành thương mại.**

## 1. Đánh giá thị trường và phản biện

SitePulse xuất phát từ giả thuyết: khách hàng Website Care của Athena cần một đầu mối bằng tiếng Việt không chỉ kiểm tra HTTP mà còn lưu bằng chứng và phối hợp xử lý. Chưa phỏng vấn khách hàng thực tế, chưa có người đăng ký trả phí, không có số liệu khảo sát.

Các đối thủ đã có dịch vụ miễn phí đáng kể (thông tin tại thời điểm nghiên cứu, có thể thay đổi):
- UptimeRobot: 50 monitors, chu kỳ kiểm tra miễn phí 5 phút — https://help.uptimerobot.com/en/articles/11604710-who-should-use-uptimerobot-s-free-plan
- Better Stack: 10 monitors và 10 heartbeats, kiểm tra 3 phút gói miễn phí — https://betterstack.com/uptime
- HetrixTools: 15 monitors miễn phí, kiểm tra mỗi phút — https://hetrixtools.com/pricing/uptime-monitor/

**Kết luận nghiên cứu (giả thuyết chiến lược, không phải kết quả khảo sát):** tính năng uptime đơn thuần khó đủ lợi thế cạnh tranh. Nên gắn pilot với Website Care: kiểm chứng sự cố, báo cáo tiếng Việt và quy trình phản hồi, sau đó mới quyết định có tách thành SaaS hay không. Chưa chốt giá, billing hoặc chi phí marketing.

## 2. Phạm vi đã lập trình

- CLI giám sát HTTP thủ công cho **1–10 tên miền HTTPS được operator phê duyệt**, yêu cầu bật rõ `ATHENA_SITEPULSE_ENABLED=true`; mặc định tắt.
- Các địa chỉ phải khớp chính xác `ATHENA_SITEPULSE_APPROVED_HOSTS`, không chấp nhận port tùy ý, username/password, query hoặc fragment. Không nhận URL từ tham số HTTP/biểu mẫu công khai.
- Phân giải và khóa IP IPv4 public trên mỗi lần chạy, từ chối loopback, private, link-local, CGNAT, dải reserved; không theo chuyển hướng đến địa chỉ khác.
- Giới hạn 8 giây/request, kết quả gồm trạng thái mã HTTP, TTFB, thời gian đo, chi tiết mã lỗi; chỉ đọc tối đa 16 KiB đầu phản hồi.
- Lưu JSONL cục bộ ở file không theo dõi Git, in kết quả thực tế khi operator chạy; CLI tổng hợp **tỷ lệ mẫu đã kiểm tra thành công**, không tự gọi là SLA/uptime 24/7.
- Quy tắc đếm sự cố: ít nhất hai lần kiểm tra DOWN liên tiếp. Đây không phải cơ chế phân tán nhiều region và chưa gửi cảnh báo.
- Trang **`/san-pham/sitepulse`** minh họa phương pháp và mời phỏng vấn; luôn thông báo chưa phát hành; không có biểu đồ/giao dịch giả.

## 3. Các bước thử nghiệm nội bộ

Tạo các biến môi trường **trong terminal riêng**, không lưu token/credentials vào Git:

```powershell
$env:ATHENA_SITEPULSE_ENABLED="true"
$env:ATHENA_SITEPULSE_APPROVED_HOSTS="example.com"
$env:ATHENA_SITEPULSE_TARGETS_JSON='[{"id":"example-home","label":"Kiểm tra ví dụ","url":"https://example.com/"}]'
npm run sitepulse:check
npm run sitepulse:summary
```

Ví dụ chỉ minh họa cú pháp, không đại diện sự đồng ý của chủ `example.com` cho pilot. **Trước khi bật kiểm tra một website thật**, phải xác minh quyền sở hữu/ủy quyền và thay bằng website của chính chủ dự án. Không lập cron/tự động hóa kiểm tra cho mục tiêu chưa được phê duyệt. Trên máy nội bộ, báo cáo được ghi mặc định vào `.qa/sitepulse-results.jsonl`, được Git ignore.

Dùng `npm run test:unit` để chạy các thử nghiệm HTTP loopback thực, DNS giả lập, redirect không được theo, timeout, parser, tình trạng tắt và tổng hợp. Test không tự thăm dò domain công khai nào.

## 4. Kế hoạch kiểm chứng giá trị trước khi bán

1. Trao đổi với 5–10 chủ website/cửa hàng/nhóm vận hành đã đồng ý tham gia, tránh hỏi dẫn dắt. Ghi lại cách phát hiện lỗi, tác động downtime, công cụ đang dùng, chi phí thời gian hiện tại.
2. Chọn tối đa 3 website đã có văn bản cho phép, chạy pilot có thời hạn xác định và đo: số check, số kết quả DOWN giả, số lần xử lý được, công sức operator và chi phí lưu trữ/hạ tầng.
3. Trình bày báo cáo thật, hỏi mức sẵn sàng trả phí cho **gói Website Care + báo cáo/hành động**, so sánh với việc dùng UptimeRobot/Better Stack/HetrixTools miễn phí.
4. Chỉ triển khai scheduler, cảnh báo, dashboard đa tenant, billing nếu có tín hiệu giá trị và được phê duyệt ngân sách. Cân nhắc chuyển ý tưởng nếu hầu hết khách hàng không muốn trả tiền.

Các chỉ tiêu thí điểm là **mục tiêu nghiên cứu**, không phải số liệu đã đạt.

## 5. Đánh giá kỹ thuật / chi phí / rủi ro

- Hiện tại: không tạo scheduler, không mua dịch vụ, không tạo chi phí mới do hệ thống mặc định tắt. Chưa có hóa đơn hay dữ liệu vận hành dài ngày để đo chi phí/hạ tầng.
- Pilot hiện chạy từ một máy, một địa điểm mạng. Không thể bảo đảm uptime toàn cầu, không so sánh được vùng địa lý và không có giám sát liên tục. Hạn chế IPv4-only; domain chỉ có AAAA bị từ chối.
- Có DNS pin IPv4 để giảm nguy cơ SSRF; không có endpoint public nhận URL nên bề mặt tấn công nhỏ hơn dịch vụ quét website tùy ý. Vẫn phải chạy từ môi trường tách biệt, hạn chế egress, không cho phép thăm dò website bên thứ ba không được ủy quyền.
- Log lịch sử local chưa có backup, phân quyền chia sẻ, xóa theo retention, chống giả mạo hoặc tách tenant; **không dùng để lưu dữ liệu khách hàng nhạy cảm**.
- Timeout 8 giây / đo, 10 target tối đa và không tự lập lịch; nếu mở dịch vụ thực tế phải thiết kế quota và worker độc lập, DNS/IPv6 policy, báo cáo false-positive, rate limiting, retry, backoff, vùng đo, backup, alerts, multi-tenant RLS, incident response.
- Cần xác minh quyền sở hữu domain và lựa chọn hợp đồng/điều khoản thông báo trước khi thu thập dữ liệu thực.

## 6. Chốt điều kiện nghiệm thu

- **Nghiệm thu kỹ thuật cục bộ**: unit test local HTTP + fail-closed DNS/SSRF, lint, TypeScript, Next production build, smoke, E2E/axe, npm audit runtime; GitHub Actions cần PASS.
- **Nghiệm thu pilot với người dùng thật: CHƯA ĐẠT** cho tới khi có sự đồng ý, chạy trên website được phép, đối chiếu kết quả và đo chi phí theo thời gian.
- **Khả năng thương mại: CHƯA XÁC NHẬN**. Không mở trả phí, đăng ký, công bố SLA, tạo tài khoản khách hàng giả hay tự động truy cập mục tiêu.
- `main`, DNS, production, Supabase live, hosting và tài chính không thay đổi.

### Xuất báo cáo tiếng Việt

Sau khi có dữ liệu đo đã được chủ website cho phép, chạy `npm run sitepulse:report` để xuất báo cáo quan sát vào `.qa/sitepulse-report.md` (không chứa dữ liệu giả). Báo cáo chỉ dùng số lượng phép đo và tỷ lệ phản hồi 2xx trên các mẫu đã thu thập; không phải mức cam kết SLA.
