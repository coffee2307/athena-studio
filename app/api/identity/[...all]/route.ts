import {NextRequest,NextResponse} from "next/server";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
/** Fail-closed separate identity API; no existing Supabase session is migrated or reused. */
async function handle(request:NextRequest):Promise<Response>{
 if(!standaloneIdentityConfig())return NextResponse.json({
  ok:false,error:"Athena Identity chưa được kích hoạt."
 },{status:503,headers});
 const {standaloneAuth}=await import("@/lib/identity/server");
 const auth=standaloneAuth();
 if(!auth)return NextResponse.json({ok:false,error:"Athena Identity chưa sẵn sàng."},{status:503,headers});
 return auth.handler(request);
}
export const GET=handle;
export const POST=handle;
