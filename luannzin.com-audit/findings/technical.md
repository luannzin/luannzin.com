# Technical SEO Findings: https://www.luannzin.com/

Audit date: 2026-10-10. Stack: Next.js 16.4 App Router, `cacheComponents`, `partialPrefetching`, Vercel (gru1). Method: raw fetch + Playwright render (`render_page.py`), `sitemap_discovery.py`, curl header/redirect probes, source read (`src/app/*`, `next.config.ts`, `src/lib/site.ts`), and the bundled Next docs in `node_modules/next/dist/docs`.

## Technical score: 60 / 100

| Category | Status | Sub-score |
|---|---|---|
| Crawlability (robots, sitemap, noindex) | FAIL | 40 |
| Indexability (canonical, duplicates, metadata) | FAIL | 55 |
| Security (HTTPS, headers) | PARTIAL | 45 |
| URL structure and redirects | PASS (minor) | 85 |
| Mobile | PASS | 95 |
| Core Web Vitals (source inspection) | PASS (watch) | 80 |
| Structured data | FAIL (none) | 20 |
| JavaScript rendering | PARTIAL | 75 |
| IndexNow | NOT IMPLEMENTED (optional) | n/a, scored 0 |

Weights: crawl 15, index 15, security 10, URL 10, mobile 10, CWV 15, JS 10, schema 10, IndexNow 5. The two highest-leverage fixes (robots.ts + sitemap.ts, then metadataBase + canonicals) are about 30 lines of code and move the score to roughly 80. Adding the headers block, OG metadata, JSON-LD and the favicon fix gets it to roughly 90.

## Prioritized issues

### High

**H1. No robots.txt (404) and no sitemap (404). Sitemap discovery: FAIL.**
- Evidence: `sitemap_discovery.py --json` returned `declared: []`, `found: []`; `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, `/wp-sitemap.xml` all HTTP 404; warning "robots.txt returned HTTP 404". `/robots.txt` returns the HTML 404 page (`X-Matched-Path: /404`). No `src/app/robots.ts` or `sitemap.ts`.
- Impact: Google treats a 404 robots.txt as "allow all", so nothing is blocked, but there is no sitemap hint. On a brand-new, 2-URL site with one post dated 2026-10-08 and no inbound links, a sitemap is the main discovery signal beyond the home-page link.
- Fix: see the Sitemap section below (`src/app/robots.ts`, `src/app/sitemap.ts`).

**H2. No canonical tags and no `metadataBase`.**
- Evidence: zero `rel="canonical"` in `/` and `/writing/art-from-a-seed` HTML; `src/app/layout.tsx` has no `metadataBase`; post `generateMetadata` only sets `alternates.types`. The same HTML is reachable by any query string (`/?utm_x=1`), and the apex host redirects (good) but `http://` and trailing-slash variants rely purely on redirects.
- Impact: Google picks the canonical itself. Tracking-parameter URLs and the text/plain twins (see M1) are not consolidated explicitly.
- Fix:
  - `src/app/layout.tsx`: add `metadataBase: new URL(site)` (import `site` from `@/lib/site`; its value is `https://www.luannzin.com`).
  - Home: export `metadata = { alternates: { canonical: "/", types: { "text/markdown": `${site}/index.md` } } }` from `src/app/page.tsx`.
  - Post: in `generateMetadata` (`src/app/writing/[slug]/page.tsx`) set `alternates: { canonical: `/writing/${post.slug}`, types: {...existing} }`.
  - Do NOT put `canonical: "/"` in the layout. Metadata `alternates` is replaced (shallow) by a child's `alternates`, and the 404 page inherits layout metadata, so a layout canonical would leak onto the 404 (a noindex page pointing at `/`).
  - Docs checked: `generate-metadata.md` says a relative URL field without `metadataBase` is a build error, and `metadataBase` should be a string if `generateMetadata` uses `'use cache'`.

### Medium

