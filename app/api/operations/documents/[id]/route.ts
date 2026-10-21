import {NextResponse,type NextRequest} from "next/server";
import {authSettings} from "@/lib/auth/config";
import {operationsEnabled} from "@/lib/operations/access";
import {serverAuthClient} from "@/lib/auth/server";
import {uuidPattern} from "@/lib/operations/models";

export const dynamic="force-dynamic";
export const runtime="nodejs";
const headers={"Cache-Control":"no-store","Referrer-Policy":"no-referrer"};
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){
 const settings=authSettings();
 if(!settings.enabled||!operationsEnabled())return NextResponse.json({error:"Dịch vụ tài khoản chưa được kích hoạt."},{status:503,headers});
 const {id}=await params;
 if(!uuidPattern.test(id))return NextResponse.json({error:"Tài liệu không tồn tại."},{status:404,headers});
 const client=await serverAuthClient();
 if(!client)return NextResponse.json({error:"Chưa xác thực."},{status:401,headers});
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user||!user.email_confirmed_at)
  return NextResponse.json({error:"Chưa xác thực."},{status:401,headers});
 // Metadata SELECT and subsequent Storage SELECT are BOTH enforced by RLS.
 // Never accept a project ID, object path or storage bucket from request arguments.
 const {data:doc,error}=await client.from("athena_documents")
  .select("id,object_path,file_name").eq("id",id).maybeSingle();
 if(error)return NextResponse.json({error:"Không thể xác minh quyền tải tài liệu."},{status:503,headers});
 if(!doc)return NextResponse.json({error:"Tài liệu không tồn tại hoặc không được cấp quyền."},{status:404,headers});
 const {data:signed,error:storageError}=await client.storage.from("athena-project-files")
  .createSignedUrl(doc.object_path,60,{download:doc.file_name});
 if(storageError||!signed?.signedUrl)
  return NextResponse.json({error:"Tệp hiện chưa sẵn sàng. Vui lòng thử lại."},{status:503,headers});
 let target:URL;
 try{
  target=new URL(signed.signedUrl,settings.url);
  if(target.origin!==new URL(settings.url).origin)throw Error("Invalid storage host");
 }catch{return NextResponse.json({error:"Không thể tạo liên kết an toàn."},{status:503,headers});}
 return NextResponse.redirect(target,{status:302,headers});
}
