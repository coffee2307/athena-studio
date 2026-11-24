import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=f=>readFileSync(f,"utf8");
test("Athena preserves template-specific popups and restores the native demo information",()=>{
 const chrome=read("components/layout/SiteChrome.tsx");
 assert.match(chrome,/TemplateExperienceInfo/);
 const native=read("public/athena-digital-demo-info.js");
 assert.doesNotMatch(native,/get\("athenaInfo"\)/);
 assert.match(native,/sessionStorage\.getItem\(key\)!=="collapsed"/);
 const lib=read("components/templates/TemplateGallery.tsx");
 assert.match(lib,/template-card-content/);
});
test("An Nhiên has a separate intentional wellness journal and reduced-motion alternative",()=>{
 const src=read("templates/wellness-clinic/src/components/Site.tsx");
 const journal=read("templates/wellness-clinic/src/components/WellnessJournal.tsx");
 const css=read("templates/wellness-clinic/src/components/WellnessJournal.module.css");
 assert.match(src,/WellnessJournal basePath/);
 assert.match(journal,/setSelected\(i\)/);
 assert.match(journal,/aria-pressed=\{selected===i\}/);
 assert.match(journal,/không thay thế tư vấn sức khỏe/);
 assert.match(css,/an-nhien-bloom/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test("NEST has separate conceptual exploration with meaningful input, not fabricated listings",()=>{
 const src=read("templates/property-showcase/src/components/Site.tsx");
 const plan=read("templates/property-showcase/src/components/NESTWalkthrough.tsx");
 const css=read("templates/property-showcase/src/components/NESTWalkthrough.module.css");
 assert.match(src,/NESTWalkthrough basePath/);
 assert.match(plan,/setActive\(2\)/);
 assert.match(plan,/type="checkbox"/);
 assert.match(plan,/KHÔNG CÓ TỶ LỆ THỰ/);
 assert.match(css,/nest-reveal/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test("Responsive touch targets and industry-specific motion use independent scoped styles",()=>{
 const school=read("templates/education-platform/src/components/Classroom.module.css");
 const nest=read("templates/property-showcase/src/components/NEST.module.css");
 const digital=read("public/athena-demo-info.css");
 const north=read("templates/modern-corporate/src/components/North.module.css");
 const terra=read("templates/construction-firm/src/components/SiteJournal.module.css");
 assert.match(school,/\.header \.menu\{min-width:44px;min-height:44px/);
 assert.match(nest,/\.photoNavigation button\{min-width:44px;min-height:44px/);
 assert.match(digital,/dc-constellation-toggle/);
 assert.match(north,/\.globalHead :is\(a,button\)\{min-height:44px/);
 assert.doesNotMatch(north,/@keyframes/);
 assert.match(terra,/terra-field-wipe/);
});
