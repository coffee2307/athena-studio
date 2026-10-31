import type {ReactNode} from "react";
import type {SovereignSection,SovereignSlug} from "@/data/sovereign-site-registry";

/**
 * P2/P3 integration surface: one renderer per physically isolated template.
 * A completed template must be registered here and its stage changed to "sovereign".
 * Do not import WorldSite, WorldExperiencePages, WorldMotion or any shared UI here.
 * Missing renderers fail closed rather than showing a generic/shared substitute.
 */
export type IndependentPageProps={
 section:SovereignSection;
 itemIndex?:number;
 embedded?:boolean;
};
export type IndependentRenderer=(props:IndependentPageProps)=>ReactNode;
export const sovereignRenderers:Partial<Record<SovereignSlug,IndependentRenderer>>={};
