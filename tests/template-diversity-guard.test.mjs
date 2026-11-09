import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {join,extname} from "node:path";
import {createHash} from "node:crypto";
const read=path=>readFileSync(path,"utf8");
const forbidden=String.fromCharCode(0x2197);
const sourceExt=new Set([".ts",".tsx",".jsx",".js",".css",".json",".html",".svg"]);
const omitted=new Set(["node_modules",".next",".git",".qa","dist","build"]);
function scan(dir,out=[]){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  if(omitted.has(item.name)||item.name.startsWith(".next"))continue;
  const file=join(dir,item.name);
  if(item.isDirectory())scan(file,out);
  else if(sourceExt.has(extname(item.name))&&read(file).includes(forbidden))out.push(file);
 }
 return out;
}
test("Athena authored UI and template locales contain no forbidden diagonal action glyph",()=>{
 const violations=["app","components","templates","data","lib","public"].flatMap(root=>scan(root));
 assert.deepEqual(violations,[],"Disallowed glyph found in authored frontend: "+violations.join(", "));
});
test("Distinct standalone templates use different hero structures and interaction metaphors",()=>{
 const pet=read("templates/pet-store/src/components/Site.tsx");
 const petStyle=read("templates/pet-store/src/components/pets-sovereign.module.css");
 const architecture=read("templates/architecture-studio/src/components/ArchitectureExperience.tsx");
 const archStyle=read("templates/architecture-studio/src/components/architecture-experience.module.css");
 const hospitality=read("templates/hospitality-booking/src/components/Site.tsx");
 const hosStyle=read("templates/hospitality-booking/src/components/hospitality-sovereign.module.css");
 const campaign=read("templates/campaign-landing/src/components/Site.tsx");
 assert.match(pet,/className=\{style\.poppyChips\}/);
 assert.match(pet,/aria-pressed=\{selected===i\}/);
 assert.match(petStyle,/grid-template-areas:"eyebrow" "picture" "copy" "ticker"/);
 assert.match(petStyle,/POPPY V3 \/ expressive pet-zine/);
 assert.match(architecture,/className=\{s\.heroCrosshair\}/);
 assert.match(archStyle,/FORMA V3 \/ technical monograph/);
 assert.match(archStyle,/background-size:46px 46px/);
 assert.match(hospitality,/className=\{s\.photoControls\}/);
 assert.match(hosStyle,/BẾP & CHUYỆN V3 \/ restaurant storytelling/);
 assert.match(hosStyle,/grid-row:2;z-index:4/);
 assert.match(campaign,/className=\{s\.posterChapterButtons\}/);
 for(const [name,src] of [["pet",petStyle],["architecture",archStyle],["hospitality",hosStyle]])assert.match(src,/@media\(prefers-reduced-motion:reduce\)/,name+" must respect reduced motion");
});
test("Template style metadata identifies different archetypes, not an interchangeable shell",()=>{
 const registry=JSON.parse(read("data/templates.json"));
 const names=["pet-store","architecture-studio","hospitality-booking","campaign-landing","fashion-archive","modern-corporate","creative-studio"];
 const values=names.map(slug=>{
  const item=registry.find(e=>e.slug===slug);
  assert.ok(item&&item.description);
  assert.ok(item.style);
  return item.style;
 });
 assert.equal(new Set(values).size,values.length,"Different industries must not share a generic style");
 for(const slug of ["pet-store","architecture-studio","hospitality-booking"]){
  const item=registry.find(e=>e.slug===slug);
  assert.equal(item.version,"4.0.0");
  assert.equal(item.features.length,5);
 }
});

test("Four redesigned galleries use fresh localized covers with matching cache fingerprints",()=>{
 const versions=JSON.parse(read("data/template-preview-versions.json"));
 for(const slug of ["pet-store","architecture-studio","hospitality-booking","campaign-landing"]){
  for(const locale of ["","-vi","-en"]){
   const key=slug+locale;
   const bytes=readFileSync("public/template-previews/"+key+".jpg");
   assert.ok(bytes.length>50000,key+" missing real photographic cover");
   assert.equal(versions[key],createHash("sha256").update(bytes).digest("hex").slice(0,16),key+" stale version");
  }
  assert.deepEqual(readFileSync("public/template-previews/"+slug+".jpg"),readFileSync("public/template-previews/"+slug+"-vi.jpg"),slug+" default and VI mismatch");
 }
});
