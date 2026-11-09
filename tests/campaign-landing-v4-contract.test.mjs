import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const read=file=>readFileSync(file,"utf8");
const source=read("templates/campaign-landing/src/components/Site.tsx");
const css=read("templates/campaign-landing/src/components/campaign-sovereign.module.css");
test("MỞ Festival V4 keeps an original lightweight cinematic poster and working chapter selection",()=>{
 const manifest=JSON.parse(read("templates/campaign-landing/template.manifest.json"));
 const site=JSON.parse(read("templates/campaign-landing/src/data/site.json"));
 assert.equal(manifest.version,"4.0.0");
 assert.equal(site.images.length,5);
 assert.match(source,/data-active-chapter=\{active\}/);
 assert.match(source,/aria-pressed=\{active===i\}/);
 assert.match(source,/posterDialogRef\.current\?\.showModal\(\)/);
 assert.match(source,/posterDialogRef\.current\?\.close\(\)/);
 assert.match(source,/fetchPriority=\{i===0\?"high":"auto"\}/);
 assert.match(source,/prefers-reduced-motion/);
 assert.doesNotMatch(source,/onPointerMove|requestAnimationFrame|WebGL|THREE/);
 for(const label of ["posterStage","posterChapter","posterModal","posterImages","posterHeadline"])
  assert.match(css,new RegExp("\\."+label+"\\{"),label+" class missing");
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 for(const file of site.images)assert.ok(existsSync("templates/campaign-landing/public"+file),file);
});
test("MỞ V4 gallery covers match exact fingerprinted VI EN and default assets",()=>{
 const versions=JSON.parse(read("data/template-preview-versions.json"));
 for(const suffix of ["","-vi","-en"]){
  const slug="campaign-landing"+suffix;
  const bytes=readFileSync("public/template-previews/"+slug+".jpg");
  assert.ok(bytes.byteLength>80000,slug+" cover unexpectedly small");
  assert.equal(versions[slug],createHash("sha256").update(bytes).digest("hex").slice(0,16));
 }
 assert.deepEqual(readFileSync("public/template-previews/campaign-landing.jpg"),readFileSync("public/template-previews/campaign-landing-vi.jpg"));
 const templates=JSON.parse(read("data/templates.json"));
 const meta=templates.find(t=>t.slug==="campaign-landing");
 assert.equal(meta.version,"4.0.0");
 assert.equal(meta.features.length,5);
 assert.ok(meta.description.includes("poster điện ảnh"));
 assert.match(read("scripts/capture-template-locales-prod.mjs"),/campaign-landing\.jpg/);
});
