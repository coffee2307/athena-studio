import {NextRequest,NextResponse} from "next/server";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {parseVpsIdentityConfig} from "@/lib/identity/vps/config";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const HEADERS={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
function unavailable(){
 return NextResponse.json({ok:false,error:"Athena Identity chưa được kích hoạt."},
  {status:503,headers:HEADERS});
}
function denied(status:number){
 return NextResponse.json({ok:false,error:"Yêu cầu xác thực không hợp lệ."},
  {status,headers:HEADERS});
}
/** Bounded POST parser; never logs identity payloads or forwards untrusted errors. */
async function boundedRequest(request:NextRequest,origin:string):Promise<Request|Response>{
 if(request.method!=="POST")return request;
 if(request.headers.get("origin")!==origin)return denied(403);
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type")||""))
  return denied(415);
 const header=request.headers.get("content-length");
 if(header&&(!/^\d+$/.test(header)||Number(header)>16_384))return denied(413);
 if(!request.body)return denied(400);
 const reader=request.body.getReader();
 const chunks:Uint8Array[]=[];
 let size=0;
 try{
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   size+=value.byteLength;
   if(size>16_384){
    void reader.cancel().catch(()=>{});
    return denied(413);
   }
   chunks.push(value);
  }
 }catch{return denied(400);}
 finally{reader.releaseLock();}
 const body=new Uint8Array(size);
 let index=0;
 for(const piece of chunks){body.set(piece,index);index+=piece.byteLength;}
 return new Request(request.url,{
  method:"POST",
  headers:request.headers,
  body
 });
}
/**
 * Priority: approved self-hosted PostgreSQL identity > explicitly local SQLite QA.
 * The two gates must never silently migrate or link their accounts.
 */
async function handle(request:NextRequest):Promise<Response>{
 const config=parseVpsIdentityConfig();
 if(config){
  const payload=await boundedRequest(request,config.origin);
  if(payload instanceof Response)return payload;
  try{
   const {activeVpsAuth}=await import("@/lib/identity/vps/runtime");
   const vps=activeVpsAuth();
   if(!vps)return unavailable();
   const response=await vps.auth.handler(payload);
   const headers=new Headers(response.headers);
   headers.set("Cache-Control","no-store");
   headers.set("X-Content-Type-Options","nosniff");
   return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }catch{return unavailable();}
 }
 if(!standaloneIdentityConfig())return unavailable();
 const {standaloneAuth}=await import("@/lib/identity/server");
 const auth=standaloneAuth();
 if(!auth)return unavailable();
 return auth.handler(request);
}
export const GET=handle;
export const POST=handle;
