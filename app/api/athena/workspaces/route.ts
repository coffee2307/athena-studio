import {NextRequest,NextResponse} from "next/server";
import {parseVpsIdentityConfig} from "@/lib/identity/vps/config";
import {listOwnedWorkspaces} from "@/lib/identity/vps/workspace";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const HEADERS={"Cache-Control":"private, no-store","Vary":"Cookie","X-Content-Type-Options":"nosniff"};
function result(payload:Record<string,unknown>,status:number){
 return NextResponse.json(payload,{status,headers:HEADERS});
}
export async function GET(request:NextRequest){
 if(!parseVpsIdentityConfig())return result({ok:false,error:"Athena Identity chưa được kích hoạt."},503);
 try{
  const {activeVpsAuth}=await import("@/lib/identity/vps/runtime");
  const active=activeVpsAuth();
  if(!active)return result({ok:false,error:"Hệ thống tài khoản chưa sẵn sàng."},503);
  const session=await active.auth.api.getSession({headers:request.headers});
  if(!session?.user?.id||!session.user.emailVerified)
   return result({ok:false,error:"Bạn cần xác minh tài khoản để tiếp tục."},401);
  const workspaces=await listOwnedWorkspaces(active.pool,session.user.id);
  return result({ok:true,workspaces},200);
 }catch{
  return result({ok:false,error:"Chưa thể tải danh sách dự án. Vui lòng thử lại sau."},503);
 }
}
