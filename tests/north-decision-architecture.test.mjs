import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root="templates/modern-corporate/src/components/";
const site=readFileSync(root+"Site.tsx","utf8");
const css=readFileSync(root+"North.module.css","utf8");

test("NORTH uses plain-language decisions instead of a decorative animated map",()=>{
 assert.match(site,/Điều gì đang khiến công việc khó hơn/);
 assert.match(site,/Chưa rõ việc nào cần ưu tiên/);
 assert.match(site,/Quy trình và công cụ rời rạc/);
 assert.match(site,/Có kế hoạch nhưng khó triển khai/);
 assert.match(site,/aria-pressed=\{selected===i\}/);
 assert.match(site,/aria-controls="north-decision-result"/);
 assert.match(site,/id="north-decision-result" aria-live="polite"/);
 assert.doesNotMatch(site,/atlasRef|moveAtlas|resetAtlas|atlasLines|atlasRoute|graphLines|atlasNode/);
 assert.doesNotMatch(css,/animation:\s*(?!none)|@keyframes|pointer-events:\s*none[^}]*transform/);
});

test("NORTH homepage is concise without repeated capability and statement sections",()=>{
 assert.match(site,/section===["']home["']/);
 assert.match(site,/s\.howSection/);
 assert.match(site,/s\.stepsPreview/);
 assert.doesNotMatch(site,/s\.statement\b|s\.capabilitySection|s\.editorialSection|s\.methodGraphic/);
 assert.match(site,/NorthClosing/);
});

test("NORTH keeps all requested subpages and does not add skeleton loaders",()=>{
 for(const section of ["home","work","detail","services","about","contact"])
  assert.ok(site.includes('section==="'+section+'"'),"Missing page "+section);
 assert.match(site,/s\.processList/);
 assert.match(site,/s\.principles/);
 assert.match(site,/onSubmit=\{createEmail\}/);
 assert.match(site,/NorthSelector/);
 assert.doesNotMatch(site,/Skeleton|loadingSpinner|LoadingOverlay/);
});

test("NORTH protects demo truth and keeps readable Vietnamese and reduced-motion",()=>{
 assert.match(site,/WEBSITE DEMO/);
 assert.match(site,/Không đại diện cho doanh nghiệp thật/);
 assert.match(site,/không phải hồ sơ khách hàng/i);
 assert.match(site,/mailto:\?subject=/);
 assert.match(site,/aria-expanded=\{menu\}/);
 assert.match(site,/event.key==="Escape"/);
 assert.match(css,/Be Vietnam Pro/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.doesNotMatch(site,/\u2197|\u2733/);
});

test("NORTH does not modify another template or depend on a shared presentation",()=>{
 assert.match(site,/import NorthSelector from "\.\/NorthSelector"/);
 assert.match(site,/from "\.\/North\.module\.css"/);
 assert.doesNotMatch(site,/templates\/shared|react-bits|WorldSite/);
});
