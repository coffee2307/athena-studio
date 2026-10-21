# Athena Studio — Phase 5 QA / Identity and Access Control
Date: 2026-10-20
Branch: `feat/athena-phase5-auth-20261020`
Base: Phase 4 `3918e4e`

## Implemented and verified in source
- Supabase Auth SSR server/browser clients with Next.js 15 cookie integration and PKCE code exchange.
- Email login, sign-up, confirmation redirects, forgot/change password; Google OAuth option gated until provider configured.
- Profile editing and local/all-device sign-out; only trusted membership for studio admin check.
- RLS migration with separate profiles, studio/client workspaces and membership roles. All browser role creation/assignment mutations denied.
- UI in Vietnamese and responsive editorial monochrome, no-index auth route metadata, fail-closed state when Auth is not configured.
- Role is never obtained from user-editable metadata; no automatic first-user admin grant.

## Automated gates (Windows, Node 24)
| Gate | Result |
|---|---|
| ESLint | PASS |
| TypeScript | PASS |
| Unit tests | **20/20 PASS** |
| Offline PostgreSQL RLS verification (PGlite WASM 0.5.10 / PostgreSQL 18) | **PASS** — two isolated tenants, profile reads/writes, denied role updates, anonymous denial |
| Next.js 15.5.28 production build | PASS, dynamic protected/private pages and auth callback routes |
| HTTP smoke | PASS: 23 public pages/API assets, legacy redirects, protected account redirects, safe disabled contact |
| `npm audit --omit=dev --audit-level=high` | PASS, 0 production advisories |
| Browser E2E with Playwright | **51/51 PASS**, Chrome desktop, touch mobile, Firefox desktop |
| axe-core checks | **27 passing scenarios**, 9 routes across three browser profiles (automated subset, not formal WCAG certification) |
| Unconfigured Auth and no fake forms | PASS |
| Protected routes with missing Auth/Google provider | PASS, redirect to explanatory login status |
| Callback with malicious next URL when Auth disabled | PASS, no external navigation |

## What the offline RLS test proves
The test runs an actual PostgreSQL RLS engine with two users and executes the Phase 5 migration's real table/policy/trigger SQL. Because PGlite does not bundle pgcrypto, the single `create extension if not exists pgcrypto` statement is omitted in that offline test. All application RLS grants/policies are executed; users see only their own profiles/memberships/workspaces; attempts to update someone else's profile have zero row effects, and write attempts against privileged membership tables fail.

**It does NOT prove** Supabase Auth provider behavior, production PostgREST, all JWT refresh scenarios, or RLS behavior on the final authorized remote Supabase project. An end-to-end staging test with two real confirmed accounts remains mandatory.

## Real integration not tested / rollout blocked
- Neither Supabase Auth nor SMTP is configured; no real email verification, signup, password recovery or Google login has been tested.
- No real administrator or customer account exists in this iteration; no membership was assigned on a remote project.
- MFA, session/device inventory, abuse protection during public sign-ups, regulatory consent, account deletion and data retention require owner decisions before launch.
- SSR Auth cookies (browser-readable) are SameSite Lax and secure on HTTPS; this must be tested at the real hosting origin. Next CSP currently retains inline script allowance and is not a strict nonce CSP.
- Auth enabled without completed RLS migration and real callback/email tests would be an unsafe release; feature flags remain `false`.
- Current admin route is permission gated, but displays development notice and is not a working management dashboard (reserved for Phase 6).
- Full dev-dependency advisories may differ from the runtime-only audit; do not infer full tree clean.

## QA release decision
**Phase 5 implementation/testing candidate PASS locally. Production Auth enablement NO-GO.**
Await independent GitHub CI and owner authorization of Supabase project, OAuth/email credentials, migration, isolation verification, legal terms and actual session tests. Main, production and DNS unchanged.

## Giao diện thực tế
- [Desktop](visual/athena-phase5-auth-desktop.jpg)
- [Mobile](visual/athena-phase5-auth-mobile.jpg)

Ảnh được chụp từ ứng dụng Next.js production chạy cục bộ tại `/dang-nhap` khi feature gate đang tắt. Đây là giao diện trạng thái chưa kích hoạt, không phải bằng chứng về đăng nhập Google, gửi email hoặc tài khoản thực.
