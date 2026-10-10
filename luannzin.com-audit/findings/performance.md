# Performance / Core Web Vitals audit: luannzin.com

Date: 2026-10-10. Pages: https://www.luannzin.com/ and https://www.luannzin.com/writing/art-from-a-seed

## Scope and data quality (read first)

- LAB DATA ONLY. No field data (CrUX/PSI field) was obtained.
  - pagespeed_check.py (keyless PSI): HTTP 429 "rate limit exceeded" on both URLs, retried once after 20 s, then stopped.
  - lcp_subparts.py (CrUX): needs an API key, not configured.
- Lab source: Lighthouse 13.5.0 (cached npx copy, Node 24, local Windows Chrome, headless). Mobile preset (simulated 4x CPU, 150 ms RTT, ~1.6 Mbps) x3 per page, desktop preset x1 per page. One machine, one network. Traces were also gathered (unthrottled) to inspect LCP candidates.
- Not measured: field LCP/INP/CLS, real INP (no interactions were driven; TBT is only a proxy), real devices, PSI score, the LCP element of the post page (see F1), and any proposed fix (all fixes are untested recommendations).
- preload_check.py: score 50/100 on both pages (no speculation rules; no fetchpriority=high on the LCP resource). bfcache signals clean (no unload listener, no no-store).

## Score and Core Web Vitals status (lab)

| Page | Lighthouse perf (mobile) | Desktop | LCP (sim / unthrottled obs) | CLS | TBT (INP proxy) | FCP sim |
|---|---|---|---|---|---|---|
| Home | 85, 85, 84 | 100 | 2.73 / 2.56 / 2.56 s sim; 0.22-0.39 s observed | 0 | 465 / 482 / 514 ms | 1.06 s |
| Post | 62, 69, 63 | 90 | 4.13 / 4.15 / 4.09 s sim; 1.45-1.58 s observed | 0 | 1248 / 668 / 1162 ms | 1.2 s |

Desktop: home LCP 0.5 s, TBT 45 ms; post LCP 0.91 s, TBT 242 ms, CLS 0.

Overall performance score (judgement, mobile-weighted, lab): 75/100 (home ~85, post ~65).

- LCP: home borderline (2.6-2.7 s simulated, limit 2.5 s); post fails in simulation (>4.0 s) but is ~1.5 s unthrottled. Treat the simulated numbers as pessimistic; field unknown.
- CLS: pass in all 8 runs, zero shifts in trace (img width/height set, canvas has aspect-ratio, fonts via next/font).
- INP: NOT MEASURED. TBT is high on mobile (home ~0.5 s, post 0.7-1.2 s simulated), so INP risk exists on slow phones, but it is not evidence of an INP failure.
- Server: TTFB ~10 ms, x-vercel-cache HIT, static prerender (x-nextjs-prerender: 1), compression on. DOM: home 121 elements, post 1038 (under 1500).

## Findings

### F1 (High, post page FCP/LCP): whole post is behind a fallback-less Suspense and only appears after a swap script
- Evidence: raw HTML of the post has an empty body shell (`<!--$?--><template id="B:1">`) and all content (breadcrumb, h1, canvas, article) inside `<div hidden id="S:1">`, revealed by `$RC("B:1","S:1")` at byte ~83,284 of a 184 KB document (22 KB transferred). Observed FCP 0.52 s on post vs 0.22 s on home; simulated LCP 4.1 s vs 2.6 s.
- Next docs confirm the mechanism: node_modules/next/dist/docs/01-app/02-guides/streaming.md (~line 582): LCP content inside a Suspense boundary cannot paint until the swap script runs.
- Source: src/app/writing/[slug]/page.tsx, `Page` wraps `<Post params={params}/>` in `<Suspense>` with no fallback (comment says params is URL data).
- Note: node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md (~line 462) says known params (generateStaticParams) put concrete content in the shell; deployed output shows otherwise. Needs verification with `next build` output.
- Post LCP element not identified: the trace has no `largestContentfulPaint::Candidate` events and Lighthouse's insight engine throws LanternError NO_LCP on post runs. LCP updates were recorded at 77, 357, 694 and 1533 ms (UKM invalidations); the final one is probably the article text (inference; a WebGL canvas is not an LCP-eligible element type).
- Fix (untested): make the post render in the static shell. Since generateStaticParams already lists every slug, add `export const dynamicParams = false` and `await params` directly in an async `Page` without the Suspense wrapper, or move the Suspense boundary down to only the genuinely dynamic bit. Then check the HTML no longer contains `<div hidden id="S:1">`. Keep `prefetch` on the home links.

