# GEO / AI Search Readiness: www.luannzin.com

Audited 2026-10-10. Pages: `/` and `/writing/art-from-a-seed` (the only post, published 2026-10-08), plus `/llms.txt` and the `.md` twins. Fetched with `render_page.py --mode auto` (raw fetch; `is_spa: false`). Each AI-crawler user agent was also fetched directly with curl.

## GEO Readiness Score: 57 / 100

| Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 62 | 15.5 | Sections are 70-190 words and open with direct statements. The post has concrete first-party specifics (9 places, 11 times, 11 landmarks, 15 fps, 30 ms / 8-frame threshold, 320-column cap, 4x4 ordered dither, 3 dot sizes), plus a table, code and one external attribution. Weaknesses: no summary up top, headings are poetic rather than descriptive or question-based, some passages only make sense on the page ("the one above", "Hover one to set it moving"), and technical terms that retrieval matches on are thin (no "procedural", "deterministic", "PRNG", "fragment shader"; "Bayer" appears only in code). One post means very little topical surface. |
| Structural Readability | 20% | 78 | 15.6 | Clean H1 > H2 > H3 hierarchy, an anchored table of contents, lists, a table, fenced code and a clean markdown twin. The H1 is split into one span per word (each with inline `opacity:0`), but the text stays in the DOM. |
| Multi-Modal | 15% | 45 | 6.75 | One static PNG with alt text and a caption. The hero is an interactive canvas, which crawlers cannot see (the .md twin says so honestly). No OG or Twitter image, no video. Two images on the home page have empty alt text (avatar, echo logo). |
| Authority & Brand | 20% | 25 | 5.0 | The post shows a visible byline and a `<time datetime>`. Missing: JSON-LD (Person/BlogPosting), `sameAs`, `rel="me"` and `rel="author"`. There is no Wikidata entity. The GitHub display name is "luan" and its `blog` field is empty. useecho.dev and the better-intl npm package never mention "Luan Fabri" or luannzin.com. Bing searches for "Luan Fabri" and "luannzin" turned up no owned results (the scraped results looked unreliable, so this is indicative only). No YouTube or Reddit footprint found. |
| Technical Accessibility | 20% | 72 | 14.4 | Prerendered on Vercel (`X-Nextjs-Prerender: 1`, cache HIT). All AI user agents get a 200 with full HTML. llms.txt, .md twins and `<link rel="alternate" type="text/markdown">` are all in place. Weaknesses: `/robots.txt` and `/sitemap.xml` return 404, there are no canonical tags, the .md twins (and the internal `/writing/[slug]/md` path) are duplicate URLs without a canonical, the post `<main>` sits inside `<div hidden id="S:1">` until an inline `$RC` script runs, and there is no RSL license. |
| **Total** | | | **57.25 -> 57** | |

## AI Crawler Access

`/robots.txt` returns 404, so every crawler is allowed by default. Every user agent below got HTTP 200 and an identical 184 KB HTML document (Bingbot got a 282 KB variant), with title and description in `<head>`. These tests spoofed user agents only. Vercel's firewall can still block bots by IP, and that cannot be checked from here.

| Crawler | Governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search results/citations | Allowed (200) |
| ChatGPT-User | User-triggered fetch (Ask AI links, pasted URLs) | Allowed (200) |
| GPTBot | OpenAI model training only | Allowed (200), owner's choice |
| Claude-SearchBot | Claude search citations | Allowed (200) |
| Claude-User | User-triggered fetch in Claude | Allowed (default) |
| ClaudeBot | Anthropic model training only | Allowed (200), owner's choice |
| PerplexityBot | Perplexity index/citations | Allowed (200) |
| Perplexity-User | User-triggered fetch | Allowed (default) |
| Googlebot | Google Search and AI Overviews / AI Mode inclusion | Allowed (200) |
| Google-Extended | Gemini/Vertex training and grounding; not Search/AIO inclusion | Allowed (default) |
| Bingbot | Bing and Copilot; Bing's index also feeds ChatGPT Search | Allowed (200) |
| Applebot / Applebot-Extended | Siri/Spotlight / Apple Intelligence training only | Allowed (default) |
| CCBot, cohere-ai | Training corpora | Allowed (200 / default) |

