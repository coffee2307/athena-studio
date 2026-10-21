import {createMetadata} from "@/lib/metadata";
import {AuthShell} from "@/components/auth/AuthShell";
import {AuthPanel} from "@/components/auth/AuthPanel";
import {AuthUnavailable} from "@/components/auth/AuthUnavailable";
import {authSettings} from "@/lib/auth/config";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Khôi phục mật khẩu",undefined,"/forgot-password"),robots:{index:false,follow:false}};
export default function Forgot(){
 return <AuthShell>{authSettings().enabled?<AuthPanel mode="forgot"/>:<AuthUnavailable/>}</AuthShell>;
}
