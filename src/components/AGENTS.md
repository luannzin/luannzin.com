# src/components

## Purpose

- Site-specific React components; server components unless the file starts with `"use client"`

## Ownership

- `article-islands.tsx`: finds the `[data-island]` placeholders (`copy`, `scene`, `roll`) that `@/lib/markdown` leaves in the article and portals client components into them
- `scene-art.tsx`: canvas player for a seeded scene (`@/lib/scene` frames drawn by `@/lib/dots`)
- `cover-art.tsx`: post cover; the die draws a new scene through the `@/lib/melt` transition; remembers the first-roll hint in `localStorage` key `cover-dice-hint`
- `die.tsx`: line-art die projected by hand into SVG paths
- `live-tile.tsx`: lazy-loads `SceneArt` over the home tile's still PNG on hover or focus
- `share.tsx`: share menu (copy link, X, LinkedIn, system share) on `@/components/ui/menu`; exports `useCopy` and `announce`, reused by the article's copy buttons
- `locale-toggle.tsx`: fixed language switch; calls the `changeLocale` server action inside a transition typed `locale`
- `toc.tsx`: contents list with scroll-spy
- `ask-ai.tsx`: links that open ChatGPT, Claude, Perplexity and Grok with a prompt
- `icons.tsx`: every icon and brand mark the site draws
- `motion/text-reveal.tsx`, `motion/action-swap.tsx`: CSS-driven adaptations of beui.dev components; their keyframes live in `src/app/globals.css`
- `t.ts`: labels under `t.components` (`share`, `copy`, `scene`, `diagram`)
- `ui/`: vendored coss kit (child doc)

## Local Contracts

- Client components never read `t`; a server parent passes labels as props (typed `typeof t.components.<group>`) so a language switch re-renders them
- Icons are Central Icons `round-outlined-radius-2-stroke-1.5` on a 24 grid in `currentColor`, `aria-hidden`; brand marks are filled in `currentColor`; new icons go in `icons.tsx`
- Motion is CSS only (classes in `globals.css`, tokens `enter`, `press`, `bezel`, `underline` in `@/lib/classes`), no animation library, and honours reduced motion
- Scene code stays out of the home page's first load: `LiveTile` imports `SceneArt` lazily
- `ArticleIslands` must know every `data-island` kind `@/lib/markdown` emits; it remounts per locale (`key={locale}`) because a language switch replaces the article HTML

## Work Guidance

- UI follows `DESIGN.md` (components section names each piece)

## Verification

- `bun run lint`
- Preview a post: copy button, scene gallery, roller, die, contents, share menu, locale toggle; hover a home tile

## Child DOX Index

- `ui/AGENTS.md`: vendored coss UI kit
