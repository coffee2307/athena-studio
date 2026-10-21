# ATHENA STUDIO — PHASE 6 QA / CLIENT DASHBOARD & OPERATIONS
Date: 2026-10-20
Source: `feat/athena-phase6-client-operations-20261020`
Base: Phase 5 commit `d8ae1e5`

## Implemented
- SSR React/Next.js account project directory, status/milestone/case detail, scoped support tickets and conversation, private document metadata/download link, account notifications and event timeline.
- Admin views for real projects, milestones and tickets; create/update operations use verified Auth session, studio admin role and database policies, rather than trusting IDs/roles sent by the browser.
- Separate operator-controlled `ATHENA_OPERATIONS_ENABLED=false` default feature flag; Phase 5 login can be configured independently, and all Phase 6 routes/actions/files remain blocked until explicitly activated.
- Seven RLS-protected relational tables and private Storage policies; database-generated audit/notification events.
- Project-file maximum 8 MiB and Next.js Server Action body size cap 9 MiB; valid MIME limited to PDF, PNG, JPEG, WebP.
- Strong empty/loading/error states without sample client work.

## Local QA gates
| Test | Result |
|---|---|
| ESLint | PASS |
| TypeScript | PASS |
| Unit test suite | **26/26 PASS**, including PostgreSQL RLS and input validation |
| PGlite multi-tenant tests | PASS, 3 isolated users (one studio admin, two customers) |
| PGlite Storage RLS | PASS, object namespace private; A cannot read B's metadata/files and vice versa |
| Next.js 15.5.28 production build | PASS, private project and ticket routes compiled as dynamic SSR |
| HTTP smoke | PASS, public routes and redirects retained; private Auth disabled |
| Production dependency audit | PASS, **0** high/severe runtime advisories |
| Cross-browser Playwright | **54/54 PASS**, Chromium desktop/mobile and Firefox desktop |
| Automated accessibility | **27/27 axe-core A/AA scenarios PASS**, on public/auth-disabled routes (not yet on live authenticated dashboard) |

## Important RLS regression details
1. Client A sees only A's project, milestones, ticket and audit trail; client B sees only B's. Direct SQL queries with guessed target IDs return zero rows for unauthorized SELECT/UPDATE.
2. A cannot create a project, mark milestones completed, change a ticket's status, impersonate another message author, or create a ticket in B's workspace.
3. Closed tickets reject new messages under the **SQL policy**, not merely via hiding the UI.
4. Admin can create projects assigned to verified client workspaces, change states, and logged events are created by database triggers.
5. Notifications are scoped to their recipient, and only the recipient can mark them as read. Users cannot INSERT fake notifications or audit records.
6. Storage test executes bucket policies on a local `storage.objects` schema backed by real PGlite/PostgreSQL RLS. Only admin can insert permitted objects; clients see objects **only** if an authorized project metadata row exists. Invalid UUID-like paths return NULL. A cross-project metadata path is rejected by the database constraint, preventing an object belonging to project A from being exposed through project B. Failed uploads can remove metadata through an admin-only, time-limited RPC **only if the Storage object does not exist**; metadata is retained for manual reconciliation if the object was actually uploaded.
7. `/api/operations/documents/[id]` remains fail-closed when Auth or operations gate is unavailable. It requests 60-second signed links only after a live authenticated metadata lookup and verifies the returned host.

## Limitations / NO-GO requirements
- **No Supabase staging or production project, Auth real session, external Storage bucket, real signed URL, document upload, or SMTP has been integration-tested.** The PGlite SQL tests do not prove external provider behavior or actual traffic on a deployed host.
- No customer, real asset, confidential client project or invoice was created; database migrations were not applied to any external project.
- Dashboard interaction with a real logged-in account has not been tested; end-to-end tests cover unauthenticated safety, and SQL tests cover permissions. A real staging A/B project test is mandatory for functional acceptance.
- Admin/tenant workspace provisioning is operator-only; there is no end-user invitation UI or file malware scanner.
- File uploads are not atomic between PostgreSQL metadata and Storage; a reconciliation/cleanup plan and infected-file screening are required before handling customer data.
- Notification channel is **inside account only**, not push/email. Database audit triggers cover key lifecycle changes but do not constitute comprehensive compliance logging or automatic incident alerts.
- Manual accessibility, keyboard/screen reader and performance measurements on a signed-in dashboard remain pending.
- Previous public Lighthouse baseline cannot be treated as a signed-in dashboard Lighthouse score.
- No production rollout, DNS, public Auth activation, paid service, destructive migration or merge to `main`.

## Release decision
**Code/infrastructure candidate subject to green GitHub Actions. Operational production GO = NO.** Follow [Phase 6 runbook](PHASE6_OPERATIONS.md), [Phase 5 identity setup](PHASE5_AUTH_ARCHITECTURE.md), and the approved project roadmap.
