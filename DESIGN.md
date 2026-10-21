# Athena Studio — Design system and motion criteria

Source: existing Athena visual identity, reviewed with Emil Kowalski Design Engineering, Impeccable, Taste Skill v2, Anthropic Frontend Design, and Superpowers. These are project design decisions, not testimonials or authority claims.

## Visual direction: engineered editorial, not an empty white room

- Canvas: warm-neutral off-white `#f6f7f5`, pure white `#ffffff`, dark ink `#171c19`.
- Secondary text `#5b615c`, structure/borders `#d9ddd7`, restrained sage `#c9dfcf`.
- Official WhatsApp green and Zalo blue appear only on recognizably functional contact buttons; not decorative section accents.
- Typeface: Be Vietnam Pro across UI. Use a deliberate display/body scale, generous readability, and correct Vietnamese diacritics.
- Use section alternation, small editorial details, credible screenshots, and grouped service content to create rhythm. Empty space must have purpose.
- Distinguish hero, service selection, case studies, workflow, FAQ, and final CTA by information hierarchy, not repetitive identical cards.

## Functional elements

- Desktop contact: explicit dialog for phone, Zalo, WhatsApp, email, with direct URLs, local QR assets, keyboard focus, and Escape/backdrop dismiss.
- Mobile contact: native application deep links when supported; labels and tap areas are at least 44px.
- Email: web-based Gmail/Outlook composition or a copyable message; do not rely only on `mailto:`.
- Account: use verified sessions; local demo must never masquerade as production customer access.

## Motion principles

- Single continuous brand ticker left-to-right, <= one dominant ambient element per first viewport; pause on hover and disable movement in reduced-motion preferences.
- Interactive dialogs use opacity + transform, <= 240ms; transforms and opacity only.
- Hover-only treatments use `@media (hover:hover) and (pointer:fine)`, never persistent sticky hover on touch.
- Preserve interruptibility; avoid `transition:all`, layout-driven animation, and animation on high-frequency UI.
- Respect `prefers-reduced-motion: reduce`; keep information visible.
- Use `100dvh`, safe-area insets, `touch-action:manipulation`, 16px form inputs and genuine keyboard focus when appropriate.

## Quality gates

No dead CTA, no accidental password/query-string submission, no overlay blocking menu, no false case study claims, no broken mobile overflow. Test functional journeys in Chromium desktop/mobile and Firefox, plus native device acceptance when available.

## Design anti-references

Generic SaaS card grids, purple/blue gradients, boxed icon tile above every heading, unverified number counters, arbitrary orb/glow effects, busy autoplay motion, and empty white sections with no clear next action.
