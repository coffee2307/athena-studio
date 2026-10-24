import registry from "@/data/templates.json";
export type Template = {
 slug:string;title:string;category:string;industry:string;style:string;purpose:string;
 description:string;variant:"portfolio"|"corporate"|"commerce"|"fashion"|"saas"|"campaign"|"hospitality"|"editorial"|"architecture"|"wellness"|"property"|"education"|"petshop"|"automotive"|"industrial"|"finance"|"construction"|"music"|"concert"|"intranet"|"immersive";
 tags:string[];pages:string[];features:string[];modules:string[];version:string;status:"interactive-demo";
 compatibility:{starter:string;next:string;react:string};
 estimatedPrice:string;qualityTier:string;demoPath:string;images:string[];
 reference:{name:string;url:string;license:"MIT"|"Owner project"};
};
export const templates=registry as Template[];
export function getTemplate(slug:string){return templates.find(template=>template.slug===slug);}
export const templateIndustries=Array.from(new Set(templates.map(template=>template.industry))).sort((a,b)=>a.localeCompare(b,"vi"));
export const templateStyles=Array.from(new Set(templates.map(template=>template.style))).sort((a,b)=>a.localeCompare(b,"vi"));
