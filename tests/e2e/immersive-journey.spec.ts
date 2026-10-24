import {test,expect} from "@playwright/test";

const scenes = ["creative-studio","architecture-studio","auto-showroom"] as const;

for (const slug of scenes) {
  test("3D scroll narrative and accessible chapters: " + slug,async({page}) => {
    await page.goto("/template-demos/" + slug);
    const launch = page.getByRole("link",{name:/Trải nghiệm 3D/});
    await expect(launch).toHaveAttribute("href","/template-demos/" + slug + "/experience");
    await launch.click();
    await expect(page).toHaveURL(new RegExp("/template-demos/" + slug + "/experience"));
    const journey = page.locator(".athena-journey");
    const stage = journey.locator(".journey-stage");
    const renderer = stage.locator("canvas.ix-3d-canvas");
    await expect(journey.locator("#journey-title")).toBeVisible();
    await expect(renderer).toHaveCount(1);
    await expect(journey.locator(".journey-step")).toHaveCount(3);

    const chapters = journey.locator(".journey-chapter-nav button");
    await expect(chapters).toHaveCount(3);
    await chapters.nth(1).click();
    await expect(chapters.nth(1)).toHaveAttribute("aria-current","step",{timeout:15000});
    await expect(journey.locator(".journey-step-copy.is-current")).toContainText(/Thay đổi điểm nhìn|Lớp không gian ẩn|Hình khối có chủ đích/);

    await journey.getByRole("button",{name:"TẮT 3D"}).click();
    await expect(journey.getByRole("button",{name:"BẬT 3D"})).toHaveAttribute("aria-pressed","false");
    await expect(renderer).toHaveAttribute("data-renderer","fallback");
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

test("reduced motion preserves all story content and native scrolling",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.setViewportSize({width:390,height:844});
  await page.goto("/template-demos/architecture-studio/experience");
  await expect(page.locator(".athena-journey .journey-step")).toHaveCount(3);
  await expect(page.locator(".athena-journey canvas.ix-3d-canvas")).toHaveAttribute("data-renderer","fallback");
  await page.getByRole("button",{name:"Đến chương 3"}).click();
  await expect(page.getByRole("button",{name:"Đến chương 3"})).toHaveAttribute("aria-current","step");
});
