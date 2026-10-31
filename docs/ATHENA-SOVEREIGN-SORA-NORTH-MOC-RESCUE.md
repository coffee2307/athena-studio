# ATHENA-21-SOVEREIGN — Three Concept Rescue (SORA · NORTH · MỘC)

Date: 2026-10-31. Scope approved in chat: improve only **creative-studio**, **modern-corporate**, **commerce-standard**. No changes to Digital Creators/BLACK VELOCITY or the remaining 16 next.js templates. Merge/deploy are not authorized.

## Why the earlier P2/P3 design was unsatisfactory

- One-word common hero/superficial industry variants diluted site character.
- SORA desktop had a redundant hamburger despite a desktop navigation with only two links.
- Home and child routes contained extensive generic English copy unrelated to the Vietnamese audience.
- Incorrect Vietnamese-display line height/letter spacing on oversized headings and mixed serif/browser fallback stacks made the designs fragile.
- Mobile menus lacked a clear close control, and conditional backdrop removal provided no deliberate exit.
- Home pages primarily relied on static grid scroll; animation had no distinct storytelling role. A mobile first-fold review revealed SORA's seal obstructing copy and MỘC's main headline starting too late.

## Three distinct production-owned design repairs

### 01 / SORA — An editorial issue, not a corporate template

Source: `templates/creative-studio/src/components/{Site.tsx,Sora.module.css}`.
- Four-link desktop magazine index, **no desktop toggle**; two-line conventional mobile toggle.
- Dark botanical right-side editorial contents sheet, script-like serif labels, explicit top × and second close control. Backdrop always exists with opacity/pointer-events state and reversible 420ms entrance/exit.
- Vietnamese first fold: “Ý tưởng có đời sống riêng”; oversized literary serif headline, floating cutout collage, kinetic round seal, rotated photo, horizontal issue ribbon and a scroll prompt.
- Unique magazine project grid, manifesto, CTA and footer; Vietnamese translations for work, services, about, contact and detail pages.
- IntersectionObserver reveal and a light rAF hero shift; visual motion only while its chapter is in view. Prefers-reduced-motion disables motion. No new 3D package.

### 02 / NORTH — Interactive systems-map / technical consulting direction

Source: `templates/modern-corporate/src/components/{Site.tsx,North.module.css}`.
- Complete four-item desktop capability navigation and distinct inquiry CTA; standard three-stroke mobile toggle only on narrow screens.
- Mobile right-side engineering directory with explicit × close, different spacing and transitions than SORA.
- Vietnamese first fold: “Rõ ràng giữa phức tạp”; interactive diagram with animated SVG topology, three selectable capability states, schematic lines/nodes and explicit outputs.
- Service process interaction, three capability cases, operational narrative and source-data disclaimers; Vietnamese translation for core sections and child pages.
- Animation driven by interaction/visibility (SVG lines and dots pause offscreen/hidden tab), intersection reveal on scroll, reduced-motion support.

### 03 / MỘC — Tactile contemporary home-object shop

Source: `templates/commerce-standard/src/components/{Site.tsx,Moc.module.css}`.
- Symmetrical boutique desktop header, 4-link store-category bar, Font Awesome shopping-bag and count; mobile two/three-stroke toggle only on narrow screens.
- Distinct rising rounded bottom sheet with legible close ×, scrim fade and reversible sheet exit.
- Vietnamese first fold: “Chậm lại một chút”, credited home-object still-life, layered editorial seal, rebalanced to display headline within first mobile screen at 320/390/428.
- Kinetic paper-like horizontal ribbon, offset product cards, functional product quick-view/bag and an additional **interactive three-material editor** (ceramic / cloth / woven fiber), with live imagery.
- Material selection, Vietnamese catalog/products/labels, product guide, about and contact copy. Scroll reveals, image entrance, hover feedback and in-viewport animation pause; reduced-motion support.

## Verified evidence (latest baseline code)

- Root `npm run typecheck`: PASS.
- Root `npm run build`: PASS.
- All three standalone project `tsc --noEmit`: PASS.
- `npm run test:unit`: **165 PASS**, **0 FAIL**, 1 environment skip (166 total).
- Dedicated Chrome/Playwright browser QA `scripts/sovereign-three-rescue-qa.mjs`: **15/15 PASS** at 320×680, 390×844, 428×926, 768×920, 1440×900. Exercises home, five child URLs at mobile, hamburger+explicit close+Escape, zero horizontal overflow, no menu width jumps, distinct full desktop navigation, SORA seal/paragraph non-intersection, MỘC first-fold heading, scroll reveal and correctly paused offscreen ambient animations.
- Actual captured screenshots in owner Windows workspace: `.qa/sovereign-3-rescue/before/` and `.qa/sovereign-3-rescue/after/` (home/mobile menu + contact-sheet), tested with real Chromium desktop and mobile **emulation**.
- `node scripts/sovereign-audit.mjs --check`: 20 sovereign, 1 protected BLACK VELOCITY legacy, no source/CSS duplicates; 0 architecture check failures.
- Updated exactly three browser-derived gallery thumbnails in `public/template-previews/`. Other thumbnails and codebases were not modified.

## Not verified / release policy

- Physical iPhone/Safari frame rate, touch, Vietnamese text rendering and 200% zoom are NOT VERIFIED. Chromium lab success is not a claim of real-device performance.
- These three are distinct creative websites, but neither a 3D replica of Digital Creators nor a guarantee that the site's aesthetic has been signed off by the user.
- All three still use existing concept demo images and illustrative content; independent client briefs will require legitimate product images and true project case data.
- Production remains blocked by the protected BLACK VELOCITY export and remaining release gates. No merge, deploy or public tunnel was performed.

Local review URLs:
- `http://127.0.0.1:3182/template-demos/creative-studio`
- `http://127.0.0.1:3182/template-demos/modern-corporate`
- `http://127.0.0.1:3182/template-demos/commerce-standard`
