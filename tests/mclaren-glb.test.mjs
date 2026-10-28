import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";

test("Auto Showroom serves the user-supplied vecarz McLaren P1 GLB",async()=>{
 const bytes=await readFile(new URL("../public/models/mclaren.glb",import.meta.url));
 assert.equal(bytes.subarray(0,4).toString("ascii"),"glTF");
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 assert.equal(bytes.length,3605316);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),"8fb16ee31c381362ad4d17fa4b7f402ab08c20411bf16f8828558ec46b566c1d");
 const jsonBytes=bytes.readUInt32LE(12);
 const json=JSON.parse(bytes.subarray(20,20+jsonBytes).toString("utf8"));
 assert.ok(json.extensionsRequired.includes("KHR_draco_mesh_compression"));
 assert.ok(json.extensionsRequired.includes("EXT_texture_webp"));
 assert.equal(json.meshes.length,195);
 assert.equal(json.materials.length,35);
 assert.equal(json.images.length,26);
});
