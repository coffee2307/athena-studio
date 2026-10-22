# Athena Studio — Design system and motion criteria

Source: existing Athena visual identity, reviewed with Emil Kowalski Design Engineering, Impeccable, Taste Skill v2, Anthropic Frontend Design, and Superpowers. These are project design decisions, not testimonials or authority claims.

## Visual direction: strict monochrome editorial identity

- Brand design is **BLACK / WHITE / NEUTRAL GRAYS ONLY**. No sage, green, beige, blue or pastel surfaces. This is the owner's explicit art direction; do not reintroduce colored accents while experimenting with UI.
- Canvas white `#ffffff`, off-white `#f6f6f6`, light divider `#dedede`, ink `#111111`, subtle type `#686868`, high-contrast dark blocks `#121212`.
- The only chromatic marks permitted are authentic third-party app logos (e.g. Zalo / WhatsApp) rendered on **white** contact buttons, and red error text when necessary for semantic safety. No gradient or glowing tinted backgrounds.
- Typeface: Be Vietnam Pro with generous legibility for Vietnamese diacritics. Use editorial scale and asymmetry for rhythm rather than decorative colors.
- Main service selector is a dark panel, while the hero is white/off-white; distinguish cards through neutral gray values, hierarchy, depth and content rather than chromatic color coding.
- Mobile nav is a full-height sheet beneath the 72px header with one visible close control, semantic sectioning, <=300ms transform/opacity transitions, preserved focus, scroll lock and Escape/backdrop dismissal.
- Mobile footer is **not** a compressed desktop 3-column grid. Use a clear dark CTA, stacked brand and contact area, scannable groups and legible legal/copyright copy. Hide floating shortcuts while footer contact links are visible to avoid overlap.
- No unnecessary AI-sounding claims, invented case studies, or internal founder/developer labels on the public website.

## Functional elements

- Desktop contact: explicit dialog for phone, Zalo, WhatsApp, email, with direct URLs, local QR assets, keyboard focus, and Escape/backdrop dismiss.
- Mobile contact: native application deep links when supported; labels and tap areas are at least 44px.
- Email: web-based Gmail/Outlook composition with prefilled subjects and body; do not rely only on `mailto:`.
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
