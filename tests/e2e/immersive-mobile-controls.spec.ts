import {test, expect} from "@playwright/test";

const slugs = ["creative-studio", "architecture-studio", "auto-showroom"] as const;

for (const slug of slugs) {
  test(`immersive ${slug}: mobile controls have usable targets without horizontal overflow`, async ({page}) => {
    for (const width of [360, 390]) {
      await page.setViewportSize({width, height: 844});
      await page.goto(`/template-demos/${slug}`);

      const scene = page.locator(".immersive-stage");
      const buttons = page.locator(".ix-mode-list button");
      await expect(scene).toBeVisible();
      await expect(buttons).toHaveCount(3);

      for (let index = 0; index < 3; index++) {
        const size = await buttons.nth(index).evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return {width: rect.width, height: rect.height};
        });
        expect(size.height, `${slug} mode ${index} at ${width}px`).toBeGreaterThanOrEqual(44);
        expect(size.width, `${slug} mode ${index} at ${width}px`).toBeGreaterThanOrEqual(44);
      }

      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(scene).toHaveAttribute("data-preset", "1");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${slug} viewport ${width}px`).toBeLessThanOrEqual(2);
    }
  });
}
