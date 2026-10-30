import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join,resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const registry=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8"));
test("ATHENA-DNA-03: all 21 templates have independent source contracts",()=>{
 assert.equal(registry.length,21);
 const seen=new Set();
 for(const item of registry){
  assert.equal(seen.has(item.slug),false,"Duplicate template "+item.slug);
  seen.add(item.slug);
  const base=join(root,"templates",item.slug);
  for(const path of ["package.json","package-lock.json","tsconfig.json","next.config.ts","src/app/page.tsx","src/app/[section]/page.tsx","src/components/Site.tsx","src/data/site.json","tests/template-contract.test.mjs","README.md","template.manifest.json"]){
   assert.equal(existsSync(join(base,path)),true,item.slug+" missing "+path);
  }
  const site=JSON.parse(readFileSync(join(base,"src/data/site.json"),"utf8"));
  const pkg=JSON.parse(readFileSync(join(base,"package.json"),"utf8"));
  const lock=JSON.parse(readFileSync(join(base,"package-lock.json"),"utf8"));
  const manifest=JSON.parse(readFileSync(join(base,"template.manifest.json"),"utf8"));
  assert.equal(site.slug,item.slug);
  assert.equal(manifest.slug,item.slug);
  assert.equal(pkg.name,lock.name);
  assert.equal(pkg.name,lock.packages[""].name);
  assert.ok(Array.isArray(site.images)&&site.images.length>0,item.slug+" missing images");
  for(const image of site.images){
   assert.ok(image.startsWith("/images/"),item.slug+" nonlocal image "+image);
   assert.equal(existsSync(join(base,"public",image.slice(1))),true,item.slug+" missing "+image);
  }
 }
});
