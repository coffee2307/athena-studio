"use client";
import Image,{type ImageProps} from "next/image";
import {useAthenaLanguage} from "@/components/i18n/AthenaLanguageProvider";
import {getTemplatePreviewSrc} from "@/lib/template-preview-image";

/** Keep image assets in sync with Athena's language control, including embedded text. */
export function LocalizedTemplateImage({
 slug,altVi,altEn,...props
}:{slug:string;altVi:string;altEn:string}&Omit<ImageProps,"src"|"alt">){
 const {language}=useAthenaLanguage();
 return <Image {...props} key={slug+"-"+language} src={getTemplatePreviewSrc(slug,language)}
  alt={language==="en"?altEn:altVi}/>;
}
