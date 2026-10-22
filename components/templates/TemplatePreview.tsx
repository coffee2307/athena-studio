import Image from "next/image";
import type {Template} from "@/lib/templates";

export function TemplatePreview({template,device="desktop"}:{template:Template;device?:"desktop"|"mobile"}){
 return <div className="template-device-frame" data-device={device}>
  <div className={"template-thumbnail template-thumbnail-"+template.variant}>
   <Image className="template-thumbnail-image" src={template.images[0]} alt="" fill sizes="(max-width: 600px) 100vw, 40vw"/>
   <span className="template-thumbnail-shade"/>
   <span className="template-thumbnail-brand">{template.industry.toLocaleUpperCase("vi")} / ATHENA</span>
   <span className="template-thumbnail-copy"><small>{template.style}</small><strong>{template.title}</strong><em>{template.purpose}</em></span>
   <span className="template-thumbnail-open">TRẢI NGHIỆM ↗</span>
  </div>
 </div>;
}