**M1. Duplicate-content exposure from the text/plain markdown twins (3 files plus one alias).**
- Evidence: `/index.md`, `/llms.txt` (rewrite, identical ETag `7c100b6b...`), `/writing/art-from-a-seed.md` all 200 `text/plain; charset=utf-8`, `Cache-Control: public, max-age=0, must-revalidate`, no `Link` canonical header, no `X-Robots-Tag`. The post twin repeats the full article (about 2,200 words) and the index twin repeats the bio. Also, the internal rewrite target `/writing/art-from-a-seed/md` is directly reachable (200, same ETag `b5175abe...`), a third URL for the same file.
- Impact: Google can index text/plain. A near-verbatim copy of the article at a different URL can split signals or occasionally outrank the page for exact-match queries. The HTML to markdown `rel="alternate"` link is already correct and should stay.
- Recommended fix (canonical Link header, not noindex). Rationale: the twins exist for agents; `X-Robots-Tag: noindex` is honored by search engines and some AI-search products, which could remove the very files you want read. Google also advises against mixing noindex with canonical. Use the canonical header, and add `noindex` only if the twins show up in Search Console.

  ```ts
  // next.config.ts  (matched parameters are valid in header values per the headers docs)
  async headers() {
    const canonical = (url: string) => [
      { key: "Link", value: `<${url}>; rel="canonical"` },
    ];
    return [
      { source: "/index.md", headers: canonical("https://www.luannzin.com/") },
      { source: "/llms.txt", headers: canonical("https://www.luannzin.com/") },
      { source: "/writing/:slug.md", headers: canonical("https://www.luannzin.com/writing/:slug") },
    ];
  },
  ```
  If `:slug.md` does not match in your path-to-regexp version, use the same escaped form the rewrite already uses: `/writing/:slug\\.md`. Verify with `curl -sI https://www.luannzin.com/writing/art-from-a-seed.md`. Keep `site` in one place by importing it into `next.config.ts` if the TS path alias resolves there; otherwise inline the origin.
- Alias cleanup (Low): add to `redirects()` `{ source: "/writing/:slug/md", destination: "/writing/:slug.md", permanent: true }`. Redirects are evaluated on the incoming URL only, so the rewrite's internal destination does not loop. Test after deploy.

**M2. Post body is served inside `<div hidden id="S:1">` and revealed by `$RC("B:1","S:1")`.**
- Evidence: in `post.html` the first `<!--$?--><template id="B:1">` fallback is empty and the whole `<main>` (about 2,216 words) sits at byte 2216 inside `<div hidden id="S:1">`; an inline script moves it into place. The home page does not have this (its `<main>` is inline).
- Cause: `src/app/writing/[slug]/page.tsx` awaits `params` inside `<Suspense>`, which is the documented pattern when `partialPrefetching` is on.
- Impact: Googlebot and Bing run the inline script, so indexing is fine. Anything that does not execute JS but honors `hidden` (Mozilla Readability/Reader mode, some LLM-crawler extractors) can see an empty body. The `.md` twin is the safety net.
- Fix options: (a) await `params` outside `<Suspense>` in `Page` (the docs say this keeps the listed slug fully inline and preserves ISR for unlisted paths without Partial Prefetching); then check `curl -s .../writing/art-from-a-seed | grep -c 'hidden id="S:'` returns 0. Trade-off: you lose the instant App Shell for unlisted slugs, which do not exist on this site anyway. (b) Accept and monitor. Re-test prefetch/navigation behavior if you choose (a).

**M3. No Open Graph or Twitter Card metadata.**
- Evidence: no `og:*`, `twitter:*` tags in any page. The site has a Share component and "Summarize with" AI links, so links get unfurled constantly.
- Fix: in `layout.tsx` add `openGraph: { type: "website", siteName: "Luan Fabri", locale: "en_US" }, twitter: { card: "summary_large_image" }`. In the post `generateMetadata` add `openGraph: { type: "article", publishedTime: post.date, authors: ["Luan Fabri"] }`. Add `src/app/opengraph-image.tsx` and `src/app/writing/[slug]/opengraph-image.tsx` (Next file convention; the generated scene art is a natural fit). `og:url` and image URLs resolve via the `metadataBase` from H2.

