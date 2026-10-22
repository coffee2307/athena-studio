import {NextRequest,NextResponse} from "next/server";
import {disconnectGitHubInstallation,githubSession} from "@/lib/github-app";
export async function DELETE(request:NextRequest){
 const origin=request.headers.get("origin");
 if(!origin||origin!==new URL(request.url).origin)return NextResponse.json({message:"Yêu cầu không hợp lệ."},{status:403});
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.json({message:"Phiên đăng nhập đã hết hạn."},{status:401});
 disconnectGitHubInstallation(session.identity,session.user.id);
 return NextResponse.json({connected:false},{headers:{"cache-control":"no-store"}});
}
