import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,join} from "node:path";
const root=resolve(import.meta.dirname,"..");
const config=JSON.parse(readFileSync(join(root,"src/data/site.json"),"utf8"));
test("template has standalone metadata, routes and local images",()=>{
 assert.ok(config.slug);
 assert.ok(config.brand);
 assert.ok(Array.isArray(config.images)&&config.images.length>0);
 for(const url of config.images)assert.equal(existsSync(join(root,"public",url.slice(1))),true,"Missing local asset "+url);
 assert.ok(existsSync(join(root,"src/app/page.tsx")));
 assert.ok(existsSync(join(root,"src/app/[section]/page.tsx")));
});