**M4. No structured data.**
- Evidence: 0 JSON-LD blocks on all pages (`render_page.py` `structured_data.block_count: 0`). Details are in `schema.md`; summary only: add `Person` + `WebSite` on `/` and `BlogPosting` (`datePublished: 2026-10-08`) on the post, rendered as `<script type="application/ld+json">` with `<` escaped to `<`.

**M5. Security headers: HSTS only.**
- Evidence: the only security-relevant header on every response is `Strict-Transport-Security: max-age=63072000` (2 years, valid). Missing: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` / `frame-ancestors` (clickjacking), HSTS `includeSubDomains; preload`.
- Impact: none for rankings; real but modest hardening gap. `nosniff` matters more than usual here because the `.md` twins are served as text/plain.
- Fix (`next.config.ts`):

  ```ts
  { source: "/:path*", headers: [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ]}
  ```
  Only add `includeSubDomains; preload` if every subdomain of luannzin.com is HTTPS-only (preload is hard to undo). A CSP is optional: Next inlines scripts, and statically prerendered pages cannot carry per-request nonces, so a useful CSP would need `script-src 'self' 'unsafe-inline'`. Skip unless desired.

### Low

**L1. Favicon is a third-party URL: `https://github.com/luannzin.png?size=64`.**
- Evidence: `<link rel="icon" href="https://github.com/luannzin.png?size=64">`; that URL answers 302 to `avatars.githubusercontent.com/u/107646613?s=64&v=4` (JPEG, 2,170 bytes, `Cache-Control: max-age=300`). `/favicon.ico` on the site is 404 (HTML). GitHub's robots.txt does not appear to block the path, but you depend on GitHub's redirect, cache lifetime and uptime. Google's favicon guidance asks for a stable URL, square, and a multiple of 48px; 64px is not a multiple.
- Fix: put a self-hosted file at `src/app/icon.png` (192x192 or 96x96) and optionally `src/app/favicon.ico` and `src/app/apple-icon.png` (Next file conventions generate the `<link>` tags). Remove `icons: { icon: ... }` from `layout.tsx` metadata.

**L2. `/writing` is a 404 although `/writing/art-from-a-seed` implies it.**
- Evidence: `/writing` returns 404 (HTML); the breadcrumb "Writing" link goes to `/#writing`. Fine for crawling (the post is linked from `/`), but the URL hierarchy has a hole and humans or crawlers that trim the path get a 404.
- Fix: `redirects()` entry `{ source: "/writing", destination: "/#writing", permanent: true }` now; a real `/writing` index page once there are 3 or more posts (and then add it to the sitemap).

**L3. 404 page has two `<title>` tags and inherited metadata.**
- Evidence: `/nope` is a correct HTTP 404 with `<meta name="robots" content="noindex">`, but the head has `<title>404: This page could not be found.</title>` followed by `<title>Luan Fabri</title>`, plus the layout description and the `index.md` alternate link (no custom `not-found.tsx` exists).
- Fix: add `src/app/not-found.tsx` that exports `metadata = { title: "Page not found" }` and renders a short message with a link home. Verify the head has one title and still returns 404 with noindex.

**L4. `http://luannzin.com` takes two redirects.**
- Evidence: `http://luannzin.com/` 308 to `https://luannzin.com/` 308 to `https://www.luannzin.com/` (0.22s total). `http://www.luannzin.com/` is one hop; `https://luannzin.com/*` is one hop with path preserved (verified on `/writing/art-from-a-seed`). All are 308 permanent.
- Impact: negligible for crawlers (Google follows many hops) and browsers with HSTS. Vercel performs the HTTPS upgrade before the www redirect, so it is not configurable on the project; submitting the hstspreload entry (needs M5 `includeSubDomains; preload`) removes it for Chrome users. Info-level in practice.

