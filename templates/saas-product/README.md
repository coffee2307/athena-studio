# LUMA Workspace — Interactive SaaS (Athena demo)

Website SaaS độc lập có workspace thực sự tương tác trong trình duyệt: bảng việc, thêm công việc, chuyển trạng thái, lọc trạng thái/vai trò, xem tiến độ tính trực tiếp và chọn nhóm. Tất cả dữ liệu khởi tạo là **mẫu trong bộ nhớ React**, reset khi tải lại; chưa có tài khoản, người dùng, API backend hay lưu trữ. Các route `/`, `/work`, `/work/1..3`, `/services`, `/about`, `/contact` được thiết kế riêng. Liên hệ mở bản nháp email không có người nhận mặc định, không tự động gửi dữ liệu.

Chạy tại thư mục template: `npm ci`, `npm run build`, `npm run start`. Trên Athena Studio, xem `/template-demos/saas-product`. Cấu hình brand nằm trong `src/data/site.json`; cần cấu hình backend, xác thực và chính sách dữ liệu trước khi biến thành sản phẩm thật. Không mượn component giao diện từ template khác.
