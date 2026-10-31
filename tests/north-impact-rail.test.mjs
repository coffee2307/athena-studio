import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const root=new URL("../templates/modern-corporate/src/components/",import.meta.url);
const jsx=readFileSync(new URL("Site.tsx",root),"utf8"),css=readFileSync(new URL("North.module.css",root),"utf8");
test("NORTH impact has meaningful outcomes rather than an empty decorative diagram",()=>{
 for(const item of ["impactPrinciples","impactPanelTop","impactDeliverable","north-impact-result","Xác định vấn đề","Thống nhất cách làm","Kiểm tra hiệu quả"])assert.ok(jsx.includes(item),item);
 assert.match(jsx,/aria-pressed=\{impactStep===i\}/);
 assert.match(jsx,/aria-controls="north-impact-result"/);
 assert.match(jsx,/aria-live="polite"/);
 assert.match(jsx,/className=\{s.impactBody\}/);
 assert.doesNotMatch(jsx,/className=\{s.impactMap\}/);
});
test("NORTH sticky utility and header remain joined to fixed rail",()=>{
 assert.match(css,/\.north \.utility\{\s*position:sticky;top:0/);
 assert.match(css,/\.north \.globalHead\{\s*position:sticky;top:var\(--north-utility-height\)/);
 assert.match(css,/\.north \.rail\{\s*position:fixed;top:calc\(var\(--north-utility-height\) \+ var\(--north-header-height\)\)/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(jsx,/\u2733/);
});
