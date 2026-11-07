import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {join,resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const registry=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8"));
const versions=JSON.parse(readFileSync(join(root,"data/template-preview-versions.json"),"utf8"));
const removed=["editorial-journal","music-label","live-concert","team-intranet","engineering-industry","finance-trust"];
test("the reduced gallery has exactly 15 real standalone templates and no removed demo exposure",()=>{
 assert.equal(registry.length,15);
 for(const slug of removed){
  assert.equal(registry.some(x=>x.slug===slug),false,slug);
  assert.equal(existsSync(join(root,"templates",slug,"package.json")),false,slug+" standalone source remains");
 }
 for(const item of registry)assert.equal(existsSync(join(root,"templates",item.slug,"package.json")),true,item.slug);
});
test("every retained template preview matches its recorded cache-busting content hash",()=>{
 assert.deepEqual(Object.keys(versions).sort(),registry.map(x=>x.slug).sort());
 for(const item of registry){
  const ext=item.slug==="digital-creators"?".png":".jpg";
  const path=join(root,"public/template-previews",item.slug+ext);
  assert.ok(existsSync(path),item.slug+" has no thumbnail");
  const content=readFileSync(path);
  assert.ok(content.length>10000,item.slug+" cover is truncated");
  assert.equal(versions[item.slug],createHash("sha256").update(content).digest("hex").slice(0,16),item.slug+" preview version is stale");
 }
});
test("gallery cards and homepage use the same version-aware cover helper",()=>{
 const preview=readFileSync(join(root,"components/templates/TemplatePreview.tsx"),"utf8");
 const home=readFileSync(join(root,"components/home/HomeTemplateShowcase.tsx"),"utf8");
 assert.match(preview,/getTemplatePreviewSrc\(template.slug\)/);
 assert.match(home,/getTemplatePreviewSrc\(item.slug\)/);
 assert.doesNotMatch(preview,/capturedHomepages/);
});
