import {chromium} from "@playwright/test";
import {mkdir, writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const baseURL = (process.env.ATHENA_QA_BASE_URL || "http://127.0.0.1:3189").replace(/\/$/, "");
const output = resolve(process.env.ATHENA_QA_OUTPUT || "artifacts/immersive-qa");
const worlds = ["creative-studio", "architecture-studio", "auto-showroom"];
const viewports = [
  {name: "desktop", width: 1440, height: 900, isMobile: false},
  {name: "mobile", width: 390, height: 844, isMobile: true},
];
const summary = {baseURL, capturedAt: new Date().toISOString(), captures: [], errors: []};
await mkdir(output, {recursive: true});

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: {width: viewport.width, height: viewport.height},
      deviceScaleFactor: 1,
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
    });
    for (const slug of worlds) {
      const page = await context.newPage();
      try {
        await page.goto(baseURL + "/template-demos/" + slug, {waitUntil: "domcontentloaded", timeout: 30000});
        const stage = page.locator(".immersive-stage");
        const canvas = stage.locator("canvas.ix-3d-canvas");
        await stage.waitFor({state: "visible"});
        await page.waitForFunction(() => {
          const element = document.querySelector("canvas.ix-3d-canvas");
          return element && element.getAttribute("data-renderer") !== "loading";
        }, {timeout: 20000});
        const renderer = await canvas.getAttribute("data-renderer");
        const caps = await canvas.evaluate(element => {
          const target = element;
          return {bufferWidth: target.width, bufferHeight: target.height};
        });
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        const primary = slug + "-" + viewport.name + "-01.png";
        await page.screenshot({path: resolve(output, primary), animations: "disabled"});
        const record = {slug, viewport: viewport.name, renderer, overflow, ...caps, primary};
        if (overflow > 2) summary.errors.push(slug + ": overflow " + overflow + " px on " + viewport.name);
        if (renderer !== "ready") summary.errors.push(slug + ": WebGL not rendering on " + viewport.name);
        if (renderer === "ready" && caps.bufferWidth * caps.bufferHeight === 0) {
          summary.errors.push(slug + ": GPU framebuffer empty");
        }

        if (viewport.name === "desktop") {
          await stage.locator(".ix-mode-list button").nth(2).click();
          await page.waitForTimeout(950);
          const selected = await stage.getAttribute("data-preset");
          if (selected !== "2") summary.errors.push(slug + ": interactive mode selection broken");
          const alternate = slug + "-" + viewport.name + "-03.png";
          await page.screenshot({path: resolve(output, alternate), animations: "disabled"});
          record.alternate = alternate;
        }
        summary.captures.push(record);
        console.log(slug, viewport.name, JSON.stringify(record));
      } catch (error) {
        summary.errors.push(slug + " / " + viewport.name + ": " + String(error));
      } finally {
        await page.close();
      }
    }
    await context.close();
  }

  const reducedContext = await browser.newContext({reducedMotion: "reduce"});
  const page = await reducedContext.newPage();
  await page.goto(baseURL + "/template-demos/creative-studio");
  await page.locator("canvas.ix-3d-canvas").waitFor();
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas.ix-3d-canvas");
    return canvas?.getAttribute("data-renderer") === "fallback";
  });
  summary.reducedMotionFallback = true;
  await reducedContext.close();
} catch (error) {
  summary.errors.push("Global QA error: " + String(error));
} finally {
  await browser.close();
  await writeFile(resolve(output, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
}
console.log("IMMERSIVE_QA_SUMMARY", JSON.stringify(summary));
if (summary.errors.length) process.exitCode = 1;
