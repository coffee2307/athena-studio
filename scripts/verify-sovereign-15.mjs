import fs from "node:fs";
import path from "node:path";
const p=process.cwd();
const templates=JSON.parse(fs.readFileSync(path.join(p,"data/templates.json"),"utf8"));
const expected="creative-studio modern-corporate commerce-standard fashion-archive saas-product campaign-landing hospitality-booking architecture-studio wellness-clinic property-showcase education-platform pet-store auto-showroom construction-firm digital-creators".split(" ");
if(templates.length!==15||new Set(templates.map(t=>t.slug)).size!==15||expected.some(x=>!templates.some(t=>t.slug===x)))throw Error("Catalog is not canonical 15.");
const routes=fs.readFileSync(path.join(p,"components/sovereign/SovereignDemoRoute.tsx"),"utf8");
const registry=fs.readFileSync(path.join(p,"data/sovereign-site-registry.ts"),"utf8");
const renderers=fs.readFileSync(path.join(p,"components/sovereign/sovereign-renderers.ts"),"utf8");
if(routes.includes("LegacyWorldSiteAdapter")||registry.includes('stage:"legacy"'))throw Error("Legacy shared shell remains active.");
for(const slug of expected){
if(!registry.includes('"'+slug+'"'))throw Error("Missing registry: "+slug);
if(slug==="saas-product"||slug==="digital-creators")continue;
const dir=path.join(p,"templates",slug,"src/components");
const source=fs.readFileSync(path.join(dir,"Site.tsx"),"utf8");
if(!fs.readdirSync(dir).some(x=>x.endsWith(".module.css")))throw Error("Missing isolated stylesheet: "+slug);
for(const match of source.matchAll(/from\s+["']([^"']+)["']/g)){
const imp=match[1];if(imp.startsWith("@/templates/")&&!imp.startsWith("@/templates/"+slug+"/"))throw Error("Cross template dependency: "+slug+" "+imp);
if(imp.startsWith("@/components/templates/"))throw Error("Shared visual shell dependency: "+slug+" "+imp);
}
if(!renderers.includes('"'+slug+'":'))throw Error("Missing direct renderer: "+slug);
}
console.log("PASS 15 independent demos; all Next sites own their visual renderer and CSS.");
