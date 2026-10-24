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
      const browserErrors = [];
      page.on("pageerror", error => browserErrors.push("pageerror: " + String(error)));
      page.on("console", entry => {if(entry.type()==="error"||entry.type()==="warning") browserErrors.push("console: "+entry.text());});
      try {
        await page.goto(baseURL + "/template-demos/" + slug, {waitUntil: "domcontentloaded", timeout: 30000});
        const stage = page.locator(".immersive-stage");
        const canvas = stage.locator("canvas.ix-3d-canvas");
        await stage.waitFor({state: "visible"});
        // Hero loads as a photo; request WebGL explicitly for evidence.
        const enable = page.locator(".ix-scene-rail").getByRole("button",{name:"Bật chế độ 3D"});
        await enable.click();
        await page.waitForFunction(() => {
          const element = document.querySelector("canvas.ix-3d-canvas");
          return element && element.getAttribute("data-renderer") === "ready";
        }, null, {timeout: 20000});
        const renderer = await canvas.getAttribute("data-renderer");
        const caps = await canvas.evaluate(element => {
          const target = element;
          return {bufferWidth: target.width, bufferHeight: target.height};
        });
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        const primary = slug + "-" + viewport.name + "-01.png";
        await stage.scrollIntoViewIfNeeded();
        // The live 3D stage can remain layout-unstable to Playwright even after WebGL is ready.
        // Capture the visible viewport instead of waiting for element-stability heuristics.
        await page.screenshot({path: resolve(output, primary), animations: "disabled"});
        const record = {slug, viewport: viewport.name, renderer, overflow, ...caps, primary};
        if (overflow > 2) summary.errors.push(slug + ": overflow " + overflow + " px on " + viewport.name);
        if (renderer !== "ready") summary.errors.push(slug + ": WebGL not rendering on " + viewport.name);
        if (renderer === "ready" && caps.bufferWidth * caps.bufferHeight === 0) {
          summary.errors.push(slug + ": GPU framebuffer empty");
        }

        if (viewport.name === "desktop") {
          await page.locator(".ix-scene-rail .ix-mode-list button").nth(2).click();
          await page.waitForTimeout(950);
          const selected = await stage.getAttribute("data-preset");
          if (selected !== "2") summary.errors.push(slug + ": interactive mode selection broken");
          const alternate = slug + "-" + viewport.name + "-03.png";
          await stage.scrollIntoViewIfNeeded();
          await page.screenshot({path: resolve(output, alternate), animations: "disabled"});
          record.alternate = alternate;
        }
        // Capture the actual DOM/photo composition in addition to GPU output.
        const editorial = page.locator(".ix-editorial");
        await editorial.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll(".ix-editorial img")]
          .every(image => image.complete && image.naturalWidth > 0), null, {timeout:15000});
        record.editorial = slug + "-" + viewport.name + "-editorial.png";
        await page.screenshot({path:resolve(output,record.editorial),animations:"disabled"});

        // A real content page must receive the new, section-specific art direction.
        await page.goto(baseURL + "/template-demos/" + slug + "/about", {waitUntil:"domcontentloaded"});
        const subpage = page.locator(".ix-subpage-feature");
        await subpage.waitFor({state:"visible"});
        await page.waitForFunction(() => {
          const image = document.querySelector(".ix-subpage-feature img");
          return image && image.complete && image.naturalWidth > 0;
        },null,{timeout:15000});
        record.subpage = slug + "-" + viewport.name + "-about.png";
        await page.screenshot({path:resolve(output,record.subpage),animations:"disabled"});

        const textureErrors = browserErrors.filter(message =>
          /Couldn't load texture|BLOB_CSP_FAILURE|refused to connect because it violates|asset failed|incomplete 3D render/i.test(message));
        if(textureErrors.length)summary.errors.push(slug + " / " + viewport.name + " GLB TEXTURE FAILED: " + textureErrors.slice(0,3).join(" | "));
        summary.captures.push(record);
        console.log(slug, viewport.name, JSON.stringify(record));
      } catch (error) {
        const actualState = await page.locator("canvas.ix-3d-canvas").getAttribute("data-renderer").catch(() => "missing");
        const pressed = await page.locator(".ix-render-toggle").getAttribute("aria-pressed").catch(() => "missing");
        summary.errors.push(slug + " / " + viewport.name + ": " + String(error) + "; renderer=" + actualState + "; pressed=" + pressed + "; browserErrors=" + JSON.stringify(browserErrors.slice(-6)));
      } finally {
        await page.close();
      }
    }
    await context.close();
  }

  const reducedContext = await browser.newContext({reducedMotion: "reduce"});
  const page = await reducedContext.newPage();
  await page.goto(baseURL + "/template-demos/creative-studio");
  // Reduced-motion deliberately hides the canvas; only DOM attachment is required.
  await page.locator("canvas.ix-3d-canvas").waitFor({state: "attached"});
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
