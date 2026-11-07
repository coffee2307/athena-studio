import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../templates/modern-corporate/src/components/Site.tsx",import.meta.url),"utf8");
const css=readFileSync(new URL("../templates/modern-corporate/src/components/North.module.css",import.meta.url),"utf8");
test("NORTH offers three actionable problems with live selected results",()=>{
 for(const item of ["Chưa rõ việc nào cần ưu tiên","Quy trình và công cụ rời rạc","Có kế hoạch nhưng khó triển khai"])assert.ok(source.includes(item),item);
 assert.match(source,/topics\.map\(\(item,i\)=>/);
 assert.match(source,/aria-pressed=\{selected===i\}/);
 assert.match(source,/aria-controls="north-decision-result"/);
 assert.match(source,/id="north-decision-result" aria-live="polite"/);
 assert.match(source,/current\.approach/);
 assert.match(source,/go\("\/work\/"\+\(selected\+1\)\)/);
});
test("NORTH has a three-step process and an honest user-sent email draft",()=>{
 for(const item of ["Hiểu vấn đề","Đề xuất hướng giải quyết","Kiểm tra hiệu quả"])assert.ok(source.includes(item),item);
 assert.match(source,/process\.map\(/);
 assert.match(source,/mailto:\?subject=/);
 assert.match(source,/Vui lòng tự chọn địa chỉ người nhận/);
 assert.doesNotMatch(source,/hello@example\.com/);
 assert.doesNotMatch(source,/fetch\(["']\/api\/inquiry/);
});
test("NORTH honors accessibility and removes decorative effects",()=>{
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/Be Vietnam Pro/);
 assert.match(css,/:focus-visible/);
 assert.doesNotMatch(css,/Times New Roman|Georgia|transition:\s*all/);
 assert.doesNotMatch(source,/dna04Pointer|impactJourney|diagramNodes/);
});
