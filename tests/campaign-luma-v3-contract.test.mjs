import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const root=new URL("../",import.meta.url);
const read=(p)=>readFileSync(new URL(p,root),"utf8");
const campaign=read("templates/campaign-landing/src/components/Site.tsx");
const campaignCss=read("templates/campaign-landing/src/components/campaign-sovereign.module.css");
const luma=read("templates/saas-product/src/components/Site.tsx");
const lumaCss=read("templates/saas-product/src/components/workspace-sovereign.module.css");
test("MỞ has an original living poster and three real interactive chapters",()=>{
 assert.match(campaign,/THÀNH PHỐ/);
 assert.match(campaign,/LÀ SÂN/);
 assert.match(campaign,/KHẤU/);
 assert.match(campaign,/chapters\.map/);
 assert.match(campaign,/aria-pressed=\{active===i\}/);
 assert.match(campaign,/setActive\(i\)/);
 assert.match(campaign,/data-dna04-artifact="campaign-landing-posterStage"/);
 assert.match(campaign,/image:0/);
 assert.match(campaignCss,/\.posterStage\{/);
 assert.match(campaignCss,/\.heroArt\{/);
 assert.match(campaignCss,/\.chapterButton\[aria-pressed="true"\]/);
 assert.doesNotMatch(campaign,/onPointerMove|dna04Pointer|window\.addEventListener\("mousemove"/);
});
test("LUMA offers real task state, visible filter and live derived progress",()=>{
 assert.match(luma,/useState<Task\[\]>\(seed\)/);
 assert.match(luma,/setTasks\(prev=>\[/);
 assert.match(luma,/function advance\(id:number\)/);
 assert.match(luma,/aria-pressed=\{filter===key\}/);
 assert.match(luma,/aria-valuenow=\{progress\}/);
 assert.match(luma,/Lọc công việc theo vai trò/);
 assert.match(luma,/function reset\(\)/);
 assert.match(luma,/data-luma-workspace/);
 assert.match(lumaCss,/\.workspace\{/);
 assert.match(lumaCss,/\.boardColumns\{/);
 assert.match(lumaCss,/\.progressTrack\{/);
 assert.doesNotMatch(luma,/onPointerMove|dna04Pointer|localStorage\.setItem|fetch\(/);
});
test("both websites remain standalone, multi-page, accessible and non-deceptive",()=>{
 const slugs=["campaign-landing","saas-product"];
 assert.notEqual(campaign,luma);
 assert.notEqual(campaignCss,lumaCss);
 for(const [i,slug] of slugs.entries()){
  const src=i===0?campaign:luma;
  const css=i===0?campaignCss:lumaCss;
  const data=JSON.parse(read("templates/"+slug+"/src/data/site.json"));
  assert.ok(data.brand);
  assert.match(src,/site\.brand/);
  for(const section of ["home","work","detail","services","about","contact"])
   assert.match(src,new RegExp('section==="'+section+'"'),slug+" missing "+section);
  assert.match(src,/window\.location\.href="mailto:\?subject="/);
  assert.doesNotMatch(src,/hello@example\.com|đã gửi thành công|thanh toán ngay|✳/);
  assert.match(src,/inert=\{!menu\}/);
  assert.match(src,/aria-expanded=\{menu\}/);
  if(i===0)assert.match(src,/prefers-reduced-motion/);
  assert.match(css,/@media\(max-width:650px\)|@media\(max-width:560px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(css,/--dna04-(?:tilt|shift|point)|transition:\s*all/i);
  assert.ok(existsSync(new URL("templates/"+slug+"/package-lock.json",root)));
 }
});
