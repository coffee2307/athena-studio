# Athena / SitePulse — Đề xuất pilot đầu tiên cho PHAM

Ngày chuẩn bị: 20/10/2026. Đây là **đề xuất chờ chủ dự án phê duyệt**, không phải chứng từ đồng ý hay báo cáo đo website. Không thực hiện request HTTP/DNS tới PHAM khi lập kế hoạch.

## Thông tin do chủ dự án đề xuất
- Trang website: **https://phamofficial.com/** (không thêm www, không theo redirect tới hostname khác)
- Nhãn nội bộ: PHAM Official — trang chủ
- ID đích kiểm tra: `pham-home`
- ID pilot dự kiến: `pham-pilot-01`
- Số URL: **1**, chỉ đường dẫn `/`, giao thức HTTPS, không query, credentials hoặc fragments

## Phạm vi và nhịp độ được đề nghị
- Thời gian đề nghị: **7 ngày tính từ lúc người có quyền chấp thuận**, không ấn định ngày bắt đầu trước khi nhận phê duyệt; không quá 14 ngày theo cơ chế bảo vệ
- Chỉ **kiểm tra thủ công có kiểm soát**, không chạy cron/worker nền
- **Tối đa 8 lần đo mỗi 24 giờ**, cách nhau tối thiểu **15 phút**; đây là giới hạn trên, không phải cam kết đủ 8 lần hay SLA
- Thử đầu tiên, chỉ sau phê duyệt: 1 request HTTPS GET tới `https://phamofficial.com/`, timeout request 8 giây, DNS timeout riêng ≤3 giây, tối đa 16 KiB đầu phản hồi, không tự theo HTTP 3xx
- Ghi nhận thời điểm UTC, HTTP status, trạng thái up/attention/down, TTFB và thời gian phản hồi, mã lỗi. Không ghi HTML/body, cookie hay dữ liệu người truy cập
- Nếu máy chủ chuyển hướng sang `www.phamofficial.com`, Shopify hoặc host khác: ghi `attention` và **dừng**, không tự bổ sung đích tiếp theo. Cần duyệt host mới trước
- Trước khi coi DOWN là sự cố: so sánh ít nhất hai lần thất bại liên tiếp và kiểm chứng thêm bằng nguồn độc lập, lưu nguyên nhân và cảnh báo sai

## Cổng phê duyệt còn thiếu
1. Chủ sở hữu/người đại diện PHAM **xác nhận mình có quyền cho phép** SitePulse kiểm tra tên miền này, không chỉ là người gửi URL
2. Xác nhận đúng một path `/`, thời hạn tối đa bảy ngày và giới hạn 8 lần/24h, tối thiểu 15 phút giữa các lần chạy
3. Lưu mã tham chiếu phê duyệt trong hồ sơ nội bộ (không cần gửi giấy tờ/căn cước/mật khẩu qua chat); sau khi xác minh mới thay `operatorAcknowledged` thành `true` và điền thời gian hiệu lực
4. Sau khi phê duyệt, người vận hành chạy lần thử HTTP đầu tiên trên máy được cấp quyền, sau đó đối chiếu kết quả

## Trạng thái kỹ thuật
- Mẫu hồ sơ [PHASE72_PHAM_CONSENT_DRAFT.json](PHASE72_PHAM_CONSENT_DRAFT.json) có URL PHAM và **chưa được phê duyệt**; các trường approvedAt/expiresAt là null nên trình kiểm tra phải từ chối
- Công cụ `npm run sitepulse:pham-plan` chỉ in đề xuất và kiểm tra cấu hình từ file mẫu; **không gọi DNS, HTTP, Shopify API hoặc bất kỳ dịch vụ bên ngoài nào**
- Chưa có đo đầu tiên, không có downtime/uptime được xác nhận, không có số liệu khách hàng hoặc doanh thu
- Chưa thay đổi production, DNS, website PHAM, Supabase, lịch tự động hoặc thanh toán

## Sau một lượt đo được cho phép
Tổng hợp 2xx/3xx/4xx/5xx, TTFB và thời điểm; kiểm chứng các thay đổi trên chính trang PHAM. Nếu có lỗi, ghi bằng chứng và báo cáo chính xác từng phép đo thay vì suy diễn số % uptime của cả ngày. Thử nghiệm tiếp theo hoặc mở rộng phạm vi sẽ được hỏi ý kiến và phê duyệt riêng.
