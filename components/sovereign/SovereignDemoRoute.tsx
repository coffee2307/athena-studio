import {notFound,redirect} from "next/navigation";
import {findSovereignSite} from "@/data/sovereign-site-registry";
import type {SovereignSection} from "@/data/sovereign-site-registry";
import {sovereignRenderers} from "@/components/sovereign/sovereign-renderers";
import {LegacyWorldSiteAdapter} from "@/components/sovereign/LegacyWorldSiteAdapter";

/** Infra-only dispatch. No shared site layout or visual primitives. */
export function SovereignDemoRoute({slug,section="home",itemIndex,embedded}:{
 slug:string;section?:SovereignSection;itemIndex?:number;embedded?:boolean;
}){
 const site=findSovereignSite(slug);
 if(!site)notFound();
 if(site.stage==="native-static"){
  // The independent Digital Creators site owns its own React/Vite UI.
  redirect("/immersive/digital-creators/index.html");
 }
 if(site.stage==="legacy")return <LegacyWorldSiteAdapter slug={slug} section={section} itemIndex={itemIndex} embedded={embedded}/>;
 const renderer=sovereignRenderers[slug as keyof typeof sovereignRenderers];
 if(!renderer)throw new Error("Sovereign template has no independent renderer: "+slug);
 return renderer({section,itemIndex,embedded});
}
