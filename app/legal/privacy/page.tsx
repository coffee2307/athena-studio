import {LegalArticle} from "@/components/legal/LegalArticle";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Quyền riêng tư","Chính sách tiếp nhận, sử dụng, bảo vệ thông tin liên hệ và các quyền yêu cầu của người dùng khi truy cập Athena Studio.","/legal/privacy");
export default function Privacy(){return <LegalArticle label="Thông tin nào được tiếp nhận, vì sao cần và bạn có thể yêu cầu gì." title="Quyền riêng tư" updated="21/10/2026">
 <h2 id="phạm-vi">1. Phạm vi và trạng thái triển khai</h2>
 <p>Trang web Athena Studio giới thiệu dịch vụ, dự án và các phương thức liên hệ. Hệ thống xác thực khách hàng, biểu mẫu lưu yêu cầu và cổng quản lý dự án có thể xuất hiện trong bản thử nghiệm nhưng chưa mặc nhiên được cung cấp công khai. Chính sách này phân biệt thông tin đang thực sự được tiếp nhận với chức năng dự kiến.</p>
 <h2 id="du-lieu">2. Những dữ liệu bạn có thể cung cấp</h2>
 <p>Nếu bạn chủ động gửi yêu cầu qua email, điện thoại hoặc kênh nhắn tin, dữ liệu có thể gồm họ tên, email, số liên hệ, tên đơn vị, nội dung công việc, đường dẫn website, thời hạn, ngân sách dự kiến và các tài liệu do bạn tự chọn gửi. Không cung cấp mật khẩu, mã xác thực OTP, khóa API, thông tin thẻ hay dữ liệu cá nhân nhạy cảm qua các kênh liên hệ công khai.</p>
 <p>Nếu biểu mẫu trực tuyến sau này được kích hoạt, Athena sẽ chỉ nhận các trường được nêu ngay tại biểu mẫu và xác nhận rõ ràng trạng thái gửi. Dữ liệu từ biểu mẫu chưa kích hoạt sẽ không được âm thầm ghi nhận.</p>
 <h2 id="muc-dich">3. Mục đích sử dụng</h2>
 <p>Thông tin liên hệ được sử dụng để xác nhận yêu cầu, hiểu vấn đề cần giải quyết, phản hồi, trao đổi báo giá và quản lý công việc do bạn chủ động đề nghị. Không mặc nhiên sử dụng nội dung liên hệ để đăng công khai case study, quảng cáo hoặc chia sẻ tài liệu cho người không có trách nhiệm xử lý.</p>
 <h2 id="can-cu">4. Cơ sở và sự lựa chọn của bạn</h2>
 <p>Khi chủ động liên hệ, bạn cho phép Athena sử dụng những thông tin cần thiết để phản hồi yêu cầu đó. Những hoạt động khác, ví dụ gửi thông tin tiếp thị hoặc thu thập phân tích hành vi không thiết yếu, cần được giải thích và xử lý lựa chọn riêng khi triển khai. Bạn có thể ngừng cuộc trao đổi bất cứ lúc nào.</p>
 <h2 id="ben-thu-ba">5. Nhà cung cấp và nơi dữ liệu có thể đi qua</h2>
 <p>Email do bạn gửi qua Gmail hoặc ứng dụng email riêng sẽ được chuyển qua hạ tầng của nhà cung cấp email liên quan. Cuộc trò chuyện qua Zalo, WhatsApp hay nền tảng khác tuân theo dịch vụ mà bạn chọn sử dụng. Việc gửi dữ liệu cho các đơn vị này phụ thuộc phương thức liên hệ thực tế; Athena không kiểm soát được toàn bộ hoạt động lưu trữ của họ.</p>
 <p>Hệ thống dự kiến của Athena ưu tiên backend tự quản lý trên VPS, PostgreSQL và adapter gửi email tùy chọn. Các dịch vụ thử nghiệm như Supabase, Cloudflare, Google hay SMTP có thể được cấu hình ở những môi trường khác nhau, nhưng không được hiểu rằng tất cả cùng thu thập dữ liệu trên website công khai. Trước khi đưa Client Portal vào sử dụng, danh sách nhà cung cấp thực tế, khu vực lưu trữ và chính sách xử lý sẽ được cập nhật.</p>
 <h2 id="luu-tru">6. Lưu giữ và bảo vệ</h2>
 <p>Athena giới hạn quyền truy cập thông tin theo nhu cầu thực hiện công việc, tránh công khai dữ liệu liên hệ và không lưu bí mật truy cập trong nội dung website. Thời hạn lưu giữ đối với yêu cầu, tài khoản và hồ sơ dự án phải được ấn định trước khi từng tính năng xử lý dữ liệu được mở production; hiện chưa công bố một thời hạn chung khi chưa xác minh hạ tầng và yêu cầu pháp lý.</p>
 <p>Sao lưu, ghi log, phục hồi và xóa dữ liệu cần được nghiệm thu trên hệ thống thực tế. Không một hệ thống trực tuyến nào có thể cam kết hoàn toàn không gặp rủi ro bảo mật.</p>
 <h2 id="quyen">7. Quyền truy cập, chỉnh sửa và yêu cầu xử lý</h2>
 <p>Bạn có thể gửi email yêu cầu xác nhận Athena đang nắm giữ thông tin nào từ cuộc trao đổi, đề nghị chỉnh sửa, hạn chế sử dụng hoặc xóa khi phù hợp. Để tránh tiết lộ dữ liệu cho người không có quyền, Athena có thể cần xác minh quyền kiểm soát email hoặc mối liên hệ với yêu cầu ban đầu trước khi xử lý. Thời gian xử lý sẽ được thông báo theo từng trường hợp và các nghĩa vụ áp dụng.</p>
 <h2 id="bao-mat-du-an">8. Thông tin dự án không công khai</h2>
 <p>Với tài liệu, giao diện quản trị, repository, mã nguồn, thông tin truy cập hoặc bí mật thương mại của khách hàng, quyền xem và công bố sẽ được quy định riêng. Athena không tự biến một repository được cấp quyền làm việc thành nội dung marketing công khai. Portfolio chỉ nên chứa ảnh và thông tin đã xác nhận quyền sử dụng.</p>
 <h2 id="thay-doi">9. Thay đổi và liên hệ</h2>
 <p>Chính sách được cập nhật nếu Athena kích hoạt thêm đăng nhập, lưu trữ hồ sơ, phân tích hành vi hoặc nhà cung cấp xử lý dữ liệu. Phiên bản mới sẽ hiển thị ngày cập nhật và phạm vi thay đổi. Yêu cầu liên quan thông tin đã gửi: <a href="mailto:coffee2307@gmail.com?subject=Yeu%20cau%20quyen%20rieng%20tu%20Athena">coffee2307@gmail.com</a>.</p>
 </LegalArticle>}
