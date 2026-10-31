# ATHENA: Vietnamese font safety — persistent P8 contract
Approved by user, 2026-11-01.

- Absolutely no Georgia or Times New Roman (including font shorthand and fallbacks) in new or edited Athena Vietnamese UI.
- Fashion Archive: use Be Vietnam Pro for all copy, headers and controls. Another serif may be used only after a tested Vietnamese cmap plus real Chromium painted-glyph inspection.
- Keep UTF-8 strict; reject U+FFFD and mojibake. Write files with explicit UTF-8, never implicit locale-dependent Windows encoding.
- Verify the actual Chrome CDP CSS.getPlatformFontsForNode on labels Sắc màu chuyển động, Chất liệu, Đặng Thị Ánh, Trường and body text. A computed font-family is not proof.
- Check 320/390/428/768/1440, 200% zoom, text ascenders, diacritics, clipping and overlap. Target 1.2+ line-height for multiline Vietnamese.
- Add scoped test for each edited template. Existing legacy debt in other templates must not silently be claimed fixed.
\nInteraction rule, 2026-11-01: never use the generic northeast-arrow glyph U+2197 in Athena CTA/button UI. This is not the separate forbidden star glyph. Favor clear CTA copy and deliberate styling. For Fashion Archive enforce a source-test that forbids the glyph in Site.tsx and FashionHero3D.tsx.\n