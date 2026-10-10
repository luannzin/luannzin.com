# Content Quality and E-E-A-T: www.luannzin.com

Audit date: 2026-10-10. Scope: `/` and `/writing/art-from-a-seed` (the only post). Sources: live HTML via `render_page.py --mode never` (static prerender, not an SPA), plus repo source (`src/app/page.tsx`, `src/app/layout.tsx`, `src/app/writing/[slug]/page.tsx`, `src/content/writing/art-from-a-seed.md`, `src/app/index.md/route.ts`, `src/app/writing/[slug]/md/route.ts`, `next.config.ts`). Bundled tools used: `content_quality.py`, `metadata_template.py`. No repo source files were edited.

## Scores

| Area | Score |
|---|---|
| **Content Quality (site)** | **68 / 100** |
| **On-Page SEO** | **52 / 100** |
| E-E-A-T (weighted) | 59 / 100 |
| AI citation readiness | 64 / 100 |
| Post body quality (in isolation) | 86 / 100 |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Basis |
|---|---|---|---|
| Experience | 20% | 74 | The post is clearly first-hand: real code from the site's own `src/lib/scene.ts`, live demos, a screenshot of the home tile, and design reasoning ("I wanted the pictures to belong to the posts without making cover images I would have to keep up"). The homepage claims "ERPs and multi-tenant platforms" but gives no example, timeframe or outcome. |
| Expertise | 25% | 62 | Technical depth and accuracy in the post are high (PRNG, weighted choice, one-point perspective, ordered dither, GPU texture approach, frame-budget fallback). Credentials are one line ("Front-end engineer at Loopscape"); no tenure, background or stack summary. The post has no byline next to the title, only the footer author card. |
| Authoritativeness | 25% | 40 | One post, two one-line project entries, no visible signals of recognition (stars, users, talks, mentions). Profile links (GitHub, X, LinkedIn) exist but are not machine-linked (no `rel="me"`, no Person `sameAs`). The source repo `github.com/luannzin/luannzin.com` returns 404 (private), so the code the post quotes can't be verified. |
| Trustworthiness | 30% | 62 | Real name, photo, employer link, HTTPS + HSTS, accurate publish date, honest attribution of the visual style to ascii.rest / bas3line. Missing: any contact route (email or "DM me"), structured identity data, canonical URLs, updated-date convention. |

Weighted: 0.20×74 + 0.25×62 + 0.25×40 + 0.30×62 = 58.9, so 59.

## Measurements

| Metric | `/` | `/writing/art-from-a-seed` |
|---|---|---|
| Visible words | ~110 (bio 72 + project/post list + labels) | 1,977 in markdown; ~1,520 prose excluding code and table; 1,666 in extracted main text |
| Floor for page type | Homepage 500 | Blog post 1,500 |
| Status vs floor | Below (thin by the floor) | Meets |
| `content_quality.py` overall | 68 (flags: `thin-content`, `low-density`) | 74 (flag: `low-density`) |
| Filler / AI-pattern score | 0 / 0 | 0 / 0 |
| Information density (entities+numbers per token) | 0.135 | 0.025 |
| Readability | n/a (too short) | Flesch Reading Ease ~80, FK grade ~6.4, 17.5 words/sentence, 13% of sentences over 30 words (longest 48) |
| Headings | H1 "Luan Fabri"; H2 Projects, Writing | H1 + 8 H2 + 3 H3, strictly nested, each with an anchor id and a TOC |
| Structured data (JSON-LD) | none | none |
| Open Graph / Twitter tags | none | none |
| Canonical | none | none |
| Publication date | none (heuristic misread "2021-10-01" out of the LinkedIn SVG path data) | 2026-10-08 in `<time datetime>`; 2 days old |

