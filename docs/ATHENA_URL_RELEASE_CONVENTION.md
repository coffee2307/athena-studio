# ATHENA — Public URL and release policy

## Public URL contract

- Use **English slugs** for all public-facing URLs and account-facing paths. User-facing prose and navigation labels stay **Vietnamese**.
- Canonical routes: `/services`, `/projects`, `/process`, `/about`, `/products`, `/pricing`, `/contact`, `/legal/*`, `/login`, `/signup`, `/forgot-password`, `/account/*`, `/admin/*`.
- New URL paths should use lowercase, ASCII, hyphenated English terms. Do not add new Vietnamese public slugs.
- Keep permanent redirects from previous URLs; preserve query strings and existing bookmarks. Update internal links, metadata canonical URLs, sitemap, tests, and documentation alongside every route change.
- API endpoints under `/api/*` and authentication callbacks under `/auth/*` are implementation protocols: do not rename without provider migration and verified compatibility.

## Release / verification contract

After an approved update, complete the changes, test, commit and push, then **merge the PR into `main`** once checks pass. Verify the resulting remote `main` SHA. Do not assert a merge if CI fails or GitHub rejects it; report the blocker instead.

Run the **merged `main` production build locally** on the authorized device and expose a verifiable loopback URL, by default `http://localhost:3182/`. Confirm at least the home page and primary client journeys return HTTP 200. Loopback URLs only work on the machine running the server; mobile external access needs a separately authorized LAN or authenticated preview tunnel.

Minimum checks: TypeScript, Next production build, smoke routes/redirects, Playwright navigation/mobile, protected routes, CTA/contact and sitemap. Production deployment, DNS updates, billing, auth activation and external credentials are separately gated.

WhatsApp/Zalo URL reachability is not proof that a message can actually reach the intended recipient. Verify ownership and messaging from a second account before advertising them as confirmed reception channels.
