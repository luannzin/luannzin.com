# src/lib

## Purpose

- Shared logic for routes and components: the scene engine, markdown rendering, posts, share images, structured data and constants

## Ownership

- `scene.ts`: seeded scene engine; one seed picks place, time of day, landmark and every shape, and each frame is a colour plus dot size per cell, ordered-dithered; exports `seedFrom`, `createScene`, `renderer`, `viewOf`, `START`, `RADIUS`; pure, runs on server and client
- `die.ts`: the die's geometry (`drawDie`), throws (`throwTo`, `angleAt`) and hop keyframes; pure, shared by `Die` and the Lab
- `dots.ts`: draws a frame on a canvas (WebGL, 2D fallback); client only
- `melt.ts`: WebGL melt between two scenes for the cover die (a plain crossfade under reduced motion); `meltLayer` holds one at a given point for the Lab; client only
- `markdown.ts`: `renderMarkdown(source, locale)` returns `{ html, toc }`; `plainMarkdown(source)` feeds the markdown twins
- `writing.ts`: reads `src/content/writing`, parses frontmatter, falls back to English for a missing translation; `getPosts`, `getPost`, `formatDate`; reading time at 220 words a minute
- `og.tsx`: share images through `next/og` (`homeImage`, `postImage`); reads the Inter TTFs and `public/avatar.jpg`
- `json-ld.tsx`: schema.org graph (`home`, `article(post, locale)`) and `JsonLd`
- `site.ts`: `site` origin (the www host), `profiles`, shared `openGraph`, `markdownTwin` (the markdown twins' response)
- `locale.ts`: `changeLocale` server action
- `classes.ts`: shared class tokens `enter`, `bezel`, `press`, `underline` (named in `DESIGN.md`)
- `utils.ts` (`cn` re-export), `segmented-control.ts` (ui kit only)

## Local Contracts

- Scenes are deterministic: a seed gives the same scene and frames on server and client; `tile.png` draws frame `START` and the live tile starts there, so they must match; changing `scene.ts` output repaints every post
- `markdown.ts` output is trusted HTML (posts are repo files) but every interpolated string still goes through `escapeHtml`
- `markdown.ts` owns the fence contract with `src/content` (`flow`, `scenes`, `roll`, code meta, lone images); a new fence needs its HTML block, its `plainMarkdown` text form and, if it mounts client code, an island kind in `@/components/article-islands`
- `renderMarkdown` runs inside `"use cache"`: it takes the locale and never reads request state
- `writing.ts` frontmatter is flat `key: value` only; posts missing `title` or `date` throw at build
- Share images look like the page at 2.5x: ground `#161616`, Inter 400/500, three ink tiers, no colour and no scene art (user decision); every element with children is flex for Satori; file paths stay literal so the build traces them
- JSON-LD: one Person `@id` on the home graph, referenced by every post; `<` is escaped in the output

## Verification

- `bun run build`
- Preview: compare `/writing/<slug>/tile.png` with the hovered home tile; check `/opengraph-image` and `/writing/<slug>/opengraph-image`

## Child DOX Index

- None