### F2 (Medium, perceived LCP / robustness): h1 and tagline are JS-gated (TextReveal)
- Confirmed in SSR HTML: `<span ... style="opacity:0;filter:blur(6px);transform:translateY(20%)">` on every word of the h1 and tagline (home and post). src/components/motion/text-reveal.tsx is "use client" using `motion/react`; text stays invisible until the JS chunk loads, hydrates and motion starts. If JS fails or is slow, the name never shows.
- Lab filmstrip (home, observed): blank at 375 ms, blurred text at 750 ms, sharp text 1.1-1.5 s. Post: h1 blurred at ~1.1 s, sharp ~1.5 s, after the cover canvas (~0.75 s).
- Correction to the suspicion: on the HOME page the h1 is NOT the LCP element in lab. The trace has a single LCP candidate, the 40x40 avatar `<img>` at 217 ms (unthrottled); no text candidate (not the h1, not the bio) was ever recorded. So the opacity:0 text did not delay measured LCP. Whether Chrome in the field records later text candidates is unverified.
- Fix: replace TextReveal for h1/tagline with the CSS `enter` classes already used elsewhere (src/lib/classes.ts) or a CSS-only per-word stagger, so no inline opacity:0 and no JS dependency. Keep motion only for interactive bits.

### F3 (High for mobile TBT / INP risk, INP itself not measured): large shared JS and heavy post hydration
- Mobile sim TBT: home ~0.5 s, post 0.67-1.25 s. Long tasks (sim) up to ~530 ms in chunk 0x6-2q5-0fvxu.js (React/Next runtime, 230 KB raw / 72 KB gz) on post.
- chunk 0v_l8s9nn9uno.js (221 KB raw / 82 KB gz) contains the scene generator (src/lib/scene.ts is 104 KB source), the WebGL dots painter and motion. It loads on the HOME page (SceneArt crop tile in src/app/page.tsx pulls scene.ts + dots.ts + motion). Script eval 124 ms home vs ~900-950 ms post (sim). 26-34 KB of it unused on load.
- Post hydration creates 8 WebGL canvases at mount (cover + 6 `data-island="scene"` + 1 `roll`, per HTML) in a `useLayoutEffect` (src/components/scene-art.tsx), each doing getContext + shader compile + first paint.
- Cover and roll scene run a 15 fps JS frame loop while visible (stir=true); cost per frame not measured.
- Fix: (a) home tile: ship a pre-rendered static thumbnail (PNG/SVG generated at build from the seed) instead of loading scene.ts; (b) in scene-art.tsx defer `dots(canvas)`/first `layout()` for non-cover scenes until IntersectionObserver reports near-viewport; (c) use `LazyMotion`/`m` or CSS for motion usage (text-reveal.tsx, action-swap.tsx); (d) measure INP in the field after changes.

### F4 (Medium): `enter` animation is non-composited and delays content
- src/lib/classes.ts `enter` = animate-in + fade-in + blur-in-4 + slide-in-from-bottom-3 + fill-mode-both. Lighthouse: 12 (home) / 15 (post) non-composited animations, reason "Filter-related property may move pixels" (the blur). They run on the main thread and stall behind hydration long tasks.
- Delays (delay-400..800 on sections, delay-400 on the post article and ToC) plus 500 ms duration: last visual change ~1.5 s home, ~2.9-3.6 s post. The post article (largest text block, likely the final LCP element there, inference) is hidden for the first 400 ms of its animation.
- Fix: drop `blur-in-4` from `enter` (keep opacity + transform, compositor-only), cap delay on above-the-fold content (bio, post article) to <=100 ms, keep long stagger only for below-the-fold decoration.

### F5 (Medium): home LCP image details
- LCP element = avatar `next/image` in src/app/page.tsx. Observed breakdown: TTFB 55-60 ms, load delay 16-18 ms, load duration 23-46 ms, element render delay 139-262 ms (the avatar has `enter` fade-in so it starts at opacity 0). Lighthouse lcp-discovery-insight: preload present and discoverable, but fetchpriority=high not applied.
- The source is remote (`https://github.com/luannzin.png` via /_next/image). Measurements were on a warm Vercel image cache; a cold cache miss would add a github.com -> avatars.githubusercontent.com redirect to LCP (not measured).
- Fix: commit the avatar as a local asset (import like src/assets/echo.png), add `fetchPriority="high"` on that Image, and remove `${enter}` from the avatar.

