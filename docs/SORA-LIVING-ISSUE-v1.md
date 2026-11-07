# SORA — LIVING ISSUE v1.0 · Implementation and acceptance record

Design approval: the user explicitly approved the SORA-only concept and P0–P4 in chat. This is a distinct creative-editorial experience, **not** a shared redesign of the Athena 21-template library.

## Intent, scope and original DNA

- Target: `templates/creative-studio/` and the actual SORA route rendered at `/template-demos/creative-studio`.
- Preserved: the beige/olive editorial language, self-hosted Noto Serif and Be Vietnam Pro, four desktop nav links, mobile two-stroke index, five original demo images, existing work/detail/services/about routes and footer.
- Excluded: NORTH, MỘC, BLACK VELOCITY, Digital Creators, Shopify, any production deployment or `main` merge.
- Content remains explicitly **demo illustrative**. No fabricated client references and no functional customer email backend.

## Implementation

1. `src/components/SoraLivingCover.tsx`: exclusive interactive home cover with three alternate stories, physical-paper collage, one photo/paper composition per story, discoverable numbered picker and prev/next controls; bounded desktop pointer gesture; mobile touch selection via accessible buttons; direct work CTA and actual hash navigation to `#sora-manifesto`. No new WebGL, GSAP, global scroll library or duplicated ticker. A single existing `requestAnimationFrame` scroll owner now applies a small reversible parallax/paper-turn offset without moving reading text.
2. `src/components/SoraLetterDesk.tsx`: native keyboard-accessible radio choices for three creative briefs, on-selection visual feedback, live letter composition, character count, working clipboard action and `mailto:` draft with **no fabricated recipient**. Submitting does not transmit data to the demo server; errors are reported via a live status paragraph.
3. `src/components/Site.tsx`: uses the two owned SORA components; removes the OS native `<select>` and old placeholder `hello@example.com`; retains all six route conditions and project data, adds the manifesto anchor.
4. `src/components/Sora.module.css`: mobile-first legible type, noncolliding collage paper, editorial responsive layout, focus-visible controls, low-motion alternative, source-defined clipping limits and live letter-preview styling. Explicitly fixes a preexisting high-specificity 760px rule that added extra left margin to contact forms.
5. `scripts/sora-living-issue-qa.mjs`, `tests/sora-living-issue.test.mjs`, legacy SORA seal collision assertions and `.github/workflows/sovereign-boundary.yml`: add durable source and real Chromium browser gates, including responsive images, click/drag, radio controls, draft update, email-placeholder guard, document scroll, font and visual geometry screenshots. The CI job has been configured but its remote execution is not asserted here.

## Browser acceptance, evidence

Verified on the Windows user's localhost at `http://127.0.0.1:3182`:
- **30/30** SORA route × viewport browser checks: home/contact/work/services/about/work detail × 320/390/428/768/1440, including pointer drag at 1440, live preview, radios, copies, native email draft and legibility.
- **90/90** existing Vietnamese font/geometry P8 checks on SORA/NORTH/MỘC; six painted-font inspection samples.
- **180 pass, 0 fail, 1 environment skip** from full `npm run test:unit` (181 total).
- Root `npm run typecheck` and `npm run build` both PASS.
- Independent `npm run build --prefix templates/creative-studio` PASS; original standalone font assets remain local and Vietnamese-capable.
- Sovereign source audit: 20 sovereign, one protected legacy automotive integration; zero source/CSS duplicate groups or structural failures. Legacy automotive debt remains and is outside this scope.
- Mobile/desktop screenshots: local `.qa/sora-living-issue/firstfold-{320,390,428,768,1440}.png`, `contact-firstfold-*.png`, `contact-*.png`; real DOM captured after font readiness. No browser-synthetic mock screenshot.
- Browser engine: **Chromium on Windows**, mobile dimensions emulated; *physical iPhone / Safari remains UNVERIFIED*, as does exact device FPS. `prefers-reduced-motion` CSS and no additional WebGL dependency minimize risk but do not prove native performance.

The creative project images already bundled with the demo remain representative imagery. Asset provenance must be reviewed separately before selling a finished template to a customer.

## Release status

This is a **review-ready branch**, not a production release. No `main` merge, Shopify update, live website deploy or public tunnel was authorized. Exact final commit and preview asset SHA are established by the last GitHub/local sync; production gates not covered above must not be presumed PASS.
