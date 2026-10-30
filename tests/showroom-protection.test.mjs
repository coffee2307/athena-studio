import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {createHash} from "node:crypto";

const root=resolve(import.meta.dirname,"..");
const lock=JSON.parse(readFileSync(join(root,"config/showroom-protection.json"),"utf8"));
test("BLACK VELOCITY showroom locked: source, animation, layouts and 3D asset cannot change silently",()=>{
 assert.equal(lock.status,"protected");
 const entries=Object.entries(lock.file_blobs);
 assert.equal(entries.length>=9,true);
 for(const [relative,expected] of entries){
  const bytes=readFileSync(join(root,relative));
  const blob=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
  assert.equal(blob,expected,relative+" changed. This showroom is frozen; request a new explicit approval before editing and updating its protection contract.");
 }
});