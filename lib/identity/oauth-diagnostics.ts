/** Public, non-secret OAuth troubleshooting. No tokens or authorization codes in UI. */
export type OAuthProvider="github"|"google";
const errors:Record<string,string>={
 invalid_code:"GitHub hoặc Google từ chối mã ủy quyền. Thường do callback khác cấu hình, mã đã hết hạn/được dùng trước hoặc Client ID và Secret thuộc hai ứng dụng khác nhau.",
 invalid_callback_request:"Yêu cầu callback không hợp lệ. Hãy khởi tạo lại từ nút đăng nhập Athena.",
 no_code:"Không nhận được mã ủy quyền từ nhà cung cấp. Hãy thử lại từ đầu.",
 state_not_found:"Không tìm thấy phiên OAuth đã khởi tạo. Có thể cookie bị xóa hoặc bị chặn.",
 state_invalid:"Dữ liệu trạng thái OAuth không hợp lệ. Hãy thử lại trên cùng một địa chỉ website.",
 state_mismatch:"Phiên OAuth không khớp. Không mở nhiều luồng đăng nhập song song.",
 state_security_mismatch:"Cookie xác thực không khớp. Không chuyển giữa localhost và 127.0.0.1.",
 oauth_provider_not_found:"Nhà cung cấp OAuth chưa được bật trên máy chủ Athena.",
 email_not_found:"GitHub không cung cấp email phù hợp. Hãy xác minh email trong tài khoản GitHub rồi thử lại.",
 email_not_verified:"Email tài khoản GitHub/Google chưa được nhà cung cấp xác minh.",
 "email_doesn't_match":"Email nhận được từ nhà cung cấp không trùng email dự kiến.",
 unable_to_get_user_info:"Không lấy được hồ sơ tài khoản từ GitHub/Google.",
 unable_to_link_account:"Tài khoản hiện tại chưa được liên kết với nhà cung cấp này. Athena không tự động ghép danh tính vì lý do bảo mật.",
 account_not_linked:"Email đã thuộc một tài khoản dùng phương thức khác. Đăng nhập bằng phương thức ban đầu; chưa hỗ trợ liên kết tự động.",
 account_already_linked_to_different_user:"Tài khoản GitHub đã được liên kết với người dùng khác.",
 unable_to_create_user:"Chưa tạo được hồ sơ người dùng trên máy chủ; cần kiểm tra database và schema.",
 unable_to_create_session:"Không tạo được phiên đăng nhập; cần kiểm tra database, cookie và cấu hình máy chủ.",
 signup_disabled:"Máy chủ chưa mở đăng ký tài khoản mới.",
 internal_server_error:"Máy chủ xác thực gặp lỗi. Cần kiểm tra nhật ký máy chủ đã được che thông tin nhạy cảm."
};
export function oauthErrorAdvice(code:string|null|undefined){
 return code&&Object.hasOwn(errors,code)
  ?errors[code]
  :"Đăng nhập OAuth chưa hoàn tất. Hãy kiểm tra callback, phiên cookie và cấu hình nhà cung cấp, rồi thử lại.";
}
export function expectedOAuthCallback(origin:string,provider:OAuthProvider){
 const parsed=new URL(origin);
 if(parsed.origin!==origin)throw Error("Origin xác thực không hợp lệ.");
 return origin+"/api/identity/callback/"+provider;
}
export function matchesIdentityOrigin(expected:string,actual:string){
 try{return new URL(expected).origin===expected&&new URL(actual).origin===actual&&expected===actual;}
 catch{return false;}
}
