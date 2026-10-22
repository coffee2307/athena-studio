# Thư viện template và nền tảng khởi tạo dự án Athena

Trạng thái tài liệu: nền tảng kỹ thuật thử nghiệm trong repository Athena. Template là định hướng thiết kế có bản xem trước trong website Athena; chưa phải sản phẩm bán sẵn, repo khách hàng, website đã phát hành hoặc dữ liệu quản trị.

## Ba phần được tách riêng

1. **Thư viện tham khảo công khai** tại `/services/web-development/templates` và `/templates/[slug]`: đọc dữ liệu có kiểu từ `data/templates.json`, hiển thị bộ lọc, tìm kiếm, trang mẫu và bản dựng desktop/mobile. Khách chọn mẫu sẽ tới form tư vấn với slug đã chọn. Nếu biểu mẫu trực tuyến chưa bật, bản nháp email vẫn giữ tên template và người dùng phải tự xác nhận gửi.
2. **Template registry** là metadata có phiên bản, trạng thái, ngành, phong cách, mục đích, trang, module và dải tương thích. Đây là nguồn cấu hình để giao diện và CLI sử dụng; chưa có CRUD hay database admin.
3. **Website khách hàng** được sinh thành thư mục riêng từ `starter/web-foundation`. Mỗi dự án có cấu hình, manifest module, dependency và vòng đời triển khai độc lập. CLI không kết nối database, Auth, secrets, hosting hoặc DNS của Athena.

## Lệnh khởi tạo

```sh
node scripts/create-site.mjs \
  --template creative-studio \
  --name studio-example \
  --brand "Studio Example" \
  --out ../studio-example
```

Module mặc định lấy từ registry. Có thể chọn một tập con đã hỗ trợ cho template, ví dụ `--modules content,contact`. CLI từ chối template/module không tồn tại, tên project không hợp lệ, ghi đè thư mục đã có dữ liệu và đường dẫn nằm bên trong repository Athena. Kiểm tra kết quả trước khi cài dependency hoặc bắt đầu tích hợp.

## Ranh giới backend

Starter hiện cung cấp Next.js App Router, typed site config, style nền trung tính, helper kiểm tra chuỗi đầu vào, lớp lỗi ứng dụng và manifest module. Nó **không giả lập** Auth, RBAC, CMS, media storage, lead persistence, booking, commerce, payment, logging provider hoặc migrations. Module được khai báo là lựa chọn chứ không đồng nghĩa tính năng đã chạy.

Khi dự án cần lưu trữ, chốt threat model và nhà cung cấp trước; cấp database riêng hoặc ranh giới dữ liệu có kiểm chứng cho khách hàng. Không dùng chung bảng và secrets của Athena một cách mặc định. Thêm migrations có thứ tự và checksum, repository/service chỉ khi có persistence, kiểm thử authorization theo từng vai trò và backup/restore trước khi đưa dữ liệu thật vào.

## Bước tiếp theo trước vận hành quản trị

- Chọn kho lưu template và lifecycle trạng thái sau khi có quy trình cập nhật mẫu thực tế.
- Chỉ tạo CRUD quản trị khi session server-side và role admin đã được bật, kiểm thử; bảo vệ API và data layer cùng lúc.
- Tạo module theo các hợp đồng và kiểm thử riêng: leads, content/media, identity/RBAC, booking, commerce.
- Với mỗi starter mới, thêm bài kiểm thử build độc lập, smoke, keyboard/mobile, security headers, dependency audit và hướng dẫn rollback.
- Tách package dùng chung chỉ khi có ít nhất hai starter thật sự chia sẻ cùng một implementation; hiện giữ cấu trúc modular để tránh duy trì abstraction rỗng.

## Acceptance của đợt này

- Tám hướng thiết kế khác nhau có thể lọc/tìm/xem chi tiết.
- Preview đổi giữa viewport desktop và điện thoại; mọi template được gắn nhãn bản dựng khái niệm.
- Chọn mẫu truyền được thông tin tới yêu cầu tư vấn.
- CLI sinh được dự án riêng an toàn, từ chối ghi đè và module không được đăng ký.
- Không bật provider, đăng nhập công khai, database khách hàng, thanh toán hoặc deploy production.
