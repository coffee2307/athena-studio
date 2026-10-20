import {eq} from "drizzle-orm";
import {createCloudIdentity} from "./auth.ts";
import {resolveWorkerIdentityConfig,type AthenaWorkerEnv} from "./gate.ts";
import {workspace,workspaceMembership} from "./schema.ts";

const NO_STORE={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
function json(body:Record<string,unknown>,status=200):Response{
 return Response.json(body,{status,headers:NO_STORE});
}
function routeIsAuth(pathname:string):boolean{
 return pathname==="/api/identity"||pathname.startsWith("/api/identity/");
}
async function requireSameOriginPost(request:Request,origin:string):Promise<Response|null>{
 if(request.method!=="POST")return null;
 if(request.headers.get("origin")!==origin)
  return json({ok:false,error:"Nguồn yêu cầu không hợp lệ."},403);
 const type=request.headers.get("content-type")||"";
 if(!/^application\/json(?:\s*;|$)/i.test(type))
  return json({ok:false,error:"Yêu cầu phải có định dạng JSON."},415);
 const size=request.headers.get("content-length");
 if(size&&(!/^\d+$/.test(size)||Number(size)>16_384))
  return json({ok:false,error:"Yêu cầu vượt quá giới hạn."},413);
 // Some clients omit Content-Length; verify the actual stream before dispatch.
 const reader=request.clone().body?.getReader();
 if(!reader)return json({ok:false,error:"Yêu cầu thiếu nội dung."},400);
 let count=0;
 try{
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   count+=value.byteLength;
   if(count>16_384){
    // A cloned Request is a tee: awaiting cancellation of one branch may hang
    // until the original branch is also consumed. Reject immediately instead.
    void reader.cancel().catch(()=>{});
    return json({ok:false,error:"Yêu cầu vượt quá giới hạn."},413);
   }
  }
 }catch{return json({ok:false,error:"Yêu cầu không hợp lệ."},400);}
 finally{reader.releaseLock();}
 return null;
}
/**
 * Independent identity and read-only tenant directory. NO mutation API for
 * memberships or repos. Authenticated users see only their own membership.
 */
export async function handleIdentityRequest(request:Request,env:AthenaWorkerEnv):Promise<Response>{
 const url=new URL(request.url);
 if(request.method==="GET"&&url.pathname==="/healthz"){
  const configured=!!resolveWorkerIdentityConfig(env,request.url);
  return json({status:configured?"configured":"disabled",verification:"configuration-only"});
 }
 const permitted=routeIsAuth(url.pathname)||url.pathname==="/api/workspaces";
 if(!permitted)return json({ok:false,error:"Không tìm thấy đường dẫn."},404);
 const config=resolveWorkerIdentityConfig(env,request.url);
 if(!config)return json({ok:false,error:"Athena Identity chưa được kích hoạt."},503);
 if(request.method!=="GET"&&request.method!=="POST")
  return json({ok:false,error:"Phương thức không được phép."},405);
 const prohibited=await requireSameOriginPost(request,config.origin);
 if(prohibited)return prohibited;
 try{
  const {auth,database}=createCloudIdentity(config);
  if(routeIsAuth(url.pathname)){
   const res=await auth.handler(request);
   const headers=new Headers(res.headers);
   headers.set("Cache-Control","no-store");
   headers.set("X-Content-Type-Options","nosniff");
   return new Response(res.body,{status:res.status,statusText:res.statusText,headers});
  }
  if(request.method!=="GET")return json({ok:false,error:"Chỉ được đọc."},405);
  const session=await auth.api.getSession({headers:request.headers});
  if(!session?.user?.id||!session.user.emailVerified)
   return json({ok:false,error:"Phiên đăng nhập không hợp lệ."},401);
  const rows=await database.select({
   workspaceId:workspace.id,
   title:workspace.title,
   kind:workspace.kind,
   role:workspaceMembership.role
  }).from(workspaceMembership)
   .innerJoin(workspace,eq(workspaceMembership.workspaceId,workspace.id))
   .where(eq(workspaceMembership.userId,session.user.id));
  return json({ok:true,workspaces:rows});
 }catch{
  // Never expose provider error bodies, OAuth credentials or SQL internals.
  return json({ok:false,error:"Dịch vụ tạm thời chưa khả dụng."},503);
 }
}
const worker={fetch:handleIdentityRequest};
export default worker;
