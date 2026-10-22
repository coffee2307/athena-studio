# Thư viện template và nền tảng khởi tạo dự án Athena

Trạng thái: nền tảng thử nghiệm trong repository Athena. Template là hướng thiết kế để tham khảo, không phải website khách hàng đã triển khai hoặc bản demo chức năng.

## Thành phần

- Thư viện `/services/web-development/templates` và trang `/templates/[slug]` đọc registry có kiểu từ `data/templates.json`, hỗ trợ lọc, tìm kiếm, sắp xếp và xem trước desktop/mobile. Người dùng có thể chọn template, xem rõ phiên bản và gửi lựa chọn sang trang tư vấn.
- `starter/web-foundation` có tám preset riêng: portfolio, corporate, commerce, fashion, SaaS, campaign, hospitality và editorial. Mỗi preset có bố cục, nội dung và thành phần semantic riêng. Màu, tên thương hiệu, module và email liên hệ lấy từ cấu hình được sinh.
- CLI tạo thư mục website độc lập với cấu hình TypeScript, manifest và dependency riêng. CLI kiểm tra template/module, đối số trùng hoặc lạ, email, thư mục đích, đường dẫn trong repo và symlink; không kết nối dịch vụ nào.
- Biểu mẫu tư vấn nhận mục tiêu, ngân sách dự kiến và thời gian mong muốn. Các trường bổ sung là tùy chọn, hiển thị trong bản nháp đã kiểm tra trước khi người dùng tự gửi email. Khi tích hợp inquiry server, metadata được giữ cùng nội dung yêu cầu trong giới hạn 4.000 ký tự.

## Tạo một website mẫu

```sh
node scripts/create-site.mjs \
  --template creative-studio \
  --name studio-example \
  --brand "Studio Example" \
  --out ../studio-example \
  --modules content,contact \
  --email hello@example.com
```

Cài dependency, typecheck, build và chạy smoke check trong thư mục website được sinh:

```sh
npm install
npm run typecheck
npm run build
npm run start
```

Mỗi website cần lockfile riêng được sinh tại thư mục dự án trước khi triển khai. Hãy rà soát manifest, cấu hình, dependencies và nội dung mẫu trước khi đưa lên hosting.

## Ranh giới chức năng

Starter chỉ bật nội dung tĩnh theo module được chọn và liên kết email thật nếu được cấu hình. Nó không giả lập Auth, RBAC, CMS, lưu lead, booking, commerce, thanh toán, database, secrets hoặc triển khai. Module ghi trong manifest chưa có nghĩa dịch vụ tương ứng đã hoạt động. Không đưa dữ liệu khách hàng hoặc credentials vào bản mẫu.

Nếu cần lưu dữ liệu, hãy tạo ranh giới dữ liệu riêng cho từng khách hàng, migration có version và checksum, chính sách quyền, backup/restore đã diễn tập và kiểm tra bảo mật trước khi nạp dữ liệu thật.

## Kiểm chứng đợt nâng cấp ngày 22/10/2026

- `npm run test:unit`: 130 đạt, 1 bỏ qua có chủ đích.
- `npm run lint`: đạt, không có lỗi hoặc cảnh báo.
- `npm run typecheck`, `npm run build` và `npm run test:smoke`: đạt.
- Playwright Chromium desktop/mobile: toàn bộ E2E đạt 166, bỏ qua 4 test theo điều kiện thiết bị. 58 luồng UI/accessibility và kiểm tra axe đều đạt.
- Tạo/build độc lập: creative-studio, modern-corporate và commerce-standard đều qua install, typecheck, build và HTTP/anchor smoke.
- Visual QA: đã xem thư viện, chi tiết template và liên hệ ở 1440px/390px; không thấy tràn ngang.

## Cổng trước khi phát hành

1. Build CI đã đạt cho ba preset và toàn bộ test Chromium/Firefox; kiểm tra lại cổng này cho mọi commit phát hành sau.
2. Chụp kiểm tra preview ở desktop và mobile; rà soát nội dung, focus, reduced motion, tương phản và overflow trước khi công khai.
3. Xác nhận production origin, index/noindex và metadata; bật đúng biến môi trường, sender email và provider sau khi test staging.
4. Sao lưu database và xác minh có thể phục hồi; giữ migrations theo thứ tự và kiểm tra health/rollback trên staging.
5. Phát hành canary có thể đảo ngược, theo dõi health/error logs rồi mới quyết định mở traffic. PR #39 chỉ ở trạng thái review; bước này chưa phát hành production.
