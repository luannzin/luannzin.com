# src/app

## Purpose

- Next.js App Router tree: pages, route handlers, metadata files, page copy and the global stylesheet

## Ownership

- `layout.tsx`: html shell, fonts (Inter preloaded; Geist Mono with `preload: false`, used only by code and the footer link), default metadata (`metadataBase`, title template, Open Graph, Twitter), a `ViewTransition` that cross-fades only locale switches, `LocaleToggle`, Vercel `Analytics`
- `page.tsx`: home (header, bio, projects, writing list (`PostRow`), Lab rows (`LabRows`: the motion, Bug hunt), Ask AI, footer: dither strip, `index.md` link and signature); the `projects` list is local to it: echo and better-intl open in a new tab, Seeded scenes is an internal row with its scene tile
- `projects/seeded-scenes/page.tsx`: Seeded scenes, the scene engine as a playground (breadcrumb Projects to `/#projects`): header, the Lab's `ScenesSpecimen` (seed field, die, timing sheet) first, the intro, then prose sections each with its piece and a write-up under it (a gallery of example seeds with the seed shown, `PlaceScene`, `DotScene`), then "The whole story" with a `PostRow` to "Art from a seed"; no code on the page. `seeds.ts` holds its seeds (`tile` is also the home row's tile), `tile.png/route.tsx` draws that tile, `projects/seeded-scenes.md/route.ts` is its twin
- `not-found.tsx`: 404, title only
- `writing/[slug]/page.tsx`: post page (breadcrumb, header, cover, contents, article, author footer, share)
- `lab/page.tsx`: the Lab's index: header, intro, one row per piece (`LabRows`, the home page's rows); `lab.md/route.ts` is its markdown twin
- `lab/motion/page.tsx`: the motion, frame by frame, one section per piece of the site's motion (seeded scenes, die, hint arrow, text reveal), each a live specimen with a timing sheet from `@/components/lab`, then its write-up; `lab/motion.md/route.ts` is its twin, its piece list matching the page's
- `lab/bug-hunt/page.tsx`: Bug hunt, the platformer: header, the game (`BugHunt`), how it's made; `lab/bug-hunt.md/route.ts` is its markdown twin
- `cv/page.tsx`: the CV: header with contact, Download PDF and Print, summary, a timeline of roles and study as a timing sheet (bars per role, playhead on today), then experience, projects, open source, skills, education and languages; `[data-screen]` parts stay on screen, `[data-paper]` parts only print
- `cv.md/route.ts`: the CV as plain markdown
- `writing/[slug]/md/route.ts`: post as plain markdown, served at `/writing/<slug>.md`
- `writing/[slug]/opengraph-image.tsx`: post share card; `opengraph-image.tsx`: home share card
- `writing/[slug]/tile.png/route.tsx`: still first frame of the post's scene (`sceneTile` from `@/lib/scene-tile`), the home tile under `LiveTile`
- `index.md/route.ts`: home as plain markdown, also served at `/llms.txt`
- `robots.ts`, `sitemap.ts`, `icon.png`, `apple-icon.png`
- `t.ts` (`t.app.meta`, `t.app.home`, `t.app.notFound`, `t.app.language`), `writing/t.ts` (`t.app.writing`), `lab/t.ts` (`t.app.lab`: the index's copy at its root, each piece's page copy under `t.app.lab.motion` and `t.app.lab.game`, the motion's pieces and timing sheet labels (`controls`, `tracks`, `seed`, `scenes`, `die`, `hint`, `reveal`) at the root, shared with posts; written to `IDENTITY.md`), `cv/t.ts` (`t.app.cv`, the CV's facts from April 2026 with the numbers left out), `projects/t.ts` (`t.app.projects.scenes`: Seeded scenes' page, home row and twin copy, its places taken from the post's table; written to `IDENTITY.md`)
- `globals.css`: Tailwind v4 entry, theme tokens, and every custom component style (prose, code box, flow diagram, scene blocks, text reveal, action swap, signature, dice hint, locale flag, lab sections, CV timeline bars, the CV's print styles)

## Local Contracts

- Server code calls `await setLocale()` before reading `t` or `translations` from `@/i18n/generated`; inside `"use cache"` functions pass the locale in and use `translations[locale]`
- `layout.tsx`, the post page and the CV export `instant = false`: rendering is per request, and the post page awaits `params` and the locale outside any Suspense boundary so the article ships visible in the HTML; the CV awaits `connection()` there before reading today's date for its timeline
- Each page sets its own `alternates` (canonical plus the `text/markdown` twin) because a child's `alternates` replaces the layout's; the 404 page sets none
- A page that sets `openGraph` spreads `openGraph` from `@/lib/site` back in and adds the locale's `ogLocale`
- Markdown twins return `markdownTwin` from `@/lib/site`: `text/plain; charset=utf-8` (some agent fetchers refuse `text/markdown`) with a `Link: rel="canonical"` header to the page; the sitemap lists pages only
- Post routes build `generateStaticParams` from `getPosts()`; share cards and twins are English, since crawlers send no locale cookie
- `dangerouslySetInnerHTML` only for repo-authored markdown (`renderMarkdown`) and `JsonLd`
- `globals.css` scans `src/` for classes but skips `components/ui/` and every `AGENTS.md`; each ui kit file the site uses needs its own `@source` line
- Custom CSS sits in `@layer components` under a comment naming the component it styles, and respects `prefers-reduced-motion`; the one exception is the CV's `@media print` block, unlayered so its paper tokens beat `.dark`
- The CV prints as its PDF: what the page shows on paper is set only by the print block in `globals.css`, scoped to `:root:has(.cv)`; keep section heads in flow (no positioned anchors) so a PDF's text layer keeps each heading above its section

## Work Guidance

- Layout, type, colour and motion follow `DESIGN.md`: one 576px column, Inter at 16px, hierarchy by weight and ink tier, no colour outside scene art
- Edit `globals.css` by hand; it is not Biome-formatted

## Verification

- `bun run lint`, `bun run build`
- Class scanning (`@source` lines): the dev server's CSS is not a reliable probe; list the files Tailwind scans with `Scanner` from `@tailwindcss/oxide`, fed the sources `compile` from `@tailwindcss/node` reads out of `globals.css`
- Preview server `dev`: `/`, `/writing/art-from-a-seed`, `/index.md`, `/llms.txt`, `/writing/art-from-a-seed.md`, `/writing/art-from-a-seed/tile.png`, `/opengraph-image`, `/projects/seeded-scenes` (type a seed, pick a place, change the dot size), `/projects/seeded-scenes.md`, `/projects/seeded-scenes/tile.png`, `/lab`, `/lab.md`, `/lab/motion`, `/lab/motion.md`, `/lab/bug-hunt` (play a level), `/lab/bug-hunt.md`, `/cv`, `/cv.md`, plus a language switch with the toggle
- Print styles and fresh `globals.css` edits: check on a production server (`bun run build`, `bunx next start -p 3001`), then `bun run cv:pdf http://localhost:3001` and read the PDFs

## Child DOX Index

- None
