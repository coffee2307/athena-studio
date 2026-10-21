import {LegalArticle} from "@/components/legal/LegalArticle";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Cookie và công nghệ lưu trữ","Thông tin về cookie thiết yếu, phiên đăng nhập, lưu trữ trình duyệt, kênh bên thứ ba và lựa chọn của bạn trên Athena Studio.","/legal/cookies");
export default function Cookies(){return <LegalArticle title="Cookie và lưu trữ" label="Những loại dữ liệu trình duyệt có thể lưu và lựa chọn của người truy cập." updated="21/10/2026">
 <h2>1. Cookie là gì?</h2>
 <p>Cookie là dữ liệu nhỏ do website hoặc dịch vụ liên quan lưu trên trình duyệt để nhận biết một phiên truy cập hoặc ghi nhớ lựa chọn. Bộ nhớ đệm của trình duyệt, local storage và session storage là các cơ chế khác; không phải tất cả đều là cookie.</p>
 <h2>2. Những gì Athena đang dùng</h2>
 <p>Website công khai chủ yếu cung cấp nội dung giới thiệu dịch vụ và dự án. Các thành phần phía máy chủ, dịch vụ hosting hoặc bảo vệ website có thể tạo dữ liệu kỹ thuật cần thiết để xử lý yêu cầu. Hiện tại, hệ thống đăng nhập mới và các tích hợp email đang được nghiệm thu riêng, không được coi là đã vận hành công khai.</p>
 <p>Athena chưa công bố việc triển khai công cụ quảng cáo hoặc theo dõi tiếp thị cá nhân hóa trên trang công khai. Trước khi mở cookie không thiết yếu, cần kiểm kê chính xác tên cookie, thời hạn, mục đích và cơ chế lựa chọn.</p>
 <h2>3. Các nhóm công nghệ cần phân biệt</h2>
 <div className="agency-legal-table-wrap"><table className="agency-legal-table"><thead><tr><th>Nhóm</th><th>Công dụng</th><th>Trạng thái</th></tr></thead><tbody>
  <tr><td>Hoạt động thiết yếu</td><td>Phục vụ trang, an ninh mạng và giao tiếp máy chủ.</td><td>Phụ thuộc cấu hình hạ tầng đang chạy</td></tr>
  <tr><td>Phiên đăng nhập</td><td>Duy trì phiên đã xác thực và bảo vệ quyền truy cập.</td><td>Chưa mở công khai</td></tr>
  <tr><td>Thống kê hoặc tiếp thị</td><td>Phân tích hành vi, đo lường chiến dịch hoặc cá nhân hóa quảng cáo.</td><td>Chưa được phê duyệt triển khai</td></tr>
  <tr><td>Nền tảng ngoài</td><td>Zalo, WhatsApp, Google, GitHub hoặc nền tảng được bạn mở từ liên kết.</td><td>Chỉ phát sinh theo dịch vụ và tương tác thực tế</td></tr>
 </tbody></table></div>
 <h2>4. Cookie đăng nhập trong tương lai</h2>
 <p>Nếu Athena Identity được mở, cookie phiên dự kiến có thuộc tính bảo mật phù hợp với HTTPS, giới hạn truy cập từ JavaScript và xác thực phía máy chủ. Thời hạn phiên, khả năng đăng xuất và cách thu hồi quyền cần được kiểm thử trên domain production trước khi công bố chi tiết.</p>
 <h2>5. Cách quản lý</h2>
 <p>Bạn có thể xóa hoặc chặn cookie trong phần cài đặt của trình duyệt. Việc chặn dữ liệu thiết yếu có thể khiến đăng nhập hoặc một số hoạt động bảo mật không dùng được khi tính năng tương ứng được kích hoạt. Việc xóa bộ nhớ đệm trình duyệt không xóa bản sao email mà bạn đã chủ động gửi.</p>
 <h2>6. Lựa chọn đối với cookie không thiết yếu</h2>
 <p>Nếu công cụ đo lường hoặc tiếp thị không thiết yếu được triển khai, Athena sẽ cung cấp thông tin và cơ chế lựa chọn phù hợp trước khi kích hoạt. Không hiển thị banner hoặc nút “Đồng ý tất cả” nếu thực tế không có bộ phận ghi nhớ và thực thi lựa chọn đó.</p>
 <h2>7. Thay đổi và yêu cầu</h2>
 <p>Trang này sẽ được cập nhật khi triển khai các nhà cung cấp, tính năng tài khoản hoặc hệ thống theo dõi mới. Có thể gửi thắc mắc đến <a href="mailto:coffee2307@gmail.com">coffee2307@gmail.com</a>.</p>
 </LegalArticle>}
