import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";

test("Auto Showroom uses the new user-supplied McLaren glTF asset",async()=>{
 const bytes=await readFile(new URL("../public/models/mclaren.glb",import.meta.url));
 assert.equal(bytes.subarray(0,4).toString("ascii"),"glTF");
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),"f9eeb7e7daae7cae0534fa0e2a021e0e9489b6b486f1b0f124e9f78e55b2f897");
 const jsonBytes=bytes.readUInt32LE(12);
 const json=JSON.parse(bytes.subarray(20,20+jsonBytes).toString("utf8"));
 assert.ok(!json.extensionsUsed?.includes("KHR_draco_mesh_compression"));
 assert.equal(bytes.length,6369252);
 assert.ok(json.extensionsRequired.includes("EXT_texture_webp"));
 assert.equal(json.materials.find(m=>m.name==="body_1").pbrMetallicRoughness.baseColorFactor[0],0);
 assert.equal(json.meshes.length,54);
 assert.ok(json.materials.some(m=>m.name==="body_1"));
});
