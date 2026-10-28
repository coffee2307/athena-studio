import Image from "next/image";
import type {Template} from "@/lib/templates";

const capturedHomepages=new Set(["digital-creators","creative-studio","architecture-studio","auto-showroom"]);
export function TemplatePreview({template,device="desktop"}:{template:Template;device?:"desktop"|"mobile"}){
 const extension=capturedHomepages.has(template.slug)?".png":".jpg";
 const screenshot="/template-previews/"+template.slug+extension+(template.slug==="auto-showroom"?"?v=20261029-p1-centered-orbit":"");
 return <div className="template-device-frame" data-device={device}>
  <div className="template-thumbnail">
   <div className="template-thumbnail-browser" aria-hidden="true"><span className="template-browser-dots"><i/><i/><i/></span><span>{template.slug}.preview</span><span>↗</span></div>
   <div className="template-thumbnail-screen"><Image className="template-thumbnail-image" src={screenshot} alt={(template.slug==="auto-showroom"?"Poster concept website ":"Ảnh chụp giao diện website ")+template.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1050px) 50vw, 33vw" priority={false}/></div>
  </div>
 </div>;
}
