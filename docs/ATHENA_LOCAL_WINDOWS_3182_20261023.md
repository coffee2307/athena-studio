# Athena Studio — cập nhật GitHub và chạy localhost 3182 (Windows)

**Nguồn:** GitHub `coffee2307/athena-studio`, nhánh `feat/athena-template-gallery-20261022` và PR #43 đang Draft. **Mục tiêu:** thử website và OAuth cục bộ, tuyệt đối không triển khai production.

## A. Pull mã nguồn an toàn (PowerShell)

Mở PowerShell trong Windows Terminal:

```powershell
cd "F:\Athena Studio"
git status --short --branch
git fetch origin
git switch feat/athena-template-gallery-20261022
git pull --ff-only origin feat/athena-template-gallery-20261022
git log -1 --oneline
node -v
npm ci
```

- **Quan trọng:** Đọc `git status` trước khi switch/pull. Nếu có file sửa dở, **không chạy** `git reset --hard`, `git clean -fd`, hoặc `git stash -u` một cách vô thức. Sao lưu/chốt từng file trước; `git pull --ff-only` sẽ dừng nếu cần merge.
- Bản mới nằm trên **feature branch**, không phải `main`. Khi chưa merge PR, `git pull origin main` không nhận được sửa đổi này.
- `npm ci` sử dụng package-lock; không xóa `.env.local`, dữ liệu `.qa` hoặc database đã có.

## B. Khởi động Athena

Cách trực tiếp, sau khi `npm ci`:

```powershell
npm run dev
```

Mở `http://127.0.0.1:3182/` trên **cùng máy tính**. Không cần khai báo `-p 3182` vì package.json đã dùng cổng này.

Hoặc dùng script kiểm tra trước:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-local.ps1 -CheckOnly
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Script xác thực Node 22+ (khuyến nghị Node 24), kiểm tra cổng, nhánh Git và origin cục bộ. Nó **không** tự chạy git pull, ghi đè secret, giết process, tạo quyền admin hoặc thay DB.

## C. GitHub OAuth ở localhost

Đặt các **giá trị thật trên máy** trong `.env.local`, không đăng nội dung lên GitHub/chia sẻ vào chat. Nếu file đã có, chỉ chỉnh các khóa cần thiết. Ví dụ để tự điền:

```dotenv
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3182
ATHENA_INDEPENDENT_AUTH_ENABLED=true
ATHENA_IDENTITY_LOCAL_ONLY=true
ATHENA_IDENTITY_DB_PATH=.qa/athena-local.sqlite
BETTER_AUTH_SECRET=<generate-locally>
ATHENA_GITHUB_OAUTH_CLIENT_ID=<from-GitHub-OAuth-App>
ATHENA_GITHUB_OAUTH_CLIENT_SECRET=<from-the-same-GitHub-OAuth-App>
```

Tạo `BETTER_AUTH_SECRET` **trên máy**:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Giữ `ATHENA_LOCAL_PASSWORD_AUTH_ENABLED` ở `false` hoặc chưa khai báo nếu chỉ muốn thử GitHub OAuth. Nếu muốn thử đăng ký bằng mật khẩu cục bộ, bật riêng `ATHENA_LOCAL_PASSWORD_AUTH_ENABLED=true` và không tái sử dụng mật khẩu thật.

**GitHub Developer Settings → OAuth Apps → Athena → Authorization callback URL:**

```text
http://127.0.0.1:3182/api/identity/callback/github
```

Cần đồng nhất callback với `NEXT_PUBLIC_SITE_URL` và URL trên thanh địa chỉ. Không chuyển qua `localhost:3182` hoặc `localhost:3000` trong quá trình xác thực.

Sau khi lưu `.env.local`, cần **restart** `npm run dev` để cấu hình được nạp lại. Trước khi thử đăng nhập, khởi tạo/migrate schema Better Auth **trong database QA**:

```powershell
$env:NODE_ENV="development"
node scripts/identity-local-migrate.mjs
Remove-Item Env:NODE_ENV
```

Migrate chỉ cho phép database nằm dưới `.qa` và chỉ bật khi cấu hình local-only hợp lệ; không sử dụng với database production. Sau đó mở `http://127.0.0.1:3182/login` và chọn GitHub. Thành công phải có cookie session thật và được truy cập `/profile`; được GitHub redirect về chưa chứng minh đăng nhập hoàn chỉnh. Hướng dẫn phân tích lỗi: `docs/GITHUB_OAUTH_CALLBACK_CHECKLIST_20261023.md`.

## D. Các URL cần kiểm tra

- Trang chủ: `http://127.0.0.1:3182/`
- 20 template: `http://127.0.0.1:3182/services/web-development/templates`
- Demo nhà hàng: `http://127.0.0.1:3182/template-demos/hospitality-booking`
- Demo SaaS: `http://127.0.0.1:3182/template-demos/saas-product`
- Quy trình gửi brief: `http://127.0.0.1:3182/start`
- Đăng nhập: `http://127.0.0.1:3182/login`

Sau khi pull, để kiểm thử tự động:

```powershell
npm run typecheck
npm run test:unit
npm run release:preflight
```

Chỉ mở cổng này qua loopback. `127.0.0.1` trên điện thoại là **chính điện thoại đó**, không phải PC, và không truy cập được nếu không có mạng/tunnel phù hợp. Không công khai máy phát triển hay database bằng cách tắt gate xác thực.
