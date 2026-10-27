# Athena Studio — software release readiness (27/10/2026)

**Scope:** Production A, the public studio website, commercial services, founder/research portfolio, demo library, legal pages and manual email consultation. This list deliberately excludes domain purchase, VPS selection and other infrastructure procurement. It is **not** a production GO authorization.

## Engineering baseline

- PR #45 (Immersive Engine) merged into PR #44's branch as `c137265aa608b1a64682e37da7d6e8edc8b70365` after successful validation and visual-evidence workflows.
- PR #44 targets PR #43's branch; PR #43 targets `main`. Neither upstream PR was merged as of this review. A later screenshot-only commit `dff20212181f774d46280b6c96652a456a738419` advances #44 and requires fresh CI verification on its final release ancestry.
- Unit, browser E2E, accessibility, Next production build, real PostgreSQL and recovery-fixture checks exist in `.github/workflows/validate.yml`. CI success on a feature branch is engineering evidence, not real-publication approval.
- Auth, Operations, Independent Identity, SitePulse, external intake and paid features must remain disabled for Production A. `/start` prepares a user-sent email draft; it does not receive or store leads.
- The registry has 21 website directions. Three new worlds are WebGL prototypes, Digital Creators is an existing original interactive experience, and the remaining 17 immersive worlds are planned. Do not advertise all 21 as finished 3D experiences.

## Release blockers — evidence, not checkbox optimism

| Gate | Required evidence | Responsible | Current state |
| --- | --- | --- | --- |
| Rights to 3D model | Exact `public/models/mclaren.glb` SHA, known rights holder, grant/license for **public redistribution**, reference to private proof and owner sign-off | Asset owner + reviewer | **BLOCKED:** existing attribution establishes no author/license |
| Portfolio and visuals | Approved PHAM/ECONITH/Digital Creators descriptions, image sources, screenshots and any applicable third-party licenses | Owner / content reviewer | Pending final approval |
| Commercial and privacy text | Confirm the responsible operator, offered services, privacy contact, retention/deletion practice and applicable contracting terms | Owner / qualified reviewer | Pending final approval; do not invent details |
| Real contact acceptance | Send an email from an independent client inbox, verify it arrives at Athena, reply, test phone/Zalo/WhatsApp links. Retain timestamps but no personal messages in Git | Owner/operator | Not independently evidenced |
| Manual quality | Physical mobile and desktop checks, 360–428 px navigation, browser back, keyboard/screen reader, reduced motion, WebGL disabled, low-GPU responsiveness, load/interaction timing | QA + owner | Automated Chromium/Firefox and screenshot evidence; field sign-off pending |
| Final source release | Merge #44 → #43 → `main` only after review; clean exact `main` SHA, green CI on that SHA, checked dependencies and immutable release/rollback references | Maintainer | PR chain still open |
| Operational acceptance | Real rollback rehearsal, recovery evidence appropriate to the features enabled, emergency contact and incident owner; production preflight with supporting external proof | Maintainer/operator | No production sign-off |

## What can ship first

Use `/`, service pages, public portfolio, template library, `/start` with its manual email draft, `/contact` and `/legal/*`. Keep the actual form-backed `/api/inquiry`, customer accounts, portals, GitHub repository sharing, payment and SitePulse disabled until **separate** real integration/security acceptance. A working `mailto:` draft is not a submitted lead.

The site deliberately stays noindex until `ATHENA_PUBLIC_SITE_RELEASE_APPROVED=true` and the exact canonical HTTPS origin is explicitly approved. That final release decision is independent of having functional code.

## Commands and evidence capture

After freezing a reviewed source SHA on the intended release branch:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run release:verify
npm run release:preflight
npm run build
npm run test:e2e
npm run test:smoke
npm run audit:runtime
```

Production mode uses `node scripts/production-preflight.mjs --production`, which intentionally returns `NO_GO` on an unmerged source, unapproved model rights, unapproved legal/portfolio/contact evidence or missing release sign-off. The new `immersive_model_rights` gate compares the **actual asset hash** to its documented SHA, requires rights-holder, redistribution basis, evidence reference and a separately approved owner flag. Never set an attestation to true without real proof.

For every manual gate capture `date`, `release SHA`, `device/environment`, `tester`, `expected`, `actual`, `private evidence reference`, `decision` and `owner approval`. Do not upload customer correspondence, identity credentials, model license agreements or private consent records to this public repository.

## Separate Production B backlog (not a Production A blocker)

Real OAuth and email/OTP delivery, verified cookies/session revocation, admin/client A/B authorization, private Storage signed URLs, provider-level sign-up controls, retention/deletion, repository-sharing security and real recovery tests remain independently gated. Passing mocked tests or having a provider URL does not authorize public accounts.
