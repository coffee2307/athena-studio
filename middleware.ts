import {createServerClient} from "@supabase/ssr";
import {NextResponse,type NextRequest} from "next/server";
import {authSettings,allowedDestination} from "@/lib/auth/config";
export async function middleware(request:NextRequest){
 const settings=authSettings();
 const privateArea=request.nextUrl.pathname.startsWith("/account")||request.nextUrl.pathname.startsWith("/admin");
 if(!settings.enabled){
  if(privateArea)return NextResponse.redirect(new URL("/login?notice=unavailable",request.url));
  return NextResponse.next();
 }
 let response=NextResponse.next({request});
 const supabase=createServerClient(settings.url,settings.key,{
  cookieOptions:{sameSite:"lax",secure:new URL(settings.origin).protocol==="https:",path:"/"},
  cookies:{
   getAll(){return request.cookies.getAll();},
   setAll(items){
    items.forEach(({name,value})=>request.cookies.set(name,value));
    response=NextResponse.next({request});
    items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
   }
  }
 });
 // Revalidates the bearer with Auth server; never trust unverified local session claims.
 const {data:{user},error}=await supabase.auth.getUser();
 if(privateArea&&(error||!user||!user.email_confirmed_at)){
  const dest=allowedDestination(request.nextUrl.pathname);
  const target=new URL("/login",request.url);
  target.searchParams.set("next",dest);
  // Do not forward untrusted access cookies to unrelated domains.
  const redirectResponse=NextResponse.redirect(target);
  response.cookies.getAll().forEach(cookie=>redirectResponse.cookies.set(cookie));
  return redirectResponse;
 }
 return response;
}
export const config={matcher:["/account/:path*","/admin/:path*","/auth/:path*"]};
