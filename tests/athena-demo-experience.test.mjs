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
test("immersive showroom defaults to zoom-in info to keep car CTA and camera controls accessible",()=>{
 const widget=read("components/templates/TemplateExperienceInfo.tsx");
 assert.match(widget,/useState\(slug!=="auto-showroom"\)/);
 assert.match(widget,/if\(slug==="auto-showroom"\)\{setExpanded\(false\);return;\}/);
 assert.match(widget,/athena-demo-float-handle/);
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

test("Zoom controls and CSS animation replace three dots on all demos",()=>{
 const widget=read("components/templates/TemplateExperienceInfo.tsx");
 const digital=read("public/athena-digital-demo-info.js");
 const css=read("public/athena-demo-info.css");
 assert.match(widget,/<ZoomIcon out\/>/);
 assert.match(widget,/<ZoomIcon\/>/);
 assert.doesNotMatch(widget,/•••/);
 assert.match(widget,/inert=\{!expanded\}/);
 assert.match(digital,/const lens=/);
 assert.doesNotMatch(digital,/•••/);
 assert.match(css,/transition:opacity/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test("SORA removes redundant instruction and arrows, keeps page picker",()=>{
 const src=read("templates/creative-studio/src/components/SoraLivingCover.tsx");
 assert.doesNotMatch(src,/KÉO ẢNH ĐỂ ĐỔI TRANG/);
 assert.doesNotMatch(src,/livingArtworkControls|livingArrows/);
 assert.match(src,/livingPagePicker/);
});
test("Poppy hero uses portrait mobile image and cover instead of letterboxing",()=>{
 const page=read("app/services/web-development/templates/page.tsx");
 const css=read("app/template-revamp.css");
 assert.match(page,/pet-store-hero-mobile.webp/);
 assert.match(page,/media="\(max-width:760px\)"/);
 assert.match(page,/pet-store-hero-desktop.webp/);
 assert.match(page,/media="\(min-width:761px\)"/);
 assert.match(page,/objectFit:"contain"/);
 assert.match(css,/ATHENA PET HERO ART DIRECTION/);
});
