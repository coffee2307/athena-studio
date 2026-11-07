import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join,resolve} from "node:path";
import {createHash} from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const get=(path)=>readFileSync(join(root,path));
const text=(path)=>get(path).toString("utf8");
function inspect(path){
 const b=get(path);
 assert.equal(b.toString("ascii",0,4),"glTF");
 assert.equal(b.readUInt32LE(8),b.byteLength);
 const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
 assert.ok(j.extensionsRequired?.includes("EXT_meshopt_compression"),path);
 assert.ok(j.bufferViews?.some(v=>v.extensions?.EXT_meshopt_compression),path);
 return b;
}
test("Fashion optimized derivatives are valid, smaller and mirrored without touching originals",()=>{
 const sets=[["pose-floor",0.72],["squat",0.65]];
 for(const [id,maxRatio] of sets){
  const original=get("public/sovereign/fashion-archive/models/"+id+".glb");
  const standalone=inspect("templates/fashion-archive/public/models/"+id+"-fast.glb");
  const embedded=inspect("public/sovereign/fashion-archive/models/"+id+"-fast.glb");
  assert.ok(standalone.length<original.length*maxRatio,id+" transfer reduction");
  assert.equal(createHash("sha256").update(embedded).digest("hex"),createHash("sha256").update(standalone).digest("hex"),id+" mirror mismatch");
 }
});
test("Default Fashion 3D uses priority Meshopt and loads Draco only for Flowers",()=>{
 const hero=text("templates/fashion-archive/src/components/FashionHero3D.tsx");
 const site=text("templates/fashion-archive/src/components/Site.tsx");
 assert.match(hero,/pose-floor-fast\.glb/);
 assert.match(hero,/squat-fast\.glb/);
 assert.match(hero,/setMeshoptDecoder/);
 assert.match(hero,/if\(index===1\)void ensureDraco\(\)/);
 assert.match(hero,/draco\.setDecoderPath\(modelBase\+"\/draco\/"\)/);
 assert.match(site,/rel="preload"[^>]+pose-floor-fast\.glb/);
});
