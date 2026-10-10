# SEO Audit: luannzin.com

Audited 2026-10-10 · https://www.luannzin.com/ (apex 308-redirects to www) · Next.js 16.4 App Router on Vercel

## Executive summary

**SEO Health Score: 58 / 100**

**Business type:** personal brand / portfolio with an engineering blog (closest template: Publisher, very small). Two indexable pages: `/` and `/writing/art-from-a-seed`, plus text/plain agent twins (`/index.md`, `/llms.txt`, `/writing/art-from-a-seed.md`).

**Context that shapes every finding:** the site is two days old (first commit 2026-10-08) and has one post. Not ranking for "Luan Fabri" or "luannzin" yet is expected at this age, not a penalty. Nothing blocks indexing, so there are no Critical findings. The job now is to give search engines and AI systems every signal they need on the first crawl: discovery files, canonicals, entity markup and share metadata. Right now all four are missing.

The engineering is strong: fast TTFB, CLS 0, correct redirects, server-rendered HTML, good alt text, and an agent layer (llms.txt and Markdown twins) that's ahead of most sites. The gaps are all in metadata and signals, and about a day's work closes most of them.

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 60 | 22% | 13.2 |
| Content Quality | 68 | 23% | 15.6 |
| On-Page SEO | 52 | 20% | 10.4 |
| Schema / Structured Data | 10 | 10% | 1.0 |
| Performance (CWV, lab only) | 75 | 10% | 7.5 |
| AI Search Readiness | 62 | 10% | 6.2 |
| Images | 84 | 5% | 4.2 |
| **Total** | | | **58** |

AI Search Readiness blends the GEO score (57) at 70% with agent readiness at 30%. Agent readiness scored Lighthouse Agentic Browsing 3/3 and an agent UX heuristic of 100, but loses points for the missing robots.txt and sitemap.

### Top issues (all High; nothing is Critical)

1. **No robots.txt, no sitemap.xml, and the site isn't submitted to Search Console or Bing Webmaster Tools.** Both files return 404.
2. **No `metadataBase` and no canonical tags**, while four text/plain copies of the content return 200 with no canonical signal.
3. **No entity markup.** There's no Person, ProfilePage or BlogPosting JSON-LD and no `rel="me"`. Off-site profiles don't use the name "Luan Fabri".
4. **No Open Graph or Twitter metadata and no og:image**, even though the site has Share and Ask AI buttons. Shared links render as bare URLs.
5. **The post's entire content ships inside `<div hidden id="S:1">`.** It's blank without JavaScript, and the mobile lab LCP is about 4.1 s.

### Top quick wins (each 30 minutes or less)

1. Add `src/app/robots.ts` and `src/app/sitemap.ts`.
2. Add `metadataBase: new URL(site)` in `layout.tsx`, and `alternates.canonical` in `page.tsx` and the post's `generateMetadata`.
3. Make the home title "Luan Fabri · Front-end engineer".
4. Add a `Link: <html-url>; rel="canonical"` header on the Markdown routes in `next.config.ts` `headers()`.
5. Set your GitHub profile name to "Luan Fabri" with the website field filled in, and add `author` and `homepage` to the better-intl `package.json` on npm.

---

## Technical SEO: 60

Full detail: `findings/technical.md`

**What works**
- Redirects are 308 permanent: apex to www, http to https (2 hops, about 0.22 s, harmless).
- Trailing slashes are normalized.
- Pages are SSR/SSG, not an SPA, with no console errors.
- TTFB is 60–75 ms with a Vercel cache HIT, and static assets are immutable.
- The viewport meta is correct with no zoom lock.
- Unknown URLs return a real 404 with `noindex`.

| Severity | Finding | Fix |
|---|---|---|
| High | `/robots.txt` and `/sitemap.xml` are 404, and `sitemap_discovery.py` found nothing. | Add `src/app/robots.ts` (allow `*`, `Sitemap: ${site}/sitemap.xml`). Add `src/app/sitemap.ts` listing `site` and `/writing/<slug>` from `getPosts()`, with the post date as `lastModified`. Leave out `.md` twins, `/llms.txt`, priority and changefreq. |
| High | No `metadataBase` and no canonical tags. | Add `metadataBase: new URL(site)` in `layout.tsx`. Set `alternates.canonical` per page in `page.tsx` and the post's `generateMetadata`. Don't set it in the layout: a child's `alternates` replaces the parent's, and the 404 page would inherit it. Re-add `types` next to `canonical` on each page. |
| Medium | `/index.md`, `/llms.txt`, `/writing/<slug>.md` and the internal `/writing/<slug>/md` all return 200 with no `Link` or `X-Robots-Tag` header. | In `next.config.ts` `headers()`, send `Link: <https://www.luannzin.com/...>; rel="canonical"` on each. Use canonical, not noindex, so AI tools can still read the files. |
| Medium | Only HSTS is set (no `includeSubDomains`). | Add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` and `Permissions-Policy` in `headers()`. Add `includeSubDomains; preload` only if every subdomain is HTTPS-only. |
| Low | The favicon is hot-linked from `github.com/luannzin.png?size=64`, which 302-redirects. It's 64 px, not a multiple of 48, and `/favicon.ico` is 404. | Add a self-hosted `src/app/icon.png` (and `apple-icon.png`), then drop `icons` from the layout metadata. |
| Low | The 404 page emits two `<title>` tags. | Add `src/app/not-found.tsx` with its own `metadata`. |
| Low | `/writing` is 404 even though the breadcrumb says "Writing". | Redirect `/writing` to `/#writing` until there's an index page (about 5 posts). |

