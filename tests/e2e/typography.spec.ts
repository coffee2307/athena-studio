import {test,expect} from "@playwright/test";

// Vietnamese accent regression: ensure our own WOFF2 files back the typography.
test("Vietnamese glyphs use locally bundled fonts with safe heading metrics", async ({page}) => {
  await page.goto("/");
  const detail=await page.evaluate(async()=>{
    const sample="Tiếng Việt: ý tưởng về một thế giới mới — Đặng, Huyền, Nguyễn, ề ễ ệ ứ ữ ự";
    await document.fonts.ready;
    const sans=await document.fonts.load('600 48px "Be Vietnam Pro"',sample);
    const serif=await document.fonts.load('italic 400 48px "Noto Serif"',sample);
    const heading=document.querySelector("h1");
    const body=getComputedStyle(document.body);
    const style=heading?getComputedStyle(heading):null;
    return {
      sansCount:sans.length,
      serifCount:serif.length,
      bodyFamily:body.fontFamily,
      titleFamily:style?.fontFamily??"",
      fontSize:style?parseFloat(style.fontSize):0,
      lineHeight:style?parseFloat(style.lineHeight):0,
      letterSpacing:style?parseFloat(style.letterSpacing):0,
    };
  });
  expect(detail.sansCount).toBeGreaterThan(0);
  expect(detail.serifCount).toBeGreaterThan(0);
  expect(detail.bodyFamily).toContain("Be Vietnam Pro");
  expect(detail.titleFamily).toContain("Be Vietnam Pro");
  expect(detail.lineHeight).toBeGreaterThanOrEqual(detail.fontSize*1.1);
  expect(detail.letterSpacing).toBeGreaterThan(-0.05*detail.fontSize);
});
