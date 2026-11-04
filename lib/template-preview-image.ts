import versionMap from "@/data/template-preview-versions.json";
const versions=versionMap as Record<string,string>;
export function getTemplatePreviewSrc(slug:string,language:"vi"|"en"="vi"){
 const supported=new Set(["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","architecture-studio","auto-showroom","digital-creators"]);
 if(supported.has(slug)){
  const rev=versions[slug+"-"+language];
  return "/template-previews/"+slug+"-"+language+".jpg"+(rev?"?v="+encodeURIComponent(rev):"");
 }
 const ext=slug==="digital-creators"?".png":".jpg";
 const rev=versions[slug];
 return "/template-previews/"+slug+ext+(rev?"?v="+encodeURIComponent(rev):"");
}
