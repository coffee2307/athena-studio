import Image from "next/image";
import type {Template} from "@/lib/templates";

export function TemplatePreview({template,device="desktop"}:{template:Template;device?:"desktop"|"mobile"}){
 const screenshot=template.slug==="digital-creators"
  ?"/template-previews/digital-creators.png"
  :"/template-previews/"+template.slug+".jpg";
 return <div className="template-device-frame" data-device={device}>
  <div className="template-thumbnail">
   <div className="template-thumbnail-browser" aria-hidden="true"><span className="template-browser-dots"><i/><i/><i/></span><span>{template.slug}.preview</span><span>↗</span></div>
   <div className="template-thumbnail-screen"><Image className="template-thumbnail-image" src={screenshot} alt={"Ảnh chụp thật website demo "+template.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1050px) 50vw, 33vw" priority={false}/></div>
  </div>
 </div>;
}
