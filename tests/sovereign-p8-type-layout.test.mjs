import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const targets=[
 ["creative-studio","Sora.module.css","s.drawerX"],
 ["modern-corporate","North.module.css","s.panelTop"],
 ["commerce-standard","Moc.module.css","s.browseClose"]
];
const root=new URL("../",import.meta.url);
for(const [slug,css,close] of targets){
 const source=readFileSync(new URL("templates/"+slug+"/src/components/Site.tsx",root),"utf8");
 const style=readFileSync(new URL("templates/"+slug+"/src/components/"+css,root),"utf8");
 test(slug+" / no banned Georgian or Times font in authored CSS",()=>{
  assert.doesNotMatch(style,/\bGeorgia\b|Times New Roman/);
  assert.match(style,/Noto Serif|Be Vietnam Pro/);
  assert.match(source,/aria-label="Đóng (?:mục lục|danh mục|điều hướng)"/);
 });
 test(slug+" / one X-only close button within its mobile menu",()=>{
  assert.equal((source.match(new RegExp("className=\\{"+close.replace(".","\\.")+"\\}","g"))||[]).length,1);
  assert.match(source,/aria-hidden="true">×<\/span><\/button>/);
  assert.doesNotMatch(source,/(?:Khép lại trang này|>Khép lại <span|>Đóng <span)/);
 });
}
test("SORA card flow has no deliberate negative card margin",()=>{
 const css=readFileSync(new URL("templates/creative-studio/src/components/Sora.module.css",root),"utf8");
 assert.doesNotMatch(css,/\.project:nth-child\(3\)\{[^}]*margin-top:\s*-/);
});
