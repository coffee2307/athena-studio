import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {join,resolve} from "node:path";

const root=resolve(import.meta.dirname,"..");
const read=path=>readFileSync(join(root,path),"utf8");
const registry=JSON.parse(read("data/templates.json"));
const versions=JSON.parse(read("data/template-preview-versions.json"));
const removed=["editorial-journal","music-label","live-concert","team-intranet","engineering-industry","finance-trust"];
// These templates have approved separate VI/EN screenshots, in addition to legacy covers.
const localized=["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","architecture-studio","pet-store","auto-showroom","digital-creators"];

test("the reduced gallery has exactly 15 standalone demos and no removed exposure",()=>{
 assert.equal(registry.length,15);
 assert.equal(new Set(registry.map(item=>item.slug)).size,15,"duplicate template slug");
 for(const slug of removed){
  assert.equal(registry.some(item=>item.slug===slug),false,slug);
  assert.equal(existsSync(join(root,"templates",slug,"package.json")),false,slug+" removed standalone source remains");
 }
 for(const item of registry)assert.ok(existsSync(join(root,"templates",item.slug,"package.json")),item.slug+" has no standalone build");
});

test("all default and language-specific covers exist and match published SHA-256 versions",()=>{
 const expectedKeys=[
  ...registry.map(item=>item.slug),
  ...localized.flatMap(slug=>[slug+"-vi",slug+"-en"])
 ].sort();
 assert.deepEqual(Object.keys(versions).sort(),expectedKeys,"unaccounted locale or cover version");
 for(const key of expectedKeys){
  const ext=key==="digital-creators"?".png":".jpg";
  const asset=join(root,"public/template-previews",key+ext);
  assert.ok(existsSync(asset),key+" cover missing");
  const content=readFileSync(asset);
  assert.ok(content.length>10000,key+" appears truncated");
  assert.equal(versions[key],createHash("sha256").update(content).digest("hex").slice(0,16),key+" version does not match asset");
 }
});

test("gallery and homepage use the same locale-aware, versioned preview resolver",()=>{
 const preview=read("components/templates/TemplatePreview.tsx");
 const home=read("components/home/HomeTemplateShowcase.tsx");
 const localizedImage=read("components/templates/LocalizedTemplateImage.tsx");
 const resolver=read("lib/template-preview-image.ts");
 assert.match(preview,/getTemplatePreviewSrc\(template.slug,language\)/,"gallery must pass UI language");
 assert.match(home,/LocalizedTemplateImage slug=\{item.slug\}/,"home cards must use localized image");
 assert.match(localizedImage,/getTemplatePreviewSrc\(slug,language\)/,"home and gallery must share resolver");
 assert.match(resolver,/versions\[slug\+"-"\+language\]/,"locale cover hashes must be applied");
 assert.doesNotMatch(preview,/capturedHomepages/,"legacy preview mapping should not return");
});