**Finding (Medium):** search and AI access is fine, but there is no explicit policy and no `Sitemap:` line. Fix: add `src/app/robots.ts` (allow `*`, `sitemap: https://www.luannzin.com/sitemap.xml`) and `src/app/sitemap.ts` built from `getPosts()`. Explicit per-bot groups are only worth adding if the owner wants to opt out of training bots (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended). Blocking them has no effect on search citations.

## llms.txt: present, well-formed

- Served at `/llms.txt` (rewrite of `/index.md`), `text/plain; charset=utf-8`, 1,024 bytes. Its structure follows the llms.txt proposal: H1 name, blockquote summary, intro paragraph, link-list sections (Projects, Writing, Links). The Writing entry points to the `.md` twin and carries a date.
- Weaknesses (Low):
  - The blockquote ("Front-end engineer at Loopscape") is too thin to identify the person. Suggested: "Luan Fabri (luannzin) is a front-end engineer at Loopscape in Jaú, SP, Brazil, building ERPs and multi-tenant platforms with React and Next.js." This ties the handle to the name, which no other source does today.
  - The llms.txt response has no `Link: <https://www.luannzin.com/>; rel="canonical"` header.
  - `llms-full.txt` is missing. With one post it isn't needed; skip it until there are several posts.
- Calibration: Google has said it does not use llms.txt. Its value is for agents and assistants fetching on demand (ChatGPT-User, Claude-User, Perplexity-User, coding agents), and here it pairs well with the Ask AI deep links.

## RSL 1.0 / Content Signals

There is no `/license.xml`, no RSL `License:` directive (and no robots.txt to put one in), and no Content-Signal. Severity: Info. This is optional for a personal site. If the owner wants a machine-readable "search yes / training no" stance, add it once robots.ts exists.

## Passage Citability: "Art from a seed"

