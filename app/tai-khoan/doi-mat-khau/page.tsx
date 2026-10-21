import {createMetadata} from "@/lib/metadata";
import {AuthShell} from "@/components/auth/AuthShell";
import {AuthPanel} from "@/components/auth/AuthPanel";
import {requireUser} from "@/lib/auth/authorization";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Đổi mật khẩu"),robots:{index:false,follow:false}};
export default async function ChangePassword(){
 await requireUser();
 return <AuthShell><AuthPanel mode="password"/></AuthShell>;
}
