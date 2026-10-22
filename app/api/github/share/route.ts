import {NextRequest,NextResponse} from "next/server";
import {githubSession,revokeGitHubRepository,shareGitHubRepository} from "@/lib/github-app";

function sameOrigin(request:NextRequest){
 const origin=request.headers.get("origin");
 return !!origin&&origin===new URL(request.url).origin;
}
async function repositoryId(request:NextRequest){
 try{
  const body=await request.json() as {repositoryId?:unknown};
  const id=Number(body.repositoryId);
  return Number.isSafeInteger(id)&&id>0?id:null;
 }catch{return null;}
}
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Yêu cầu không hợp lệ."},{status:403});
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Phiên đăng nhập đã hết hạn."},{status:401});
 const id=await repositoryId(request);
 if(!id)return NextResponse.json({message:"Repository không hợp lệ."},{status:400});
 try{
  await shareGitHubRepository(session.identity,session.user.id,id);
  return NextResponse.json({shared:true,message:"Repository đã được chia sẻ ở chế độ chỉ đọc."},{headers:{"cache-control":"no-store"}});
 }catch(error){
  const message=error instanceof Error&&error.message.includes("50 MB")?error.message:"Không thể chia sẻ repository này. Hãy kiểm tra quyền GitHub App.";
  return NextResponse.json({message},{status:409,headers:{"cache-control":"no-store"}});
 }
}
export async function DELETE(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"Yêu cầu không hợp lệ."},{status:403});
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Phiên đăng nhập đã hết hạn."},{status:401});
 const id=await repositoryId(request);
 if(!id)return NextResponse.json({message:"Repository không hợp lệ."},{status:400});
 revokeGitHubRepository(session.identity,session.user.id,id);
 return NextResponse.json({shared:false,message:"Đã thu hồi quyền chia sẻ."},{headers:{"cache-control":"no-store"}});
}
