# Athena — Google / GitHub OAuth readiness

## Current status

Better Auth has built-in Google/GitHub providers. Their buttons are now visible on local login and signup pages, but remain **disabled** when the corresponding app secrets are missing. Athena does not have OAuth credentials configured yet. Email/password login remains available only for the localhost trial. OAuth callback completion was not tested against a real provider.

## To enable locally, after creating OAuth apps with the owner's accounts

Website origin used by the auth server: `http://127.0.0.1:3182`.

| Provider | Authorized redirect/callback |
| --- | --- |
| Google Cloud OAuth web client | `http://127.0.0.1:3182/api/identity/callback/google` |
| GitHub OAuth App | `http://127.0.0.1:3182/api/identity/callback/github` |

Google authorized origin: `http://127.0.0.1:3182`. GitHub Homepage URL should use the same localhost origin. Follow provider console restrictions for localhost URIs and set a verified consent-screen/test user as appropriate.

Configure only in ignored `.env.local`:

```dotenv
ATHENA_GOOGLE_OAUTH_CLIENT_ID=<your-google-id>
ATHENA_GOOGLE_OAUTH_CLIENT_SECRET=<your-google-secret>
ATHENA_GITHUB_OAUTH_CLIENT_ID=<your-github-id>
ATHENA_GITHUB_OAUTH_CLIENT_SECRET=<your-github-secret>
```

**Never commit or paste secrets in chat.** Set one provider at a time with both fields; partial configuration intentionally fails closed. Restart Next.js after editing `.env.local`.

The app calls `signIn.social()` with the Better Auth base path `/api/identity`. Successful credentials and provider approval are required before OAuth redirect can complete and create a verified session. GitHub OAuth login is **not** permission to read the user's repositories.

## Production prerequisites

Use the final verified HTTPS domain (the exact `athenastudio.com` name is not confirmed), register separate production callback URLs, configure encrypted rotating secrets, persistent hosted database, verified email or equivalent proof, application roles/workspace authorization, CSRF/rate-limit checks, trusted origins, and end-to-end login/logout/recovery tests. Local `ATHENA_IDENTITY_LOCAL_ONLY` mode must remain inaccessible on production.

## Design/QA changes

The Athena Design Engineering plugin's visual critique and UX-hardening criteria guided the stronger warm/dark hierarchy, revised contact shortcuts, dismissible desktop service dropdown, and OAuth status messages. Accessibility checks require reduced-motion support, mobile widths, keyboard Escape and focus management. External Zalo/WhatsApp account ownership remains unverified until an actual recipient test.
