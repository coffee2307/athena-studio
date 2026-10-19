# Athena Studio — Digital Solutions & Product Lab

Athena Studio is a Next.js 15 / React 19 / TypeScript website rebuilt around four clear offers:

1. Web Design & Development
2. Website Care
3. AI Integration
4. Micro-SaaS Product Lab (concepts clearly labeled as unreleased)

## Quick start

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Visit http://localhost:3000. The homepage and four service detail pages are statically generated; the header and contact form use small client components.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. To activate the contact form, set **all three** `RESEND_API_KEY`, `CONTACT_EMAIL`, and `CONTACT_FROM_EMAIL`; optionally set `NEXT_PUBLIC_CONTACT_EMAIL` to display a direct contact address. Without these credentials the form remains visibly unavailable rather than silently discarding customer inquiries. Never commit keys.

The API route validates form input, checks same-origin requests, includes a honeypot, applies a basic per-process throttle and sends messages server-side with Resend. Production deployments should replace the per-process throttle with an edge or shared-store rate limit and add abuse monitoring.

## Core routes

- `/`: studio landing page.
- `/services`: four service categories.
- `/services/[slug]`: detailed scope and deliverables.
- `/products`: Product Lab; no preorders or fake live subscriptions.
- `/studio`: philosophy and approach.
- `/contact`: project intake.
- `/api/inquiry`: opt-in production email integration.

## Design principles

Premium editorial layouts inspired by the quality bar of the owner's PHAM project, without using PHAM assets or implying the projects belong to one brand. Expressive typography, warm dark/light surfaces, lime-accent data visualization, CSS-based sculptural hero, responsive grids, keyboard accessibility and reduced-motion support.

## Before launch

Verify domain and email ownership, deployment secrets, applicable privacy/terms content, anti-spam controls, service pricing and contract templates. No live client work, metrics, certifications or finished product claims are fabricated.

See `REBUILD_PLAN.md` for scope, acceptance criteria and release phases.
