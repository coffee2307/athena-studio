import {NextRequest,NextResponse} from "next/server";
import {connectGitHubInstallation,githubAppConfig,githubInstallCookieName,githubSession,verifyGitHubInstallState} from "@/lib/github-app";

export async function GET(request:NextRequest){
 const fallback=new URL("/profile?github=connect-error",request.url);
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.redirect(new URL("/login?next=%2Fprofile",request.url));
 const config=githubAppConfig();
 if(!config)return NextResponse.redirect(new URL("/profile?github=setup-needed",request.url));
 const url=new URL(request.url);
 const installationId=url.searchParams.get("installation_id")||"";
 const action=url.searchParams.get("setup_action");
 const state=url.searchParams.get("state")||"";
 const cookie=request.cookies.get(githubInstallCookieName())?.value;
 const verified=verifyGitHubInstallState(cookie,state,session.identity.secret);
 const response=NextResponse.redirect(action==="install"&&verified?.userId===session.user.id?new URL("/profile?github=connected",request.url):fallback);
 response.cookies.set(githubInstallCookieName(),"",{httpOnly:true,sameSite:"lax",secure:session.identity.origin.startsWith("https://"),path:"/api/github/callback",maxAge:0});
 if(action!=="install"||verified?.userId!==session.user.id)return response;
 try{await connectGitHubInstallation(session.identity,session.user.id,installationId);}
 catch{return NextResponse.redirect(fallback);}
 return response;
}