Templated metadata (`metadata_template.py`, both pages): `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, no flags. Metadata is hand-written, not bulk-generated.

AI-generated content check (QRG Sept 2025): no markers. The post is specific, idiosyncratic in voice, carries first-hand reasoning and verifiable implementation detail, and cites its inspiration. No generic phrasing, no repetitive structure.

## Findings

### High

**H1. Post `<title>` and meta description carry no searchable terms.**
Evidence: `<title>Art from a seed · Luan Fabri</title>`; `<meta name="description" content="Every post’s picture, grown from one number">` (43 chars). The page is about seeded procedural generation, a mulberry32 PRNG, ordered (Bayer) dithering, halftone dots and WebGL, but none of those words reach the title or description, so the page can only rank for its own title. Google will likely rewrite the 43-char description.
Fix: keep the poetic H1, give the `<title>` a descriptive subtitle and lengthen the description to ~140-155 chars. Example:
- Title: `Art from a seed: procedural cover art from one number · Luan Fabri`
- Description: `How each post grows its own animated cover from one number: a seeded mulberry32 PRNG, weighted scene choices, and Bayer-dithered halftone dots on WebGL.`
The frontmatter `description` also feeds the homepage list subtitle (`src/app/page.tsx` line 146-171); if the longer text is too long for that tile, add one flat frontmatter key (the parser in `src/lib/writing.ts` already supports any flat `key: value`) for the meta description and use it in `generateMetadata`.

**H2. No Open Graph / Twitter card metadata on any page.**
Evidence: live `<head>` has only title, description, markdown alternate and icon. `src/components/share.tsx` sends the post to X/LinkedIn, so every share unfurls as a bare link. For a post whose subject is its picture, this is the largest missed asset.
Fix: add `metadataBase: new URL(site)` and `openGraph` (title, description, url, type `article`, `publishedTime`, `authors`) plus `twitter: { card: "summary_large_image" }` in `layout.tsx` / `generateMetadata`. For the image, the lowest-effort path is a static per-post PNG (a 1200×630 capture of the scene next to the existing `public/writing/art-from-a-seed/home-tile.png`) or an `opengraph-image` file in `src/app/writing/[slug]/` (convention documented in this Next version at `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`). A homepage OG image (name, role, avatar) covers profile-link shares.

**H3. No Person / BlogPosting structured data; identity is not machine-linked.**
Evidence: `structured_data.block_count: 0` on both pages; GitHub/X/LinkedIn links in the bio have no `rel="me"`.
Fix: one JSON-LD `Person` on `/` (name "Luan Fabri", alternateName "luannzin", jobTitle, worksFor Organization Loopscape with url, url, image, sameAs GitHub/X/LinkedIn/useecho.dev) and `BlogPosting` on posts (headline, description, datePublished, dateModified, image, author referencing the Person `@id`). Add `rel="me"` to the three profile links in `InlineLink`. This is the main lever for name-query entity association and for AI answers attributing the work correctly. (Schema detail belongs to the schema audit; listed here because it is the biggest E-E-A-T gap.)

### Medium

**M1. Homepage is thin on verifiable experience.**
Evidence: ~110 visible words; the experience claim is one sentence ("I build ERPs and multi-tenant platforms with React and Next.js"). `PRODUCT.md` lists true facts not on the page: at Loopscape since 2023, based in Jaú / SP, Brazil.
Fix: add 2-4 concrete lines rather than padding to 500 words: tenure ("since 2023"), location, the kind of problems solved (tables, keyboard-first forms, tenant theming, whatever is true), and one sentence per project on why it exists and its status. `PRODUCT.md` says not to publish metrics without asking, so confirm with the owner before adding numbers. Keep `src/app/index.md/route.ts` in step (its comment says the bio is duplicated there).

**M2. Homepage `<title>` is name-only.**
Evidence: `<title>Luan Fabri</title>` (10 chars). It works for exact-name queries but does not disambiguate the person or say what the site is.
Fix: `Luan Fabri · Front-end engineer` or `Luan Fabri: Front-end engineer (React, Next.js)` (~48 chars). Set it as `title.default` in `layout.tsx`; the `%s · Luan Fabri` template for posts is unaffected. The homepage meta description (147 chars, specific, untemplated) is good as is.

**M3. Markdown twins duplicate HTML pages without a canonical; HTML pages have no canonical either.**
Evidence: `/writing/art-from-a-seed.md`, `/index.md` and `/llms.txt` all return 200 `text/plain` with the same text as the HTML pages and no `Link: rel=canonical` or `X-Robots-Tag` header. `<link rel="alternate" type="text/markdown">` points at them, which makes them discoverable. Neither HTML page sets `alternates.canonical`. Bare `luannzin.com` 308s to `www`, which is correct.
Fix: add `alternates.canonical` (`/` and `/writing/${slug}` with `metadataBase` set). In both markdown route handlers add the response header `Link: <https://www.luannzin.com/writing/${slug}>; rel="canonical"` (and the home URL for `/index.md`). That keeps the files available to agents while consolidating signals on the HTML. `X-Robots-Tag: noindex` is the blunter alternative.

