import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync,existsSync} from "node:fs";
const root="components/home/AthenaServiceShowcase.tsx";
const css=readFileSync("app/athena-home-showcase-and-navigation.css","utf8");
const component=readFileSync(root,"utf8");
const projects=readFileSync("data/projects.ts","utf8");
test("The SORA website service preview selects a real portrait screenshot at mobile width",()=>{
 assert.match(component,/<picture>/);
 assert.match(component,/<source media="\(max-width:760px\)" type="image\/webp" srcSet="\/template-previews\/creative-studio-service-mobile.webp"\/>/);
 assert.match(component,/objectFit:"cover"/);
 assert.match(css,/\.dna-browser-preview picture\{position:absolute;inset:0;display:block;overflow:hidden\}/);
 const asset="public/template-previews/creative-studio-service-mobile.webp";
 assert.ok(existsSync(asset)&&statSync(asset).size>15000);
});
test("All four PHAM project screenshots were refreshed and cache-busted",()=>{
 for(const file of ["pham-home-hires.webp","pham-product-hires.webp","pham-home-mobile-hires.webp","pham-product-mobile-hires.webp"]){
  const path="public/portfolio/"+file;
  assert.ok(existsSync(path)&&statSync(path).size>20000,path);
  assert.ok(projects.includes('/portfolio/'+file+'?v=20261103'),"Missing cache-busted project image "+file);
 }
 assert.match(projects,/03\/11\/2026/);
 assert.doesNotMatch(projects,/29\/10\/2026/);
});
test("PHAM remains accurately labeled a founder project, not a customer contract",()=>{
 assert.match(projects,/slug:"pham".*title:"PHAM"/);
 assert.match(projects,/kind:"founder"/);
 assert.match(projects,/rightsVerified:true/);
});
