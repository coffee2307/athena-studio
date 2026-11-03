import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync,readdirSync} from "node:fs";
const read=path=>readFileSync(path,"utf8");
const list=JSON.parse(read("data/templates.json"));
const slugs=list.map(x=>x.slug);
test("DNA04 About has its own interactive desk, separate from Process",()=>{
 const about=read("app/about/page.tsx");
 const process=read("app/process/page.tsx");
 assert.match(about,/AboutStudioDesk/);
 assert.match(about,/AboutPrinciples/);
 assert.doesNotMatch(about,/StudioHeroScene/);
 assert.match(process,/ProcessBlueprint/);
 assert.doesNotMatch(process,/StudioHeroScene/);
 assert.match(read("components/experience/AboutStudioDesk.tsx"),/onPointerMove/);
 assert.match(read("components/experience/ProcessBlueprint.tsx"),/IntersectionObserver/);
 assert.match(read("components/experience/ProcessBlueprint.tsx"),/requestedStage/);
});
test("all independent templates keep stable panels without cursor-driven tilt",()=>{
 for(const slug of slugs.filter(x=>x!=="digital-creators"&&x!=="auto-showroom")){
  const base="templates/"+slug+"/src/components/";
  const site=read(base+"Site.tsx");
  const cssfile=readdirSync(base).find(f=>f.endsWith(".module.css")&&f!=="FashionHero3D.module.css");
  assert.ok(cssfile,"Independent CSS required for "+slug);
  const css=read(base+cssfile);
  assert.doesNotMatch(site,/dna04Pointer|onPointerMove=\{dna04Pointer\}|onPointerOut=\{dna04PointerOut\}/,"Unwanted pointer-driven panel transforms in "+slug);
  assert.doesNotMatch(css,/--dna04-(?:shift|tilt|small-rotate|point)|transform:[^;{}]*rotate[XY]?\(var\(--dna04/,"Cursor-driven transforms must be absent in "+slug);
  if(slug==="modern-corporate"){
   assert.match(site,/className=\{s\.decisionPanel\}/);
   assert.match(css,/\.decisionPanel\{/);
  }else{
   assert.match(site,/data-dna04-artifact/,"Keep visual artifacts in "+slug);
   assert.match(css,/data-dna04-artifact/,"Keep hover/focus styling in "+slug);
  }
  assert.match(css,/prefers-reduced-motion/,"Reduced motion in "+slug);
 }
});

test("NORTH and MỘC own their dropdown components",()=>{
 for(const [slug,component] of [["modern-corporate","NorthSelector"],["commerce-standard","MocSelector"]]){
  assert.ok(existsSync("templates/"+slug+"/src/components/"+component+".tsx"));
  const source=read("templates/"+slug+"/src/components/Site.tsx");
  assert.ok(source.includes("import "+component));
  assert.doesNotMatch(source,/from "\.\.\/\.\.\/\.\.\/shared\/StyledSelect"/);
 }
});
test("all DNA04 skeleton experiments are removed without deleting existing loading routes",()=>{
 assert.equal(slugs.length,15);
 for(const slug of slugs.filter(x=>x!=="digital-creators")){
  const base="templates/"+slug+"/src/";
  for(const file of ["app/loading.tsx","components/Loading.tsx","components/Loading.module.css"]){
   assert.equal(existsSync(base+file),false,"Unexpected generated skeleton "+base+file);
  }
 }
 for(const path of ["components/experience/AthenaRouteSkeleton.tsx",
   "components/sovereign/SovereignLoadingRoute.tsx",
   "templates/digital-creators/src/components/SceneSkeleton.tsx",
   "templates/digital-creators/src/components/SceneSkeleton.css",
   "app/template-demos/[slug]/loading.tsx",
   "app/template-demos/[slug]/[section]/loading.tsx"]){
  assert.equal(existsSync(path),false,"Unexpected skeleton "+path);
 }
 for(const path of ["app/profile/loading.tsx","app/account/projects/loading.tsx","app/account/support/loading.tsx"])
  assert.ok(existsSync(path),"Original loader should be preserved "+path);
 const modal=read("components/templates/TemplateDemoModal.tsx");
 assert.doesNotMatch(modal,/SovereignLoadingRoute|dna04-iframe-loading/);
 assert.doesNotMatch(read("app/athena-dna04.css"),/dna04-route-loader|dna04-iframe-loading/);
 assert.doesNotMatch(read("templates/digital-creators/src/App.tsx"),/SceneSkeleton/);
});
