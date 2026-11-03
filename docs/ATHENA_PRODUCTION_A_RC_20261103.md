# ATHENA STUDIO — Production A Release Candidate / 2026-11-03

**Status: ENGINEERING CANDIDATE — NO PRODUCTION GO.** This document is an engineering inventory, not legal, hosting or publication approval.

## Intended first public release

Public studio homepage, services, portfolio (founder/research work accurately labeled), 15-template demo gallery, working manual email contact flow, and legal information pages. Accounts/signup, client portal, persistent lead intake, automated email/OTP, payments, SitePulse and access to repositories **remain disabled**. No independent template is advertised as a delivered client contract.

Release source: `release/athena-production-a-rc-20261103`, branched from `6242fe1` which contains the current DNA02/DNA03/DNA04/NORTH + Athena gallery changes. Merge request into `main` requires a separate owner release decision. Pin the final reviewed commit, artifact digest and rollback SHA *after* all CI checks pass.

## Available engineering acceptance (local Windows, 2026-11-03)

- Root TypeScript, ESLint (warnings only), unit tests, release verification and candidate preflight: PASS.
- Root unit suite: **223 pass / 0 fail / 1 skipped**. Do not silently turn that skipped test into a pass.
- Root Next.js optimized build: PASS, 179 generated pages.
- npm production dependency security advisory service: **0 vulnerabilities** at the time of the check. Repeat on final release commit.
- Broken standalone template imports to missing `./globals.css` removed; these sites already have independent CSS modules. Verify on clean Linux CI as well.
- NORTH independent export now renders configured `site.brand`; accessible X-only close button with 44px hit target. Legacy tests updated to the current approved simple UX, retaining behavior/assertion checks.
- Public release stays **noindex** by default and production identity, DB, OTP, paid APIs and inquiry POST must remain off.
- Chrome cross-device P8 QA: **90/90 PASS** over NORTH/SORA/MỘC (320/390/428/768/1440 px, 6 routes each); template gallery browser QA: **8/8 PASS** across 15 demos; production route/static asset/redirect smoke: PASS. These are local automation, not physical device acceptance.
- Independent template clean Linux builds and GitHub CI remain separately pending; do not infer them from the root Windows build.

## Owner/operator and external acceptance — do not claim PASS from automated checks

1. **Hostname/hosting:** Approve cost, real domain and target host. Configure DNS, HTTPS certificate, proxy and canonical origin; do not use temporary Cloudflare Quick Tunnels as production. Independent staging first.
2. **Contact delivery:** Test a new visitor email from an independent inbox, confirm receipt *and an actual reply*, and verify published phone, Zalo and WhatsApp targets. Manual `mailto:` composer is not an automated inquiry submission.
3. **Commercial and legal responsibility:** Confirm the actual business/service operator, contracting authority, correct public contact and privacy/data retention policies, service exclusions, pricing terminology and any taxes/consumer duties with a qualified reviewer when needed. No invented legal identity.
4. **Visual/portfolio rights:** Owner verifies each public photograph, third-party mark, PHAM/ECONITH/Digital Creators statements and source evidence. Founder projects are not client deliverables.
5. **McLaren 3D redistribution:** Sketchfab source by vecarz (@heynic) shows **CC Attribution** and the repository records a CC BY 4.0 link, exact binary hash, credit and adaptations. Separately compare source/binary and record private owner approval; model brand/trademark ownership is separate from the creator's model copyright.
6. **Physical devices/accessibility:** Android Chrome and iOS Safari, 320–428px menus/forms/scroll/back, WebGL enabled/disabled, keyboard/screen reader, low-memory GPU and 4G/5G cold-cache performance. Retain dated evidence against the final artifact.
7. **Staging operations:** Real Linux HTTPS smoke; non-root container, secrets outside Git, health checks, uptime alerts and a tested rollback. If persistent customer data will be stored, add off-host encrypted backup and isolated restore drill before enabling it.
8. **Final GO:** Confirm the release commit SHA, artifact digest, approved host, cost, indexing toggle and rollback owner in writing. Only then merge/deploy and enable indexing.

## Current deployment boundary

- Neither Cloudflare Tunnel (3182 / 5173) may be reopened without request.
- Do not merge into `main`, purchase hosting, modify DNS, create public accounts, enable backend intake or deploy production as part of this engineering candidate.
- Keep preflight fail-closed; never suppress failing CI or fake owner sign-off environment flags.
- `scripts/production-preflight.mjs --production` must remain **NO_GO** until evidence above is separately provided.

## Release process after acceptance

Freeze SHA → GitHub CI + reproducible Linux build → reviewed immutable container image → deploy isolated staging noindex → external HTTPS/contact/mobile/performance/accessibility/security checks → owner publication decision → production image-by-digest → monitor real traffic → rollback by previous digest on failure.

## 2026-11-03 — Further release hardening

- The approved simplified NORTH layout no longer contains the old decorative impact rail. Its CI browser QA now verifies the actual three decision controls, live outcomes, keyboard focus order, working detail links, four-step process and mobile menu, without bypassing functionality. Local Chrome results: diagnostic routes 36/36 PASS; layout/keyboard checks 15/15 PASS.
- Refined four-template QA 20/20 PASS; SORA page-picker QA 30/30 PASS; Fashion Archive 3D QA 6/6 PASS; responsive Sovereign QA 90/90 PASS.
- Black Velocity/Auto Showroom's expanded floating Athena information card previously blocked the desktop hero CTA and mobile angle controls. It now defaults to an accessible zoom-in handle **only on this immersive showroom**, retaining intentional open/close interaction. Other templates continue to open the information panel by default. Real Chrome canonical McLaren 3D/camera tests on 390px and 1440px: 3/3 PASS including CTA hit testing and mobile control exposure.
- Current local root checks: 224 passed, 0 failed, 1 skipped; lint 0 errors and 12 warnings; TypeScript PASS. Previous optimized Next.js build completed with 179 routes. Only GitHub Actions on the final head SHA may confirm release CI.
- Production remains NO_GO pending owner and external acceptance. No main merge, DNS, public tunnel, indexing, paid service, customer data collection or production deployment has been authorized.
