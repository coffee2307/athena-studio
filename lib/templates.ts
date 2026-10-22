import registry from "@/data/templates.json";

export type Template = {
 slug:string; title:string; category:string; industry:string; style:string; purpose:string;
 description:string; variant:"portfolio"|"corporate"|"commerce"|"fashion"|"saas"|"campaign"|"hospitality"|"editorial";
 tags:string[]; pages:string[]; features:string[]; modules:string[]; version:string; status:"preview";
 compatibility:{starter:string;next:string;react:string};
};
export const templates=registry as Template[];
export function getTemplate(slug:string){return templates.find(template=>template.slug===slug);}
export const templateIndustries=Array.from(new Set(templates.map(template=>template.industry))).sort((a,b)=>a.localeCompare(b,"vi"));
export const templateStyles=Array.from(new Set(templates.map(template=>template.style))).sort((a,b)=>a.localeCompare(b,"vi"));
