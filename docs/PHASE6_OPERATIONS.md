# ATHENA STUDIO — Phase 6: Client Dashboard & Operations
Date: 2026-10-20
Branch: `feat/athena-phase6-client-operations-20261020`
Base: Phase 5 `d8ae1e5`
Source: [ATHENA_MASTER_ROADMAP.md](ATHENA_MASTER_ROADMAP.md)

## 1. Implemented capabilities

**Customer portal**
- `/tai-khoan`: verified account profile, user-scoped notifications (mark as read), project and support navigation.
- `/tai-khoan/du-an`: **actual** projects accessible under the user's workspace memberships.
- `/tai-khoan/du-an/[id]`: project status and schedule, milestones, support tickets, private documents and immutable audit timeline.
- `/tai-khoan/ho-tro`: support ticket list and ticket creation, restricted to projects the user can access.
- `/tai-khoan/ho-tro/[id]`: saved conversation and author-bound replies. Closed tickets reject additional replies at database-policy level.
- Empty/loading/error states are explicit; no demo project, fabricated revenue or fictitious customer work.

**Verified studio admin**
- `/quan-tri`: limited real-data operational overview, project and support lists.
- `/quan-tri/du-an`: creation only for existing **client-type** workspaces, linked to a confirmed administrator account. Workspace membership management and client invitations are **not** implemented in the browser; assignment remains through authorized admin/database operations.
- Admin-only update of project/milestone/ticket status, milestone creation, private document uploads.
- No admin authority derived from user-editable metadata or query parameters. Phase 5 `requireAdmin()` checks confirmed identity and real studio membership.

**Documents and notifications**
- Private Supabase Storage bucket `athena-project-files` with 8 MiB quota and PDF, PNG, JPG, WebP file-type restrictions; only authenticated studio admins may upload. Client download requires both an accessible database metadata row and Storage RLS.
- Download request `GET /api/operations/documents/[id]`: validates Auth user and document metadata, asks Supabase for a **60-second signed URL**, verifies the host against configured Supabase origin, then redirects without caching. The client never receives a service-role key or arbitrary object path.
- Upload action writes metadata then Storage object. On upload failure it calls the restricted `athena_discard_failed_document` RPC: verified studio admin, uploader identity and a 15-minute freshness window are required; it deletes metadata only if **no corresponding Storage object exists**. If a network timeout happened after Storage succeeded, the metadata is preserved for manual reconciliation. The database also requires the object path prefix to equal the project's UUID to prevent cross-project metadata aliasing. Metadata and Storage still lack a shared atomic transaction; manual reconciliation and malware scanning are required before public rollout.
- Database-generated notifications cover project/milestone status, new tickets, ticket status and new messages. Notifications are in-portal records; **no real push, email or mobile notifications** are configured.
- Database audit triggers record key create/status/message/document-registration events; user-facing audit history is read-only and workspace-scoped.

## 2. Data architecture

Apply these **in order** to an isolated, explicitly authorized Supabase staging project:
1. [Phase 5 identity](db/phase5_identity.sql)
2. [Phase 6 project operations](db/phase6_operations.sql)
3. [Phase 6 private Storage bucket and policies](db/phase6_storage.sql)

Tables: `athena_projects`, `athena_milestones`, `athena_tickets`, `athena_ticket_messages`, `athena_documents`, `athena_notifications`, `athena_audit_events`. Projects belong to `athena_workspaces` and client users obtain access via `athena_memberships`. Only verified studio admins can change project/milestone/ticket status or register document metadata.

RLS helper functions live in `private`, not API-exposed public schema. They derive the requester identity from `auth.uid()` and check studio or customer membership. Client A cannot see, edit or download B's records by guessing or changing IDs. The SQL is intentionally create-only for project records (no browser deletion) except admin cleanup of document metadata.

**Privileges**: Authenticated browser role receives narrowly scoped SELECT/INSERT and column-specific UPDATE rights. No authenticated role can directly write audit events, forge notifications or update memberships. Database triggers run under an explicit definer in private schema with empty `search_path`.

## 3. Offline isolation and QA strategy

Reproducible unit tests boot a real PostgreSQL 18 engine using PGlite WebAssembly:
- `tests/operations-rls.test.mjs`: two clients, one verified admin; project ID manipulation; project/milestone edits rejected; cross-client ticket and message access; spoofed author; closed-ticket rejection; notifications and audit integrity.
- `tests/operations-storage.test.mjs`: Supabase-style local `storage.objects`/bucket scaffolding with actual Storage RLS policies; the authenticated admin writes files, A reads only A's authorized document objects, B cannot see A's object/metadata, client upload denied. Tests malicious object path.
- `tests/rls-isolation.test.mjs`: Phase 5 role and profile isolation retained.

The test executes the operations and Storage policies in PostgreSQL rather than replacing RLS with JavaScript mocks. PGlite cannot run optional Supabase extensions or the real external Storage REST and Auth services. These are **not** confirmations of live Supabase Storage, session, transaction delivery or real bucket behavior. Run the original migrations and A/B Auth JWT test scenarios in verified Supabase staging before activating registration or document upload.

Automation: `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run test:smoke`, `npm run test:e2e`, `npm run audit:runtime`. GitHub Actions must independently pass after PR submission.

## 4. Setup and release gates — owner actions

1. Approve a separate Supabase staging project and hosting region, data retention/deletion rules, backup and restore requirements. Consider the price and free-tier limits before any purchase.
2. Apply migrations only after reviewing the exact change with database owner. Set up a private Storage bucket with RLS; **never make project bucket public**.
3. Independently verify studio founder/admin identities, customer invitations and which workspace each account belongs to. Provision memberships from a privileged operator context, not unauthenticated public sign-up.
4. Configure Supabase Auth, email verification and Google OAuth from Phase 5, and verify real HTTPS/cookie redirect flows. Only then enable `NEXT_PUBLIC_ATHENA_AUTH_ENABLED=true` on a non-public staging origin.
5. Test *two real tenant accounts* A and B via PostgREST: A cannot access B by modifying project/ticket/document IDs. Test clients' RLS against PDF signed URL generation, admin upload, closed-ticket responses, role escalation, and linked workspace policies.
6. Confirm operational email notification requirements (Phase 6 currently has only in-app notifications), project status terminology, document licensing/retention, backup/restore and incident response. Consider malware scanning and file moderation before accepting arbitrary customer documents.
7. Approve staging visuals and screen-reader/manual accessibility checks, then issue a separate GO/NO-GO decision for production. Do not merge `main`, deploy, change DNS or incur costs without authorization.

## 5. Explicit scope boundaries

The Phase 6 dashboard, server actions, RLS migrations and CSS are written and build-tested but are **not connected to a real Supabase project**. In the current disabled-auth build, all customer/admin pages correctly redirect to the disabled-login page. No private customer data, paid contract, actual project or generated test records have been put into a real provider.

No realtime WebSocket synchronization, e-signing, Stripe, public subscription checkout, role invitation UX, customer organization billing, file malware scanning, customer-initiated uploads or comprehensive on-call monitoring has been activated. Phase 7 remains Product Lab/Micro-SaaS after Phase 6 acceptance.
