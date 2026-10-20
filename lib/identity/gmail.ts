import "server-only";
import type {AuthMailTransport,OtpPurpose} from "@/lib/identity/types";
export type GmailSecrets={clientId:string;clientSecret:string;refreshToken:string;sender:string};
function encode64(input:string){return Buffer.from(input,"utf8").toString("base64");}
function safeEmail(input:string):boolean{
 return /^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/.test(input)&&input.length<=254;
}
/** Gmail only transfers a code; Athena/Better Auth validates it. Never log OTP. */
export function gmailOtpTransport(settings:GmailSecrets,http:typeof fetch=fetch):AuthMailTransport{
 return {
  async send(email:string,otp:string,purpose:OtpPurpose){
   if(!safeEmail(email)||!safeEmail(settings.sender)||!/^\d{6}$/.test(otp))
    throw new Error("ATHENA_MAIL_INVALID_INPUT");
   const labels:Record<OtpPurpose,string>={
    "sign-in":"Mã đăng nhập Athena","email-verification":"Xác minh email Athena",
    "forget-password":"Khôi phục tài khoản Athena","change-email":"Xác minh đổi email Athena"
   };
   const title=labels[purpose],plain=title+"\n\nMã của bạn: "+otp+
    "\n\nMã có thời hạn 5 phút. Không cung cấp mã cho người khác. Nếu không yêu cầu, hãy bỏ qua email.";
   const html='<!doctype html><html lang="vi"><head><meta charset="utf-8"></head>'+
    '<body style="font-family:Arial,sans-serif;background:#f7f7f5;padding:32px">'+
    '<main style="max-width:540px;margin:auto;background:white;padding:34px;border:1px solid #ddd">'+
    '<p style="font-size:11px;letter-spacing:.16em">ATHENA STUDIO / BẢO MẬT</p>'+
    '<h1 style="font-size:26px;line-height:1.4">'+title+'</h1>'+
    '<p style="font-size:14px">Nhập mã sau để tiếp tục thao tác trong Athena Studio:</p>'+
    '<p style="font-size:32px;font-weight:700;letter-spacing:.18em">'+otp+'</p>'+
    '<p style="font-size:12px;color:#555;line-height:1.8">Mã hết hạn sau 5 phút. Nếu không yêu cầu, hãy bỏ qua email. Athena không yêu cầu chia sẻ mã qua tin nhắn.</p>'+
    '</main></body></html>';
   const boundary="athena-otp-"+crypto.randomUUID();
   const subject="=?UTF-8?B?"+encode64(title)+"?=";
   const mime=[
    "From: Athena Studio <"+settings.sender+">","To: <"+email+">","Subject: "+subject,
    "MIME-Version: 1.0","Content-Type: multipart/alternative; boundary=\""+boundary+"\"","","--"+boundary,
    "Content-Type: text/plain; charset=UTF-8","Content-Transfer-Encoding: base64","",encode64(plain),"--"+boundary,
    "Content-Type: text/html; charset=UTF-8","Content-Transfer-Encoding: base64","",encode64(html),
    "--"+boundary+"--",""
   ].join("\r\n");
   const params=new URLSearchParams({
    client_id:settings.clientId,client_secret:settings.clientSecret,
    refresh_token:settings.refreshToken,grant_type:"refresh_token"
   });
   // One shared deadline; never automatically resend an ambiguous OTP delivery.
   const signal=AbortSignal.timeout(3800);
   let response:Response;
   try{response=await http("https://oauth2.googleapis.com/token",{
    method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},
    body:params,signal,cache:"no-store"
   });}catch{throw new Error("ATHENA_MAIL_TOKEN_UNAVAILABLE");}
   if(!response.ok)throw new Error("ATHENA_MAIL_TOKEN_UNAVAILABLE");
   const data:unknown=await response.json().catch(()=>null);
   if(!data||typeof data!=="object"||!("access_token" in data)||
     typeof data.access_token!=="string"||!data.access_token)
    throw new Error("ATHENA_MAIL_TOKEN_INVALID");
   let sent:Response;
   try{sent=await http("https://gmail.googleapis.com/gmail/v1/users/me/messages/send",{
    method:"POST",headers:{"authorization":"Bearer "+data.access_token,"content-type":"application/json"},
    body:JSON.stringify({raw:Buffer.from(mime,"utf8").toString("base64url")}),signal,cache:"no-store"
   });}catch{throw new Error("ATHENA_MAIL_UNCERTAIN");}
   if(!sent.ok)throw new Error(sent.status===429?"ATHENA_MAIL_QUOTA":"ATHENA_MAIL_UNAVAILABLE");
   const accepted:unknown=await sent.json().catch(()=>null);
   if(!accepted||typeof accepted!=="object"||!("id" in accepted)||typeof accepted.id!=="string")
    throw new Error("ATHENA_MAIL_UNCERTAIN");
  }
 };
}
export function gmailSecretsFromEnv(env:NodeJS.ProcessEnv=process.env):GmailSecrets|null{
 if(env.ATHENA_GMAIL_SENDER_ENABLED!=="true")return null;
 const sender=env.ATHENA_GMAIL_SENDER||"";
 const clientId=env.ATHENA_GMAIL_CLIENT_ID||"";
 const clientSecret=env.ATHENA_GMAIL_CLIENT_SECRET||"";
 const refreshToken=env.ATHENA_GMAIL_REFRESH_TOKEN||"";
 if(!safeEmail(sender)||!clientId||!clientSecret||!refreshToken)return null;
 return {sender,clientId,clientSecret,refreshToken};
}
