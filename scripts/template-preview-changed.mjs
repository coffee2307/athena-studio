/** Determine which gallery previews require regeneration for a commit range. */
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const active=new Set(JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8")).map(x=>x.slug));
const before=process.argv[2];
if(!before||/^0+$/.test(before)){console.log("all");process.exit(0);}
const diff=spawnSync("git",["diff","--name-only",before,"HEAD"],{encoding:"utf8"});
if(diff.status!==0){console.log("all");process.exit(0);}
const files=diff.stdout.split(/\r?\n/).filter(Boolean);
const selected=new Set();
let full=false;
for(const file of files){
 const match=file.match(/^(?:templates|public\/sovereign|public\/template-demos)\/([^/]+)\//);
 if(match&&active.has(match[1])){selected.add(match[1]);continue;}
 if(file.startsWith("vendor/digital-creators/")||file.startsWith("public/immersive/digital-creators/")){selected.add("digital-creators");continue;}
 if(file.startsWith("public/models/")||file.startsWith("components/immersive/")||file==="components/templates/WorldSite.tsx"||file==="components/templates/WorldImmersiveHome.tsx"||file==="app/auto-showroom-minimal.css"){selected.add("auto-showroom");continue;}
 if(file==="app/template-navigation-identities.css"||file==="app/template-worlds.css")full=true;
 if(/^(?:app\/template-demos\/|components\/sovereign\/|app\/template-demo\.css$|data\/templates\.json$|data\/sovereign-site-registry\.ts$|\.github\/workflows\/template-previews-auto\.yml$)/.test(file))full=true;
}
console.log(full?"all":selected.size?[...selected].join(","):"none");
