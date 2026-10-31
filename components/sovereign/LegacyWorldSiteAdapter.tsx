import {WorldSite} from "@/components/templates/WorldSite";
import type {SovereignSection} from "@/data/sovereign-site-registry";

/** Transitional compatibility ONLY. This file is the sole authorized old-UI boundary.
 * 20 templates still render the old shell until each own-site replacement is verified.
 * Do not reuse this adapter for any newly developed sovereign UI.
 */
export function LegacyWorldSiteAdapter({slug,section,itemIndex,embedded}:{
 slug:string;section:SovereignSection;itemIndex?:number;embedded?:boolean;
}){
 return <WorldSite slug={slug} section={section} itemIndex={itemIndex} embedded={embedded}/>;
}
