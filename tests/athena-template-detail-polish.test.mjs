import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=f=>readFileSync(f,"utf8");
test("Standalone Next, Digital Creators, Qrio preserve a reachable minimizable Athena panel",()=>{
 const chrome=read("components/layout/SiteChrome.tsx");
 const popup=read("components/templates/TemplateExperienceInfo.tsx");
 const digital=read("public/athena-digital-demo-info.js");
 const qrio=read("public/athena-qrio-demo-info.js");
 for(const html of ["public/immersive/qrio/index.html","public/immersive/qrio/home.html"]){
  assert.match(read(html),/athena-qrio-demo-info\.js/);
  assert.match(read(html),/athena-demo-info\.css/);
 }
 assert.match(chrome,/TemplateExperienceInfo slug=/);
 assert.match(popup,/window\.sessionStorage\.getItem\(key\)!=="collapsed"/);
 assert.match(popup,/Quay lại thư viện/);
 assert.match(popup,/toggle\(false\)/);
 assert.match(popup,/toggle\(true\)/);
 assert.doesNotMatch(digital,/get\("athenaInfo"\)/);
 assert.match(digital,/setExpanded\(window\.sessionStorage\.getItem\(key\)!=="collapsed"\)/);
 assert.match(qrio,/expand\(false\)/);
 assert.match(qrio,/expand\(true\)/);
 assert.match(qrio,/window\.self!==window\.top/);
});
test("Close X is borderless and MỘC/Poppy add strokes are centered",()=>{
 const modal=read("app/template-revamp.css");
 const moc=read("templates/commerce-standard/src/components/Moc.module.css");
 const m=read("templates/commerce-standard/src/components/Site.tsx");
 const poppy=read("templates/pet-store/src/components/PoppyMarket.module.css");
 const p=read("templates/pet-store/src/components/PoppyMarket.tsx");
 assert.match(modal,/template-demo-close\s*\{[\s\S]*?border:0!important/);
 assert.match(moc,/\.plusMark::before,\.plusMark::after/);
 assert.match(moc,/transform:translate\(-50%,-50%\)/);
 assert.match(m,/className=\{s\.plusMark\}/);
 assert.match(poppy,/\.addGlyph::before,\.addGlyph::after/);
 assert.match(poppy,/\.drawerHead button\{border:0!important/);
 assert.match(p,/className=\{s\.addGlyph\}/);
});
test("Editorial copy no longer uses serial-number headings and generic CTA arrows",()=>{
 const sola=read("templates/creative-studio/src/components/Site.tsx");
 const fashion=read("templates/fashion-archive/src/components/Site.tsx");
 const food=read("templates/hospitality-booking/src/components/Site.tsx");
 const arch=read("templates/architecture-studio/src/components/ArchitectureExperience.tsx");
 const digital=read("vendor/digital-creators/src/App.tsx");
 assert.doesNotMatch(sola,/0\{i\+1\}\s*\/\s*\{project\.type\}/);
 assert.doesNotMatch(fashion,/\{look\.id\}\s*\/\s*\{look\.kind\}/);
 assert.doesNotMatch(food,/0\{i\+1\}\s*\/\s*\{d\.english\}/);
 assert.doesNotMatch(arch,/0\{i\+1\}\s*\/\s*\{p\.type\}/);
 assert.doesNotMatch(digital,/\{activity\.number\}\s*\/\s*DỰ KIẾN/);
});
