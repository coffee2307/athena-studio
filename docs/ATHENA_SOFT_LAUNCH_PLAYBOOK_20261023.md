# ATHENA STUDIO — SOFT LAUNCH / OPERATOR PLAYBOOK

Date: 2026-10-23
Track: **Production A (public agency site + manual email intake)**
State: **RELEASE CANDIDATE; NOT PUBLICATION APPROVAL**.

## Scope of this iteration

- Introduce a three-step visitor flow at `/start`: choose service, describe the problem, then compose a reviewable email draft.
- Header consultation CTA routes visitors to `/start`; the `/contact` page continues to offer direct email and phone.
- The draft uses `createInquiryEmailDraft` with validation. It stays in browser memory, is not persisted, and never POSTs to Athena. Visitors must click **Open email app** and personally send the message.
- Product Lab, payments, account signup, OAuth, client portal, lead API and real customer data remain behind their existing gates.
- Update template registry regression tests for **20 demos** comprising legacy starter v1 and added starter v2; avoid silently changing demo compatibility fields.

## Minimal viable service scope — first one or two clients

| Offer | In scope if agreed in writing | Outside initial offering without separate review |
| --- | --- | --- |
| Website build | discovery, sitemap, design, responsive build, tested contact method, launch and handover | e-commerce settlement, custom CRM, large identity systems, unpriced hosting |
| Website care | scoped defect inventory, approved fixes, regression check, handover notes | emergency 24/7 SLA, production database migrations without backup |
| AI workflow consultation | process mapping, sample prototype, data policy, evaluation criteria | autonomous decisions, uploads of sensitive customer data, claims of guaranteed savings |

SitePulse/Micro-SaaS stays **research only**. Do not call founder projects “agency customer deliveries”; never link to private work or expose source.

## Lead-to-delivery procedure (single operator)

1. **Receive**: request arrives by actual email or a separately verified backend channel. A browser-generated draft is not an incoming lead. Record date, requester, source and scope in a private operator tracker, not public Git.
2. **Qualify**: confirm ownership/authorization, objective, minimum viable pages/features, content responsibility, accessibility, dependencies, desired dates and approximate budget. Decline unsupported/sensitive work.
3. **Scope**: produce a written proposal with deliverables, milestones, acceptance tests, number of revision rounds, exclusions and third-party costs. Record client approval. Do not assert unverified project outcomes.
4. **Agreement**: use locally appropriate contracting and payment arrangements; verify legal authority and invoicing with a responsible adult/professional when necessary. Do not automatically accept funds or launch payment checkout.
5. **Deliver**: use a separate private client repository/workspace, least-privilege access, reviewed secrets, QA and client-approved deployment. No unapproved migration to a real provider.
6. **Handover**: provide tested URL, change log, account ownership, admin instructions, backups and recovery/rollback procedure, deliverables manifest and acceptance record.
7. **Support**: record agreed window, severity thresholds, response mechanism, exclusions and aftercare changes. Never promise 24/7 service without capacity.

## Quote template — to be filled per client

- Client and authorized decision-maker: ______
- Website / service type: ______
- Problem and acceptance objective: ______
- Deliverables and number of pages/templates: ______
- Content/assets supplied by: ______
- Integrations and permissions: ______
- Deliverable quality criteria: desktop/mobile, relevant browsers, security, accessibility, functional email/contact test.
- Milestones and acceptance evidence: ______
- Revisions included: ______
- Exclusions and assumptions: ______
- Third-party costs (domain, hosting, API, email) and payer: ______
- Price, tax/invoice treatment, milestone payment and refund rules: ______
- Intellectual property and license/rights: ______
- Confidentiality, data retention and deletion responsibilities: ______
- Support / maintenance conditions: ______
- Sign-off and project owner: ______

This is an internal commercial checklist, **not a finalized legal contract**.

## Pre-publication gates — independent evidence

| Gate | Required evidence | Current disposition |
| --- | --- | --- |
| Source | merged and reviewed `main` SHA, build artifact + dependency audit, passing CI | Pending |
| DNS/TLS | real HTTPS hostname and certificate verified from an external network | Pending |
| Contact | send a real email and receive a reply, verify phone; no dead social links | Pending |
| Legal | privacy, controller identity, scope, retention and applicable business authority approved | Pending |
| Portfolio | rights for each image/claim, founder work labeled accurately | Pending |
| Mobile UX | physical device smoke, menu, browser back, contact usability | Pending |
| Security | real host config, rate limits where needed, dependency audit, no secret leaks | Pending |
| Resilience | off-host restore rehearsal, rollback test, alerting | Pending |
| Owner GO | approved exact release SHA, hostname, cost, time and rollback window | Not granted |

Automated passes **cannot replace** the above owner evidence. `ATHENA_PUBLIC_SITE_RELEASE_APPROVED` remains false. Do not enable public search indexing or payment/auth providers as part of this source-code batch.

## Candidate verification

```powershell
cd "F:\Athena Studio"
npm run typecheck
npm run lint
npm run test:unit
npm run release:preflight
npm run build
node scripts/soft-launch-smoke.mjs
```

Run the browser smoke against local `http://127.0.0.1:3182` while the dev server is alive; follow it with production-artifact smoke. A smoke result on localhost **does not prove** public production safety.

## Public rollout recommendation

- Start with a verified read-only public marketing site plus email/manual consultation; offer only scoped website builds and care for 1–2 pilot clients.
- Keep account creation, production client dashboard, Micro-SaaS, payment and experimental OAuth **off** until separate validation.
- Record conversion funnel **manually** without cookies or tracking scripts: source, qualified inquiries, proposals sent, clients accepted, work completed and customer feedback.
- Decide on wider launch only after real customer delivery, support burden and actual hosting costs are known.
