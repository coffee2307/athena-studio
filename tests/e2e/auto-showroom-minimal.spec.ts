import {expect,test} from "@playwright/test";

const base="/template-demos/auto-showroom";
const pages=[
 {path:"/work",section:"work",heading:"ONE CAR."},
 {path:"/work/1",section:"detail",heading:""},
 {path:"/services",section:"services",heading:"DESIGNED"},
 {path:"/about",section:"about",heading:"LESS NOISE."},
 {path:"/contact",section:"contact",heading:"LET'S TALK"}
];
for(const item of pages){
 test("VELAR subpage is distinct and image-free: "+item.section,async({page})=>{
  const result=await page.goto(base+item.path,{waitUntil:"domcontentloaded"});
  expect(result?.status()).toBe(200);
  const main=page.locator("main.velar-"+item.section);
  await expect(main).toBeVisible();
  await expect(main.getByRole("heading",{level:1})).toBeVisible();
  if(item.heading)await expect(main.getByRole("heading",{level:1})).toContainText(item.heading);
  expect(await main.locator("img").count()).toBe(0);
  expect(await page.locator(".ix-subpage-feature").count()).toBe(0);
  expect(await page.locator('img[src*="black-velocity-study"]').count()).toBe(0);
 });
}

test("Contact demo confirms without sending a request",async({page})=>{
 await page.goto(base+"/contact");
 await page.getByLabel("Tên của bạn *").fill("Nguyen Van A");
 await page.getByLabel("Email *").fill("example@example.com");
 await page.getByLabel("Nội dung quan tâm *").selectOption({index:1});
 await page.getByLabel("Lời nhắn *").fill("Tôi muốn tham khảo trải nghiệm showroom số.");
 await page.getByRole("button",{name:"THỬ GỬI YÊU CẦU"}).click();
 await expect(page.getByRole("status")).toContainText("Không có dữ liệu nào được chuyển đi.");
});

test("Main cinematic canvas fills the width instead of cropping its left 21%",async({page})=>{
 await page.goto(base,{waitUntil:"domcontentloaded"});
 await expect.poll(async()=>page.evaluate(()=>{
  const node=document.querySelector<HTMLCanvasElement>(".bv-cinematic-track canvas.ix-auto-3d-canvas");
  if(!node?.parentElement)return false;
  const r=node.getBoundingClientRect();const parent=node.parentElement.getBoundingClientRect();
  return r.left-parent.left<=1&&r.width>=parent.width-.5;
 }),{timeout:10000}).toBe(true);
});
