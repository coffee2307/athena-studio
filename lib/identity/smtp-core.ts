import nodemailer from "nodemailer";
import type {AuthMailTransport,OtpPurpose} from "./types.ts";

export type SmtpTransportConfig={
 host:string;port:465|587;sender:string;username:string;password:string;
};
/**
 * Portable transactional email. Server-only: never attach SMTP credentials to
 * browser code. No retry on a failed SMTP delivery: a remote server might have
 * accepted the message before the connection failed.
 */
export function smtpOtpTransport(
 config:SmtpTransportConfig,
 suppliedTransport?:Pick<ReturnType<typeof nodemailer.createTransport>,"sendMail">
):AuthMailTransport{
 const transport=suppliedTransport??nodemailer.createTransport({
  host:config.host,
  port:config.port,
  secure:config.port===465,
  requireTLS:config.port===587,
  auth:{user:config.username,pass:config.password},
  connectionTimeout:2_500,
  greetingTimeout:2_500,
  socketTimeout:4_500,
  tls:{minVersion:"TLSv1.2",rejectUnauthorized:true},
  pool:false,
  disableFileAccess:true,
  disableUrlAccess:true
 });
 const subjects:Record<OtpPurpose,string>={
  "sign-in":"Mã đăng nhập Athena",
  "email-verification":"Xác minh email Athena",
  "forget-password":"Khôi phục tài khoản Athena",
  "change-email":"Xác minh đổi email Athena"
 };
 const validEmail=(e:string)=>e.length<=254&&/^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/.test(e);
 return {
  async send(email,otp,purpose){
   if(!validEmail(email)||!validEmail(config.sender)||!(/^\d{6}$/).test(otp)||
    !subjects[purpose])throw new Error("ATHENA_MAIL_INVALID_INPUT");
   const intro=subjects[purpose];
   try{
    const info=await transport.sendMail({
     from:{name:"Athena Studio",address:config.sender},
     to:email,
     subject:intro,
     text:intro+"\n\nMã của bạn: "+otp+
      "\n\nMã hết hạn sau 5 phút. Không cung cấp mã cho người khác.",
     headers:{"Auto-Submitted":"auto-generated","X-Auto-Response-Suppress":"All"}
    });
    if(!info.accepted.includes(email))
     throw new Error("ATHENA_MAIL_UNCERTAIN");
   }catch{
    // SMTP may accept DATA before a socket fails. Never silently retry.
    throw new Error("ATHENA_MAIL_UNCERTAIN");
   }
  }
 };
}
