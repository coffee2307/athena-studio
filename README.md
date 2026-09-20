# Athena

Athena is a minimalist digital product studio website for businesses. The initial codebase is intentionally lightweight and ready for future 3D work without including a 3D runtime yet.

## Stack

- Next.js App Router
- React and TypeScript
- Global CSS with modular tokens and reusable component styles
- Strict TypeScript and ESLint

## Architecture

- `app/` contains routes, layout, metadata, and global styles.
- `components/layout/` contains site chrome.
- `components/sections/` contains page-level compositions.
- `components/ui/` contains reusable presentational primitives.
- `components/three/` is reserved for future React Three Fiber scenes.
- `data/` contains navigation, service, project, and process content.
- `lib/` contains constants, metadata, and small utilities.
- `types/` contains shared TypeScript interfaces.
- `public/branding/` contains brand assets.
- `public/models/` is the future home for 3D models.
- `public/projects/` contains project-specific assets.
- `styles/` contains design tokens, typography, and utilities.

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the site. Run `npm run lint` and `npm run build` before deployment.

## Add a project

Add a typed entry to `data/projects.ts`, then place project imagery in `public/projects/<slug>/`. The work index and dynamic `/work/[slug]` route consume the same data automatically.

## Future extension points

Add React Three Fiber and scene components under `components/three/`; store `.glb` or related model files under `public/models/`. Motion, GSAP, and page transitions can be introduced at the section and layout boundaries without changing content data.
