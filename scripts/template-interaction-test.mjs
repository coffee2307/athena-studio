import {chromium} from "@playwright/test";
const browser=await chromium.launch({headless:true,executablePath:process.platform==="win32"?"C:/Program Files/Google/Chrome/Application/chrome.exe":undefined});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const slugs=["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","editorial-journal","architecture-studio","wellness-clinic","property-showcase","education-platform"];
const errors=[];page.on("pageerror",error=>errors.push(error.message));
for(const slug of slugs){
 await page.goto("http://localhost:3000/template-demos/"+slug,{waitUntil:"domcontentloaded"});
 const buttons=page.locator(".template-demo-filters button");
 const count=await buttons.count();
 for(let i=1;i<count;i++){
  await buttons.nth(i).click();
  const cards=await page.locator(".template-demo-card").count();
  if(cards===0)throw new Error(slug+" category "+i+" empty");
 }
 console.log("FILTER",slug,"OK");
}
await page.goto("http://localhost:3000/template-demos/commerce-standard",{waitUntil:"networkidle"});
await page.getByRole("button",{name:/Thêm vào túi/}).first().click();
if(await page.locator(".template-demo-cart-panel").count()!==1)throw new Error("Cart panel missing");
if(!await page.locator(".template-demo-cart-panel").innerText().then(s=>s.includes("1 sản phẩm")))throw new Error("Cart count missing");
await page.getByRole("button",{name:"Xóa túi thử nghiệm"}).click();
await page.getByRole("button",{name:"Đóng giỏ hàng"}).click();
console.log("CART OK");
await page.clock.install();
await page.goto("http://localhost:3000/template-demos/editorial-journal",{waitUntil:"networkidle"});
await page.clock.fastForward(301000);
if(await page.getByText("Bạn có thích mẫu này?").count()!==1)throw new Error("5 minute invitation missing");
await page.getByRole("button",{name:"Tiếp tục xem demo"}).click();
console.log("5 MINUTE PROMPT OK");
console.log("PAGE_ERRORS",errors.length,JSON.stringify(errors.slice(0,3)));
await browser.close();
