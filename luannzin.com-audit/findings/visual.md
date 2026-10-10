# Visual / Mobile / Images audit: luannzin.com

Date: 2026-10-10. Pages: `/` and `/writing/art-from-a-seed`. Tools: bundled capture_screenshot.py, analyze_visual.py, render_page.py (run via claude-seo runtime) plus a custom Playwright probe on the same Chromium (DOM, opacity timeline, no-JS, CLS, contrast).

Screenshots were taken during the audit and removed afterwards.

Primary captures (settled = network idle + 1 s, all enter animations finished):
- home-desktop.png (1920x1080), home-laptop.png, home-tablet.png, home-mobile.png (375x812 @2x), home-mobile-full.png
- article-desktop.png, article-laptop.png, article-tablet.png, article-mobile.png, article-mobile-full.png

Crawler-style / degraded captures:
- *-desktop-immediate.png, *-mobile-immediate.png (taken at DOMContentLoaded)
- home-desktop-t0ms.png, t400ms (ms after `load`); article-desktop-t0ms / t400ms / t1000ms
- *-nojs-3s.png (JavaScript disabled, waited 3 s)

## Summary scores
- Images: 84/100
- Mobile / responsive layout: 90/100 (no overflow, 16px base, viewport meta OK)
- Renderer visibility (text hidden from non-settled/non-JS renderers): needs work (see H1, H2)

## Findings

### H1. HIGH: Article body ships inside `<div hidden id="S:1">`; no-JS render is blank
- Raw HTML of `/writing/art-from-a-seed` has an empty `<template id="B:1">` (pending Suspense boundary). The entire `<main>` (breadcrumb, H1, hero, text, TOC) sits in `<div hidden id="S:1">` at byte ~2216 and is moved into place by the inline `$RC` script at the end of the stream.
- JS disabled, 3 s wait: 0 of 558 text nodes visible, `innerText` length 0, fully blank screenshot (article-*-nojs-3s.png).
- Raw-text extractors (trafilatura) still read it (8,601 chars). Extractors or renderers that honour the `hidden` attribute (Mozilla Readability-style, no-JS screenshot services, some AI fetchers) get an empty page.
- Cause (read-only check): `src/app/writing/[slug]/page.tsx` wraps `<Post params>` in `<Suspense>` with no fallback (cacheComponents + partialPrefetching). The comment says this is deliberate for prefetching.
- Fix: put the static parts (breadcrumb, header, article body) in the static shell. Options: (a) drop the `<Suspense>` around the whole post, since `generateStaticParams` already supplies every slug; (b) if the Suspense must stay for partial prefetching, give it a real fallback and move only the URL-dependent read inside it. Verify with `curl -s URL | grep -c 'hidden id="S:'` returning 0 and the `<h1>` appearing outside any `hidden` div.

### H2. MEDIUM-HIGH: H1 and tagline are `opacity:0` in SSR HTML and need JS to appear
- Home: `<h1>Luan Fabri</h1>` and the "Front-end engineer at Loopscape" tagline are word-split spans with inline `style="opacity:0;filter:blur(6px);transform:translateY(20%)"` (TextReveal component). JS disabled, 3 s: 20 of 26 text nodes visible; the 6 hidden ones are exactly the name and role. Reduced-motion + immediate capture also still shows these 6 hidden. The article H1 has the same inline hidden style.
- The home page's name and role are the most important entity text, so they are the least reliably rendered.
- Fix: render the SSR markup visible (no inline `opacity:0`), and apply the start state from a CSS class under `@media (prefers-reduced-motion: no-preference)` or after hydration. Alternative: `animation-fill-mode: both` CSS keyframes (as the rest of the page already does via `motion-safe:animate-in`) instead of inline JS styles.

### M1. MEDIUM: Immediate (crawler-style) capture shows an almost blank page
- Home at DOMContentLoaded or `load`: 26 of 26 text nodes at opacity 0 (only the avatar fading in). Fully visible about 1.1 to 1.25 s after `load` (staggered delays up to ~0.8 s + 0.5 s duration). See home-desktop-immediate.png, home-desktop-t0ms.png.
- Article: at `load`, 3 of 559 text nodes fully visible; 546 by about 1.1 s after load. On mobile emulation at DOMContentLoaded `innerText` was 0 (content still in the hidden Suspense div). See article-mobile-immediate.png.
- A renderer that snapshots at `load` or `networkidle` with no extra wait records a blank dark page. The bundled capture_screenshot.py (networkidle + 1 s) gets the full page, but only just on the article.
- Fix: same as H2 (CSS-only enter animation that starts visible under reduced-motion and is capped to under ~300 ms total), or shorten delays so everything is opaque within ~500 ms.

### M2. MEDIUM: No social/preview image
- No `og:image`, `twitter:image` or `twitter:card` in either page head; `/writing/art-from-a-seed/opengraph-image` returns 404. The article's hero is a `<canvas>` seed art with no raster equivalent, so link previews and image search get nothing.
- Fix: add `opengraph-image` (static PNG per post, or a rendered snapshot of the seeded scene) and `twitter:card=summary_large_image`.

### M3. LOW-MEDIUM: Visual hierarchy is flat by design
- Computed sizes: H1 16px/500, H2 16px/500, body 16px/400 on both pages; hierarchy is carried only by weight and colour (white 245 vs grey 178 vs grey 129). The article title reads like a label under the breadcrumb (article-mobile.png).
- Intentional minimalism, but weak for scanning and for crawlers' visual heuristics. Optional fix: article H1 at `text-xl`/`text-2xl`, keep the rest.