## Content Quality: 68 · On-Page SEO: 52

Full detail: `findings/content.md`, plus `findings/sxo.md` for search intent and personas

**What works**
- The post is clearly written by a person, from first-hand experience: Flesch about 80, grade level about 6.4, no filler, no AI-content markers. Scored alone, it rates 86.
- E-E-A-T is 59 overall: Experience 74, Expertise 62, Authoritativeness 40, Trust 62.

| Severity | Finding | Fix |
|---|---|---|
| High | The post title "Art from a seed · Luan Fabri" and its 43-character description ("Every post's picture, grown from one number") use none of the words people search with. "generative", "PRNG", "procedural" and "javascript" appear 0 times in the prose. | Keep the H1. Change the `<title>` to something like "Art from a seed: seeded generative art in TypeScript". Write a 140–155 character description naming mulberry32, Bayer dithering and WebGL. Name each technique once in the prose, and make 2–3 headings say what their section covers. |
| Medium | The homepage is thin at about 110 words. The title is the name only, and there's no contact route or location. | Add the title above. Add 3–5 true facts: what kinds of problems you solve, how long you've done this, location or timezone, and an email link. Keep `src/app/index.md/route.ts` in step. |
| Medium | There's one post, and better-intl and echo each get only a one-line card. | The better-intl post is the biggest SXO gap: searches for it favour guides and next-intl comparisons. See the content plan in `ACTION-PLAN.md`. |
| Low | The byline only appears in the footer. | Add "By Luan Fabri" to the date line in the post header. |
| Low | The bio has a comma splice: "front-end engineer at Loopscape, I build…". | Make it "…at Loopscape, where I build…" in both `page.tsx` and `index.md/route.ts`. |
| Low | The post doesn't open with a quotable one-line summary. | Open with 2–3 self-contained sentences that state the technique. That also helps AI citation. |

SXO gap scores (kept out of the health score): home 45/100, post 53/100. Weakest persona: someone evaluating better-intl or echo (41). Strongest: an engineer peer (69). There's no page-type mismatch for the name, handle or post searches. Bare "mulberry32" can't be won because search reads it as the fruit; aim for "mulberry32 PRNG javascript".

## Schema / Structured Data: 10

Full detail and ready-to-paste code: `findings/schema.md`

There's no JSON-LD, Microdata or RDFa on either page.

| Severity | Finding | Fix |
|---|---|---|
| High | The homepage has no Person, ProfilePage or WebSite markup. | Use one `@graph`: a `WebSite`, plus a `ProfilePage` whose `mainEntity` is a Person with `@id` `${site}/#person`, `name`, `alternateName` "luannzin", `jobTitle`, `worksFor` Loopscape, `image`, and `sameAs` for GitHub, X and LinkedIn. |
| High | The post has no BlogPosting. | Add a `BlogPosting` with `headline`, `datePublished` 2026-10-08, `author` set to `{ "@id": "${site}/#person" }`, `image` (once the OG image exists), and `mainEntityOfPage`. |
| Medium | The visible breadcrumb has no markup. | Add a two-item `BreadcrumbList`. |
| Info | Not recommended: HowTo (deprecated), FAQPage (Google retired FAQ rich results on 2026-05-07), `SearchAction`. | Expect no visible SERP feature from Person or WebSite on a personal site. The value is entity disambiguation for Google and AI systems. |

Embed the markup with a small `<JsonLd>` server component that renders `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")`. The Person object lives in one shared module so both pages use the same `@id`.

## Performance: 75 (lab data only)

Full detail: `findings/performance.md`

PageSpeed Insights returned 429 without a key, so there's no CrUX field data. These are local Lighthouse 13.5.0 runs: 3 mobile and 1 desktop per page. INP wasn't measured; TBT stands in as a proxy.

| Page | Mobile perf | LCP | CLS | TBT | Desktop |
|---|---|---|---|---|---|
| `/` | 84–85 | 2.56–2.73 s | 0 | 465–514 ms | 100 |
| `/writing/art-from-a-seed` | 62–69 | 4.09–4.15 s | 0 | 668–1248 ms | 90 |

