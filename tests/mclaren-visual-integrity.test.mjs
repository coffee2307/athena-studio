import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";

const file=resolve(dirname(fileURLToPath(import.meta.url)),"../public/models/mclaren.glb");
const buffer=readFileSync(file);
assert.equal(buffer.toString("ascii",0,4),"glTF");
const jsonLength=buffer.readUInt32LE(12);
const gltf=JSON.parse(buffer.subarray(20,20+jsonLength).toString("utf8"));

test("McLaren P1 exposes the paint, carbon, glass and metal material identities used by studio tuning",()=>{
 const names=new Set(gltf.materials.map(material=>material.name));
 for(const name of ["Carpaint","Carpaint_Black","INT_carbon","Carbon_Mult50","Clear_Glass","Windows","Chrome"]){
  assert.ok(names.has(name),`Missing named P1 material: ${name}`);
 }
 const paint=gltf.materials.find(material=>material.name==="Carpaint");
 assert.ok(paint.extensions?.KHR_materials_clearcoat,"The original automotive paint includes a clearcoat layer");
});

test("McLaren has four distinct real wheel pivots for grounded contact shadows",()=>{
 const wheels=["WHEEL_LF","WHEEL_RF","WHEEL_LR","WHEEL_RR"].map(name=>{
  const node=gltf.nodes.find(node=>node.name===name);
  assert.ok(node?.translation?.length===3,`Missing wheel pivot: ${name}`);
  return `${node.translation[0].toFixed(2)}:${node.translation[2].toFixed(2)}`;
 });
 assert.equal(new Set(wheels).size,4);
});

test("McLaren continues to include self-hosted textures rather than an external runtime dependency",()=>{
 assert.ok(gltf.images.length>=20);
 assert.ok(gltf.images.every(image=>image.bufferView!==undefined));
 assert.ok(gltf.images.some(image=>image.mimeType==="image/webp"));
});
