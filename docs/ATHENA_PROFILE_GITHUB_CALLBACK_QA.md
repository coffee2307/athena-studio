# Athena — Profile/session & GitHub OAuth callback diagnostics

## Authenticated navigation
- Root layout uses a single `AuthSessionProvider` shared by desktop header, mobile menu, and footer. The source of truth is Better Auth's server-verified `GET /api/identity/get-session`, not localStorage.
- After a verified login the UI replaces `Đăng nhập`/`Đăng ký` with a `Hồ sơ` link to `/profile`.
- The server checks session validity again on `/profile`, which exposes only the user's own details and does **not** grant client projects or administration privileges. `/account-preview` redirects to the English canonical `/profile`.
- Local password signup/signin relies on Better Auth's successful issuance, then navigates to `/profile` which performs the authoritative session check. Avoid issuing multiple `get-session` calls immediately after login; the local rate limiter is limited to 10 requests/minute.

## GitHub `/login?error=invalid_code`
Better Auth emits `invalid_code` at the OAuth authorization-code exchange step when its GitHub provider cannot exchange the *single-use* code for valid tokens, or the exchange throws. This is distinct from a successful Athena session and distinct from an OAuth state mismatch. Do not disable state/PKCE or CSRF protections to bypass it.

Checklist for a **new** login attempt:
1. Start in a fresh normal Chrome tab at **`http://127.0.0.1:3182/login`**, never alternate with `localhost:3182` during the same sign-in.
2. In GitHub Developer Settings → OAuth Apps, confirm the app that owns **the configured Client ID** also owns **the configured Client Secret** (two values are associated with one app). In the local ignored `.env.local`, the keys are `ATHENA_GITHUB_OAUTH_CLIENT_ID` and `ATHENA_GITHUB_OAUTH_CLIENT_SECRET`. Never publish or paste secrets into chat.
3. In the same GitHub OAuth app, confirm the exact redirect URI `http://127.0.0.1:3182/api/identity/callback/github`. No wildcard is necessary.
4. Restart the Next.js dev server after modifying env values. Cancel older OAuth login tabs and **click GitHub sign-in again** to obtain a *new code*; do not refresh or revisit an old GitHub callback URL or saved authorization link.
5. Complete GitHub's authorization promptly. If it still fails, inspect the dev-server error event **without logging or sharing the raw code, state, cookie, token or client secret**. Validate the token-exchange error classification and app configuration privately.
6. Confirm the final destination is `/profile` and the header shows Hồ sơ. An error URI alone does not prove account creation or a working GitHub login.

GitHub OAuth for login is **separate** from connecting client repositories via a GitHub App.