1,785 words with code blocks stripped, 13 sections. Section word counts: 149, 156, 86, 189, 112, 12, 132, 70, 98, 139, 170, 171, 69. Most fall near the 130-170 extractable-block heuristic (a third-party heuristic; Google says chunking for AI isn't required).

Strengths:
- Most sections open with a direct, factual sentence ("The seed comes from the post's frontmatter, or from a hash of its slug...", "The scene draws fifteen frames a second.", "Each cell becomes one dot, in one of three sizes or none, the way a printed halftone does it.").
- Original, specific numbers that only this source has: first-party data is the kind of thing that earns citations.
- A comparison table (places x times x landmarks), a code-level explanation, and an attributed external source (ascii.rest / bas3line).

Gaps:
1. **No answer-first summary (Medium).** The opening paragraph is experiential and tied to the page ("Move your pointer over the one above..."). An AI asked "how do you generate deterministic cover art for blog posts from a seed?" has no 40-60 word block to lift. Fix: add a 2-3 sentence summary under the description. For example: "Each post stores one integer seed. A seeded PRNG (mulberry32) picks a place, time of day and landmark from weighted tables, shades a cell grid with noise-based sky, mountains and reflective water, then draws it as Bayer-dithered halftone dots in a WebGL fragment shader at 15 fps."
2. **Retrieval vocabulary (Low-Medium).** The deliberately plain prose leaves out the terms people query with: procedural generation, deterministic, seeded random number generator, ordered (Bayer) dithering, fragment shader, generative art. Work them in once each, in the summary and where the matching section first explains the technique.
3. **Headings (Low).** "A small world of parts" and "Touching it" don't say what the section answers. Keep the voice, but consider descriptive versions such as "How one seed picks every part of the scene" or "How water reflections work". Question-style headings line up with how users phrase prompts.
4. **Context-dependent passages (Low).** "Hover one to set it moving", "like the one above" and the live-scene placeholders read as broken when extracted. The .md twin already labels them. In the HTML, keep each section's first sentence self-contained.

Home page: the bio (about 70 words) is direct and extractable ("I'm a front-end engineer at Loopscape, I build ERPs and multi-tenant platforms with React and Next.js"). It is written in the first person and the paragraph itself never says "Luan Fabri" (only the H1 does), which weakens name-to-fact binding when the passage is lifted. Fix: open the bio in the third person or add the name, e.g. "Luan Fabri is a front-end engineer at Loopscape...".

## Technical Notes for AI Fetchers

- **The article body sits in a hidden streaming boundary (Medium-Low).** On `/writing/art-from-a-seed`, all of `<main>` is inside `<div hidden id="S:1">` and is only moved into place by the inline `$RC("B:1","S:1")` script. Cause: `Page` wraps `<Post>` in `<Suspense>` and awaits `params` inside it, even though `generateStaticParams` exists. Trafilatura still extracted all 1,666 words. Non-rendering fetchers that respect `hidden` (some readability or markdown converters) could drop the body. The .md twin offsets this for agents that follow the alternate link. Fix: render the post body outside the Suspense fallback path, so it lands in the static shell as visible HTML. Check the Next 16 cacheComponents/params guidance in `node_modules/next/dist/docs/` first. A separate `$RX("B:0","")` client-render bailout also appears at the end of the body.
- **Duplicate URLs (Medium).** `/writing/art-from-a-seed.md`, `/writing/art-from-a-seed/md`, `/index.md` and `/llms.txt` all return 200 text/plain copies of indexable pages, and the HTML pages have no `<link rel="canonical">`. Google can index text/plain. Fix: set `alternates.canonical` in page metadata, and add a `Link: <html-url>; rel="canonical"` header to the md route responses. Don't use `noindex` on the twins, because some AI fetchers honor it.
- **No Open Graph / Twitter metadata (Medium).** There is no `og:title`, `og:description`, `og:image` or `og:type=article`, and no `article:published_time`. ChatGPT, Perplexity and social shares lose a preview card, and shares are what produce brand mentions. Fix: add `openGraph` to the metadata, or an `opengraph-image` file; `home-tile.png` already exists.
- **No sitemap (Medium).** Fix: `src/app/sitemap.ts` with lastModified dates, then submit it in Google Search Console and Bing Webmaster Tools. Bing's index feeds Copilot and part of ChatGPT Search. IndexNow is optional.
- Positive: `lang="en"`, HSTS, a 308 from the apex domain and from http to `https://www.`, fast cached responses.

## Entity and Brand Signals: "Luan Fabri"

| Signal | Status |
|---|---|
| Wikipedia / Wikidata | None (Wikidata search for "Luan Fabri" returned nothing) |
| On-site structured data | None: no Person, no BlogPosting/author, no `sameAs` |
| `rel="me"` on social links | Missing (links to github.com/luannzin, x.com/__luannzin, linkedin.com/in/luannzin) |
| GitHub (github.com/luannzin) | Display name "luan", bio "@luannzin", blog field **empty**, company @loopscape, location Jaú / SP, 34 followers. The full name "Luan Fabri" is never shown, and nothing links back to the site. |
| npm better-intl | No `author` or `homepage` field |
| useecho.dev (own project) | Links to github.com/luannzin only; no "Luan Fabri" and no luannzin.com |
| Bing search | "Luan Fabri" results were dominated by other people named Luan (footballer Luan Guilherme, singer Luan Santana); "luannzin" returned unrelated results. No owned property appeared (indicative; the scraping was unreliable). |
| YouTube / Reddit | No presence found. These are the strongest correlated signals for AI citation (YouTube mentions about 0.74). |
| LinkedIn | Profile exists (linkedin.com/in/luannzin); not verified |

The name is ambiguous because "Luan" is a crowded given name in Brazil (footballers, singers), and the handle "luannzin" is not tied to "Luan Fabri" anywhere off-site. Today an AI system asked "who is Luan Fabri?" can only answer by fetching luannzin.com (the Ask AI button does exactly this) and has no corroborating sources.

Fixes:
1. Add JSON-LD `Person` on `/`: name "Luan Fabri", alternateName "luannzin", url, image, jobTitle, worksFor Organization Loopscape (url), address locality Jaú/SP/BR, `sameAs` [GitHub, X, LinkedIn, useecho.dev, npm profile]. Add `BlogPosting` on posts (headline, datePublished, author referencing the Person `@id`, image). The schema findings cover the details.
2. Make the off-site signals match: set the GitHub name to "Luan Fabri" and its blog field to https://www.luannzin.com; add `author: "Luan Fabri"` and `homepage` to better-intl's package.json; add "by Luan Fabri" with a link on useecho.dev; add the website field on LinkedIn and X.
3. Add `rel="me"` to the home-page social links.
4. Distribution: post the seeded-art write-up to r/generative, r/webdev, Hacker News and dev.to (canonical pointing back to the site), and record a short YouTube or X video of the scenes. These are the highest-correlation signals and this post is unusually visual.

## Platform-Specific Scores and Advice

| Platform | Score | Main constraint | Advice |
|---|---|---|---|
| Google AI Overviews / AI Mode | 38 | Inclusion follows Googlebot indexing and ranking. A 2-page site, no sitemap, no structured data, a brand-new post. | Submit to Search Console with a sitemap; add Person and BlogPosting; add the answer-first summary. AIO picks passages from pages that already rank, so long-tail queries ("seeded generative cover image blog", "mulberry32 dithering webgl") are the realistic targets. Google-Extended does not affect AIO. |
| ChatGPT (Search + browsing) | 52 | OAI-SearchBot is allowed. Search discovery leans on Bing's index (weak today). The text/plain .md twins already work around ChatGPT fetchers refusing text/markdown. | Submit to Bing Webmaster Tools; add canonicals; add OG metadata for citation cards; tie the name to the handle in llms.txt and the bio. |
| Perplexity | 55 | PerplexityBot allowed; favors fresh, structured, specific pages, which the post is. | Answer-first summary, descriptive headings, an OG image; Reddit distribution helps (Perplexity cites Reddit heavily). |
| Bing Copilot | 40 | Bing index, no sitemap, no IndexNow, no entity signals. | Bing Webmaster Tools, a sitemap, optionally IndexNow, plus JSON-LD. |
| Claude (search) | 50 | Claude-SearchBot allowed; same content gaps. | Same as ChatGPT. |

## Top 5 Highest-Impact Changes

| # | Change | Severity | Effort |
|---|---|---|---|
| 1 | Person + BlogPosting JSON-LD with `sameAs`, `alternateName: "luannzin"`, author `@id`; `rel="me"` on social links | High | 30-45 min |
| 2 | Make off-site identity match: GitHub name "Luan Fabri" + blog URL, npm author/homepage, useecho.dev byline, LinkedIn/X website fields | High | 30 min (no code in this repo) |
| 3 | `robots.ts` with a Sitemap line + `sitemap.ts`; submit to Google Search Console and Bing Webmaster Tools | Medium-High | 30 min |
| 4 | Canonical tags on HTML pages, a canonical `Link` header on .md/llms.txt responses, Open Graph/Twitter metadata with an article image | Medium | 30-45 min |
| 5 | Answer-first 2-3 sentence summary on the post with retrieval vocabulary; descriptive headings; third-person bio sentence containing "Luan Fabri" on home | Medium | 30-60 min |

Next tier: move the post body out of the hidden Suspense boundary (Medium-Low, about 15-30 min, check the Next 16 docs first); expand the llms.txt blockquote (Low, 5 min); distribute on Reddit/HN/YouTube (High impact, ongoing); write more posts (topical surface; ongoing); RSL/Content-Signal (Info, optional).

## Structured Findings (for audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 57,
  "dimensions": {"citability": 62, "structural_readability": 78, "multi_modal": 45, "authority_brand": 25, "technical_accessibility": 72},
  "platform_scores": {"google_aio": 38, "chatgpt": 52, "perplexity": 55, "bing_copilot": 40, "claude": 50},
  "findings": [
    {"id": "geo-entity-schema", "severity": "high", "title": "No Person/BlogPosting JSON-LD, no sameAs, no rel=me", "evidence": "0 ld+json blocks on / and /writing/art-from-a-seed; social links lack rel=me", "fix": "Add Person (alternateName luannzin, sameAs GitHub/X/LinkedIn/useecho.dev/npm) and BlogPosting with author @id; rel=me on social links", "effort": "30-45 min"},
    {"id": "geo-offsite-identity", "severity": "high", "title": "Name 'Luan Fabri' not tied to handle 'luannzin' off-site", "evidence": "GitHub name 'luan', blog empty; better-intl npm has no author/homepage; useecho.dev omits name/site; no Wikidata; Bing shows no owned results", "fix": "Set GitHub name and blog URL, npm author/homepage, useecho.dev byline, LinkedIn/X website", "effort": "30 min"},
    {"id": "geo-robots-sitemap", "severity": "medium", "title": "robots.txt and sitemap.xml return 404", "evidence": "/robots.txt 404, /sitemap.xml 404; all AI crawlers allowed by default", "fix": "Add src/app/robots.ts with Sitemap line and src/app/sitemap.ts; submit to GSC and Bing Webmaster Tools", "effort": "30 min"},
    {"id": "geo-canonical-duplicates", "severity": "medium", "title": "No canonical tags; .md twins are uncanonicalized duplicates", "evidence": "No rel=canonical on HTML; /writing/art-from-a-seed.md, /writing/art-from-a-seed/md, /index.md, /llms.txt all 200 text/plain with no Link header", "fix": "alternates.canonical in metadata; Link rel=canonical header on md route responses", "effort": "20 min"},
    {"id": "geo-opengraph", "severity": "medium", "title": "No Open Graph/Twitter metadata", "evidence": "0 og:/twitter: meta tags on both pages", "fix": "Add openGraph (type article, publishedTime, image) or opengraph-image route", "effort": "20 min"},
    {"id": "geo-answer-first", "severity": "medium", "title": "Post lacks answer-first summary and retrieval vocabulary", "evidence": "Opening paragraph is experiential and page-dependent; terms like procedural/deterministic/PRNG/fragment shader absent from prose", "fix": "Add 2-3 sentence self-contained summary under the title; descriptive headings", "effort": "30-60 min"},
    {"id": "geo-hidden-boundary", "severity": "low", "title": "Post <main> delivered inside <div hidden id=S:1> until inline JS runs", "evidence": "Suspense around <Post> awaiting params; $RC(B:1,S:1); trafilatura still extracts 1,666 words", "fix": "Render post body in the static shell outside the Suspense boundary (verify against Next 16 cacheComponents docs)", "effort": "15-30 min"},
    {"id": "geo-llms-summary", "severity": "low", "title": "llms.txt blockquote too thin to identify the person", "evidence": "'> Front-end engineer at Loopscape'", "fix": "Expand to 'Luan Fabri (luannzin) is a front-end engineer at Loopscape in Jaú, SP, Brazil...'", "effort": "5 min"},
    {"id": "geo-brand-distribution", "severity": "medium", "title": "No YouTube/Reddit footprint", "evidence": "No mentions found", "fix": "Share the post on r/generative, r/webdev, HN, dev.to (canonical back); short demo video", "effort": "ongoing"},
    {"id": "geo-rsl", "severity": "info", "title": "No RSL 1.0 license or Content-Signal", "evidence": "/license.xml 404; no robots.txt", "fix": "Optional: declare search-allowed/training stance once robots.ts exists", "effort": "15 min"}
  ],
  "positives": [
    "Prerendered HTML, 200 for every AI crawler UA tested",
    "llms.txt present and spec-shaped, linking .md twins with dates",
    "Per-post .md twins served text/plain with byline, date and source URL; rel=alternate type=text/markdown on pages",
    "Clean heading hierarchy, TOC anchors, table, code, visible byline and <time datetime>",
    "Ask AI deep links make assistants fetch the site for name queries"
  ]
}
```