**M4. The post has no visible byline at the top.**
Evidence: the header shows date and "N min read" only; the author appears in the footer card ("Luan Fabri / Front-end engineer at Loopscape") after ~2,000 words.
Fix: add "By Luan Fabri" (linked to `/`) in the date line. Cheap and directly addresses "who wrote this" for raters and extractors.

**M5. Only one post; Writing reads as a stub and authority has nothing to accrue to.**
Evidence: `src/content/writing/` holds one file. See Content strategy below.

**M6. The post's prose doesn't use the terms people and AI systems search with.**
Evidence: across the markdown, "procedural": 0, "deterministic": 0, "PRNG"/"pseudo-random": 0, "Bayer": only inside a code variable, "Next.js": 0. The prose says "a tiny random number generator" and "a four-by-four ordered dither".
Fix: name things once where they first appear, without changing the voice: "a tiny seeded pseudo-random number generator (PRNG), mulberry32"; "a four-by-four ordered (Bayer) dither"; one sentence early on saying it is deterministic procedural generation. Optionally make 2-3 headings more descriptive while keeping the tone, e.g. "From colour to dots: halftone with ordered dithering", "Shading only what moves: caching light and drawing on the GPU", "Touching it: pointer, tap and dice".

### Low

**L1. Numbers written as words lower extractability.** `content_quality.py` density 0.025 on the post. "nine places, eleven times of day, and eleven things", "fifteen frames a second", "eight in a row over 30 milliseconds" mix words and digits. Digits ("9 places, 11 times of day, 11 landmarks", "15 fps") are easier to quote and scan. Fix where the number is the fact; keep words where they are prose.

**L2. No standalone summary sentence at the top of the post.** The opening paragraph is narrative and addresses the reader's pointer ("Move your pointer over the one above"), which is meaningless out of context (the `.md` twin already notes "The live scenes are only on the page"). Fix: let the first or second sentence state the whole technique in one quotable line, e.g. "Each post's cover is generated deterministically from one integer seed: a mulberry32 PRNG picks the place, time of day and landmark, every grid cell is shaded, and the result is drawn as dithered halftone dots on WebGL."

**L3. The code the post quotes can't be checked.** `github.com/luannzin/luannzin.com` returns 404, though code blocks are titled `src/lib/scene.ts`. If the repo can be public, link it from the post ("Source: src/lib/scene.ts on GitHub"); if not, a gist of `scene.ts` gives readers and raters a verification path.

**L4. No contact route.** No email, form or "DMs open on X" line. A single line of contact intent is a trust signal and the conversion the site is for (recruiters, founders per `PRODUCT.md`). `PRODUCT.md` says ask before publishing an email; a "reach me on X or LinkedIn" sentence avoids that.

**L5. No sitemap.xml or robots.txt** (both 404). Not content, but a one-post site gains nothing from absence; `sitemap.ts` / `robots.ts` file conventions are documented in this Next version. Defer details to the technical audit.

**L6. Minor copy issues.** Comma splice in the bio: "I’m a front-end engineer at Loopscape, I build ERPs..." (fix: "...at Loopscape, where I build ERPs..."). Same sentence is mirrored in `src/app/index.md/route.ts`.

**L7. Breadcrumb "Writing" links to `/#writing`, a fragment, not a page.** Fine with one post; add a `/writing` index once there are ~5 posts so the archive has its own crawlable URL and title.

### Info

**I1. Strengths worth keeping.** The post is the best E-E-A-T asset on the site: original, first-hand, technically specific, readable (FRE ~80, FK ~6), well structured (H2/H3 hierarchy, TOC, anchor ids), with a good comparison table, captioned screenshot with descriptive alt text, accessible `aria-label`s on live scenes and the flow diagram, honest attribution, and an accurate `<time datetime>`. Metadata is hand-written (`site_risk: low`).

**I2. Agent-facing assets are ahead of most personal sites.** `/llms.txt`, `/index.md` and per-post `.md` twins served as `text/plain`, linked via `rel="alternate"`, give AI fetchers clean text with author, date and source URL. Pair them with canonicals (M3) and JSON-LD (H3).

