import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../templates/modern-corporate/src/components/Site.tsx",import.meta.url),"utf8");
const css=readFileSync(new URL("../templates/modern-corporate/src/components/North.module.css",import.meta.url),"utf8");
test("NORTH diagnostic has three real scenarios, mapped outcomes and a navigable service detail",()=>{
 for(const item of ["Chưa rõ ưu tiên","Công cụ rời rạc","Khó đưa vào thực tế"])assert.ok(source.includes(item),item);
 assert.match(source,/id="north-diagnostic-tool"/);
 assert.match(source,/aria-controls="north-diagnostic-result"/);
 assert.match(source,/aria-live="polite"/);
 assert.match(source,/services\.map\(\(x,i\)=>/);
 assert.match(source,/services\[active\]\.deliver/);
 assert.match(source,/go\("\/work\/"\+\(active\+1\)\)/);
 assert.match(source,/href="#north-diagnostic-tool"/);
});
test("NORTH keeps a real four-step process and honest email draft",()=>{
 for(const item of ["Sơ đồ hiện trạng","Bản đồ ưu tiên","Nguyên mẫu","Bảng theo dõi"])assert.ok(source.includes(item),item);
 assert.match(source,/steps\[active\]\.output/);
 assert.ok(!source.includes("hello@example.com"),"No invented business email recipient");
 assert.match(source,/mailto:\?subject=/);
 assert.match(source,/Bạn tự chọn người nhận/);
});
test("NORTH motion, focus, typography, and scoped responsive layout are covered",()=>{
 assert.match(css,/north \.diagramNodes button\[aria-pressed="true"\]/);
 assert.match(css,/@media\(max-width:350px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/Be Vietnam Pro/);
 assert.doesNotMatch(css,/Times New Roman|Georgia|transition:\s*all/);
 assert.ok(!source.includes(String.fromCharCode(0x2733)),"Forbidden decorative symbol");
});
