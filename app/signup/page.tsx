import {createMetadata} from "@/lib/metadata";
import {AuthShell} from "@/components/auth/AuthShell";
import {AuthPanel} from "@/components/auth/AuthPanel";
import {AuthUnavailable} from "@/components/auth/AuthUnavailable";
import {authSettings} from "@/lib/auth/config";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {LocalPasswordAuth} from "@/components/auth/LocalPasswordAuth";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Đăng ký tài khoản",undefined,"/signup"),robots:{index:false,follow:false}};
export default function Register(){
 const settings=authSettings();
 const identity=standaloneIdentityConfig();
 return <AuthShell>{identity&&(identity.localPassword||identity.github||identity.google)?<LocalPasswordAuth mode="signup" expectedOrigin={identity.origin} passwordEnabled={identity.localPassword===true} googleEnabled={Boolean(identity.google)} githubEnabled={Boolean(identity.github)}/>:settings.enabled?<AuthPanel mode="signup" googleEnabled={process.env.NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED==="true"}/>:<AuthUnavailable/>}</AuthShell>;
}
