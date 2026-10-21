# ATHENA STUDIO — PHASE 8 COMMERCIAL SITE REBUILD / ACCEPTANCE

Date: 2026-10-21
Repository: coffee2307/athena-studio
Branch: feat/athena-commercial-relaunch-20261021
Rollback reference: backup/athena-before-commercial-relaunch-20261021
Base: fix/athena-client-first-vietnamese-typography-20261021

**This is implementation inside the approved Phase 8 roadmap, not a new phase.**
Owner approved a release-candidate review and merge into main only after acceptance.
No production DNS, customer data, mailbox, OAuth, hosting subscription or secret was touched.

## Why the rebuild

The original public site emphasized visual slogans at the expense of client workflow:
there was no obvious account entry, no usable direct contact in footer,
links to the GitHub source repositories of PHAM/ECONITH and incomplete policy/quote detail.
Old mobile menu snapped between display:none/flex and did not animate.

## Working changes

1. **Agency header:** monochrome top strip, service dropdown, Work/Workflow/About/Product destinations,
   visible sign-in and sign-up entries even when Auth is gated, and a primary request-quote CTA.
   Responsive mobile panel has slide/fade and an overlay; focus management, Escape, scroll lock,
   background inert and reduced-motion support.
2. **Contact:** monochrome floating contact dock, visible phone/email and reviewed optional
   Zalo/WhatsApp adapters. Zalo/WhatsApp require exact tested accounts before the public URL is
   allowed into page HTML. This is preferable to dead buttons. Removed the copy
   'Các liên kết nhắn tin chỉ hoạt động nếu tài khoản tương ứng đã được kích hoạt trên số liên hệ.'
3. **Footer:** phone, email, reviewed social links, navigation, services, workflow, quotation path,
   login/signup and legal pages including a service policy. CTA focuses on customer's actual problem.
4. **Portfolio:** Removed sourceUrl from public Project type/data, never display 'Mở repository gốc'.
   PHAM captures from publicly available phamofficial.com homepage and PHAM-001 product page
   on desktop and mobile, resized into local WebP assets. Captured on 2026-10-21. The captured
   pages showed 'PRELAUNCH' on the product: this is not proof of completed customer sales.
   PHAM is founder-owned; not a delivered agency client job.
   ECONITH remains a research case; real screenshots not yet approved, so display a clearly
   labeled non-screenshot placeholder and verified-safe high-level features only.
   Qrio stays unpublished awaiting provenance and media.
   **Removing a link from Athena DOES NOT convert an existing public GitHub repository to private.**
   Repository visibility audit/owner review remains a separate explicit action.
5. **Business information:** new process (/quy-trinh), pricing methodology (/bao-gia),
   case-specific FAQs and improved About with truthful capability boundaries.
   Pricing cannot claim an amount until a standardized, approved service package exists.
6. **Policies:** expanded Privacy, Cookie, Terms, Service Policy and legal hub. Not a legal
   opinion or registration proof. Policies should be reconciled with live hosting/data-processing,
   company legal identity, retention period, contracts and real vendor list before publish.
7. **No added external dependency** or new paid subscription. Caddy/Next.js + Better Auth +
   PostgreSQL VPS stack remains an option behind existing Auth/Provider release gates.
   Independent Client Portal/Auth migration is NOT switched on by these website changes.
8. **SEO:** sitemap includes process, pricing and service policy pages.
9. **Motion:** lightweight CSS. Mobile menu preserves keyboard/hover/touch functionality and
   disabling animations for prefers-reduced-motion; no WebGL or heavy dependency.

## Acceptance checklist

- [ ] Desktop, tablet and mobile visual sign-off on real screenshots.
- [ ] Link crawl + manual review of service, portfolio, footer, login disabled route, policy pages.
- [ ] Browser a11y 2.2 A/AA tests, no horizontal overflow, usable focus/ESC.
- [ ] Site checks: lint, TypeScript, 99+ unit tests, all Playwright browsers, optimized Next build.
- [ ] Public page contains no GitHub repository URL or source-download button.
- [ ] PHAM image provenance and rights owner verified. ECONITH screenshot publication approved separately.
- [ ] Zalo/WhatsApp exact target confirmed on desktop and mobile before enabling their links.
- [ ] Legal status/entity/retention terms and commercial sales policy reviewed before publish.
- [ ] Identity release gates remain OFF and unauthorized tenant/endpoint API returns 503/denial.
- [ ] PR review, clean staged diff, CI PASS on the HEAD commit, documented rollback.
- [ ] Explicit production activation with separately approved domain, costs and secrets only later.

## Rollback & release controls

Keep origin/main unchanged until all site V1 checks pass and owner approves the appearance and
publication of screenshots and legal copy. Create a single Draft PR with this release candidate
against main, rather than merging every historic experimental PR separately. Existing code stack
retains its 8A/8B/8C gates: merging files is NOT enabling unverified Auth, payments, Mail, storage or
staging migrations. CI success is necessary but insufficient for production GO.

Do not publish private repositories or customer-facing live metrics without separate evidence.
Do not run live SMTP / OAuth / deploy on the owner's behalf before credentials and operating
conditions are accepted.

## Local Lighthouse baseline (homepage, simulated mobile)

Run on 2026-10-21 against the local Next.js production server at 127.0.0.1,
not against a public production VPS: **Performance 97 / Accessibility 100 /
Best Practices 100 / SEO 66**. Local lab metrics: LCP about 2.0s, FCP about
1.1s, TBT about 160ms, CLS 0.049. These are not independently verified field
Core Web Vitals or service-level guarantees. SEO 66 is caused by the deliberate
`robots.txt` and preview noindex restriction. Do not remove the restriction
until a real public domain, policy, security review and launch are approved.

Lighthouse also flagged the visible/accessible brand-name text separation in a
zero-weight manual name audit; fixed by preserving whitespace between ATHENA and
STUDIO in the accessible link's visible label. This needs verifying on the
newest HEAD before release.
