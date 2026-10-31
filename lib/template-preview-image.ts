import versionMap from "@/data/template-preview-versions.json";
const versions=versionMap as Record<string,string>;
export function getTemplatePreviewSrc(slug:string){
 const ext=slug==="digital-creators"?".png":".jpg";
 const rev=versions[slug];
 return "/template-previews/"+slug+ext+(rev?"?v="+encodeURIComponent(rev):"");
}
