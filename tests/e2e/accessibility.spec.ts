import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for(const route of ["/","/dich-vu","/du-an","/du-an/pham","/lien-he","/phap-ly","/dang-nhap","/dang-ky","/quen-mat-khau","/san-pham/sitepulse"]){
 test("Automated WCAG 2.2 A/AA accessibility: "+route,async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto(route);
  const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 });
}
