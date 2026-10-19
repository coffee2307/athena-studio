# Athena Studio — Rebuild execution plan (2026-10-19)

## Product direction
A single independent studio serving Vietnamese SMBs and international clients remotely.

Four product lines:
- Web design & development — scoped project contracts.
- Website Care — recurring maintenance and observability.
- AI integration — discovery, proof of concept, implementation and managed operation.
- Micro-SaaS — product lab, beginning with the SitePulse **concept** (not yet released).

## Execution phases
| Phase | Scope | Exit criteria |
|---|---|---|
| 0 — Audit & safety | Inspect repo and PHAM styling reference, backup branch, scope | Local clean repo, rollback branch |
| 1 — Brand & presentation | New typography, editorial landing, navigation, responsive experience | Desktop/mobile layouts, real content |
| 2 — Information architecture | Service hub, four detail pages, Product Lab, Studio, contact | Valid internal links and route metadata |
| 3 — Lead capture | Explicitly gated contact form and secure API adapter | Clear unconfigured state, configured integration test |
| 4 — QA | Lint, TypeScript, build, HTTP smoke tests, mobile and accessibility checks | No blocking build errors |
| 5 — Release | Feature branch commit, push & PR | Reviewable changes without rewriting main |
| 6 — Commercial operations (future) | Contracts, CMS, monitoring, actual Micro-SaaS and billing | Only after verified customer and operational requirements |

## Design direction
Premium editorial technology brand: near-black, warm off-white, pale chartreuse, oversized condensed grotesk, serif accent, precise data labels, fine rules, abstract sculptural CSS artwork, purposeful motion. PHAM is a **quality benchmark**; no PHAM brand asset is copied.

## Explicit exclusions from initial delivery
- No fabricated case studies, client results, support SLAs or testimonials.
- No live SaaS subscriptions or payment processing for products not yet available.
- No production email without verified domain and configured provider.
- No credentials in repository.
- No database until customer workflow requires one.

## QA checklist
- [x] ESLint passes
- [x] TypeScript passes
- [x] Production build passes
- [x] Home, /services, 4 detail routes, /products, /studio, /contact respond
- [x] Keyboard-visible focus & escape-to-close mobile navigation
- [x] Reduced-motion CSS and mobile layouts
- [x] Contact system refuses intake when not configured
- [x] No deceptive claims or PHAM asset reuse
- [x] Branch review ready
- [ ] Production email provider end-to-end test (requires domain and credentials)
- [ ] Production deployment and security review (requires hosting configuration)

## Operations before public launch
Verify site domain, owned inbound email, provider email sending domain, deployed runtime environment, legal disclosures, intake/privacy retention, distributed rate limiting, spam protection, security headers, monitoring and backups. Review service quotes and contracts before accepting orders.
