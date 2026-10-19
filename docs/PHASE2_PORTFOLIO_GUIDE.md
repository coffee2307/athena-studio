# ATHENA STUDIO — PHASE 2 PORTFOLIO & CONTENT ARCHITECTURE
Date: 2026-10-19
Approved source: [ATHENA_MASTER_ROADMAP.md](ATHENA_MASTER_ROADMAP.md)
Branch: `feat/athena-phase2-public-portfolio-20261019`

## Shipped public structure
- Canonical Vietnamese URLs: `/du-an`, `/du-an/[slug]`, `/dich-vu`, `/dich-vu/[slug]`, `/san-pham`, `/ve-athena`, `/lien-he`.
- Legal draft pages at `/phap-ly`, `/phap-ly/quyen-rieng-tu`, `/phap-ly/dieu-khoan`, `/phap-ly/cookie`.
- Existing English routes (`/work`, `/work/[slug]`, `/services`, `/services/[slug]`, `/studio`, `/products`, `/contact`) permanently redirect to localized routes.
- Homepage includes a featured work section and link to case studies. Footer links to legal drafts.
- Sitemap indexes only published project case studies. Preview robots intentionally disallow indexing until `NEXT_PUBLIC_SITE_URL` is set to a verified HTTPS origin.

## Truthfulness and provenance
`data/projects.ts` is the current typed source; `types/project.ts` is the model. A public entry must:
1. Have `visibility: "published"` **and** a traceable source URL.
2. Use `kind: "founder"`, `"research"` or `"client"` accurately.
3. State what has been verified and what has not. Never invent revenue, users, PnL, metrics, testimonials or commissioned client delivery.
4. Distinguish `challenge`, `approach`, `outcome` and `outcomeNote`.
5. Include the founder's role; `gallery` media must have `rightsVerified: true` before display.
6. For actual customers, require written approval to publish logos, screens and performance claims before using `kind:"client"`.

## Verified portfolio entries
### PHAM — `/du-an/pham`
- Kind: founder's own fashion/e-commerce project, **not a paid Athena client**.
- Evidence: [coffee2307/pham-store](https://github.com/coffee2307/pham-store) public repository with Liquid theme folders; [PHAM_EDITION_SYSTEM.md](https://github.com/coffee2307/pham-store/blob/main/docs/PHAM_EDITION_SYSTEM.md) describes Shopify/Edition/Worker-D1 architecture.
- Do not claim commercial launch, reservations, actual revenue, orders or fulfillment success from code/documentation alone.

### ECONITH — `/du-an/econith`
- Kind: founder's research, not an investment service or paid client work.
- Evidence: [coffee2307/econith](https://github.com/coffee2307/econith), README on main. Quant/World/dashboard research architecture documented, with explicit SIM/DEMO and autonomy limitations.
- Do not claim verified financial performance, trained production models, profitable live trading or unconditional autonomous execution.

### Qrio — held for review
- Status: `visibility: "review"`, not emitted to public project pages or sitemap.
- Reason: `coffee2307/qrio` was not available as a public repository at audit; no images and scope could be verified.
- Owner to provide source repository, role and publication permission before enabling.

## Artwork and screenshots
Currently all portfolio covers are original Athena CSS/vector **editorial representations**, explicitly labeled as not real product screenshots. This prevents accidental claims that a fictional UI shot reflects a working product. `gallery[]` supports authorized images later; no screenshots were copied from third-party studio photography, Shopify product shots, or GitHub assets without verification.

## Content management workflow
1. Copy or author a typed `Project` object in `data/projects.ts`, default `visibility:"review"`.
2. Attach verifiable original sources; record owner authorization.
3. Write Vietnamese, evidence-based introduction, challenge, approach, outcome and limitations.
4. Confirm status, precise role and publication rights for each media item.
5. Pass `npm run test:unit`, build, SEO and visual review.
6. Change to `visibility:"published"` only after approval. Entries then appear in index, homepage (if `featured`) and sitemap.

A visual CMS is *not required yet*: data remains deterministic and versioned in Git. A CMS and upload workflow can be added when editing is frequent and staffed.

## SEO and legal notes
- Localized canonical paths, dynamic project metadata and 1200×630 Athena OG image.
- OG artwork is brand-owned SVG-derived, not a customer/result image.
- `robots.ts` rejects indexing when the origin is unconfigured/non-HTTPS. Do not set `NEXT_PUBLIC_SITE_URL` to a test domain to bypass review.
- Legal pages are clearly marked as **draft requiring owner/legal review**. They are not legal certification, and a cookie-consent banner is not implemented as long as no nonessential tracker has been configured.
- Actual legal identity, data retention and provider agreements need confirmation before public launch.

## Owner-only follow-up for Phase 2
- Confirm the exact founder role, source descriptions and publication permission for PHAM, Qrio and ECONITH.
- Supply approved case-study media or arrange screenshots from authorized live/staging environments; record copyright/credit.
- Confirm accurate company/legal entity information and data handling policy before approving legal terms.
- Approve the exact canonical domain before production; do not update DNS in this Phase.
