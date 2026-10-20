# ATHENA STUDIO — Phase 8A Integrated Release Candidate

Date: 2026-10-20
Branch: `feat/athena-phase8a-integrated-release-20261020`
Source approval: Phase 8 approved by project owner on 2026-10-20.
Base `origin/main`: `cc3be136de11d748cc71bbb0f2895fe494d35d17`.
Integration is a **candidate branch**, not a release to production and not a merge into `main`.

## 1. What was actually integrated

Phase work is a **linear Git history**. This branch extends `proposal/athena-phase8-release-integration-20261020` and therefore contains the full code changes of Phase 0–7.3 and the Phase 8 proposal without repeated cherry-picks or manual conflict resolutions.

| Code source | Commit | Pull request | Status at initial audit |
|---|---|---|---|
| Public rebuild | `3468535` | #1 | Merged to main |
| Phase 0 | `807f256` | #2 | Draft |
| Phase 1 | `9345872` | #3 | Draft |
| Phase 2 | `752a4ff` | #4 | Draft |
| Phase 3 | `1224e33` | #5 | Draft |
| Phase 4 | `3918e4e` | #6 | Draft |
| Phase 5 | `d8ae1e5` | #7 | Draft |
| Phase 6 | `46fc89e` | #8 | Draft |
| Phase 7 | `d31c0cd` | #9 | Draft |
| Phase 7.1 | `4b47b0c` | #10 | Draft |
| Phase 7.2 | `9ecd078` | #11 | Draft |
| Phase 7.3 | `da79356` | #12 | Draft |
| Phase 8 plan | `f37c6b8` | #13 | Draft |

The `git merge-base --is-ancestor` chain has been verified in order. The integration branch will have a **new** commit/release candidate SHA; do not use the milestone SHA as evidence of final QA. Main remains unchanged until a separate controlled release decision.

At this baseline, comparing the approved Phase 8 proposal commit with `main` yields **173 changed paths, 8,255 added lines, 467 removed lines** (including generated lockfile and binaries). These are Git diff metrics, **not** a productivity, quality or performance percentage.

## 2. Enforced release integrity

A new command `npm run release:verify` calls `scripts/phase8-release-gates.mjs`. The command is read-only and:
- Checks the stable main ancestor and all 13 lineage milestones.
- Checks that `.env.example` does not enable Auth, Google OAuth, dashboard or SitePulse without owner/provider acceptance.
- Checks eleven explicitly documented provider credentials and sensitive configuration values are blank in the example file.
- Rejects tracked files under `.qa/`, `.env.local`, certificate private keys and raw SitePulse JSONL evidence.
- Checks that the relevant migration, controls, tests and roadmap files remain present.
- Emits a machine-readable JSON report with current HEAD and **explicit release holds**, not an unconditional GO badge.

The CI workflow now checks out full Git history (`fetch-depth: 0`) and runs `release:verify` after unit tests. Pure unit tests cover the fail-closed default configuration and accidental tracked sensitive paths. **This scan is not a substitute for a secret-scanning service or an audit of every line in the repository.**

## 3. Release tracks

### Track A — public studio website
The white/black Vietnamese public site, service pages, founder-owned/verified portfolio, and Product Lab explanation can be **reviewed** for a V1 launch. Lead intake still fails closed until real database, anti-spam and email are configured and tested. Do not claim automated lead receiving is active.

### Track B — accounts, operations and Micro-SaaS
Remain **OFF by default**. Database RLS and user-flow tests on local/PGlite are not a replacement for actual Supabase/Auth, OAuth, SMTP, private Storage and signed-URL tests. SitePulse is a time-limited, manually authorized pilot with an inconclusive first PHAM network result, **not a commercially launched SaaS**.

## 4. Integration test record

Execute and record:
```powershell
npm run release:verify
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:smoke
npm run audit:runtime
npm run test:e2e
```

Cloud CI: both `Lint, unit, build and audit` and `Browser E2E and automated accessibility` must PASS **on this exact Phase 8A branch**. Do not infer passing from earlier Phase branch runs.

### Non-automated gates still unresolved
- Real hosting/staging, contact provider and real delivered email, Supabase Auth, Google OAuth, DB and Storage.
- Two real tenant sessions with cross-workspace ID tampering and authorization tests.
- Backup restore rehearsal, legal/retention/consent review and accessibility with a screen reader.
- PHAM pilot failure diagnosis, authorized field measurements, research with prospective clients and operating-cost validation.
- Owner approval of final release SHA and deployment/rollback procedure. No DNS, production, payments or migration to a real database performed in this workstream.

## 5. Rollback and change management

Before altering a previous branch, the local Git backup `backup/athena-phase8a-start-20261020` points at `f37c6b8`. Do not rewrite any existing Phase PR or tag as “merged”. CI outputs and this report are for an isolated **Draft PR**. Rolling back source means check out the previous reviewed commit on an authorized environment; PostgreSQL rollback must be approved and backed up separately.

**Phase 8A completion target:** integrated candidate exists, traceable lineage/feature gates validated and CI green. **This does not mark Phase 8B–8D, production launch or Phase 7 commercial validation complete.**
