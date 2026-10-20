# ATHENA SITEPULSE — Phase 7.3: Diagnosing an inconclusive manual check

Date: 20/10/2026. Phase 7.2 PR #11 remains the source of approved pilot scope; this technical update changes diagnostic classification only.

## Why this patch is needed
The first manually authorized check for the PHAM target returned `httpStatus: null` with a generic `connection_or_tls_error`. That outcome confirms **failure of this specific probe to obtain an HTTP response**, not an outage of the website. The raw error code was not captured, so the exact root cause cannot be recovered from the saved result. No automatic alert, system change or repeat probe was triggered.

**Detailed first-run evidence and consent records remain private** under the operator's Git-ignored `.qa/` folder; they are not committed to GitHub.

## Diagnostic change
The Node `https.request` error listener now maps a small allowlisted set of transport codes to coarse categories:
- TLS certificate mismatch/expired/untrusted → `tls_certificate_error`.
- General TLS protocol or handshake error → `tls_handshake_error`.
- TCP connection reset/refused → `connection_reset` / `connection_refused`.
- Connect timeout or route failure → `connection_timeout` / `network_unreachable`.
- DNS failure categories → `dns_failed`.
- All unknown codes → `connection_or_tls_error`.

The probe **never logs raw error messages, certificates, host-resolution answers, HTML, headers, secrets, or response bodies**. Error categories are not evidence of root cause on their own.

## What must happen before the next live check
1. Respect **at least 15 minutes** after the previous measurement according to SitePulse JSONL evidence; the daily limit remains eight checks.
2. Keep the exact one approved HTTPS target, root path, and the same time-limited private authorization manifest.
3. Trigger the next check **manually** if the owner wants continued diagnosis. Do not create a scheduler, background monitoring job or implicit retry.
4. Compare the new category and HTTP status with the prior result. Do not diagnose downtime from a single failed transport probe.
5. If it still fails, review network egress/firewall, direct TLS handshake, domain allowlist and upstream provider controls **without bypassing certificate validation**. Any independent website measurement still follows the same consent and cooldown restrictions.
6. If HTTP 3xx appears, SitePulse records `attention` and does not follow it automatically; obtain separate approval for a different hostname.

## Verification scope
- Offline tests for error classification against synthetic errors.
- Existing consent/anti-SSRF/RLS and browser suites must continue passing.
- Real external probe revalidation is **pending**. This patch cannot explain the earlier generic failure retrospectively.
- No production, DNS, main branch, paid provider or PHAM website changes.
