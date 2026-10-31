import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,join} from "node:path";
const root=resolve(import.meta.dirname,"..");
const load=p=>readFileSync(join(root,p),"utf8");
test("VELAR removes only its redundant 3D mode rail, keeps editorial worlds and CC BY credit",()=>{
 const src=load("components/templates/WorldImmersiveHome.tsx");
 assert.match(src,/!isAuto&&<section className="ix-scene-rail"/);
 assert.match(src,/isAuto&&<div className="bv-after-cinematic"/);
 assert.match(src,/<ModelAttribution compact\/>/);
 const copyright=load("components/immersive/ModelAttribution.tsx");
 assert.match(copyright,/heynic/);
 assert.match(copyright,/creativecommons\.org\/licenses\/by\/4\.0/);
});
test("Actual McLaren loading state has a spinner with retry and fallback, never a visual percent bar",()=>{
 const src=load("components/immersive/McLarenLoadingUI.tsx");
 assert.match(src,/className="bv-spinner-ring"/);
 assert.match(src,/data-model-loading/);
 assert.match(src,/window\.location\.reload/);
 assert.match(src,/onFallback/);
 assert.doesNotMatch(src,/ix-car-load-track|<span>.*%<\/span>/);
});
test("NORTH refuses a decorative circle drawn over written content",()=>{
 const src=load("templates/modern-corporate/src/components/North.module.css");
 assert.match(src,/\.north \.impactBody:after\{content:none!important\}/);
 assert.match(src,/\.impactMap\{/);
});
test("All three distinct enhancements are source-owned, no shared visual object",()=>{
 const sora=load("templates/creative-studio/src/components/Site.tsx");
 const north=load("templates/modern-corporate/src/components/Site.tsx");
 const moc=load("templates/commerce-standard/src/components/Site.tsx");
 assert.match(sora,/editorialLayer/);
 assert.match(sora,/labStage/);
 assert.match(north,/impactJourney/);
 assert.match(moc,/brandName/);
 const mobile=load("components/templates/WorldSite.tsx");
 assert.match(mobile,/Đóng menu showroom/);
});
