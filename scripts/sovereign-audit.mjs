/**
 * ATHENA-21-SOVEREIGN/v2.0 — audit + fail-closed release guard.
 * --check: migration infrastructure contract (P1)
 * --strict: no legacy UI and no identical standalone UI allowed (P5 release)
 * --out=path: write reproducible SHA-based audit report (read-only to site code)
 */
import {readFileSync,existsSync,readdirSync,mkdirSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {resolve,join,relative,dirname} from "node:path";
const root=resolve(import.meta.dirname,"..");
const mode=process.argv.includes("--strict")?"strict":"check";
const outputArg=process.argv.find(x=>x.startsWith("--out="));
const templates=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8"));
const registrySource=readFileSync(join(root,"data/sovereign-site-registry.ts"),"utf8");
const known=[...registrySource.matchAll(/^ "([^"]+)":\{stage:"([^"]+)",archetype:"([^"]+)",owner:"([^"]+)"\}/gm)].map(m=>({slug:m[1],stage:m[2],archetype:m[3],owner:m[4]}));
const failures=[],debt=[];
const hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
const allFiles=path=>!existsSync(path)?[]:readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(join(path,e.name)):[join(path,e.name)]);
if(templates.length!==21||known.length!==21)failures.push("Expected 21 unique registered templates and sovereign stages");
if(new Set(known.map(x=>x.slug)).size!==21)failures.push("Duplicate sovereign registry slugs");
if(JSON.stringify([...templates.map(x=>x.slug)].sort())!==JSON.stringify([...known.map(x=>x.slug)].sort()))failures.push("Sovereign registry does not match canonical template catalog");
const routePaths=[
 "app/template-demos/[slug]/page.tsx",
 "app/template-demos/[slug]/[section]/page.tsx",
 "app/template-demos/[slug]/work/[item]/page.tsx"
];
for(const path of routePaths){
 const content=readFileSync(join(root,path),"utf8");
 if(!content.includes("SovereignDemoRoute")||content.includes("WorldSite"))failures.push("Public demo route still directly owns shared UI: "+path);
}
const adapter="components/sovereign/LegacyWorldSiteAdapter.tsx";
if(!readFileSync(join(root,adapter),"utf8").includes('from "@/components/templates/WorldSite"'))failures.push("Missing isolated transitional adapter");
const router="components/sovereign/SovereignDemoRoute.tsx";
if(readFileSync(join(root,router),"utf8").includes('from "@/components/templates/WorldSite"'))failures.push("Sovereign technical router must not import legacy UI directly");
const rendererSource=readFileSync(join(root,"components/sovereign/sovereign-renderers.ts"),"utf8");
const rendererImports=[...rendererSource.matchAll(/from ["']@\/templates\/([^/]+)\/src\/components\/Site["']/g)].map(m=>m[1]);
if(new Set(rendererImports).size!==rendererImports.length)failures.push("Same standalone site is imported under multiple renderers");
for(const site of known){
 if(site.stage!=="sovereign"||site.slug==="digital-creators")continue;
 if(!rendererImports.includes(site.slug))failures.push("Sovereign site does not import its own standalone Site: "+site.slug);
 if(!rendererSource.includes('"'+site.slug+'":'))failures.push("Sovereign site missing renderer registration: "+site.slug);
}
const forbidden=["WorldSite","WorldMotion","WorldExperiencePages","world-header-cta","world-footer","world-btn"];
const rows=known.map(site=>{
 const path=join(root,"templates",site.slug);
 const isNative=site.slug==="digital-creators"&&site.stage==="sovereign";
 const src=isNative?join(path,"src/App.tsx"):join(path,"src/components/Site.tsx");
 const scopedCss=existsSync(src)?readFileSync(src,"utf8").match(/import\s+\w+\s+from\s+["']\.\/([^"']+\.module\.css)["']/)?.[1]:undefined;
 const css=isNative?join(path,"src/digital-navigation.css"):scopedCss?join(path,"src/components",scopedCss):join(path,"src/app/globals.css");
 const present=existsSync(src)&&existsSync(css)&&existsSync(join(path,"package.json"))&&existsSync(join(path,"template.manifest.json"));
 if(!present)failures.push("Template missing export essentials: "+site.slug);
 if(isNative){
  const pkg=existsSync(join(path,"package.json"))?JSON.parse(readFileSync(join(path,"package.json"),"utf8")):{};
  if(!existsSync(join(path,"vite.config.ts"))||!pkg.scripts?.build?.includes("vite"))failures.push("Digital Creators export must build as native Vite site");
  const parity=spawnSync(process.execPath,[join(root,"scripts/sovereign-digital-creators-sync.mjs"),"--check"],{cwd:root,encoding:"utf8"});
  if(parity.status!==0)failures.push("Digital Creators export source/asset parity failed: "+(parity.stdout||parity.stderr||"").slice(0,600));
 }
 const sourceHash=existsSync(src)?hash(src):null;
 const cssHash=existsSync(css)?hash(css):null;
 const sourceFiles=allFiles(join(path,"src")).filter(f=>/\.(?:tsx?|jsx?|css)$/.test(f));
 const forbiddenUi=sourceFiles.flatMap(f=>{
  const text=readFileSync(f,"utf8");
  return forbidden.filter(term=>text.includes(term)).map(term=>relative(root,f)+":"+term);
 });
 const diagonal=sourceFiles.reduce((n,f)=>n+readFileSync(f,"utf8").split(String.fromCharCode(0x2197)).length-1,0);
 const star=sourceFiles.reduce((n,f)=>n+readFileSync(f,"utf8").split(String.fromCharCode(0x2733)).length-1,0);
 if(star)failures.push("Forbidden glyph in "+site.slug);
 if(site.stage==="sovereign"&&forbiddenUi.length)failures.push("Forbidden shared UI in sovereign "+site.slug+": "+forbiddenUi.join(","));
 if(site.stage==="legacy")debt.push(site.slug+": demo still renders WorldSite compatibility shell");
 if(diagonal)debt.push(site.slug+": standalone export still has "+diagonal+" diagonal arrows");
 return {...site,sourceHash,cssHash,sourceFiles:sourceFiles.length,forbiddenUi,diagonal,present};
});
const duplicates=key=>{
 const groups=new Map();
 for(const site of rows){const h=site[key];if(!h)continue;groups.set(h,[...(groups.get(h)||[]),site.slug]);}
 return [...groups.values()].filter(group=>group.length>1);
};
const duplicateSourceGroups=duplicates("sourceHash"),duplicateCssGroups=duplicates("cssHash");
for(const group of duplicateSourceGroups)debt.push("Identical exported UI source: "+group.join(", "));
for(const group of duplicateCssGroups)debt.push("Identical exported style source: "+group.join(", "));
const stages=Object.fromEntries(["legacy","native-static","sovereign"].map(k=>[k,rows.filter(x=>x.stage===k).length]));
if(mode==="strict"){
 if(stages.legacy||stages["native-static"])failures.push("Strict sovereignty requires all 21 stages to be sovereign, including correct standalone export for Digital Creators");
 if(duplicateSourceGroups.length)failures.push("Strict sovereignty forbids identical exported UI files");
 if(duplicateCssGroups.length)failures.push("Strict sovereignty forbids identical exported CSS");
 if(rows.some(r=>r.diagonal))failures.push("Forbidden diagonal glyph remains in standalone export");
}
const result={planId:"ATHENA-21-SOVEREIGN/v2.0",phase:"P4-native-export",mode,stages,duplicateSourceGroups,duplicateCssGroups,debt,failures,rows};
if(outputArg){const path=resolve(process.cwd(),outputArg.slice(6));mkdirSync(dirname(path),{recursive:true});writeFileSync(path,JSON.stringify(result,null,2)+"\n");}
console.log("SOVEREIGN_AUDIT",JSON.stringify({mode,stages,duplicates:{source:duplicateSourceGroups,css:duplicateCssGroups},debt:debt.length,failures}));
if(failures.length)process.exitCode=1;
