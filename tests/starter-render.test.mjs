import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {createRequire,Module} from "node:module";
import {fileURLToPath} from "node:url";
import ts from "typescript";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
const require=createRequire(import.meta.url);
const source=fileURLToPath(new URL("../starter/web-foundation/src/components/StarterHome.tsx",import.meta.url));
const registry=JSON.parse(readFileSync(fileURLToPath(new URL("../data/templates.json",import.meta.url)),"utf8"));
function loadHome(){
 assert.ok(existsSync(source),"StarterHome must render the selected preset instead of a generic page");
 const code=ts.transpileModule(readFileSync(source,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const mod=new Module(source);mod.filename=source;mod.paths=require.resolve.paths("react");mod._compile(code,source);
 return mod.exports.StarterHome;
}
async function setup(){
 const Home=loadHome();
 const {presets}=await import("../starter/web-foundation/src/config/presets.ts");
 return {Home,presets};
}
test("all twelve presets render their own content, semantic layout and working local anchors",async()=>{
 const {Home,presets}=await setup();
 assert.equal(Object.keys(presets).length,12);
 const rendered=new Set();
 for(const [variant,preset] of Object.entries(presets)){
  const template=registry.find(item=>item.variant===variant);
  assert.ok(template,variant+" is registered");
  const html=renderToStaticMarkup(React.createElement(Home,{name:"Studio Kiểm Thử",preset,modules:template.modules,contactEmail:"hello@example.com"}));
  assert.ok(html.includes(preset.heading),variant+" heading");
  if(template.modules.includes("content")||template.modules.includes("catalog"))assert.ok(html.includes(preset.entries[0].title),variant+" actual preset content");
  else assert.doesNotMatch(html,/id="noi-dung"/,variant+" does not expose an unselected content module");
  assert.match(html,/<h1[ >]/);
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),variant+" broken anchor "+id);
  assert.doesNotMatch(html,/<form|Đã (gửi|đặt chỗ)|Thanh toán ngay/);
  rendered.add(preset.layout);
 }
 assert.ok(rendered.size>=3,"At least portfolio, services and products must have different layouts");
 const campaign=registry.find(item=>item.slug==="campaign-landing");
 assert.ok(campaign.modules.includes("content"),"campaign landing exposes its campaign content");
});
test("unselected modules and unconfigured contact do not leave dead links or fake actions",async()=>{
 const {Home,presets}=await setup();
 const html=renderToStaticMarkup(React.createElement(Home,{name:"Studio Kiểm Thử",preset:presets.portfolio,modules:[],contactEmail:""}));
 assert.doesNotMatch(html,/href="#noi-dung"|href="#lien-he"|mailto:|<form/);
 assert.doesNotMatch(html,/id="noi-dung"|id="lien-he"/);
});

test("reserved characters in configured email remain inside the mailto recipient",async()=>{
 const {Home,presets}=await setup();
 const html=renderToStaticMarkup(React.createElement(Home,{name:"Studio",preset:presets.portfolio,modules:["contact"],contactEmail:"hello?subject=Hi@example.com"}));
 assert.match(html,/href="mailto:hello%3Fsubject%3DHi%40example\.com"/);
});
