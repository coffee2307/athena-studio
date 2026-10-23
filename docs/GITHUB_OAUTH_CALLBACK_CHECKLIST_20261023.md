# GitHub OAuth — Athena Identity callback checklist (23/10/2026)

**Scope:** Local Better Auth proof of concept at `http://127.0.0.1:3182`. No production enablement or changes to OAuth provider credentials.

## Exact configuration

1. Create/choose one **GitHub OAuth App** for Athena *identity login* (not the separate GitHub App used for repository permissions).
2. Set **Homepage URL** to `http://127.0.0.1:3182/`.
3. Set **Authorization callback URL** to **`http://127.0.0.1:3182/api/identity/callback/github`**. It is NOT `/api/auth/callback/github`, `/login`, `/profile`, a preview tunnel, or a previous port.
4. `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3182` is the exact base origin; `BETTER_AUTH_SECRET` is stable across redirect and at least 32 characters; `ATHENA_INDEPENDENT_AUTH_ENABLED=true`, `ATHENA_IDENTITY_LOCAL_ONLY=true`, `NODE_ENV=development`, `ATHENA_IDENTITY_DB_PATH=.qa/<name>.sqlite`; plus the matching `ATHENA_GITHUB_OAUTH_CLIENT_ID` and `ATHENA_GITHUB_OAUTH_CLIENT_SECRET`. **Never commit or paste real credentials.**
5. Local databases must have already been migrated through the existing Better Auth migration path. Provider buttons can be available with GitHub-only login; local password does not have to be enabled.
6. Open the browser at `http://127.0.0.1:3182/login` only. Start a new single authorization from that tab. Do not cross to `localhost` at any stage; do not reuse an expired `code` or an old callback URL.
7. Inspect only the **error name** in the returned URL. Do not share `code`, `state`, cookies, Client Secret or token. `invalid_code` can mean client mismatch, code reuse/expiry, callback mismatch or provider exchange failure; it does not by itself prove a wrong secret. `state_not_found` / `state_mismatch` implicate OAuth state/cookies. `account_not_linked` requires separate account-linking policy; Athena deliberately keeps automatic linking disabled.
8. Success requires an actual server-issued Better Auth session and successful server-side `/profile` access — an OAuth redirect alone is insufficient.

## Offline tests

- `node --test tests/oauth-origin.test.mjs tests/local-password-auth.test.mjs` confirms callback composition, strict loopback origin and disabled automatic account linking without real credentials.
- GitHub Actions builds and checks local configs without live GitHub authentication; it cannot prove the owner’s OAuth app callback or a live authorization exchange.
- For a public HTTPS host, use a **separate registered callback** `https://YOUR_HOST/api/identity/callback/github`, approved VPS identity config, protected secret files, database migrations, TLS, cookies and rollback. Local-only gates must remain unavailable outside localhost.

## Security boundaries

- Sign-in identity never implies repository permissions. Installations use an independently approved GitHub App.
- Do not bypass state, PKCE, email verification, CSRF or trusted-origin gates to “fix” login.
- Do not turn on provider flags, authentication in production, customer accounts or payments merely because an OAuth App has a Client ID and Secret.
