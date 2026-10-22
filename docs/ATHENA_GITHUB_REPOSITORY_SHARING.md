# Athena — GitHub repository sharing

## Login and repository permission are separate

GitHub login to Athena proves identity only. The login OAuth app does not request broad repository scopes. Repository access uses a separate GitHub App installed by the user or organization, with **Metadata: read-only** and **Contents: read-only** permissions.

## GitHub App setup

Create a GitHub App with:

- Repository permissions: Metadata **Read-only**, Contents **Read-only**.
- No organization permissions, write permissions, webhook delivery, or user impersonation.
- Setup URL: `https://<Athena-origin>/api/github/callback`.
- Callback/redirect behavior: GitHub sends the browser back to the setup URL with `installation_id`, `setup_action`, and the one-time signed `state`.

Set server-only values in ignored `.env.local`:

```dotenv
ATHENA_GITHUB_APP_ID=
ATHENA_GITHUB_APP_SLUG=
ATHENA_GITHUB_APP_PRIVATE_KEY=
ATHENA_GITHUB_SHARE_ADMIN_EMAILS=
```

The private key accepts escaped newline characters. Never put it in a `NEXT_PUBLIC_*` variable or commit it. The allowlist is a comma-separated list of Athena staff email addresses that can view shared-repository metadata and download a code archive.

## What sharing does

1. The user connects an installation and sees repositories granted to that GitHub App.
2. The user explicitly selects each repository by pressing **Chia sẻ với Athena**.
3. Athena stores the selected repository name, branch, visibility, account association, and consent timestamp in the local identity database. GitHub access tokens are short-lived and are never stored.
4. An allowlisted Athena staff account can list shared repositories through `GET /api/admin/github-shares` and request an archive through `GET /api/admin/github-shares/<share-id>/archive`. The archive is streamed from GitHub and is not saved by the Athena application server.
5. The integration refuses repositories larger than 50 MB. The user can revoke one repository from the profile panel, disconnect the installation, or remove Athena's GitHub App installation in GitHub settings.

The integration can read repository contents after explicit sharing; it cannot push code or change repository settings. A user should not share secrets, customer data, credentials, or repositories they are not authorized to share.

## Environment limitation

Athena's current account profile is gated to a localhost-only identity proof of concept. This integration is deliberately disabled unless a GitHub App is configured. Production use requires the production identity database migration, durable storage and retention rules, deployment secrets, HTTPS callback registration, rate limits, incident handling, and a security review. No production repository is connected by this change.
