import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../templates/modern-corporate/src/components/",import.meta.url);
const jsx=readFileSync(new URL("Site.tsx",root),"utf8");
const css=readFileSync(new URL("North.module.css",root),"utf8");
test("NORTH shows decision outcomes, not decorative impact maps",()=>{
 assert.match(jsx,/className=\{s\.decisionPanel\}/);
 assert.match(jsx,/className=\{s\.decisionResult\}/);
 assert.match(jsx,/aria-live="polite"/);
 assert.match(jsx,/current\.approach/);
 assert.match(jsx,/current\.name/);
 assert.doesNotMatch(jsx,/impactMap|impactJourney|impactPrinciples|impactPanelTop/);
});
test("NORTH menu, keyboard navigation and contact remain usable",()=>{
 assert.match(css,/\.globalHead\{position:sticky;top:0/);
 assert.match(css,/\.mobileMenu\{/);
 assert.match(jsx,/aria-expanded=\{menu\}/);
 assert.match(jsx,/aria-label="Đóng điều hướng"/);
 assert.match(jsx,/onKeyDownCapture=/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(jsx,/\u2733/);
});
