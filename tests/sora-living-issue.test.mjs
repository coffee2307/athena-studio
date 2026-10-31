import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const f=p=>readFileSync(new URL("../templates/creative-studio/src/components/"+p,import.meta.url),"utf8");
test("SORA owns a cover with native keyboard buttons and bounded desktop dragging",()=>{
 const src=f("SoraLivingCover.tsx");
 assert.match(src,/aria-pressed=\{page===i\}/);
 assert.match(src,/onPointerDown=\{down\}/);
 assert.match(src,/Math\.max\(-58,Math\.min\(58/);
 assert.match(src,/matchMedia\("\(hover:hover\) and \(pointer:fine\)"\)/);
 assert.match(src,/data-sora-parallax/);
 assert.doesNotMatch(src,/✳/);
});
test("SORA letter desk uses native radio inputs and shows a dynamic draft",()=>{
 const src=f("SoraLetterDesk.tsx");
 assert.match(src,/type="radio"/);
 assert.match(src,/name="sora-topic"/);
 assert.match(src,/name="sora-topic"/);
 assert.match(src,/navigator\.clipboard\.writeText/);
 assert.match(src,/role="status"/);
 assert.doesNotMatch(src,/hello@example\.com/);
 assert.doesNotMatch(src,/<select/);
});
test("SORA alone owns the new components, preserving all authored routes",()=>{
 const src=f("Site.tsx");
 assert.match(src,/SoraLivingCover images=\{images\}/);
 assert.match(src,/SoraLetterDesk/);
 for(const route of ["home","work","contact","services","about","detail"])assert.match(src,new RegExp('section==="'+route+'"'));
});
test("SORA copy identifies concrete samples and services without vague project names",()=>{
 const site=f("Site.tsx"),cover=f("SoraLivingCover.tsx"),letter=f("SoraLetterDesk.tsx");
 for(const forbidden of ["Nếp —", "Lặng —", "Mùa —", "Một cá tính cần được nhìn thấy", "Một không gian số có dấu ấn riêng", "Một câu chuyện đáng được kể"]){
  assert.ok(![site,cover,letter].some(src=>src.includes(forbidden)), "Vague text remains: "+forbidden);
 }
 for(const phrase of ["Bộ nhận diện quán cà phê","Website studio nội thất","Bộ ảnh ra mắt sản phẩm","Đây là nội dung minh họa"]){assert.ok(site.includes(phrase), "Missing factual sample label: "+phrase);}
 for(const phrase of ["Logo.","Website.","Hình ảnh.","Chọn loại thiết kế"]){assert.ok(cover.includes(phrase), "Missing accessible cover label: "+phrase);}
 for(const phrase of ["Thiết kế logo, bảng màu, kiểu chữ","Thiết kế giao diện, trang nội dung","Thiết kế ảnh quảng cáo, banner"]){assert.ok(letter.includes(phrase), "Missing service deliverables: "+phrase);}
});
test("SORA maintains Vietnamese font no-go and reduced motion",()=>{
 const css=f("Sora.module.css");
 assert.doesNotMatch(css,/(?:Georgia|Times New Roman)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.letterOption:focus-within/);
});
