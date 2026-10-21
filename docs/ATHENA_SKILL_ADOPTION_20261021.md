# Athena design skills installation and application

Date: 2026-10-21. Scope: project-local `.agents/skills`, installed via `npx skills add ... -a codex -y --copy`. Sources:

- `emilkowalski/skill`: all listed skills, including animate, review-animations, mobile-native, animation-performance, break-ui.
- `pbakaus/impeccable`: impeccable.
- `Leonxlnx/taste-skill`: design-taste-frontend.
- `anthropics/skills`: frontend-design.
- `obra/superpowers`: development and verification methodology.

Installation scope is this repository, not global software configuration. In other coding agents, project-local skills may require restart and compatible skill discovery. Their existence alone does not enable ChatGPT's hosted app plugins.

Security: installer reports a Socket alert/Snyk medium risk for Taste Skill. Its script tools have not been executed. Do not grant downloaded skill scripts access to tokens, browser sessions, or private company files without reviewing source/dependencies. Skill markdown is guidance, not an instruction to override release security policy.

## Review / changes applied

| Before | After | Reason |
| --- | --- | --- |
| `mailto:` and `tel:` seemed inert on desktop | Explicit contact sheet, web compose choices, QR for handheld | No dependency on a desktop phone/mail handler |
| Floating link labels did not support exploration | User can switch contact channels inside one accessible dialog | Reduce dead-ends and recoverability |
| Uniform mostly-white spacing | Single dark ticker stripe with restrained movement | More rhythm without adding random decorative objects |
| Zalo/WhatsApp icons approximated | Use owner-provided SVG files, verified by hash | Brand recognition and design accuracy |
| UI motion could ignore input modality | Constrain hover styling to fine pointers and give press feedback | Mobile-native interaction |
| Auth had disabled display with no actionable local test | Local-only Better Auth signup/session test mode with explicit flags | Validate genuine auth while production remains gated |
| Test-only UI assumptions | Explicit tests for QR, ticker, contact sheet, auth safety | Repeatable regression detection |

## Remaining release caveats

Physical phone/mobile browser check needed for OS deep links and QR camera association. Zalo and WhatsApp must be verified against the recipient's actual accounts. Production signup/login needs approved HTTPS origin, durable database, real verified email or OAuth, and authorization integration; localhost password mode does not satisfy those gates.

## Reproducibility and repository distribution

The third-party skill bodies and scripts are installed locally in `.agents/skills/`, but are deliberately ignored by Git. `skills-lock.json` is tracked. Reinstall from its sources on a trusted development machine with `npx skills experimental_install`, then review the downloaded version and scripts before execution. This avoids importing unreviewed third-party binary or executable bundles into the Athena public codebase.

The private ChatGPT plugin `athena-design-engineering` version 0.1.0 was created via Plugin Creator. It is independent of local skill installations and contains six Athena-specific text workflows without executable scripts. Using the ChatGPT plugin requires opening/connecting it in the user interface; its existence does not grant private repository credentials.
