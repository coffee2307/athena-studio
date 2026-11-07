# NORTH — Clear Decisions

NORTH is a standalone Next.js B2B consulting **demo**, implemented within Athena Studio. The company, process scenarios and imagery are illustrative, not claims of an existing business or verified customer projects.

## Visitor journey

The primary job is to understand how NORTH could help, without learning a technical systems model. The homepage contains a clear promise and actions, three selectable common problems with practical approaches, and three readable working stages followed by a contact CTA.

The previous animated network map, pointer parallax, floating ornaments, redundant capability sections, decorative process diagrams and continuously animated paths have been removed.

## Routes

- /: three selectable problems, three steps and contact.
- /work: three subjects with illustrative images.
- /work/1, /work/2, /work/3: problem, approach and possible deliverables. No invented customer results.
- /services: four visible steps, no hidden tabbed dashboard.
- /about: three working principles.
- /contact: accessible form and locally generated email draft. The visitor chooses the recipient. No server submission.

Each route works inside templates/modern-corporate and as /template-demos/modern-corporate within Athena.

## Design and technical boundaries

NORTH owns Site.tsx, North.module.css and NorthSelector.tsx under templates/modern-corporate/src/components. No shared visual template styles or skeleton loaders. Typography uses Vietnamese-compatible Be Vietnam Pro with fallbacks. Visual motion is limited to hover/focus color feedback; no infinite animation or pointer-following movement. Keyboard and reduced-motion support are preserved.

Root-repository verification: npm run typecheck, node --test tests/north-decision-architecture.test.mjs, npm run build, and from localhost 127.0.0.1:3182 run node scripts/north-decision-qa.mjs. Also build templates/modern-corporate independently. Mobile Chrome emulation does not establish real iOS Safari compatibility.

Thumbnail public/template-previews/modern-corporate.jpg is captured from the actual running website using scripts/capture-north-preview.mjs, never an invented mockup.

This revision remains PR #55 Draft; no merge, production deployment or changes to other templates are authorized.
