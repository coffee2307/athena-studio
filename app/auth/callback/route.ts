import {NextResponse,type NextRequest} from "next/server";
import {serverAuthClient} from "@/lib/auth/server";
import {authSettings,allowedDestination} from "@/lib/auth/config";
export async function GET(request:NextRequest){
 const settings=authSettings();
 if(!settings.enabled)return NextResponse.redirect(new URL("/dang-nhap?notice=unavailable",request.url));
 const code=request.nextUrl.searchParams.get("code");
 const next=allowedDestination(request.nextUrl.searchParams.get("next"));
 if(!code||code.length>2048)return NextResponse.redirect(new URL("/dang-nhap?notice=invalid",settings.origin));
 const supabase=await serverAuthClient();
 if(!supabase)return NextResponse.redirect(new URL("/dang-nhap?notice=unavailable",settings.origin));
 const {error}=await supabase.auth.exchangeCodeForSession(code);
 if(error)return NextResponse.redirect(new URL("/dang-nhap?notice=invalid",settings.origin));
 return NextResponse.redirect(new URL(next,settings.origin));
}
