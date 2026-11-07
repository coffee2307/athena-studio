import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const component=readFileSync("components/layout/ContactDock.tsx","utf8");
const css=readFileSync("app/agency-relaunch.css","utf8");

test("Athena mobile contact dock has three direct contact channels",()=>{
 for(const channel of ['id:"phone"','id:"zalo"','id:"whatsapp"'])assert.match(component,new RegExp(channel));
 assert.match(component,/channels\.filter\(c=>c\.id!=="email"\)/);
 assert.match(component,/className="agency-contact-shortcuts"/);
 assert.doesNotMatch(component,/mobileExpanded|agency-contact-toggle|athena-contact-shortcuts/);
});
test("All three phone/Zalo/WhatsApp actions stay visible and touch sized on mobile",()=>{
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/\.agency-contact-shortcuts\{display:flex;flex-direction:column;align-items:flex-end;gap:8px\}/);
 assert.match(css,/\.agency-contact-dock \.agency-contact-action\{/);
 assert.match(css,/width:48px;/);
 assert.match(css,/height:48px;/);
 assert.doesNotMatch(css,/agency-contact-toggle|\.agency-contact-shortcuts\.is-open|\.agency-contact-shortcuts\{display:none/);
});
