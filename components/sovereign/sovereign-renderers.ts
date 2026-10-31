import type {ComponentType} from "react";
import type {SovereignSection,SovereignSlug} from "@/data/sovereign-site-registry";
import {Site as Sora} from "@/templates/creative-studio/src/components/Site";
import {Site as North} from "@/templates/modern-corporate/src/components/Site";
import {Site as Moc} from "@/templates/commerce-standard/src/components/Site";

import {Site as FashionArchiveSite} from "@/templates/fashion-archive/src/components/Site";
import {Site as SaasProductSite} from "@/templates/saas-product/src/components/Site";
import {Site as CampaignLandingSite} from "@/templates/campaign-landing/src/components/Site";
import {Site as HospitalityBookingSite} from "@/templates/hospitality-booking/src/components/Site";
import {Site as ArchitectureStudioSite} from "@/templates/architecture-studio/src/components/Site";
import {Site as WellnessClinicSite} from "@/templates/wellness-clinic/src/components/Site";
import {Site as PropertyShowcaseSite} from "@/templates/property-showcase/src/components/Site";
import {Site as EducationPlatformSite} from "@/templates/education-platform/src/components/Site";
import {Site as PetStoreSite} from "@/templates/pet-store/src/components/Site";
import {Site as ConstructionFirmSite} from "@/templates/construction-firm/src/components/Site";

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
 "commerce-standard":Moc,
 "fashion-archive":FashionArchiveSite,
 "saas-product":SaasProductSite,
 "campaign-landing":CampaignLandingSite,
 "hospitality-booking":HospitalityBookingSite,
 "architecture-studio":ArchitectureStudioSite,
 "wellness-clinic":WellnessClinicSite,
 "property-showcase":PropertyShowcaseSite,
 "education-platform":EducationPlatformSite,
 "pet-store":PetStoreSite,
 "construction-firm":ConstructionFirmSite
};
