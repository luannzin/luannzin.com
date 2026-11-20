# src/components

## Purpose

- Site-specific React components; server components unless the file starts with `"use client"`

## Ownership

- `article-islands.tsx`: finds the `[data-island]` placeholders (`copy`, `scene`, `roll`, `lab`) that `@/lib/markdown` leaves in the article and portals client components into them; a `lab` placeholder lazy-loads `Piece` from `lab/specimens.tsx`, so posts without one never load the Lab
- `scene-art.tsx`: canvas player for a seeded scene (`@/lib/scene` frames drawn by `@/lib/dots`); `cell` pins the cell size in CSS pixels (Seeded scenes' dot size)
- `scene-playground.tsx`: Seeded scenes' pieces, each a live scene in a specimen's Well: `PlaceScene` (a place picked as radio chips finds a seed that lands there, with what the place allows) and `DotScene` (one scene at a chosen dot size)
- `post-row.tsx`: `PostRow`, a post as a row (scene tile with the morph to the post's figure, title, description); home's Writing list and Seeded scenes
- `cover-art.tsx`: post cover (with `DiceHint`); the die draws a new scene through the `@/lib/melt` transition; remembers the first-roll hint in `localStorage` key `cover-dice-hint`
- `die.tsx`: line-art die, geometry and throws from `@/lib/die`
- `live-tile.tsx`: lazy-loads `SceneArt` over the home tile's still PNG on hover or focus
- `share.tsx`: share menu (copy link, X, LinkedIn, system share) on `@/components/ui/menu`; exports `useCopy` and `announce`, reused by the article's copy buttons
- `dock.tsx`: `Dock`, the fixed theme and language control: the theme's orb with the language as a flag moon, and a menu of both that unfolds around the orb; a theme pick runs the circle reveal (a View Transition from the picked orb) and sets the theme through next-themes' `useTheme`; a language pick calls the `changeLocale` server action inside a transition typed `locale`
- `orb.tsx`: `Orb`, a theme drawn as a turning halftone sphere on a 2D canvas, one shared clock for every live orb (15fps at rest, 30 awake)
- `toc.tsx`: contents list with scroll-spy
- `page-nav.tsx`: `Breadcrumb` and `Contents` (margin rail at xl, disclosure below), shared by the post page and the Lab
- `author-footer.tsx`: closing rule and author link, with Share passed in; post page, Lab and CV
- `footer-art.tsx`: home footer art: `DitherStrip` (canvas of four Bayer-dithered dusk blocks whose dots the pointer pushes aside) and `Signature` (hand-drawn "Luan", drawn by `.signature` in `globals.css` once in view)
- `dice-hint.tsx`: the hand-drawn arrow to a cover's die, drawn by `.dice-hint` in `globals.css`
- `print-button.tsx`: the CV's Print button (`window.print()`)
- `lab/timeline.tsx`: `useTimeline` (a piece's clock), `useSeekCss`, `bezier`, `Specimen` (transport plus timing sheet), `Segmented` (the speeds, and Seeded scenes' dot sizes), and `well`, the specimen frame Seeded scenes' pieces share
- `lab/rows.tsx`: `LabRows`, the Lab's pieces as rows, on the home page and the Lab's index
- `lab/specimens.tsx`: the Lab's pieces, each driving the real component or library code at the sheet's time; `Piece` picks one by name for a post's `lab` fence
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
- Preview a post: copy button, scene gallery, roller, die, contents, share menu; hover a home tile
- Dock: open by click (a hover only wakes the orb: faster spin, light toward the cursor, brighter ring; it must not open it), by keyboard (ArrowUp on the orb, arrows, Escape) and by touch on a phone viewport; switch every theme and both languages; reduced motion swaps at once
- Seeded scenes: type a seed (it melts on the sheet), pick each place and "Another scene", every dot size

## Child DOX Index

- `ui/AGENTS.md`: vendored coss UI kit
