import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const root="templates/modern-corporate/src/components/";
const site=readFileSync(root+"Site.tsx","utf8");
const css=readFileSync(root+"North.module.css","utf8");

test("NORTH site identity is editorial decision architecture, not inherited universal shell",()=>{
 assert.match(site,/NORTH \/ LIVE SYSTEM MAP/);
 assert.match(site,/Bớt<br\/><span>phức tạp/);
 assert.match(site,/THE CAPABILITY INDEX/);
 assert.match(site,/THE DECISION PIPELINE/);
 assert.match(site,/OPERATING MANIFESTO/);
 assert.match(site,/FIELD REPORT \/ 001/);
 assert.doesNotMatch(site,/(WorldSite|StyledSelect from "\.\.\/\.\.\/\.\.\/shared)/);
 assert.ok(existsSync(root+"NorthSelector.tsx"));
});

test("Home live system map responds to all three verified service issues",()=>{
 assert.match(site,/aria-pressed=\{i===active\}/);
 assert.match(site,/aria-controls="north-atlas-output"/);
 assert.match(site,/id="north-atlas-output" aria-live="polite"/);
 assert.match(site,/onClick=\{\(\)=>setActive\(i\)\}/);
 assert.match(site,/const services=\[/);
 assert.match(site,/Khó triển khai/);
 assert.match(site,/Công cụ rời rạc/);
 assert.match(site,/Chưa rõ ưu tiên/);
});

test("NORTH contains working all routes, per-page experiences and no skeleton overlays",()=>{
 for(const section of ["home","work","detail","services","about","contact"])
  assert.ok(site.includes('section==="'+section+'"'),"missing "+section);
 assert.match(site,/NorthClosing/);
 assert.match(site,/onSubmit=\{contact\}/);
 assert.match(site,/required minLength=\{10\}/);
 assert.match(site,/aria-controls="north-mobile-menu"/);
 assert.match(site,/window\.addEventListener\("keydown",key\)/);
 assert.doesNotMatch(site,/Skeleton|LoadingOverlay|loadingSpinner/);
});

test("NORTH preserves truthful demonstration identity, glyph safety, Vietnamese type and motion limits",()=>{
 assert.match(site,/WEBSITE MẪU/);
 assert.match(site,/KHÔNG ĐẠI DIỆN DOANH NGHIỆP THẬT/);
 assert.match(site,/không phải hồ sơ triển khai thực tế|không phải hồ sơ triển khai|not a client case/i);
 assert.doesNotMatch(site,/\u2197|\u2733/);
 assert.doesNotMatch(css,/\u2733/);
 assert.match(css,/Be Vietnam Pro/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/north-route-move/);
 assert.match(css,/focus-visible/);
});

test("NORTH linked detail pages and mailto workflow never claim actual back-end storage",()=>{
 assert.match(site,/go\("\/work\/"\+\(active\+1\)\)/);
 assert.match(site,/go\("\/work\/"\+\(i\+1\)\)/);
 assert.match(site,/mailto:\?subject=/);
 assert.match(site,/Không lưu dữ liệu trên máy chủ|KHÔNG LƯU DỮ LIỆU TRÊN MÁY CHỦ/);
});
