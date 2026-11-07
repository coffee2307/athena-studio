import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {buildCarSilhouetteSupports} from "../lib/showroom-framing.ts";

function originalSupports(root,pivot){
 pivot.updateMatrixWorld(true);root.updateMatrixWorld(true);
 const inverse=pivot.matrixWorld.clone().invert(),directions=[];
 for(let step=0;step<32;step++)for(const elevation of [-5,-1.5,0,1.5,5]){
  const angle=step*Math.PI*2/32;
  directions.push(new THREE.Vector3(Math.cos(angle),elevation,Math.sin(angle)).normalize());
 }
 directions.push(new THREE.Vector3(0,1,0),new THREE.Vector3(0,-1,0));
 const scores=directions.map(()=>-Infinity),supports=directions.map(()=>new THREE.Vector3());
 const vertex=new THREE.Vector3(),transform=new THREE.Matrix4();
 root.traverse(object=>{
  if(!(object instanceof THREE.Mesh))return;
  const positions=object.geometry?.getAttribute("position");if(!positions)return;
  transform.multiplyMatrices(inverse,object.matrixWorld);
  for(let index=0;index<positions.count;index++){
   vertex.fromBufferAttribute(positions,index).applyMatrix4(transform);
   for(let j=0;j<directions.length;j++){
    const score=vertex.dot(directions[j]);
    if(score>scores[j]){scores[j]=score;supports[j].copy(vertex)}
   }
  }
 });
 const seen=new Set();
 return supports.filter((p,i)=>{
  if(!Number.isFinite(scores[i]))return false;
  const key=[p.x,p.y,p.z].map(v=>v.toFixed(4)).join(":");
  if(seen.has(key))return false;seen.add(key);return true;
 });
}

test("preserve GLB mesh support cloud without loss of contour precision",()=>{
 const pivot=new THREE.Group();pivot.position.set(.2,-.4,.7);pivot.rotation.y=.36;
 const root=new THREE.Group();root.scale.set(1.2,1,.85);pivot.add(root);
 for(let i=0;i<4;i++){
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(.4+i*.27,22,15),new THREE.MeshStandardMaterial());
  mesh.position.set(Math.sin(i*2)*1.3,i*.24,Math.cos(i*.9)*.8);
  mesh.rotation.set(i*.19,i*.07,-i*.16);
  root.add(mesh);
 }
 const before=performance.now();
 const reference=originalSupports(root,pivot);
 const referenceMs=performance.now()-before;
 const start=performance.now();
 const optimized=buildCarSilhouetteSupports(root,pivot);
 const optimizedMs=performance.now()-start;
 assert.equal(optimized.length,reference.length);
 for(let i=0;i<reference.length;i++){
  assert(reference[i].distanceTo(optimized[i])<0.00001,"Support point "+i+" changed");
 }
 console.log("SILHOUETTE_CPU_MS",JSON.stringify({reference:+referenceMs.toFixed(2),optimized:+optimizedMs.toFixed(2),points:optimized.length}));
 root.traverse(x=>{if(x instanceof THREE.Mesh){x.geometry.dispose();x.material.dispose()}});
});

test("full-quality GLB is unchanged and preloaded with immutable shared assets",()=>{
 const page=readFileSync(new URL("../app/template-demos/[slug]/page.tsx",import.meta.url),"utf8");
 const config=readFileSync(new URL("../next.config.ts",import.meta.url),"utf8");
 const scene=readFileSync(new URL("../components/immersive/McLarenShowroomScene.tsx",import.meta.url),"utf8");
 assert.match(page,/mclaren\.glb\?v=20261029-p1-vecarz/);
 assert.match(page,/rel="preload"/);
 assert.match(config,/max-age=31536000, immutable/);
 assert.match(scene,/draco\.preload\(\)/);
 assert.match(scene,/tunedMaterials\.has\(mat\)/);
 assert.match(scene,/tunedTextures\.has\(texture\)/);
 assert.match(scene,/modelDecodedMs/);
 assert.match(scene,/firstFrameMs/);
});
