import {NextResponse,type NextRequest} from "next/server";
import type {EmailOtpType} from "@supabase/supabase-js";
import {serverAuthClient} from "@/lib/auth/server";
import {authSettings} from "@/lib/auth/config";
const accepted=["email","signup","recovery","invite","magiclink"] as const;
export async function GET(request:NextRequest){
 const settings=authSettings();
 if(!settings.enabled)return NextResponse.redirect(new URL("/dang-nhap?notice=unavailable",request.url));
 const token=request.nextUrl.searchParams.get("token_hash");
 const type=request.nextUrl.searchParams.get("type");
 if(!token||token.length>2048||!type||!accepted.includes(type as (typeof accepted)[number]))
  return NextResponse.redirect(new URL("/dang-nhap?notice=invalid",settings.origin));
 const client=await serverAuthClient();
 if(!client)return NextResponse.redirect(new URL("/dang-nhap?notice=unavailable",settings.origin));
 const {error}=await client.auth.verifyOtp({token_hash:token,type:type as EmailOtpType});
 if(error)return NextResponse.redirect(new URL("/dang-nhap?notice=invalid",settings.origin));
 return NextResponse.redirect(new URL(type==="recovery"?"/tai-khoan/doi-mat-khau":"/tai-khoan",settings.origin));
}
