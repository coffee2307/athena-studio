import {NextRequest,NextResponse} from "next/server";
import {createGitHubInstallState,githubAppConfig,githubInstallCookieName,githubSession} from "@/lib/github-app";

export async function GET(request:NextRequest){
 const session=await githubSession(request.headers);
 if(!session)return NextResponse.redirect(new URL("/login?next=%2Fprofile",request.url));
 const config=githubAppConfig();
 if(!config)return NextResponse.redirect(new URL("/profile?github=setup-needed",request.url));
 const {state,cookie}=createGitHubInstallState(session.user.id,session.identity.secret);
 const destination=new URL("https://github.com/apps/"+config.slug+"/installations/new");
 destination.searchParams.set("state",state);
 const response=NextResponse.redirect(destination);
 response.cookies.set(githubInstallCookieName(),cookie,{httpOnly:true,sameSite:"lax",secure:session.identity.origin.startsWith("https://"),path:"/api/github/callback",maxAge:600});
 return response;
}
