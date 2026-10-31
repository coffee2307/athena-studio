import type {ComponentType} from "react";
import type {SovereignSection,SovereignSlug} from "@/data/sovereign-site-registry";
import {Site as Sora} from "@/templates/creative-studio/src/components/Site";
import {Site as North} from "@/templates/modern-corporate/src/components/Site";
import {Site as Moc} from "@/templates/commerce-standard/src/components/Site";

/** Only technical site dispatch; never export shared headers, buttons, page shells or motion. */
export type IndependentPageProps={
 section:SovereignSection;
 itemIndex?:number;
 embedded?:boolean;
 basePath?:string;
 assetBase?:string;
};
export type IndependentRenderer=ComponentType<IndependentPageProps>;
export const sovereignRenderers:Partial<Record<SovereignSlug,IndependentRenderer>>={
 "creative-studio":Sora,
 "modern-corporate":North,
 "commerce-standard":Moc
};
