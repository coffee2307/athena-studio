# Qrio native interface mirror â€” Athena Studio

The user owns the original Qrio project (private repository: coffee2307/Qrio).
This showcase mirrors only its **client-facing HTML, CSS and JavaScript** from
the local Windows project at F:\qrio, including its public logo files, to
maintain the original visual identity and interaction flow. This UI source is
included in Athena's public repository for the requested preview integration.
Review this public exposure before merging or publishing production.

Source of truth: F:\qrio (local project). Native UI pages mirrored: index/home,
edit, scan, about, contact, terms, privacy and disclaimer. The mirroring
script used in the local development workspace: scripts/qrio-refresh-from-local.mjs.

NO PRIVATE BACKEND: Qrio's app.py, admin.py, database, .env, actual payment,
ticketing, administrator routes, uploaded files and secrets are NOT present.
The locally bundled client-only bridge traps all /api/* requests. Basic QR
generation works locally in the browser; advanced styling, file upload,
VietQR, event tickets, payments, scanning-backed validation and server-backed
features are not part of the working Athena demo. Do not describe this as the
full Flask application. The scanner page may be restricted by Athena's
camera permission settings.

Third-party QR encoding:
qrcode-generator 1.4.4 (Kazuhiko Arase), MIT License.
Original project: https://github.com/kazuhikoarase/qrcode-generator
(c) 2009 Kazuhiko Arase.
The MIT license notice is included in qrcode.js, alongside the original
source file.

Qrio's logos and public-facing UI remain the property of their respective
owner(s). The hosted Athena page must retain "noindex" for this demo and may
only be framed from the same Athena origin.
