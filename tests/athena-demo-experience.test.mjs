import {readFileSync} from "node:fs";
import {test} from "node:test";
import assert from "node:assert/strict";
const read=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
test("mobile gallery navigates straight to real demo, desktop retains modal",()=>{
 const source=read("components/templates/TemplateGallery.tsx");
 assert.match(source,/matchMedia\("\(max-width: 760px\)"\)/);
 assert.match(source,/window\.location\.assign\(path\)/);
 assert.match(source,/setSelected\(item\)/);
 assert.match(source,/openExperience\(item\)/);
 assert.match(source,/TemplateDemoModal template=\{selected\}/);
});
test("floating demo information excludes embedded previews and handles subpages",()=>{
 const site=read("components/layout/SiteChrome.tsx");
 const widget=read("components/templates/TemplateExperienceInfo.tsx");
 assert.match(site,/TemplateExperienceInfo slug=\{pathname\.split\("\/"\)\[2\]\}/);
 assert.match(widget,/window\.self===window\.top/);
 assert.match(widget,/get\("embed"\)!=="1"/);
 assert.match(widget,/window\.sessionStorage/);
 assert.match(widget,/Escape/);
 assert.match(widget,/template\.estimatedPrice/);
});
test("desktop modal controls and sidebar remain unchanged",()=>{
 const modal=read("components/templates/TemplateDemoModal.tsx");
 assert.match(modal,/dialogRef\.current/);
 assert.match(modal,/setDevice\("desktop"\)/);
 assert.match(modal,/setDevice\("mobile"\)/);
 assert.match(modal,/template-demo-info/);
});
test("Digital Creators standalone deploy receives independent overlay",()=>{
 const html=read("public/immersive/digital-creators/index.html");
 const js=read("public/athena-digital-demo-info.js");
 const css=read("public/athena-demo-info.css");
 assert.match(html,/athena-demo-info\.css/);
 assert.match(html,/athena-digital-demo-info\.js/);
 assert.match(js,/window\.self!==window\.top/);
 assert.match(js,/sessionStorage/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/min-width:44px/);
});
