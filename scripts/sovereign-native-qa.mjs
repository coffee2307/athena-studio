/** Physical source parity is checked by sovereign-digital-creators-sync.mjs.
 * This browser QA checks native Vite preview AND Athena demo redirect independently.
 * Both run on localhost only; emulated mobile is not physical iPhone Safari.
 */
import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const websites=[
 {name:"native-export",url:process.env.DIGITAL_EXPORT_URL||"http://127.0.0.1:5178/#/"},
 {name:"athena-demo",url:process.env.ATHENA_DIGITAL_URL||"http://127.0.0.1:3182/template-demos/digital-creators"}
];
const dir=".qa/athena-21-sovereign/p4-digital-native";
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
for(const target of websites){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 try{
  const response=await page.goto(target.url,{waitUntil:"domcontentloaded",timeout:45000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.locator("#root").waitFor({timeout:15000});
  await page.waitForTimeout(450);
  const initial=await page.evaluate(()=>({
   title:document.title,
   heading:document.querySelector("h1")?.textContent?.trim().slice(0,180),
   scrollOverflow:document.documentElement.scrollWidth-innerWidth,
   navToggle:!!document.querySelector(".dc-constellation-toggle"),
   hasRubik:!!document.querySelector("canvas, .rubik-hero, [data-rubik]")
  }));
  if(!initial.navToggle)throw Error("Missing native creative atlas menu");
  if(!initial.heading)throw Error("Missing heading");
  if(initial.scrollOverflow>3)throw Error("Mobile horizontal overflow "+initial.scrollOverflow);
  await page.screenshot({path:dir+"/"+target.name+"-mobile.png",animations:"disabled",timeout:25000});
  const toggle=page.locator(".dc-constellation-toggle");
  await toggle.click();
  await page.locator(".dc-constellation-nav").waitFor({state:"visible",timeout:10000});
  await page.screenshot({path:dir+"/"+target.name+"-menu.png",animations:"disabled",timeout:25000});
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const escaped=await toggle.getAttribute("aria-expanded");
  if(escaped!=="false")throw Error("Escape did not close native menu: "+escaped);
  if(errors.length)throw Error("Page errors "+errors.join("; ").slice(0,350));
  results.push({name:target.name,url:target.url,...initial});
  console.log("DIGITAL_NATIVE_BROWSER_PASS",target.name,initial.title,initial.heading);
 }catch(e){failures.push({name:target.name,error:String(e)});console.log("DIGITAL_NATIVE_BROWSER_FAIL",target.name,String(e));}
 await page.close();
}
await browser.close();
writeFileSync(dir+"/qa.json",JSON.stringify({results,failures,platform:"Chromium mobile emulation 390x844"},null,2)+"\n");
console.log("DIGITAL_NATIVE_QA",JSON.stringify({passed:results.length,failed:failures.length,required:2}));
if(failures.length||results.length!==2)process.exitCode=1;
