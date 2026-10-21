import {createMetadata} from "@/lib/metadata";
import {AuthShell} from "@/components/auth/AuthShell";
import {AuthPanel} from "@/components/auth/AuthPanel";
import {AuthUnavailable} from "@/components/auth/AuthUnavailable";
import {authSettings} from "@/lib/auth/config";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Đăng ký tài khoản",undefined,"/dang-ky"),robots:{index:false,follow:false}};
export default function Register(){
 const settings=authSettings();
 return <AuthShell>{settings.enabled?<AuthPanel mode="signup" googleEnabled={process.env.NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED==="true"}/>:<AuthUnavailable/>}</AuthShell>;
}
