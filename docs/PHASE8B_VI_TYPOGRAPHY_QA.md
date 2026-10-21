# Athena Studio — Phase 8B Vietnamese typography and admin gate

Date: 2026-10-20 (Asia/Ho_Chi_Minh)
Branch: `feat/athena-phase8b-vietnamese-typography-20261020`
Base: `feat/athena-phase8b-live-readonly-20261020` (Draft PR #17)

## Typography defect and correction

Previous global font stack depended on platform `Segoe UI` / Arial, while some editorial italic text used Times New Roman. Several prominent Vietnamese display headings used letter spacing down to `-.095em` and line-height approximately `1.03`, which can visually crowd stacked Vietnamese accents, particularly with variable fallback glyph widths.

Changes:
- Bundle pinned `@fontsource/be-vietnam-pro@5.3.0` for regular headings/body across weights 400/500/600/700, with Unicode ranges containing Vietnamese `U+1EA0–U+1EF9`.
- Bundle pinned `@fontsource/noto-serif@5.3.0` at 400 italic for editorial emphasis. All font files are built with Next.js, not fetched at runtime from Google Fonts or another CDN.
- Use `font-kerning: normal` and font smoothing, retain the existing Athena monochrome aesthetic.
- Override aggressive tracking on main display headings to `-.035em` desktop and `-.025em` small screens; increase their line-height to 1.16/1.2 to protect accent stacks.
- Add Playwright glyph font-loading regression tests for `Tiếng Việt`, `ề`, `ễ`, `ệ`, `ứ`, `ữ`, `ự`, and test typography metrics on Chromium desktop/mobile and Firefox.

Validation:
- `npm run test:unit` 56/56 PASS.
- `npm run lint` and `npm run typecheck` PASS.
- `npm run build` PASS with 29 generated pages.
- `npm run audit:runtime` 0 production-dependency vulnerabilities.
- Targeted Playwright Vietnamese font test 3/3 PASS; full E2E suite separately verified before merge.
- This does not mean the production website is deployed; the changes remain in a staged Draft PR.

## Studio Admin email gate

Owner designated one separate Studio Admin email address. Attempting ordinary Supabase `auth.signUp` with a generated strong random password was blocked by the Supabase Auth API: `HTTP 429 over_email_send_rate_limit`. No admin Auth user was created (verified with management read-back), no admin workspace/membership was inserted and no admin privileges were granted. Existing two client A/B tenants remain unchanged.

Do not bypass email confirmation, manually insert `auth.users`, promote client fixtures or send repeated signups against rate limits. Resume after Auth mail quota resets or after the owner configures a verified custom SMTP provider, re-validate exact Supabase staging project ref, email ownership, confirmed identity and authenticated session before granting narrowly scoped `studio/admin` membership in a single guarded transaction.

## Gates remaining

- Real Studio Admin JWT authorization across both client workspaces and project management.
- Authorized private document upload, signed URL isolation, rollback and cleanup.
- Provider SMTP, Google OAuth, staging hosting, backup restore, legal/security release acceptance.
- Do not merge main, enable public Auth UI, deploy production, upgrade paid providers or connect real customers.
