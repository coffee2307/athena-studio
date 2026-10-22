"use client";
import type {ReactNode} from "react";
import {usePathname} from "next/navigation";
import {Navbar} from "@/components/layout/Navbar";
import {AuthSessionProvider} from "@/components/auth/AuthSessionProvider";
import {Footer} from "@/components/layout/Footer";
import {ContactDock} from "@/components/layout/ContactDock";
import {ExperienceEffects} from "@/components/experience/ExperienceEffects";
import {PageTransition} from "@/components/experience/PageTransition";

export function SiteChrome({children}:{children:ReactNode}){
 const pathname=usePathname();
 const isAuthenticationPage=pathname==="/login"||pathname==="/signup"||pathname==="/forgot-password";
 if(isAuthenticationPage){
  return <AuthSessionProvider>
   <Navbar/>
   <main id="main-content" className="athena-auth-main">{children}</main>
  </AuthSessionProvider>;
 }
 return <AuthSessionProvider>
  <Navbar/>
  <main id="main-content"><PageTransition>{children}</PageTransition></main>
  <Footer/>
  <ContactDock/>
  <ExperienceEffects/>
 </AuthSessionProvider>;
}
