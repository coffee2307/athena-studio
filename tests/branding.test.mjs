import test from "node:test";
import assert from "node:assert/strict";
import {readFile,stat} from "node:fs/promises";
const root=new URL("../",import.meta.url);
const src=(path)=>new URL(path,root);

test("Athena owl artwork is used instead of the former A glyph",async()=>{
 const nav=await readFile(src("components/layout/Navbar.tsx"),"utf8");
 const hero=await readFile(src("components/experience/HeroField.tsx"),"utf8");
 assert.match(nav,/logo-symbol-black\.svg/);
 assert.match(hero,/logo-symbol-black\.svg/);
 assert.doesNotMatch(nav,/brand-symbol-dot/);
});

test("generated favicon preserves official owl path vectors",async()=>{
 const original=await readFile(src("public/branding/logo-symbol-black.svg"),"utf8");
 const favicon=await readFile(src("public/branding/favicon.svg"),"utf8");
 assert.match(favicon,/fill="#ffffff"/);
 assert.equal((original.match(/<path /g)||[]).length,(favicon.match(/<path /g)||[]).length);
 assert.equal((original.match(/<polygon /g)||[]).length,(favicon.match(/<polygon /g)||[]).length);
 for(const path of ["public/apple-touch-icon.png","public/android-chrome-192x192.png","public/android-chrome-512x512.png","public/branding/favicon.ico"]){
  assert.ok((await stat(src(path))).size>300,"Missing generated icon: "+path);
 }
});

test("core UI copy and accessibility language are Vietnamese",async()=>{
 const home=await readFile(src("app/page.tsx"),"utf8");
 const layout=await readFile(src("app/layout.tsx"),"utf8");
 assert.match(home,/Ý tưởng của bạn/);
 assert.match(layout,/html lang="vi"/);
 assert.match(home,/CREATIVE ENGINEERING STUDIO/);
 assert.match(home,/Ba hướng giải quyết/);
 assert.match(home,/AthenaServiceShowcase/);
 assert.match(home,/dna-services-grid|AthenaServiceShowcase/);
 assert.match(home,/Bắt đầu dự án/);
 assert.match(home,/Product Lab và SitePulse hiện ở giai đoạn nghiên cứu, chưa mở bán/);
 assert.match(home,/HomeTemplateShowcase/);
 assert.doesNotMatch(home,/không phải danh sách hợp đồng khách hàng Athena/);
});