**I3. Entrance animations start at `opacity: 0`.** The H1s and role line are rendered by `TextReveal` (motion, JS) with `opacity:0; filter:blur(6px)` in the SSR HTML; body sections use a CSS-only animation. Text is present in HTML for non-JS consumers and Google renders JS, so this is low risk. Confirm the rendered screenshot in Search Console URL Inspection shows the name and title visible.

**I4. Freshness.** Post dated 2026-10-08 (today 2026-10-10). There is no `dateModified` convention yet; add an optional `updated` frontmatter key surfaced as visible text and in `BlogPosting.dateModified` when a post is materially revised. Don't bump dates without real changes.

## AI citation readiness: 64 / 100

| Signal | Status |
|---|---|
| Clean text for agents (llms.txt, .md twins) | Strong |
| Self-contained passages | Good: e.g. "The seed comes from the post's frontmatter, or from a hash of its slug when the post leaves it out..." and the water-reflection paragraph stand alone |
| Tabular facts | Good: the place / time / landmark table |
| Clear heading hierarchy | Good, but headings are evocative rather than descriptive (M6) |
| Entity and attribution markup | Missing (H3) |
| Quotable numbers and named techniques | Weak (L1, M6) |
| One-line summary / definition | Missing (L2) |
| Context-free phrasing | Some passages depend on the live demo ("the one above", "Hover one to set it moving") |

## Content strategy (no keyword volumes; none were measured)

The site's job per `PRODUCT.md` is to let engineers, founders and recruiters judge Luan's work in under a minute. Writing is where experience and expertise become provable, so the strategy is fewer, deeper first-hand posts that each pair with something he built or ships.

1. **One post per project (highest priority).** `better-intl`: why it exists, the typed file-based design, how it compares to established Next.js i18n libraries, migration notes. `echo`: what "learns with you" means technically, decisions and trade-offs. These connect the homepage project list to depth, give external links (READMEs, launch posts) something to point at, and target problem-shaped queries developers actually search.
2. **Day-job expertise, anonymized.** Multi-tenant Next.js (tenant routing, theming, auth boundaries), ERP UI patterns (dense data tables, keyboard-first forms, long-session performance). This is the claim on the homepage ("software people spend their whole workday in") and the strongest Experience signal available. No client data or metrics without approval.
3. **Build notes on this site.** Markdown twins and llms.txt for agents, View Transition morphs between list tile and cover, Next.js 16 cache components and React Compiler in practice. Timely topics where a working, linkable implementation is the differentiator. "Art from a seed" already set the format: real code, live demo, honest credits.
4. **Two pillars, internally linked.** Front-end craft (motion, canvas/WebGL, design engineering) and Next.js architecture/i18n. Each new post links to one or two siblings and to the relevant project; add a `/writing` index once there are ~5 posts.
5. **Cadence over volume.** A steady, sustainable rhythm (e.g. monthly) matters more than a burst. Each post should keep this one's standard: first-hand, specific, with code or a demo.
6. **Optional: Portuguese.** `PRODUCT.md` lists English only, with Portuguese possible later via better-intl. Translated posts would also be a dogfooding case study for better-intl; only worth it if they will be maintained.

## Structured findings (audit-data.json, category: Content Quality)