**L5. Home `<title>` is just "Luan Fabri" (10 chars).**
- Fix: `title: { default: "Luan Fabri - Front-end engineer", template: "%s · Luan Fabri" }` in `layout.tsx`. The home description (143 chars) is fine. Post description "Every post's picture, grown from one number" (43 chars) is short but acceptable; extend it to about 120 to 155 chars if you want a better snippet.

**L6. JS payload is larger than a mostly static page needs.**
- Evidence: compressed JS transfer (br/gzip as served): home 8 files, about 265 KB; post 9 files, about 328 KB; CSS 2 files, about 37 KB total. Static assets are `immutable, max-age=31536000` (good). HTML TTFB is about 60 to 75 ms from Vercel edge (HIT) with 11 KB (home) and 22 KB (post) over the wire.
- Fix (optional): `TextReveal` pulls the full `motion/react` bundle. Switching to `LazyMotion` + `m.span` with `domAnimation`, or replacing it with the CSS `enter` utility the page already uses, cuts JS and fixes L7. Check with `@next/bundle-analyzer` first.

**L7. Headings and tagline start at inline `opacity:0` and only animate in after hydration.**
- Evidence: `TextReveal` (`src/components/motion/text-reveal.tsx`) is a client component whose SSR output is `<span style="opacity:0;filter:blur(6px);transform:translateY(20%)">` per word (4 spans in the home `<h1>`/tagline, plus one per word in the post `<h1>`). Text is present in the DOM, so indexing and `extracted_text` ("Luan Fabri / Front-end engineer at Loopscape ...") are correct. But: (1) with JS blocked or hydration delayed, the `<h1>` stays invisible; (2) Chrome ignores opacity-0 content for LCP, so the hero text paints late; the About paragraph (CSS-driven, fades in at `delay-400`) may become the LCP element instead. Not a ranking problem at current sizes; fine under the 2.5 s LCP threshold on a fast connection, but unmeasured on slow mobile.
- Fix: render the initial state with CSS only (no inline `opacity:0` in the SSR HTML), e.g. a keyframe animation per word via `animation-delay`, in a server component. That also removes one "use client" boundary. Keep `motion-safe:` so reduced-motion users see text immediately. Measure with PageSpeed Insights / CrUX once there is field data.

### Info (verified OK)

- **HTTPS and redirects:** HTTPS enforced everywhere, 308 permanent, host canonicalized to `www`. `/writing/art-from-a-seed/` 308 to the no-slash URL (trailing slash normalized). `/writing/nonexistent.md` returns a clean 404 text/plain.
- **Indexability controls:** no `noindex` on real pages (only on the 404). `<html lang="en">`, `<meta charSet>` present. Single `<h1>` on home and post; heading order logical (post: 1 h1, 9 h2, 3 h3). 
- **Mobile:** `<meta name="viewport" content="width=device-width, initial-scale=1">` (no `maximum-scale`/`user-scalable=no`), responsive max-w-xl layout, reduced-motion handled (`prefers-reduced-motion` in `globals.css`), `color-scheme: dark`. Optional: add `viewport.themeColor`.
- **CLS:** images carry width/height, canvas uses `aspectRatio`, fonts via `next/font` (self-hosted, preloaded via `Link` header, `size-adjust`), Suspense fallback is empty (content swaps in the same position). Watch the `ArticleIslands` copy-button mounts in field data.
- **INP:** `requestAnimationFrame` loops exist in `scene-art.tsx` (canvas animation); no heavy input handlers seen. Keep an eye on pointer-move cost on low-end phones.
- **Compression and caching:** Brotli/gzip on, `X-Vercel-Cache: HIT`, HTML `max-age=0, must-revalidate` (revalidated at the CDN edge, ETag on text routes).
- **Rendering model:** SSR/SSG, not an SPA (`is_spa: false`); no console errors in the Playwright render (`console_errors: []`). The home page is fully usable without JS except the `TextReveal` words (L7).
- **AI/agent access:** nothing in robots.txt restricts GPTBot, ClaudeBot, PerplexityBot, etc.; the recommended robots.ts keeps them allowed, matching the `.md` twin strategy. Training opt-outs (Google-Extended, Applebot-Extended, CCBot) are an owner decision.
- **hreflang:** single-language site; not applicable.
- **IndexNow:** not implemented (no key file at root). Optional for 2 URLs; submit via Bing Webmaster Tools (import the sitemap) instead. Add IndexNow only if Bing/Yandex/Naver traffic matters.