### F6 (Low-Medium): fonts and favicon
- Two woff2 preloaded on every page (71 KB total, Inter + Geist Mono, Link header). Geist Mono is used for the footer `index.md` link and code only. Fix: `preload: false` on `Geist_Mono` in src/app/layout.tsx.
- Favicon `icons.icon = "https://github.com/luannzin.png?size=64"` in src/app/layout.tsx causes two cross-origin requests (github.com redirect then avatars.githubusercontent.com, ~255 ms and 390-460 ms sim). Fix: src/app/icon.png (file convention).
- font-display audit passes; CLS from fonts is 0.

### F7 (Low): other
- Render-blocking CSS 36 KB (1h_0fmnahhj57.css, 35 KB transfer): est. 210-300 ms simulated savings on home.
- Legacy JS polyfills in the runtime chunk (Array.prototype.at/flat/flatMap, Object.fromEntries, Object.hasOwn): ~14 KB wasted.
- Home `<Link prefetch>` to the post triggers two RSC requests (1 KB + 14 KB) and a 62 KB gz post chunk ~0.45 s after load (up to 48 KB unused on home). Post-LCP but adds main-thread parse. Acceptable trade-off for instant navigation; keep if intended.
- No speculation rules (preload_check). Optional.

## Priority order
1. F1 post page Suspense swap (largest lab gap between pages).
2. F3 JS weight/hydration (TBT, INP risk).
3. F4 enter animation blur and delays.
4. F5 avatar LCP handling and local asset.
5. F2 TextReveal to CSS.
6. F6/F7 housekeeping.

## Housekeeping notes
- Next.js feedback pass (AGENTS.md) was not run (tool-call budget). Candidate: docs (08-caching.md) say known params render concrete content in the static shell, but the deployed post HTML keeps all content behind a pending Suspense boundary with a hidden div. Unverified.
- Raw artifacts (Lighthouse JSON, traces, filmstrips) are in the session scratchpad perf/ directory.

## Structured findings (audit-data.json, Performance)
```json
{
  "category": "Performance",
  "score": 75,
  "data_type": "lab",
  "field_data": "unavailable (no API key; PSI keyless 429)",
  "metrics": {
    "home_mobile": {"perf": [85,85,84], "lcp_sim_s": [2.73,2.56,2.56], "tbt_ms": [465,482,514], "cls": 0},
    "post_mobile": {"perf": [62,69,63], "lcp_sim_s": [4.13,4.15,4.09], "tbt_ms": [1248,668,1162], "cls": 0},
    "home_desktop": {"perf": 100, "lcp_s": 0.505, "tbt_ms": 45, "cls": 0},
    "post_desktop": {"perf": 90, "lcp_s": 0.913, "tbt_ms": 242, "cls": 0}
  },
  "findings": [
    {"id": "F1", "severity": "high", "file": "src/app/writing/[slug]/page.tsx", "issue": "post body inside fallback-less Suspense, hidden div revealed by $RC"},
    {"id": "F3", "severity": "high", "file": "src/components/scene-art.tsx; src/app/page.tsx", "issue": "scene.ts/WebGL/motion in home bundle; 8 WebGL canvases hydrate on post; TBT high on mobile"},
    {"id": "F2", "severity": "medium", "file": "src/components/motion/text-reveal.tsx", "issue": "h1 and tagline inline opacity:0, JS-gated; not the lab LCP element"},
    {"id": "F4", "severity": "medium", "file": "src/lib/classes.ts", "issue": "non-composited blur enter animation, 400-800 ms delays"},
    {"id": "F5", "severity": "medium", "file": "src/app/page.tsx", "issue": "avatar LCP: fade-in, no fetchpriority, remote github source"},
    {"id": "F6", "severity": "low", "file": "src/app/layout.tsx", "issue": "Geist Mono preload; remote favicon redirect chain"},
    {"id": "F7", "severity": "low", "file": "n/a", "issue": "render-blocking CSS 36 KB, legacy polyfills 14 KB, prefetch of post chunk, no speculation rules"}
  ]
}
```
