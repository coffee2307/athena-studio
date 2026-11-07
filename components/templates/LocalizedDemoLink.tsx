"use client";
import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";

const excluded=new Set(["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"]);
export function LocalizedDemoLink({slug,href}:{slug:string;href:string}){
 const {language}=useAthenaLanguage();
 const destination=excluded.has(slug)?href:href+(href.includes("?")?"&":"?")+"lang="+language;
 return <Link href={destination} className="pill-link pill-dark" target="_blank" rel="noopener noreferrer">
  Mở demo toàn trang <Icon name="arrow-right" size={18}/>
 </Link>;
}