## Sitemap and robots section

### Current state
No sitemap, no robots.txt (both 404). No `Sitemap:` declaration anywhere. The `sitemap_discovery.py` helper validated nothing.

### Scope: which URLs go in

| URL | In sitemap? | Why |
|---|---|---|
| `https://www.luannzin.com/` | Yes | Canonical home |
| `https://www.luannzin.com/writing/art-from-a-seed` | Yes | Only article; `lastModified` = frontmatter date 2026-10-08 |
| `/index.md`, `/llms.txt`, `/writing/*.md`, `/writing/*/md` | No | text/plain agent twins; listing them invites indexing of duplicates (M1) |
| `/writing` | No | 404 today; add only when a real index page exists |
| 404 and `/_next/*`, `/_vercel/*` | No | Not content (do not block `/_next/` in robots; Google needs the CSS/JS to render) |

Rules: absolute `www` URLs only (use the existing `site` constant), HTTPS, no redirecting URLs, no trailing slash, no `changeFrequency`/`priority` (Google ignores both), and real `lastModified` values (a `new Date()` on every build trains Google to ignore lastmod).

### `src/app/sitemap.ts` (new file)

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPosts } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts(); // sorted newest first, reads src/content/writing at build time
  return [
    { url: site, lastModified: posts[0]?.date },
    ...posts.map((p) => ({ url: `${site}/writing/${p.slug}`, lastModified: p.date })),
  ];
}
```

`lastModified` accepts a `YYYY-MM-DD` string. When a post is later edited, add an `updated:` frontmatter key and prefer it. The route is a static Route Handler (cached by default per the sitemap docs) and `getPosts()` already uses `node:fs` the same way `app/index.md/route.ts` does, so it works with `cacheComponents`.

### `src/app/robots.ts` (new file)

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site}/sitemap.xml`,
  };
}
```

Output will be `User-Agent: *`, `Allow: /`, `Sitemap: https://www.luannzin.com/sitemap.xml`. Do not add a `Host:` line. Do not `Disallow` the `.md` twins (agents are meant to fetch them; use the canonical Link header instead).

