import {defineConfig,devices} from "@playwright/test";
const useInstalledChrome=process.platform==="win32";
const baseURL=process.env.PLAYWRIGHT_BASE_URL??"http://127.0.0.1:3189";
const chromiumExecutable=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const externalChromium=chromiumExecutable?{
 launchOptions:{executablePath:chromiumExecutable,args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]}
}:{};
export default defineConfig({
 testDir:"./tests/e2e",
 fullyParallel:true,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?2:undefined,
 reporter:process.env.CI?[["list"],["html",{open:"never",outputFolder:"playwright-report"}]]:"list",
 use:{baseURL,trace:"retain-on-failure",screenshot:"only-on-failure"},
 projects:[
  {name:"chromium-desktop",use:{...devices["Desktop Chrome"],...(useInstalledChrome&&!chromiumExecutable?{channel:"chrome"}:{}),...externalChromium}},
  {name:"chromium-mobile",use:{...devices["Pixel 7"],...(useInstalledChrome&&!chromiumExecutable?{channel:"chrome"}:{}),...externalChromium}},
  {name:"firefox-desktop",use:{...devices["Desktop Firefox"]}}
 ],
 webServer:{
  command:"npm run start -- -p 3189 -H 127.0.0.1",
  url:baseURL,
  reuseExistingServer:!process.env.CI,
  timeout:90_000,
 },
 timeout:30_000,
 expect:{timeout:10_000},
 outputDir:"test-results",
});