### L1. LOW: Tap targets under 44/48 px (all pass WCAG 2.2 AA 24px minimum)
- Home inline links (375px): Loopscape 104x20, GitHub 72x20, X 11x20 (smallest), LinkedIn 84x20, footer `index.md` 67x18 at 14px.
- Icon buttons 32x32 with ~8px gaps: "Ask about me on" (4) and "Summarize with" (4), die button 32x32, Copy code 28x28, Share 88x32.
- Article TOC links 22px tall with 30px pitch (OK). Project rows are 327x52 to 66 (good).
- Fix: raise icon buttons to `size-11` (44px) or add `before:absolute before:-inset-2` hit areas; add `py-2` or an inline-block hit area on the X link.

### L2. LOW: Small and low-contrast text
- 9px "TS" badge on code blocks (`span.code-badge`, aria-hidden, decorative). Everything else is 14px mono (code, `index.md`) or 16px.
- Muted grey (129,129,129) on #161616 is 4.65:1 (passes AA 4.5 with almost no margin). It is used for tagline, project descriptions, breadcrumb "Writing", dates, captions, TOC, and 14px code comments. Consider lifting to about 140 for headroom.

### L3. LOW: Code blocks scroll sideways on mobile
- `pre` is `overflow-x: auto` (scrollWidth 513 to 606 vs 375 client). Page itself does not overflow, so this is correct. They have no `tabindex="0"`, so keyboard users cannot scroll them. Add `tabindex="0"` plus `role="region"` and a label (or `focus-visible` styles).

### What passes
- Viewport meta `width=device-width, initial-scale=1`; `html lang="en"`; `color-scheme: dark`.
- No horizontal overflow at 375px on either page (`scrollWidth` 375 = `innerWidth`); analyze_visual.py: no overlaps, no text overflow, base font 16px, on both pages.
- Above the fold: desktop home shows everything including footer within 1080px; mobile home shows name, role, both intro paragraphs and all three profile links (GitHub y=357, LinkedIn y=383) within 812px. There is no marketing CTA (personal site); no email/contact link exists, only X/GitHub/LinkedIn.
- Article above the fold (mobile): breadcrumb, H1, date, Summarize buttons, hero scene all visible within 812px.
- CLS 0.00 on both pages (enter animations use transform/opacity/filter only; hero canvas has fixed aspect ratio).
- Laptop 1366 and tablet 768: no overlap between sticky TOC rail and column; TOC collapses to a `<summary>` "On this page" under the breakpoint (327x50).
- Console errors: none. Page fully readable at 16px body with 26px line-height.

## Images audit (alt text, formats)

Inventory (rendered DOM):
- Home: 2 `<img>` (both `alt=""`), 1 `<canvas>` (aria-hidden), 11 aria-hidden SVG icons.
- Article: 2 `<img>`, 8 canvases, 19 SVGs.

| Image | alt | Verdict |
|---|---|---|
| Home avatar (github.com/luannzin.png via `/_next/image`, 40x40) | `""` | Correct: decorative, adjacent visible "Luan Fabri". Eager-loaded above the fold (good). Served as WebP (2.8 KB), `Vary: Accept`. |
| echo logo (44x44) inside link "echo / The note taker..." | `""` | Correct: decorative, link has visible text. `loading="lazy"` but it is in the first viewport on desktop and mobile (y about 528): drop lazy or use `priority`. |
| Article footer avatar inside link "Luan Fabri / Front-end engineer..." | `""` | Correct. |
| `/writing/art-from-a-seed/home-tile.png` (560x184, 32 KB PNG) | "The Writing list on the home page, with this post's tile" | Present and descriptive; plain `<img>`, not `next/image`, no srcset or WebP/AVIF, PNG on a `max-age=0, must-revalidate` public asset. |
| Hero scene (blossom pond) | `div[role=img][aria-label="An animated scene drawn in dots: blossom pond"]` wrapping an aria-hidden canvas | Good a11y pattern; same for the 7 related scenes. The canvas has no raster/`<img>` fallback for crawlers or image search. |
| Loopscape, GitHub, LinkedIn and AI-provider icons (SVG) | aria-hidden | Correct: each sits inside a link with visible text or `aria-label` ("Ask about me on ChatGPT", etc.). |
| Home "Art from a seed" and "better-intl" tiles | canvas / SVG, aria-hidden | Fine, decorative next to titles. |

Image issues: (1) no og:image or twitter:image (M2); (2) favicon is hot-linked `https://github.com/luannzin.png?size=64`: a third-party dependency, with no `apple-touch-icon` or SVG icon; the `_next/image` avatar also depends on github.com being reachable; (3) `home-tile.png` unoptimised; (4) echo logo lazy-loaded in the viewport.

Score rationale (84/100): alt-text practice is correct everywhere (decorative `alt=""` only next to visible text; meaningful `role=img` labels on art); deductions for missing OG/twitter image (-8), canvas hero with no crawlable image fallback (-3), unoptimised PNG tile (-2), favicon hot-linked from GitHub (-2), lazy-loaded in-viewport logo (-1).

## Accessibility tree notes (render_page.py --a11y-tree)
- Home: `main > sectionheader > heading "Luan Fabri"` (words in separate StaticText nodes, fine), tagline paragraph, About section, links with accessible names.
- Article: `navigation "Breadcrumb"`, `heading` H1, 8 `role=img` scenes, TOC `nav`. No console errors.