### After deploy
1. `curl -s https://www.luannzin.com/robots.txt` and `/sitemap.xml` return 200 with the right content types (`text/plain`, `application/xml`).
2. Re-run `sitemap_discovery.py https://www.luannzin.com/ --json` and expect `found` to list the sitemap as `valid: true` and `declared` to list the robots entry.
3. Submit `https://www.luannzin.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools (verify the `www` property, not only the apex).

## Fix checklist in repo order

1. `src/app/robots.ts`, `src/app/sitemap.ts` (new) - H1
2. `src/app/layout.tsx` - `metadataBase`, OG/Twitter defaults, longer home title, drop external `icons` (H2, M3, L1, L5)
3. `src/app/page.tsx` - export `metadata` with `alternates.canonical: "/"` (H2)
4. `src/app/writing/[slug]/page.tsx` - canonical + OG article metadata in `generateMetadata`; evaluate moving `await params` out of Suspense (H2, M2, M3)
5. `next.config.ts` - `headers()` (canonical Link on twins, security headers) and `redirects()` (`/writing`, `/writing/:slug/md`) (M1, M5, L2)
6. `src/app/icon.png` (+ optional `favicon.ico`, `apple-icon.png`), `src/app/not-found.tsx`, `opengraph-image.tsx` (L1, L3, M3)
7. JSON-LD per `schema.md` (M4)
8. `src/components/motion/text-reveal.tsx` - CSS-first reveal (L6, L7)

## Machine-readable findings (for audit-data.json, category "Technical SEO")

```json
{
  "category": "Technical SEO",
  "score": 60,
  "subscores": {
    "crawlability": 40, "indexability": 55, "security": 45, "url_structure": 85,
    "mobile": 95, "core_web_vitals": 80, "structured_data": 20,
    "javascript_rendering": 75, "indexnow": 0
  },
  "findings": [
    {"id":"H1","severity":"High","title":"robots.txt and sitemap.xml both 404","evidence":"sitemap_discovery: declared=[], found=[]; /robots.txt, /sitemap.xml HTTP 404","fix":"Add src/app/robots.ts and src/app/sitemap.ts"},
    {"id":"H2","severity":"High","title":"No canonical tags, no metadataBase","evidence":"0 rel=canonical on / and /writing/art-from-a-seed","fix":"metadataBase in layout.tsx; alternates.canonical in page.tsx and post generateMetadata (not in layout)"},
    {"id":"M1","severity":"Medium","title":"text/plain markdown twins have no canonical signal","evidence":"/index.md, /llms.txt, /writing/art-from-a-seed.md, /writing/art-from-a-seed/md all 200 with no Link or X-Robots-Tag","fix":"next.config.ts headers(): Link rel=canonical to HTML page; redirect /writing/:slug/md"},
    {"id":"M2","severity":"Medium","title":"Post body inside hidden div revealed by $RC","evidence":"<div hidden id=\"S:1\"> contains <main> (~2,216 words)","fix":"Await params outside Suspense in writing/[slug]/page.tsx, or accept"},
    {"id":"M3","severity":"Medium","title":"No Open Graph / Twitter metadata","evidence":"0 og:/twitter: tags","fix":"openGraph/twitter in metadata + opengraph-image.tsx"},
    {"id":"M4","severity":"Medium","title":"No structured data","evidence":"0 JSON-LD blocks","fix":"Person+WebSite on /, BlogPosting on post (see schema.md)"},
    {"id":"M5","severity":"Medium","title":"Only HSTS security header","evidence":"Strict-Transport-Security: max-age=63072000 only","fix":"headers() with nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS includeSubDomains/preload if safe"},
    {"id":"L1","severity":"Low","title":"Favicon hot-linked from github.com (302 to avatars host, 64px)","evidence":"link rel=icon https://github.com/luannzin.png?size=64; /favicon.ico 404","fix":"src/app/icon.png (+ favicon.ico, apple-icon.png)"},
    {"id":"L2","severity":"Low","title":"/writing returns 404","evidence":"HTTP 404 on /writing","fix":"redirect /writing -> /#writing, or add an index page"},
    {"id":"L3","severity":"Low","title":"404 page has two <title> tags","evidence":"<title>404: This page could not be found.</title><title>Luan Fabri</title>","fix":"src/app/not-found.tsx with metadata.title"},
    {"id":"L4","severity":"Low","title":"http://luannzin.com needs 2 redirects","evidence":"http apex -> https apex -> https www (0.22s)","fix":"None required; HSTS preload removes it for Chrome"},
    {"id":"L5","severity":"Low","title":"Home title is only the name","evidence":"<title>Luan Fabri</title>","fix":"title.default 'Luan Fabri - Front-end engineer'"},
    {"id":"L6","severity":"Low","title":"JS payload 265-328 KB compressed","evidence":"8-9 JS chunks per page","fix":"LazyMotion/m or CSS reveal; bundle analyzer"},
    {"id":"L7","severity":"Low","title":"Headings SSR with inline opacity:0 until hydration","evidence":"TextReveal spans style=opacity:0;filter:blur(6px)","fix":"CSS-first reveal in a server component"}
  ]
}
```
