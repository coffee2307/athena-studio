import {test, expect} from "@playwright/test";

const worlds = [
  "creative-studio",
  "architecture-studio",
  "auto-showroom",
] as const;

for (const slug of worlds) {
  test(slug + ": real WebGL scene can be toggled off without losing controls", async ({page}) => {
    await page.goto("/template-demos/" + slug);
    const stage = page.locator(".immersive-stage");
    const canvas = stage.locator("canvas.ix-3d-canvas");
    const fallback = stage.locator(".ix-hero-photograph");
    const rail = page.locator(".ix-scene-rail");
    const toggle = rail.getByRole("button", {name: "Bật chế độ 3D"});

    await expect(stage).toBeVisible();
    await expect(canvas).toHaveCount(1);
    await expect(fallback).toBeVisible();
    await expect(canvas).toHaveAttribute("data-renderer", /^(ready|fallback)$/, {timeout: 15000});
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(rail.getByRole("button", {name: "Tắt chế độ 3D"})).toHaveAttribute("aria-pressed", "true");
    await expect(canvas).toHaveAttribute("data-renderer", slug==="auto-showroom"?"ready":/^(ready|fallback)$/, {timeout: 30000});
    if(slug==="auto-showroom")await expect(canvas).toHaveAttribute("data-geometry","gltf-draco-mclaren");
    // WebGL context availability is machine-dependent. 3D must be live
    // where supported; otherwise the image fallback must remain usable.
    const state = await canvas.getAttribute("data-renderer");
    if (state === "ready") {
      const size = await canvas.evaluate(element => {
        const canvasElement = element as HTMLCanvasElement;
        return {width: canvasElement.width, height: canvasElement.height};
      });
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    }

    await rail.getByRole("button", {name: "Tắt chế độ 3D"}).click();
    await expect(rail.getByRole("button", {name: "Bật chế độ 3D"})).toHaveAttribute("aria-pressed", "false");
    await expect(canvas).toHaveAttribute("data-renderer", "fallback");
    await expect(fallback).toBeVisible();

    await rail.locator(".ix-mode-list button").nth(2).click();
    await expect(stage).toHaveAttribute("data-preset", "2");
    await rail.getByRole("button", {name: "Bật chế độ 3D"}).click();
    await expect(rail.getByRole("button", {name: "Tắt chế độ 3D"})).toHaveAttribute("aria-pressed", "true");
  });
}

test("reduced-motion visitors see the photo, never an animated WebGL stage", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/template-demos/creative-studio");
  const scene = page.locator("canvas.ix-3d-canvas");
  await expect(scene).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator(".immersive-stage .ix-hero-photograph")).toBeVisible();
});