| Severity | Finding | Fix |
|---|---|---|
| High | The whole post `<main>` ships inside `<div hidden id="S:1">`, which is revealed only when the `$RC` script runs (about 83 KB into the HTML). FCP is 0.52 s on the post versus 0.22 s on home, and with JS off the page is blank. I confirmed this with `curl`. The cause is `page.tsx` wrapping `<Post>` in a `<Suspense>` with no fallback, while `generateStaticParams` already covers every slug. | Read the Next 16 docs first (`node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md`), then await `params` outside the boundary or drop it, with `dynamicParams = false`. Confirm with `curl -s <post-url> \| grep 'hidden id="S:'`, which should print nothing. |
| Medium | TBT and INP risk. The home bundle pulls in `scene.ts` (about 104 KB source), the WebGL painter and the full `motion/react`. The post hydrates 8 WebGL canvases. | Use a static thumbnail for the home writing list, lazy-init canvases below the fold, and switch to `LazyMotion` with `m` components. |
| Medium | `TextReveal` writes `opacity:0;filter:blur(6px)` inline into the SSR HTML, so the H1 and tagline need JS to appear. The `enter` class (`src/lib/classes.ts`) runs a non-composited blur animation with 400–800 ms delays (12 on home, 15 on the post). | Render the text visible and put the start state in CSS behind `@media (prefers-reduced-motion: no-preference)`. Drop the blur, and cap delays on content above the fold. |
| Medium | On home, the LCP element is the avatar `<img>`. It's remote (github.com), fades in, and has no `fetchPriority`. | Self-host the avatar in `src/assets` and keep `preload`. |
| Low | The remote favicon, the Geist Mono preload, 36 KB of render-blocking CSS and 14 KB of legacy polyfills. | Covered by the favicon fix. Check the `browserslist` target. |

## AI Search Readiness: 62

Full detail: `findings/geo.md` and `findings/agentic.md`

**What works**
- Every AI crawler tested got a 200 with the full HTML: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot and CCBot.
- `llms.txt` follows the proposed format, and the `.md` twins and `rel="alternate"` links work.
- Lighthouse Agentic Browsing is 3/3 and the agent UX heuristic is 100.
- Your choice to serve the Markdown as text/plain is right; keep it.

| Severity | Finding | Fix |
|---|---|---|
| High | Nothing on the web ties "Luan Fabri" to "luannzin". Your GitHub name is "luan" with an empty blog field, better-intl on npm has no author or homepage, useecho.dev never names you, and Wikidata has nothing. | Update GitHub (name "Luan Fabri", website set to the site), LinkedIn and X to point at `https://www.luannzin.com`. Add `author` and `homepage` to better-intl's `package.json`. Add a "by Luan Fabri" footer link on useecho.dev. Add `rel="me"` to the profile links on the home page. |
| Medium | Platform scores: Google AI Overviews 38, ChatGPT 52, Perplexity 55, Bing Copilot 40, Claude 50. Bing's index feeds ChatGPT Search and Copilot. | Submit the sitemap to Bing Webmaster Tools as well as Google Search Console. |
| Medium | The site has no Reddit, Hacker News or YouTube footprint. | Share the post where generative-art people gather: r/generative, HN, dev.to. Optionally make a short demo video. |
| Low | The `llms.txt` summary line is too thin to identify you. | Expand the `>` line: "Luan Fabri (luannzin), front-end engineer at Loopscape in Brazil, author of echo and better-intl." Confirm the facts first. |
| Skip | WebMCP, ai-catalog.json, `/.well-known` discovery files, `Accept: text/markdown` negotiation, Content-Signal. | No confirmed consumer, or nothing to describe on a 2-page site. |

## Images: 84

Full detail: `findings/visual.md`.

**What works**
- Alt text is right: the avatar and echo logo use `alt=""` next to visible names, and the canvas hero has `role=img` with an `aria-label`.
- There's no horizontal overflow at 375 px.
- The home page fits above the fold.
- CLS is 0.

| Severity | Finding | Fix |
|---|---|---|
| High | No og:image or twitter:image anywhere. The post cover is runtime canvas art, so there's no raster to share. | Add `src/app/writing/[slug]/opengraph-image.tsx` (an `ImageResponse` title card) and a site-wide `src/app/opengraph-image.tsx`. Use the same URL as the BlogPosting `image`. Run `next build` to confirm it works with `cacheComponents`. |
| Low | The echo logo is lazy-loaded even though it's in the first viewport. `home-tile.png` is an unoptimised 32 KB PNG. | Mark the logo as priority, or leave it, since it's small. |
| Low | Tap targets: the X link is 11×20 px and inline links are 20 px tall. A 9 px "TS" badge sits on code blocks. Code blocks scroll sideways without `tabindex`. | Everything passes WCAG 2.2 AA's 24 px target minimum, so this is polish only. Add `tabindex="0"` to scrollable `<pre>` elements. |

---

## Not covered

- **Field data and Search Console:** no Google API credentials (no CrUX, Search Console or GA4).
- **Matomo:** no credentials.
- **Backlinks:** no Moz or Bing API keys. A two-day-old domain has essentially no link profile yet.
- **Topic clustering:** only one post.
- **Drift:** no baseline exists. Capture one after Phase 1 ships (`/seo drift baseline https://www.luannzin.com/`).
