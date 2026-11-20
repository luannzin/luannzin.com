# src/lib

## Purpose

- Shared logic for routes and components: the scene engine, markdown rendering, posts, share images, structured data and constants

## Ownership

- `scene.ts`: seeded scene engine; one seed picks place, time of day, landmark and every shape, and each frame is a colour plus dot size per cell, ordered-dithered; exports `seedFrom`, `createScene`, `renderer`, `viewOf`, `START`, `RADIUS` and the `Place` type; pure, runs on server and client
- `scene-tile.tsx`: `sceneTile(seed)`, a scene's 44px home tile as a PNG through `next/og` (first frame, the landmark crop, 18 dots across at 3x); posts' and Seeded scenes' `tile.png` routes
- `scene-png.ts`: `sceneWide(seed)`, the whole scene's first frame at 1200x600 (240 dots across, 5px a cell) as PNG bytes, drawn straight into pixels and encoded with `node:zlib` (next/og takes about 5s for that many dots, about 0.2s here); `/today.png`
- `die.ts`: the die's geometry (`drawDie`), throws (`throwTo`, `angleAt`) and hop keyframes; pure, shared by `Die` and the Lab
- `dots.ts`: draws a frame on a canvas (WebGL, 2D fallback); client only
- `melt.ts`: WebGL melt between two scenes for the cover die (a plain crossfade under reduced motion); `meltLayer` holds one at a given point for the Lab; client only
- `markdown.ts`: `renderMarkdown(source, locale)` returns `{ html, toc }`; `plainMarkdown(source)` feeds the markdown twins
- `writing.ts`: reads `src/content/writing`, parses frontmatter, falls back to English for a missing translation; `getPosts`, `getPost`, `formatDate`; reading time at 220 words a minute
- `og.tsx`: share images through `next/og` (`homeImage`, `postImage`); reads the Inter TTFs and `public/avatar.jpg`
- `json-ld.tsx`: schema.org graph (`home`, `article(post, locale)`) and `JsonLd`
- `site.ts`: `site` origin (the www host), `profiles`, `email` (CV only), `cvPdf` (the CV PDF paths, kept in step with `scripts/cv-pdf.mjs`), shared `openGraph`, `markdownTwin` (the markdown twins' response)
- `locale.ts`: `changeLocale` server action
- `theme.ts`: the themes in the dock's order and the `Theme` type; shared by the layout's `ThemeProvider`, the dock and the orb
- `classes.ts`: shared class tokens `enter`, `bezel`, `press`, `underline` (named in `DESIGN.md`)
- `utils.ts` (`cn` re-export), `segmented-control.ts` (ui kit only)

## Local Contracts

- Scenes are deterministic: a seed gives the same scene and frames on server and client; `sceneTile` draws frame `START` and the live tile starts there, so they must match; changing `scene.ts` output repaints every post
- `markdown.ts` output is trusted HTML (posts are repo files) but every interpolated string still goes through `escapeHtml`
- `markdown.ts` owns the fence contract with `src/content` (`flow`, `scenes`, `roll`, `lab`, code meta, lone images); a new fence needs its HTML block, its `plainMarkdown` text form and, if it mounts client code, an island kind in `@/components/article-islands`
- `renderMarkdown` runs inside `"use cache"`: it takes the locale and never reads request state
- `writing.ts` frontmatter is flat `key: value` only; posts missing `title` or `date` throw at build
- Share images look like the page at 2.5x: ground `#161616`, Inter 400/500, three ink tiers, no colour and no scene art (user decision); every element with children is flex for Satori; file paths stay literal so the build traces them
- JSON-LD: one Person `@id` on the home graph, referenced by every post; `<` is escaped in the output

## Verification

- `bun run build`
- Preview: compare `/writing/<slug>/tile.png` with the hovered home tile; check `/opengraph-image` and `/writing/<slug>/opengraph-image`

## Child DOX Index

- None
