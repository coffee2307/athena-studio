import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";

test("Auto Showroom uses the actual user-supplied, attributed McLaren glTF asset",async()=>{
 const bytes=await readFile(new URL("../public/models/mclaren-ultimate-vision-gt.glb",import.meta.url));
 assert.equal(bytes.subarray(0,4).toString("ascii"),"glTF");
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),"af5ec167526d71bbf8afd7a7494cb5694c1297d657df2bf4545cccaba64bb0b2");
 const jsonBytes=bytes.readUInt32LE(12);
 const json=JSON.parse(bytes.subarray(20,20+jsonBytes).toString("utf8"));
 assert.ok(json.extensionsRequired.includes("KHR_draco_mesh_compression"));
 assert.ok(json.extensionsRequired.includes("EXT_texture_webp"));
 assert.equal(json.asset.extras.license,"CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)");
 assert.equal(json.meshes.length,54);
 assert.ok(json.materials.some(m=>m.name==="body_1"));
});
