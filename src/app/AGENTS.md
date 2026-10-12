# src/app

## Purpose

- Next.js App Router tree: pages, route handlers, metadata files, page copy and the global stylesheet

## Ownership

- `layout.tsx`: html shell, fonts (Inter preloaded; Geist Mono with `preload: false`, used only by code and the footer link), default metadata (`metadataBase`, title template, Open Graph, Twitter), a `ViewTransition` that cross-fades only locale switches, `LocaleToggle`, Vercel `Analytics`
- `page.tsx`: home (header, bio, projects, writing list, Lab row, Ask AI, footer: dither strip, `index.md` link and signature); the `projects` list is local to it
- `not-found.tsx`: 404, title only
- `writing/[slug]/page.tsx`: post page (breadcrumb, header, cover, contents, article, author footer, share)
- `lab/page.tsx`: the Lab, one section per piece of the site's motion (seeded scenes, die, hint arrow, text reveal), each a live specimen with a timing sheet from `@/components/lab`, then its write-up
- `lab.md/route.ts`: the Lab as plain markdown; its piece list matches the page's
- `writing/[slug]/md/route.ts`: post as plain markdown, served at `/writing/<slug>.md`
- `writing/[slug]/opengraph-image.tsx`: post share card; `opengraph-image.tsx`: home share card
- `writing/[slug]/tile.png/route.tsx`: still first frame of the post's scene, the home tile under `LiveTile`
- `index.md/route.ts`: home as plain markdown, also served at `/llms.txt`
- `robots.ts`, `sitemap.ts`, `icon.png`, `apple-icon.png`
- `t.ts` (`t.app.meta`, `t.app.home`, `t.app.notFound`, `t.app.language`), `writing/t.ts` (`t.app.writing`), `lab/t.ts` (`t.app.lab`, written to `IDENTITY.md`)
- `globals.css`: Tailwind v4 entry, theme tokens, and every custom component style (prose, code box, flow diagram, scene blocks, text reveal, action swap, signature, dice hint, locale flag, lab sections)

## Local Contracts

- Server code calls `await setLocale()` before reading `t` or `translations` from `@/i18n/generated`; inside `"use cache"` functions pass the locale in and use `translations[locale]`
- `layout.tsx` and the post page export `instant = false`: rendering is per request, and the post page awaits `params` and the locale outside any Suspense boundary so the article ships visible in the HTML
- Each page sets its own `alternates` (canonical plus the `text/markdown` twin) because a child's `alternates` replaces the layout's; the 404 page sets none
- A page that sets `openGraph` spreads `openGraph` from `@/lib/site` back in and adds the locale's `ogLocale`
- Markdown twins return `markdownTwin` from `@/lib/site`: `text/plain; charset=utf-8` (some agent fetchers refuse `text/markdown`) with a `Link: rel="canonical"` header to the page; the sitemap lists pages only
- Post routes build `generateStaticParams` from `getPosts()`; share cards and twins are English, since crawlers send no locale cookie
- `dangerouslySetInnerHTML` only for repo-authored markdown (`renderMarkdown`) and `JsonLd`
- `globals.css` scans `src/` for classes but skips `components/ui/` and every `AGENTS.md`; each ui kit file the site uses needs its own `@source` line
- Custom CSS sits in `@layer components` under a comment naming the component it styles, and respects `prefers-reduced-motion`

## Work Guidance

- Layout, type, colour and motion follow `DESIGN.md`: one 576px column, Inter at 16px, hierarchy by weight and ink tier, no colour outside scene art
- Edit `globals.css` by hand; it is not Biome-formatted

## Verification

- `bun run lint`, `bun run build`
- Class scanning (`@source` lines): the dev server's CSS is not a reliable probe; list the files Tailwind scans with `Scanner` from `@tailwindcss/oxide`, fed the sources `compile` from `@tailwindcss/node` reads out of `globals.css`
- Preview server `dev`: `/`, `/writing/art-from-a-seed`, `/index.md`, `/llms.txt`, `/writing/art-from-a-seed.md`, `/writing/art-from-a-seed/tile.png`, `/opengraph-image`, `/lab`, `/lab.md`, plus a language switch with the toggle

## Child DOX Index

- None
