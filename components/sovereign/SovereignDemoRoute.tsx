import {createElement} from "react";
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
 if(slug==="digital-creators"&&site.stage==="sovereign"){
  // Native Vite/Three.js owns all of its independent UI; the Next demo is a technical redirect only.
  redirect("/immersive/digital-creators/index.html");
 }
 if(site.stage==="legacy")return <LegacyWorldSiteAdapter slug={slug} section={section} itemIndex={itemIndex} embedded={embedded}/>;
 const renderer=sovereignRenderers[slug as keyof typeof sovereignRenderers];
 if(!renderer)throw new Error("Sovereign template has no independent renderer: "+slug);
 return createElement(renderer,{section,itemIndex,embedded,basePath:"/template-demos/"+slug,assetBase:"/sovereign/"+slug});
}
