ATHENA STUDIO — CUSTOMER-FIRST UX / VIETNAMESE TYPOGRAPHY CORRECTION
Date: 2026-10-21
Status: REVIEW CANDIDATE. Part of approved Phase 8. NOT a new phase.

Reported: screenshot of oversized footer typography contained malformed spacing around Vietnamese letters; business homepage was slogan-first, without clearly communicating customer problems, concrete scope and accessible contact paths.

Implemented:
- Locally bundled Be Vietnam Pro regular and italic is now the common Vietnamese display font. Removed Georgia from the large footer subheading and normalized scale/tracking on headings.
- Homepage opens with problems: needing a new website, fixing an existing site, or reducing repetitive tasks. Three direct service choices and a problem/deliverable grid precede evidence/project cards.
- Services use shared challenge/output data; detail pages show actual potential scope and prevent Product Lab research from appearing ready to purchase.
- Contact page asks for existing URL, the problem and the preferred outcome. While the inquiry API is intentionally OFF, a direct email link prepopulates those details for the customer.
- Project cards explicitly identify founder/research work instead of invented signed client engagements. No unsupported revenue, conversion claims or invented testimonials.
- The footer now presents an actionable website problem, reduces huge typography and visibly labels Product Lab as research.
- Dedicated Playwright tests verify the three service intent routes, customer contact fallback, font loading and typography, accessibility and viewport overflow on desktop/mobile.

QA rules:
- Run Next.js build, lint, types, unit tests, Playwright/axe E2E and compare desktop/mobile screenshots from a real browser.
- Avoid port 3000 (another locally running project). The Athena preview uses 3182 or a QA port.
- Keep server-side Auth/SMTP and customer data flags OFF; these are separate deployment gates.

This is NOT a production or DNS change. No VPS, commercial contract, customer database or OAuth/SMTP provider has been activated. Review preview content and typography before any merge/main deployment.
