/**
 * Athena Core identity boundary: vendor-neutral and offline-testable.
 * No SDK imports, secrets, persistence, or browser globals.
 */
export type IdentityAction =
 | {kind:"login";email:string;password:string}
 | {kind:"signup";email:string;password:string;fullName:string;redirectTo:string}
 | {kind:"forgot";email:string;redirectTo:string}
 | {kind:"password";password:string}
 | {kind:"google";redirectTo:string};

export type IdentityKind=IdentityAction["kind"];
export type IdentityFailureKind=
 | "email_quota" | "throttled" | "network" | "invalid_credentials"
 | "email_unverified" | "weak_password" | "provider_disabled"
 | "unavailable" | "unknown";

export interface IdentityPort {
 login(email:string,password:string):Promise<void>;
 signup(email:string,password:string,fullName:string,redirectTo:string):Promise<void>;
 forgot(email:string,redirectTo:string):Promise<void>;
 password(password:string):Promise<void>;
 google(redirectTo:string):Promise<void>;
}
export type IdentityFailure={kind:IdentityFailureKind;message:string;cooldownSeconds:number};
export type IdentityResult=
 | {ok:true;action:IdentityKind}
 | {ok:false;action:IdentityKind;failure:IdentityFailure};

function errorDetails(err:unknown):{code:string;status:number;name:string}{
 if(typeof err!=="object"||err===null)return {code:"",status:0,name:""};
 const x=err as Record<string,unknown>;
 return {
  code:typeof x.code==="string"?x.code.toLowerCase().slice(0,80):"",
  status:typeof x.status==="number"&&Number.isInteger(x.status)?x.status:0,
  name:typeof x.name==="string"?x.name.slice(0,80):""
 };
}
/** Never forward arbitrary provider error messages, identifiers, or exception stacks to customers. */
export function classifyIdentityFailure(err:unknown,action:IdentityKind):IdentityFailure{
 const {code,status,name}=errorDetails(err);
 const mail=action==="signup"||action==="forgot";
 if(code==="over_email_send_rate_limit"||(mail&&status===429&&code!=="over_request_rate_limit"))
  return {kind:"email_quota",cooldownSeconds:90,message:"Hệ thống gửi email đang tạm thời quá tải. Yêu cầu chưa được xác nhận hoàn tất. Thông tin bạn nhập vẫn được giữ; vui lòng thử lại sau."};
 if(status===429||["over_request_rate_limit","too_many_requests","rate_limit_exceeded"].includes(code))
  return {kind:"throttled",cooldownSeconds:90,message:"Có quá nhiều yêu cầu trong thời gian ngắn. Vui lòng đợi trước khi thực hiện lại; không cần gửi liên tục."};
 if(["email_not_confirmed","email_unverified"].includes(code))
  return {kind:"email_unverified",cooldownSeconds:0,message:"Email chưa được xác minh. Vui lòng kiểm tra hộp thư và thư mục spam trước khi đăng nhập."};
 if(action==="login"&&["invalid_credentials","invalid_grant"].includes(code))
  return {kind:"invalid_credentials",cooldownSeconds:0,message:"Thông tin đăng nhập chưa chính xác. Vui lòng kiểm tra lại hoặc sử dụng chức năng quên mật khẩu."};
 if(["weak_password","password_too_short"].includes(code))
  return {kind:"weak_password",cooldownSeconds:0,message:"Mật khẩu chưa đáp ứng yêu cầu bảo mật. Hãy sử dụng mật khẩu dài ít nhất 12 ký tự, khó đoán."};
 if(["signup_disabled","provider_disabled","identity_policy_block"].includes(code))
  return {kind:"provider_disabled",cooldownSeconds:0,message:"Phương thức xác thực này chưa khả dụng. Chúng tôi chưa thể hoàn tất yêu cầu của bạn."};
 if(["network_error","fetch_error","request_timeout"].includes(code)||["TypeError","AuthRetryableFetchError"].includes(name))
  return {kind:"network",cooldownSeconds:0,message:"Kết nối đến hệ thống xác thực bị gián đoạn. Kiểm tra mạng và thử lại; dữ liệu trong biểu mẫu vẫn được giữ."};
 if(status>=500)
  return {kind:"unavailable",cooldownSeconds:0,message:"Dịch vụ xác thực đang gián đoạn. Bạn có thể thử lại sau; dữ liệu đã nhập không bị xóa."};
 return {kind:"unknown",cooldownSeconds:0,message:action==="login"
  ?"Chưa thể đăng nhập. Vui lòng kiểm tra thông tin hoặc thử lại sau."
  :"Yêu cầu chưa thể hoàn tất. Vui lòng thử lại sau; thông tin đã nhập vẫn được giữ."};
}
/** Handles provider errors; never bypasses verification, invents a session, or silently retries. */
export async function runIdentityAction(port:IdentityPort,action:IdentityAction):Promise<IdentityResult>{
 try{
  switch(action.kind){
   case "login":await port.login(action.email,action.password);break;
   case "signup":await port.signup(action.email,action.password,action.fullName,action.redirectTo);break;
   case "forgot":await port.forgot(action.email,action.redirectTo);break;
   case "password":await port.password(action.password);break;
   case "google":await port.google(action.redirectTo);break;
  }
  return {ok:true,action:action.kind};
 }catch(err){
  return {ok:false,action:action.kind,failure:classifyIdentityFailure(err,action.kind)};
 }
}
export function cappedCooldown(seconds:number):number{
 if(!Number.isFinite(seconds)||seconds<=0)return 0;
 return Math.min(Math.ceil(seconds),300);
}
