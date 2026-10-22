import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createInquiryEmailDraft} from "../lib/contact-email-draft.ts";

const registry=JSON.parse(await readFile(new URL("../data/templates.json",import.meta.url),"utf8"));
test("template registry has unique, complete entries and only supported optional modules",()=>{
 const slugs=new Set();
 for(const item of registry){
  assert.match(item.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(slugs.has(item.slug),false);slugs.add(item.slug);
  for(const key of ["title","category","industry","style","purpose","description","variant","version"])assert.ok(item[key],`${item.slug}: ${key}`);
  assert.ok(item.pages.length>0);assert.ok(item.features.length>0);
  assert.deepEqual(item.compatibility,{starter:"web-foundation@1",next:"15.5.x",react:"19.x"});
  assert.equal(item.status,"interactive-demo");
  assert.equal(item.images.length,5);
  assert.ok(item.estimatedPrice); assert.ok(item.qualityTier); assert.ok(item.reference?.url);
  assert.ok(item.modules.every(module=>["content","contact","catalog","commerce","auth","booking"].includes(module)));
 }
 assert.equal(registry.length,12);
});
test("contact email draft includes the selected template and still requires an explicit send",()=>{
 const draft=createInquiryEmailDraft({name:"Coffee",email:"coffee@example.com",service:"web-development",message:"Tôi cần xây dựng website cho dự án mới.",template:"Studio sáng tạo"},"studio@example.com");
 assert.match(draft.body,/Mẫu website tham khảo: Studio sáng tạo/);
 assert.match(draft.href,/mailto:/);
 assert.match(draft.body,/chưa được gửi tự động/);
});
