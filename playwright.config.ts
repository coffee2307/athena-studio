import {defineConfig,devices} from "@playwright/test";
const useInstalledChrome=process.platform==="win32";
export default defineConfig({
 testDir:"./tests/e2e",
 fullyParallel:true,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?2:undefined,
 reporter:process.env.CI?[["list"],["html",{open:"never",outputFolder:"playwright-report"}]]:"list",
 use:{baseURL:"http://127.0.0.1:3189",trace:"retain-on-failure",screenshot:"only-on-failure"},
 projects:[
  {name:"chromium-desktop",use:{...devices["Desktop Chrome"],...(useInstalledChrome?{channel:"chrome"}:{})}},
  {name:"chromium-mobile",use:{...devices["Pixel 7"],...(useInstalledChrome?{channel:"chrome"}:{})}},
  {name:"firefox-desktop",use:{...devices["Desktop Firefox"]}}
 ],
 webServer:{
  command:"npm run start -- -p 3189 -H 127.0.0.1",
  url:"http://127.0.0.1:3189",
  reuseExistingServer:!process.env.CI,
  timeout:90_000,
 },
 timeout:30_000,
 expect:{timeout:10_000},
 outputDir:"test-results",
});
