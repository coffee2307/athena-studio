import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {normalizeShowroomZoom,showroomZoomFactor,showroomZoomRadius,showroomCanonicalRadius} from "../lib/showroom-camera-controls.ts";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const source=p=>readFileSync(resolve(root,p),"utf8");

test("zoom controls have bounded, monotonic and reversible camera distances",()=>{
 const factors=[-2,-1,0,1,2].map(showroomZoomFactor);
 assert.deepEqual(factors.map(x=>Number(x.toFixed(3))),[1.36,1.18,1,.82,.64]);
 for(let z=-2;z<=2;z++){
  assert.equal(normalizeShowroomZoom(z),z);
  for(const base of [6.9,8.2,10.35]){
   const displayed=showroomZoomRadius(base,z);
   assert.ok(Math.abs(showroomCanonicalRadius(displayed,z)-base)<1e-10);
  }
 }
 assert.equal(normalizeShowroomZoom(50),2);
 assert.equal(normalizeShowroomZoom(-50),-2);
 assert.equal(normalizeShowroomZoom(Number.NaN),0);
});
test("manual drag and scroll transition capture canonical unzoomed radius, never displayed radius",()=>{
 const code=source("components/immersive/McLarenShowroomScene.tsx");
 assert.match(code,/manualRadius=unzoomedRadius/);
 assert.match(code,/radius:unzoomedRadius/);
 assert.match(code,/unzoomedRadius=radius/);
 assert.match(code,/displayedRadius=showroomZoomRadius/);
 assert.match(code,/cameraBaseRadius=unzoomedRadius\.toFixed/);
 assert.doesNotMatch(code,/manualRadius=Math\.hypot/);
 assert.doesNotMatch(code,/radius:Math\.hypot\(camera\.position/);
 assert.match(code,/shortestOrbitDelta\(tx.start,tx.end\)\*fraction/);
});
test("BLACK VELOCITY is the singular public identity, source attribution remains",()=>{
 const site=source("components/templates/WorldImmersiveHome.tsx");
 const chapters=source("components/immersive/AutoCinematicTrack.tsx");
 const interlude=source("components/templates/WorldEditorialInterlude.tsx");
 const data=source("data/demo-worlds.ts");
 const details=source("data/demo-world-details.ts");
 const credits=source("components/immersive/ModelAttribution.tsx");
 assert.match(data,/"auto-showroom":\{"brand":"BLACK VELOCITY"/);
 assert.doesNotMatch(site,/VELAR/);
 assert.doesNotMatch(details.slice(details.indexOf('"auto-showroom"')),/VELAR/);
 assert.match(site,/XEM NĂM GÓC NHÌN/);
 assert.match(site,/onClick=\{\(\)=>jumpToAutoCinematicChapter\(1\)\}/);
 assert.match(site,/ONE CAR\. FIVE PERSPECTIVES\./);
 assert.match(site,/EXPLORE THE DETAILS\./);
 assert.match(interlude,/THREE DESIGN/);
 assert.match(chapters,/McLaren P1/);
 assert.match(credits,/CC BY 4\.0/);
 assert.match(credits,/sketchfab.com\/heynic/);
 assert.match(site,/ModelAttribution compact/);
 const after=site.match(/<ModelAttribution compact\/>/g)||[];
 assert.equal(after.length,1);
});
test("new home 3D button has real semantics and an accessible, high-contrast style",()=>{
 const site=source("components/templates/WorldImmersiveHome.tsx");
 const styles=source("app/black-velocity.css");
 assert.match(site,/<button type="button" className="ix-hero-primary"/);
 assert.match(styles,/button\.ix-hero-primary\{appearance:none/);
 assert.match(styles,/button\.ix-hero-primary:focus-visible/);
});
