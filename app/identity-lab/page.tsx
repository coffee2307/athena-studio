import {notFound} from "next/navigation";
import {IndependentIdentityLab} from "@/components/auth/IndependentIdentityLab";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {gmailSecretsFromEnv} from "@/lib/identity/gmail";
export const dynamic="force-dynamic";
export const metadata={title:"Athena Identity Lab — chỉ dành cho localhost",robots:{index:false,follow:false}};
export default function IdentityLab(){
 const config=standaloneIdentityConfig();
 // In production/staging this route must remain indistinguishable from a 404.
 if(!config)notFound();
 return <main className="identity-lab-page"><IndependentIdentityLab
  googleEnabled={!!config.google}
  githubEnabled={!!config.github}
  otpEnabled={!!gmailSecretsFromEnv()}
 /></main>;
}
