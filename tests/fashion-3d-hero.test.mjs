import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync,readdirSync} from "node:fs";
import {resolve,join} from "node:path";
import {createHash} from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(join(root,p),"utf8");
const site=read("templates/fashion-archive/src/components/Site.tsx");
const hero=read("templates/fashion-archive/src/components/FashionHero3D.tsx");
const css=read("templates/fashion-archive/src/components/runway-sovereign.module.css");
const heroCss=read("templates/fashion-archive/src/components/FashionHero3D.module.css");
const expected={
"pose-floor.glb":"a44444a42146e2495de0277099747cd679bf998267b103ed728adbd89e00d508",
"flowers.glb":"9a7af957b3bdde50c5372a1d5908f5262c6fb570abed2f4d2443494c14dc7a88",
"squat.glb":"598b49e8cf6e98a33c8fa382480006295c434163f26fb2531fe5113f79433d59"
};
test("FASHION_3D_CC_BY_ASSETS exactly match three user-supplied compressed GLBs in standalone and demo",()=>{
 for(const [name,hash] of Object.entries(expected)){
  const a=join(root,"templates/fashion-archive/public/models",name);
  const b=join(root,"public/sovereign/fashion-archive/models",name);
  assert.equal(createHash("sha256").update(readFileSync(a)).digest("hex"),hash,name+" standalone");
  assert.equal(createHash("sha256").update(readFileSync(b)).digest("hex"),hash,name+" demo");
 }
 for(const dir of ["templates/fashion-archive/public/models/draco","public/sovereign/fashion-archive/models/draco"]){
  for(const n of ["draco_wasm_wrapper.js","draco_decoder.wasm","draco_decoder.js"])assert.ok(statSync(join(root,dir,n)).size>1000,n);
 }
});
test("FASHION 3D hero: no lamp/poster, real Z rotation, bound camera, three buttons, pause and reduced motion",()=>{
 assert.match(site,/import FashionHero3D from/);
 assert.match(site,/<FashionHero3D modelBase=\{assetBase\+"\/models"\}/);
 assert.doesNotMatch(site,/LightStudio/);
 assert.doesNotMatch(hero,/LightStudio|lamp|poster/i);
 assert.match(hero,/pivot.rotation.z-=dt\*\.28/);
 assert.match(hero,/camera\.up\.set\(0,0,1\)/);
 assert.match(hero,/orient\.rotation\.x=Math\.PI\/2/);
 assert.match(hero,/pivot.rotation.z-=deltaX\*\.009/);
 assert.match(hero,/onPointerMove=\{onPointerMove\}/);
 assert.match(hero,/onPointerCancel=\{finishDrag\}/);
 assert.match(heroCss,/touch-action:pan-y/);
 assert.match(hero,/Box3\(\)\.setFromObject/);
 assert.match(hero,/setDecoderPath\(modelBase\+"\/draco\/"\)/);
 assert.match(hero,/IntersectionObserver/);
 assert.match(hero,/document.hidden/);
 assert.match(hero,/prefers-reduced-motion: reduce/);
 assert.match(hero,/aria-pressed=\{active===index\}/);
 assert.match(hero,/MODELS\.map\(/);
 assert.match(heroCss,/\.controls button\{[^}]*width:44px;height:44px/);
 assert.match(heroCss,/\.hero \.actions a\.primary:visited/);
 assert.match(heroCss,/color:#fff9f1!important/);
 assert.ok(!site.includes("↗")&&!hero.includes("↗"),"Forbidden generic CTA arrow icon");
 assert.match(hero,/webglcontextlost/);
});
test("FASHION Vietnamese UI is strict UTF-8, Be Vietnam Pro only, no mixed legacy fonts or glyph replacements",()=>{
 const components=join(root,"templates/fashion-archive/src/components");
 for(const name of readdirSync(components).filter(n=>/\.(css|tsx)$/.test(n))){
  const src=readFileSync(join(components,name),"utf8");
  assert.ok(!src.includes("\ufffd"),name+" invalid replacement glyph");
  assert.doesNotMatch(src,/Georgia|Times New Roman|Noto Serif/i,name+" banned font");
  assert.ok(!src.includes(String.fromCharCode(0x2733)),name+" forbidden icon");
 }
 assert.match(css,/Be Vietnam Pro/);
 assert.match(heroCss,/Be Vietnam Pro/);
 assert.ok(site.includes("Sắc màu chuyển động")&&site.includes("Chất liệu"),"Vietnamese source copy");
});
test("FASHION correct visible author and CC BY 4.0 source URLs",()=>{
 const sources=read("templates/fashion-archive/public/ASSET-SOURCES.md");
 for(const id of ["d2cb341b9ff44f04ac5cb92ad69a1161","f39b34790d464ad7ae84f504413ffc60","2c75128e56224662a5f27d613dd0f505"]){
  assert.ok(sources.includes(id),id+" missing asset attribution");
  assert.ok(hero.includes(id),id+" missing visible hero attribution");
 }
 assert.match(sources,/creativecommons.org\/licenses\/by\/4.0/);
});

test("FASHION preview generator fails closed until real GLB is ready",()=>{
 const src=read("scripts/sovereign-refresh-previews.mjs");
 assert.match(src,/if\(slug==="fashion-archive"\)/);
 assert.match(src,/\[data-active-model="pose-floor"\]\[data-model-state="ready"\]/);
});
