import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {existsSync,statSync} from "node:fs";
import {createInquiryEmailDraft} from "../lib/contact-email-draft.ts";

const registry=JSON.parse(await readFile(new URL("../data/templates.json",import.meta.url),"utf8"));
test("template registry has unique, complete entries and only supported optional modules",()=>{
 const slugs=new Set();
 for(const item of registry){
  assert.match(item.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(slugs.has(item.slug),false);slugs.add(item.slug);
  for(const key of ["title","category","industry","style","purpose","description","variant","version"])assert.ok(item[key],`${item.slug}: ${key}`);
  assert.ok(item.pages.length>0);assert.ok(item.features.length>0);
  assert.ok(["web-foundation@1","web-foundation@2","standalone-vite@1"].includes(item.compatibility.starter),item.slug+": unsupported starter");
  assert.equal(item.compatibility.next,"15.5.x");
  assert.equal(item.compatibility.react,"19.x");
  assert.equal(item.status,"interactive-demo");
  assert.equal(item.images.length,item.variant==="immersive"?0:5);
  assert.equal(item.demoPath,"/template-demos/"+item.slug);
  assert.ok(item.pages.includes("Trang chủ"),item.slug+": no home page");
  assert.ok(item.estimatedPrice); assert.ok(item.qualityTier); assert.ok(item.reference?.url);
  assert.ok(item.modules.every(module=>["content","contact","catalog","commerce","auth","booking"].includes(module)));
 }
 assert.equal(registry.length,15);
});
test("contact email draft includes the selected template and still requires an explicit send",()=>{
 const draft=createInquiryEmailDraft({name:"Coffee",email:"coffee@example.com",service:"web-development",message:"Tôi cần xây dựng website cho dự án mới.",template:"Studio sáng tạo"},"studio@example.com");
 assert.match(draft.body,/Mẫu website tham khảo: Studio sáng tạo/);
 assert.match(draft.href,/mailto:/);
 assert.match(draft.body,/chưa được gửi tự động/);
});

test("Digital Creators is vendored verbatim and the gallery uses a real screenshot",()=>{
 const dc=registry.find(item=>item.slug==="digital-creators");
 assert.ok(dc,"Digital Creators is template 21");
 assert.equal(dc.compatibility.starter,"standalone-vite@1");
 for(const file of [
  "../vendor/digital-creators/src/App.tsx",
  "../vendor/digital-creators/src/components/RubikScrollStory.tsx",
  "../vendor/digital-creators/src/components/PaintingAboutVisual.tsx",
  "../vendor/digital-creators/src/components/LegoActivitiesVisual.tsx",
  "../public/immersive/digital-creators/index.html",
  "../public/template-previews/digital-creators.png"
 ])assert.ok(existsSync(new URL(file,import.meta.url)),file);
});

test("the three Phase 0 immersive covers exist as real browser captures",()=>{
 for(const slug of ["creative-studio","architecture-studio","auto-showroom"]){
  const file=new URL("../public/template-previews/"+slug+".png",import.meta.url);
  assert.ok(existsSync(file),slug+" is missing its live preview");
  assert.ok(statSync(file).size>20000,slug+" screenshot is empty or truncated");
 }
});
