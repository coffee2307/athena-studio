/** P1 regression: all existing demo URLs must survive technical route handoff. */
import {readFileSync} from "node:fs";
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const registry=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8"));
const slugs=registry.filter(t=>t.slug!=="digital-creators").map(t=>t.slug);
const stages=new Map([...readFileSync(new URL("../data/sovereign-site-registry.ts",import.meta.url),"utf8").matchAll(/^ "([^"]+)":\{stage:"([^"]+)"/gm)].map(m=>[m[1],m[2]]));
const urls=slugs.flatMap(slug=>[
 {slug,url:"/template-demos/"+slug},
 ...["work","services","about","contact"].map(section=>({slug,url:"/template-demos/"+slug+"/"+section})),
 {slug,url:"/template-demos/"+slug+"/work/1"}
]);
urls.push({slug:"digital-creators",url:"/template-demos/digital-creators"});
for(const slug of ["creative-studio","commerce-standard"])for(const i of [4,5])urls.push({slug,url:"/template-demos/"+slug+"/work/"+i});
let failures=[];
for(let offset=0;offset<urls.length;offset+=10){
 await Promise.all(urls.slice(offset,offset+10).map(async item=>{
  try{
   const res=await fetch(base+item.url,{redirect:"follow",signal:AbortSignal.timeout(12000)});
   if(res.status!==200)throw Error("HTTP "+res.status);
   const html=await res.text();
   if(stages.get(item.slug)==="legacy"&&!html.includes("world-site"))throw Error("Legacy fallback missing while awaiting migration");
   if(stages.get(item.slug)==="sovereign"&&html.includes('class="world-site'))throw Error("Sovereign route leaked shared WorldSite");
   if(item.slug==="digital-creators"&&!html.includes("digital-creators"))throw Error("Digital Creators native site unavailable");
  }catch(e){failures.push({url:item.url,error:String(e)});}
 }));
}
console.log("SOVEREIGN_ROUTE_SMOKE",JSON.stringify({tested:urls.length,failures}));
if(failures.length)process.exitCode=1;
