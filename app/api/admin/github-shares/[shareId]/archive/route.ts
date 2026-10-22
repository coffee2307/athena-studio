import {NextRequest,NextResponse} from "next/server";
import {downloadSharedRepositoryArchive,githubSession,isGitHubShareAdmin} from "@/lib/github-app";
type Props={params:Promise<{shareId:string}>};
export async function GET(request:NextRequest,{params}:Props){
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Đăng nhập để tiếp tục."},{status:401});
 if(!isGitHubShareAdmin(session.user.email))return NextResponse.json({message:"Không có quyền truy cập."},{status:403});
 const {shareId}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(shareId))return NextResponse.json({message:"Mã chia sẻ không hợp lệ."},{status:404});
 try{
  const {response,filename}=await downloadSharedRepositoryArchive(session.identity,shareId);
  return new Response(response.body,{status:200,headers:{"content-type":"application/gzip","content-disposition":"attachment; filename=\""+filename+"\"","cache-control":"private, no-store","x-content-type-options":"nosniff"}});
 }catch{return NextResponse.json({message:"Không thể tải repository. Quyền chia sẻ có thể đã bị thu hồi hoặc kho lưu trữ vượt giới hạn 50 MB."},{status:404});}
}