```json
{
  "category": "Content Quality",
  "scores": { "content_quality": 68, "on_page_seo": 52, "eeat": 59, "ai_citation_readiness": 64 },
  "eeat": { "experience": 74, "expertise": 62, "authoritativeness": 40, "trustworthiness": 62 },
  "metadata_template": { "site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {} },
  "findings": [
    { "id": "H1", "severity": "High", "title": "Post title and meta description carry no searchable terms", "url": "/writing/art-from-a-seed", "evidence": "title 'Art from a seed · Luan Fabri'; description 43 chars 'Every post’s picture, grown from one number'", "fix": "Descriptive title subtitle; 140-155 char description naming PRNG, dithering, halftone, WebGL" },
    { "id": "H2", "severity": "High", "title": "No Open Graph / Twitter card metadata", "url": "site-wide", "evidence": "head has only title, description, alternate, icon; Share component posts bare links", "fix": "metadataBase + openGraph + twitter summary_large_image; per-post OG image" },
    { "id": "H3", "severity": "High", "title": "No Person/BlogPosting JSON-LD, no rel=me", "url": "site-wide", "evidence": "structured_data.block_count 0 on both pages", "fix": "Person with sameAs on /, BlogPosting with author @id on posts; rel=me on profile links" },
    { "id": "M1", "severity": "Medium", "title": "Homepage thin on verifiable experience", "url": "/", "evidence": "~110 visible words vs 500 floor; one-sentence experience claim", "fix": "Add tenure, location, problem areas, one line per project (confirm facts with owner)" },
    { "id": "M2", "severity": "Medium", "title": "Homepage title is name-only", "url": "/", "evidence": "<title>Luan Fabri</title>", "fix": "'Luan Fabri · Front-end engineer'" },
    { "id": "M3", "severity": "Medium", "title": "No canonicals; .md twins duplicate HTML", "url": "/index.md, /llms.txt, /writing/*.md", "evidence": "200 text/plain, no Link rel=canonical or X-Robots-Tag; no alternates.canonical", "fix": "alternates.canonical on HTML; Link rel=canonical header on markdown routes" },
    { "id": "M4", "severity": "Medium", "title": "No byline at top of post", "url": "/writing/art-from-a-seed", "evidence": "header shows date + read time only; author card in footer", "fix": "'By Luan Fabri' linked to / in the date line" },
    { "id": "M5", "severity": "Medium", "title": "Single post", "url": "/", "evidence": "one file in src/content/writing", "fix": "Project posts, anonymized day-job posts, build notes; steady cadence" },
    { "id": "M6", "severity": "Medium", "title": "Prose omits searchable technical terms", "url": "/writing/art-from-a-seed", "evidence": "procedural 0, deterministic 0, PRNG 0, Bayer only in code", "fix": "Name techniques once in prose; make 2-3 headings descriptive" },
    { "id": "L1", "severity": "Low", "title": "Numbers as words", "url": "/writing/art-from-a-seed", "evidence": "information_density 0.025", "fix": "Use digits for factual counts" },
    { "id": "L2", "severity": "Low", "title": "No one-line summary", "url": "/writing/art-from-a-seed", "evidence": "narrative, demo-dependent opening", "fix": "Add a quotable definition sentence in the first paragraph" },
    { "id": "L3", "severity": "Low", "title": "Quoted source not verifiable", "url": "/writing/art-from-a-seed", "evidence": "github.com/luannzin/luannzin.com 404", "fix": "Make repo public or publish scene.ts as a gist and link it" },
    { "id": "L4", "severity": "Low", "title": "No contact route", "url": "/", "evidence": "no email/form/DM line", "fix": "One contact sentence (X/LinkedIn if email is not to be published)" },
    { "id": "L5", "severity": "Low", "title": "No sitemap.xml / robots.txt", "url": "site-wide", "evidence": "both 404", "fix": "sitemap.ts and robots.ts (defer to technical audit)" },
    { "id": "L6", "severity": "Low", "title": "Comma splice in bio", "url": "/", "evidence": "'at Loopscape, I build ERPs'", "fix": "'at Loopscape, where I build ERPs' (also in index.md route)" },
    { "id": "L7", "severity": "Low", "title": "Breadcrumb targets a fragment", "url": "/writing/art-from-a-seed", "evidence": "href='/#writing'", "fix": "Add /writing index at ~5 posts" },
    { "id": "I1", "severity": "Info", "title": "Post is a strong first-hand asset", "url": "/writing/art-from-a-seed", "evidence": "FRE ~80, 0 filler/AI patterns, original code, attribution", "fix": "Keep as the template for future posts" },
    { "id": "I2", "severity": "Info", "title": "Agent-facing markdown twins present", "url": "/llms.txt", "evidence": "llms.txt, index.md, per-post .md", "fix": "Pair with canonicals and JSON-LD" },
    { "id": "I3", "severity": "Info", "title": "H1 starts at opacity 0 until hydration", "url": "site-wide", "evidence": "TextReveal initial opacity:0 blur(6px) in SSR HTML", "fix": "Confirm visible in URL Inspection screenshot" },
    { "id": "I4", "severity": "Info", "title": "No dateModified convention", "url": "/writing/*", "evidence": "frontmatter has date only", "fix": "Optional 'updated' key, shown visibly and in BlogPosting" }
  ]
}
```
