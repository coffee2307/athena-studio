# ATHENA-DNA-01 — Creative Engineering Studio

Status: **approved for implementation** in the user's current conversation, 2026-10-30. **No approval to merge `main` or deploy production.** This file records the scope; it is not a substitute for host-level authorization.

## Site DNA

Athena Studio is an independent creative engineering practice: turn real client problems into useful, distinctive digital experiences. The visitor should understand the service, see evidence of visual/technical capability, and confidently begin a conversation. The main site is a persuasive creative studio, not a research paper, compliance dashboard, generic agency template or cinematic toy.

- Audience: people choosing a website, website maintenance, or an AI-enabled workflow.
- Emotion: restrained confidence, visual curiosity, clarity, approachability.
- Distinctive media: actual functioning template screenshots and honest founder projects.
- Palette roles: warm paper `#F6F5F1`, graphite `#191B1B`, limited vermilion `#D95F42`, soft stone `#E4E3DE`, dark muted green for secondary surfaces.
- Type: local Be Vietnam Pro with Vietnamese diacritic coverage; selective Noto Serif italic for artistic contrast.
- Motion: discreet entrance, hover and scene arrangement; respect `prefers-reduced-motion`. 3D belongs to concept-specific demos, not generic public pages.
- Shape: restrained soft radii for touchable artifacts; no blanket prohibition on rectangles, typography or whitespace.
- CTA: one prominent action per screen; secondary alternatives quiet. Diagonal arrows only when clearly indicating a new context.
- Mobile: design first for 320/390/428, then tablet 768 and desktop 1440. Avoid vertically rotated labels, text walls, full-screen empty gaps and overlapping floating actions.
- Truth: founder projects are not customer contracts; unreleased Product Lab items are not sold; no fabricated testimonials, performance or bookings.

## Surface mode contracts

| Surface | Primary visitor job | Composition |
|---|---|---|
| Home | Understand Athena and select next action | Concise hero + real template previews, service-specific art, three-step process |
| Services | Identify the relevant service | Visual service cards leading to honest detail and delivery constraints |
| Service detail | Evaluate scope and inquiry | Structured text, functional FAQ, no invented promises |
| Portfolio | Find a real project | Equal-weight project cards with distinct subject art |
| Case studies | Understand founder work | Accessible TOC plus bounded real screenshots; mobile capture scrolls in a centered stage when needed |
| Template catalog | Compare functioning demos | Actual previews and aligned cards/CTAs; internal demos keep their own identities |
| Immersive worlds | Interact with a specific 3D story | Preserve 3D scene, camera framing, performance fallback and creator attribution |
| Accounts, legal, admin | Complete tasks accurately | Predictability, semantic state, legibility, no gratuitous animation |

## Excluded / protected

- No changes to PHAM Shopify iframe security policies.
- No claims that ECONITH financial outcomes are verified.
- No replacement of licensed GLB assets or attribution.
- No modification of `main`, no public deploy, no external tunnels.
- Retain local `.local-recovery` and separately supplied 3D model files.

## Release evidence requirements

Required: TypeScript, ESLint, unit tests and production build; browser E2E and accessibility; real screenshot review on 320, 390, 428, 768 and 1440; image loading, CTA destinations, 3D fidelity, no horizontal overflow, long-content framing and keyboard/reduced-motion. Mobile browser emulation is **not** a physical iPhone test.

Known CI issues as of approval: auth test assumed active auth in identity-disabled CI; McLaren mobile E2E occasionally samples a transient canvas. Fix expectations to reflect verified behavior, do not bypass underlying functionality.

**Do not mark release PASS while critical tests remain failing or visual evidence is missing.**
