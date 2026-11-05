"use client";
import {useAuthSession} from "@/components/auth/AuthSessionProvider";
import {SessionNavigation} from "@/components/auth/SessionNavigation";
import {ConsultationCTA} from "@/components/layout/ConsultationCTA";
import {AthenaLanguageSwitch} from "@/components/i18n/AthenaLanguageProvider";

/** Keep the language control immediately before account actions in either session state. */
export function HeaderAccountActions(){
 const {status}=useAuthSession();
 return <div className="agency-nav-actions">
  <AthenaLanguageSwitch/>
  <SessionNavigation/>
  {status==="anonymous"&&<ConsultationCTA className="agency-primary-cta" label="Yêu cầu tư vấn" iconSize={17}/>}
 </div>;
}
export function MobileConsultationAction(){
 const {status}=useAuthSession();
 return status==="authenticated"?null:<ConsultationCTA className="agency-mobile-cta" label="Gửi yêu cầu tư vấn" iconSize={18}/>;
}
