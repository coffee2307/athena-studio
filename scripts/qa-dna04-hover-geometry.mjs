import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const files={
 "architecture-studio":"architecture-sovereign.module.css",
 "construction-firm":"construction-sovereign.module.css",
 "education-platform":"education-sovereign.module.css",
 "fashion-archive":"runway-sovereign.module.css",
 "hospitality-booking":"hospitality-sovereign.module.css",
 "pet-store":"pets-sovereign.module.css",
 "property-showcase":"property-sovereign.module.css",
 "commerce-standard":"Moc.module.css",
 "creative-studio":"Sora.module.css",
};
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
let sourcePass=0, visualPass=0;
for(const [slug,name] of Object.entries(files)){
 const css=readFileSync("templates/"+slug+"/src/components/"+name,"utf8");
 const matches=[...css.matchAll(/:global\(\[data-dna04-artifact\]:hover\)\{([^}]*)\}/g)];
 assert(matches.length>0,slug+" missing scoped hover style");
 for(const [,rules] of matches)assert(!/border-radius\s*:/.test(rules),slug+" modifies border-radius on hover");
 sourcePass++;
}
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
try{
 for(const slug of Object.keys(files)){
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  try{
   const r=await page.goto(origin+"/template-demos/"+slug,{waitUntil:"load",timeout:45000});
   assert.equal(r?.status(),200,slug+" status");
   const artifacts=page.locator("[data-dna04-artifact]");
   const count=await artifacts.count();
   assert(count>0,slug+" no artifact");
   let target;
   for(let i=0;i<count;i++){
    const candidate=artifacts.nth(i);
    if(await candidate.isVisible()){target=candidate;break;}
   }
   assert(target,slug+" no visible artifact");
   await target.scrollIntoViewIfNeeded();
   await page.mouse.move(0,0);
   const before=await target.evaluate(el=>getComputedStyle(el).borderRadius);
   await target.hover({force:true});
   await page.waitForTimeout(160);
   const after=await target.evaluate(el=>getComputedStyle(el).borderRadius);
   assert.equal(after,before,slug+" corner radius drift: "+before+" -> "+after);
   console.log("PASS",slug,"radius",before);
   visualPass++;
  }finally{await page.close();}
 }
}finally{await browser.close();}
console.log("HOVER_RADIUS_QA",JSON.stringify({sourcePass,visualPass,failed:0}));
