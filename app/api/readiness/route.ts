import {NextResponse} from "next/server";
import {isInquiryEnabled} from "@/lib/inquiry/config";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export function GET(){
 const ready=isInquiryEnabled();
 return NextResponse.json({
  status:ready?"configured":"blocked",
  intake:ready?"configured":"unavailable",
  verification:"configuration-only"
 },{status:ready?200:503,headers:{"Cache-Control":"no-store"}});
}
