import {NextRequest,NextResponse} from "next/server";
import {githubSession,isGitHubShareAdmin,listGitHubShares} from "@/lib/github-app";
export async function GET(request:NextRequest){
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Đăng nhập để tiếp tục."},{status:401});
 if(!isGitHubShareAdmin(session.user.email))return NextResponse.json({message:"Không có quyền truy cập."},{status:403});
 try{return NextResponse.json({shares:listGitHubShares(session.identity)},{headers:{"cache-control":"private, no-store"}});}
 catch{return NextResponse.json({message:"Không thể tải danh sách chia sẻ."},{status:503});}
}
