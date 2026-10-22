import {NextRequest,NextResponse} from "next/server";
import {githubAppConfig,githubSession,listUserRepositories} from "@/lib/github-app";

export async function GET(request:NextRequest){
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Đăng nhập để xem repository của bạn."},{status:401});
 if(!githubAppConfig())return NextResponse.json({configured:false,connected:false,message:"GitHub App chưa được cấu hình."},{headers:{"cache-control":"no-store"}});
 try{
  const result=await listUserRepositories(session.identity,session.user.id);
  return NextResponse.json({configured:true,...result},{headers:{"cache-control":"no-store"}});
 }catch{
  return NextResponse.json({configured:true,connected:false,message:"Không thể tải repository từ GitHub. Kiểm tra quyền của GitHub App rồi thử lại."},{status:502,headers:{"cache-control":"no-store"}});
 }
}
