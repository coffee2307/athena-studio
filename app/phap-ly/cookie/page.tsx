import {LegalArticle} from "@/components/legal/LegalArticle";
import {createMetadata} from "@/lib/metadata";
export const metadata=createMetadata("Cookie","Thông tin sơ bộ về cookie và các công nghệ lưu trữ dữ liệu của website Athena Studio.","/phap-ly/cookie");
export default function Cookie(){return <LegalArticle title="Cookie và lưu trữ" label="Các công nghệ vận hành website và lựa chọn của người truy cập." updated="19/10/2026">
 <h2>1. Tình trạng hiện tại</h2><p>Ở phiên bản website công khai đang phát triển, Athena chưa cố ý tích hợp cookie quảng cáo hoặc SDK phân tích hành vi phục vụ tiếp thị. Hiện không có chức năng đăng nhập khách hàng. Hạ tầng hosting và các tích hợp trong tương lai có thể sử dụng cookie kỹ thuật.</p>
 <h2>2. Những công nghệ có thể xuất hiện</h2><p>Trình duyệt có thể lưu bộ nhớ đệm tài nguyên, dữ liệu phiên hoặc các thông tin kỹ thuật khi sử dụng dịch vụ liên kết ngoài. Sau khi bổ sung xác thực, cookie phiên bảo mật sẽ cần được phân loại và công bố chính xác theo cấu hình thực tế.</p>
 <h2>3. Kiểm soát của bạn</h2><p>Bạn có thể quản lý cookie qua cài đặt trình duyệt. Việc chặn cookie kỹ thuật có thể ảnh hưởng những chức năng đòi hỏi phiên xác thực sau này, nhưng website hiện vẫn cho phép duyệt nội dung công khai mà không cần tạo tài khoản.</p>
 <h2>4. Điều chỉnh tương lai</h2><p>Trước khi bổ sung phân tích, quảng cáo hoặc công cụ của bên thứ ba sử dụng cookie không thiết yếu, Athena sẽ đánh giá yêu cầu thông báo và xin lựa chọn phù hợp. Không hiển thị banner đồng ý chỉ để trang trí khi chưa có cơ chế quản lý lựa chọn hoạt động.</p>
 </LegalArticle>}
