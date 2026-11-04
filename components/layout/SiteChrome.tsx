"use client";
import type {ReactNode} from "react";
import {usePathname} from "next/navigation";
import {Navbar} from "@/components/layout/Navbar";
import {AuthSessionProvider} from "@/components/auth/AuthSessionProvider";
import {Footer} from "@/components/layout/Footer";
import {ContactDock} from "@/components/layout/ContactDock";
import {ExperienceEffects} from "@/components/experience/ExperienceEffects";
import {PageTransition} from "@/components/experience/PageTransition";
import {AthenaPointerResponse} from "@/components/experience/AthenaPointerResponse";
import {TemplateExperienceInfo} from "@/components/templates/TemplateExperienceInfo";
import {AthenaLanguageProvider} from "@/components/i18n/AthenaLanguageProvider";

export function SiteChrome({children}:{children:ReactNode}){
 const pathname=usePathname();
 const isAuthenticationPage=pathname==="/login"||pathname==="/signup"||pathname==="/forgot-password";
 if(pathname.startsWith("/template-demos/")){
  return <main id="main-content" className="template-demo-main">{children}<TemplateExperienceInfo slug={pathname.split("/")[2]}/></main>;
 }
 if(isAuthenticationPage){
  return <AthenaLanguageProvider><AuthSessionProvider>
   <Navbar/>
   <main id="main-content" className="athena-auth-main">{children}</main>
  </AuthSessionProvider></AthenaLanguageProvider>;
 }
 return <AthenaLanguageProvider><AuthSessionProvider>
  <Navbar/>
  <main id="main-content"><PageTransition>{children}</PageTransition></main>
  <Footer/>
  <ContactDock/>
  <ExperienceEffects/>
  <AthenaPointerResponse/>
 </AuthSessionProvider></AthenaLanguageProvider>;
}
