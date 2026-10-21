import {NextRequest,NextResponse} from "next/server";
import {getInquirySettings} from "@/lib/inquiry/config";
import {parseInquiry} from "@/lib/inquiry/validation";
import {verifyChallenge,limitInquiry,recordInquiry,notifyOwner,setNotification} from "@/lib/inquiry/providers";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const MAX_BYTES=12_000;

function fail(status:number,message:string){
 return NextResponse.json({ok:false,error:message},{status,headers:{"Cache-Control":"no-store"}});
}
async function readBounded(request:NextRequest):Promise<string|null>{
 if(!request.body)return null;
 const length=request.headers.get("content-length");
 if(length&&Number(length)>MAX_BYTES)return null;
 const reader=request.body.getReader();
 let bytes=0;
 const chunks:Uint8Array[]=[];
 try{
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   bytes+=value.byteLength;
   if(bytes>MAX_BYTES){await reader.cancel().catch(()=>{});return null;}
   chunks.push(value);
  }
  const result=new Uint8Array(bytes);let offset=0;
  for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.byteLength;}
  return new TextDecoder("utf-8",{fatal:true}).decode(result);
 }catch{return null;}finally{reader.releaseLock();}
}
export async function POST(request:NextRequest){
 const settings=getInquirySettings();
 if(!settings)return fail(503,"Biểu mẫu chưa được kích hoạt. Vui lòng liên hệ qua email.");
 const expectedOrigin=new URL(settings.origin).origin;
 if(request.headers.get("origin")!==expectedOrigin)return fail(403,"Nguồn yêu cầu không được phép.");
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type")||""))return fail(415,"Yêu cầu dữ liệu JSON.");
 const raw=await readBounded(request);
 if(!raw)return fail(413,"Nội dung yêu cầu quá lớn hoặc không hợp lệ.");
 let body:unknown;
 try{body=JSON.parse(raw);}catch{return fail(400,"Dữ liệu gửi lên không hợp lệ.");}
 const parsed=parseInquiry(body);
 if(!parsed.ok)return fail(400,parsed.error);
 const item=parsed.value;
 // Honeypot responses never claim that the user's valid submission was stored.
 if(item.website)return NextResponse.json({ok:true,ignored:true},{status:200});
 try{
  const validated=await verifyChallenge(settings,item.captcha);
  if(!validated)return fail(403,"Xác minh chống spam chưa thành công. Vui lòng thử lại.");
 }catch{return fail(503,"Không thể xác minh yêu cầu lúc này. Vui lòng thử lại sau.");}
 try{
  if(!(await limitInquiry(settings,item.email)))return fail(429,"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.");
 }catch{return fail(503,"Hệ thống bảo vệ biểu mẫu tạm thời không khả dụng.");}
 let id:string;
 try{id=await recordInquiry(settings,item);}
 catch{return fail(503,"Chưa thể lưu yêu cầu. Vui lòng gửi email trực tiếp.");}
 // At this point the request is durable. Email is a secondary notification;
 // a mail outage must not misrepresent a saved lead as rejected.
 let notified=false;
 try{notified=await notifyOwner(settings,item,id);}catch{notified=false;}
 try{await setNotification(settings,id,notified?"sent":"failed");}
 catch{console.error("Inquiry notification status update failed",id);}
 return NextResponse.json({
  ok:true,reference:id.slice(0,8),
  message:notified?"Yêu cầu đã được ghi nhận và thông báo đến Athena.":"Yêu cầu đã được lưu. Thông báo nội bộ đang gặp sự cố nhưng thông tin của bạn không bị mất.",
  notificationDelayed:!notified
 },{status:201,headers:{"Cache-Control":"no-store"}});
}
