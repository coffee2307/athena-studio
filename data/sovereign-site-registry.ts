/** ATHENA-21-SOVEREIGN/v2.0 — technical routing registry only.
 * No typography, header, button, footer, modal, motion or component styling lives here.
 * Stage reflects the ACTUAL demo implementation, not its desired future status.
 */
export const sovereignSites = {
 "creative-studio":{stage:"sovereign",archetype:"living-editorial",owner:"SORA"},
 "modern-corporate":{stage:"sovereign",archetype:"capability-navigation",owner:"NORTH"},
 "commerce-standard":{stage:"sovereign",archetype:"tactile-storefront",owner:"MOC"},
 "fashion-archive":{stage:"legacy",archetype:"fashion-archive",owner:"FASHION"},
 "saas-product":{stage:"legacy",archetype:"product-workspace",owner:"LUMA"},
 "campaign-landing":{stage:"legacy",archetype:"campaign-poster",owner:"CAMPAIGN"},
 "hospitality-booking":{stage:"legacy",archetype:"restaurant-booking",owner:"HOSPITALITY"},
 "editorial-journal":{stage:"legacy",archetype:"digital-publication",owner:"FIELDNOTES"},
 "architecture-studio":{stage:"legacy",archetype:"architectural-gallery",owner:"ARCHITECTURE"},
 "wellness-clinic":{stage:"legacy",archetype:"care-journey",owner:"WELLNESS"},
 "property-showcase":{stage:"legacy",archetype:"property-exploration",owner:"PROPERTY"},
 "education-platform":{stage:"legacy",archetype:"learning-paths",owner:"EDUCATION"},
 "pet-store":{stage:"legacy",archetype:"pet-commerce",owner:"POPPY"},
 "auto-showroom":{stage:"legacy",archetype:"cinematic-webgl",owner:"BLACK-VELOCITY"},
 "engineering-industry":{stage:"legacy",archetype:"engineering-specs",owner:"FORGE"},
 "finance-trust":{stage:"legacy",archetype:"financial-explanation",owner:"ATLAS"},
 "construction-firm":{stage:"legacy",archetype:"construction-progress",owner:"TERRACON"},
 "music-label":{stage:"legacy",archetype:"record-sleeves",owner:"ECHO"},
 "live-concert":{stage:"legacy",archetype:"live-poster",owner:"NEON-LIVE"},
 "team-intranet":{stage:"legacy",archetype:"internal-workspace",owner:"ORBIT"},
 "digital-creators":{stage:"native-static",archetype:"creative-club-webgl",owner:"DIGITAL-CREATORS"}
} as const;
export type SovereignSlug = keyof typeof sovereignSites;
export type SovereignStage = "legacy"|"native-static"|"sovereign";
export type SovereignSection = "home"|"work"|"services"|"about"|"contact"|"detail";
export function findSovereignSite(slug:string){
 return Object.prototype.hasOwnProperty.call(sovereignSites,slug)
  ? sovereignSites[slug as SovereignSlug]
  : null;
}
