# SXO Findings: luannzin.com

Audit date: 2026-10-10
Pages: `https://www.luannzin.com/` (home) and `https://www.luannzin.com/writing/art-from-a-seed` (post)
Queries analyzed: "Luan Fabri", "luannzin", "seeded generative art javascript", "mulberry32", "better-intl next.js i18n"

**SXO Gap Score (separate from the SEO Health Score):**
- Home, for the brand queries: **45/100**
- Post, for the topic queries: **53/100**

---

## 1. Lead finding: the page types match, but the site does not appear in any of the 5 SERPs

The homepage is the right kind of page for a name search: a person-profile landing page. The post is the right kind of page for a technique search: a technical blog post. The problem is not the format. Search engines cannot match the site to these queries:

- The homepage declares no entity: no Person schema and no sameAs links.
- The site has no sitemap.
- The post never uses the words people search with.
- better-intl and echo have no page on the site at all.

| Query | SERP consensus (taxonomy type) | Site page | Mismatch | Site present? |
|---|---|---|---|---|
| Luan Fabri | 7/9 person/entity profiles (Wikipedia bio of Rodrigo Fabri, LinkedIn "Luan Felipe", businessmap team page, HKW contributor, 2 sports-player pages, trademark owner) = 78% Landing Page (personal-profile variant) | Home (personal profile) | ALIGNED on type. Visibility gap is **CRITICAL** | No (0/9 results are this Luan Fabri) |
| luannzin | 0/9 relevant (Chinese place names, pinyin, novel chapters). No consensus. The engine itself said it "looks like a username" | Home | ALIGNED. Zero competition, yet the site is absent: **CRITICAL** discovery/indexing gap | No |
| seeded generative art javascript | 9/10 AI-skill marketplace listings ("algorithmic-art", p5.js `randomSeed`/`noiseSeed`) = 90% Hybrid; 1 technical deep dive | Post (Blog Post with interactive demos) | **MEDIUM**. The taxonomy default is HIGH. I lowered it because the incumbents are near-duplicate directory blurbs, so a real tutorial is the better intent match. The gap is in vocabulary, not format | No |
| mulberry32 | 9/9 fruit, color, paper and dictionary pages. Google reads the query as the fruit. The engine suggested "mulberry32 PRNG javascript" as a refinement | Post | **CRITICAL** for the bare term, which can't be won and isn't worth chasing. Target the refined long tail instead | No |
| better-intl next.js i18n | 5/9 guide or blog posts (author's TabNews post at #1, intlayer guides), plus comparison pages ("next-i18next vs next-intl vs intlayer"), Next.js docs, a Hack Club project page and bestofjs next-intl | None (one line on home) | **CRITICAL**: no page exists | No. The only first-party asset ranking is a TabNews post by user `luansemz`. Verify that this is the same author |

## 2. Page evidence (rendered via render_page.py, then parse_html.py)

**Home**
- title "Luan Fabri"; H1 "Luan Fabri"; H2 Projects and Writing; 107 words
- No canonical, no OG or Twitter tags, 0 JSON-LD blocks
- Social links (GitHub, X, LinkedIn) are inline text with no `rel="me"`
- Avatar has `alt=""`
- No contact or email link

**Post**
- title "Art from a seed · Luan Fabri"; meta description "Every post's picture, grown from one number"
- About 1,670 words: 9 H2, 3 H3, a table, TypeScript code blocks with copy buttons
- Interactive canvas cover plus demos (dice, seed grid, hover)
- Desktop TOC sidebar and mobile `<details>` TOC; `<time datetime="2026-10-08">`; reading time; visual breadcrumb
- 0 JSON-LD, no OG, no canonical, no dateModified
- The author appears only in the footer card. There is no byline in the header
- 1 static image (`home-tile.png`, with alt text). The cover is canvas only, so crawlers and social cards see no image

**Site-wide**
- `/robots.txt` 404, `/sitemap.xml` 404, `/opengraph-image` 404
- `layout.tsx` has no `metadataBase`, `openGraph` or `alternates.canonical`

**Query terms in the post body**

| Term | Count |
|---|---|
| generative | 0 |
| javascript | 0 |
| PRNG | 0 |
| deterministic | 0 |
| mulberry32 | 2 (one prose mention, one function name) |
| canvas | 3 |
| random | 4 |

## 3. User stories (each one cites a SERP signal)

1. **Recruiter verifying a candidate (Consideration).** As a recruiter who has "Luan Fabri" from a CV, I want to confirm which Luan Fabri this is and see his experience, because the name SERP is full of namesakes. I'm blocked by **entity ambiguity**: nothing on the web ties this site to his LinkedIn or GitHub, and the site does not rank.
   *Source: "Luan Fabri" SERP, 0/9 relevant and 78% profile pages (Wikipedia, LinkedIn, team pages).*
2. **Engineer following a handle (Awareness).** As an engineer who saw @__luannzin or github.com/luannzin, I want his home base, because devs find each other by handle. I'm blocked by a **discovery gap**: "luannzin" returns pinyin and geography pages.
   *Source: "luannzin" SERP, 0/9 relevant; the engine flagged it as a likely username.*
3. **Next.js dev evaluating better-intl (Consideration to Decision).** I want to know whether better-intl is worth adopting over next-intl, because the SERP frames it next to next-intl comparisons and describes it as early-stage. I'm blocked by a **trust gap and comparison fatigue**. The site offers one line: "Typed, file-based i18n for Next.js".
   *Source: intlayer "next-i18next vs next-intl vs intlayer", bestofjs next-intl, and Hack Club "pending review", all in the better-intl SERP.*
4. **Creative coder (Awareness).** I want a reproducible way to seed generative scenes in plain JS or TS without p5.js, because every result is a directory copy of the same p5 skill blurb. I'm blocked by an **information gap**: the post solves exactly this but never says "generative art" or "JavaScript".
   *Source: "seeded generative art javascript" SERP, 9/10 skill listings repeating p5 `randomSeed`/`noiseSeed`.*
5. **Dev looking up mulberry32 (Awareness, wants a quick answer).** I want the function and to know when to use it over `Math.random`, because I need deterministic output. I'm blocked by **technical ambiguity**: the SERP returns the fruit, and the post buries mulberry32 in paragraph 4 with no heading.
   *Source: "mulberry32" SERP, 9/9 non-technical; the engine suggested the "mulberry32 PRNG javascript" refinement.*

## 4. SXO Gap Score

| Dimension | Home | Evidence (home) | Post | Evidence (post) |
|---|---|---|---|---|
| Page Type (15) | 12 | Profile page matches the profile SERP | 9 | Blog post against Hybrid listings and a fruit SERP |
| Content Depth (15) | 6 | 107 words. Has role, employer and stack. No location, experience history or contact. SERP profiles (LinkedIn, team pages) carry those | 11 | Full pipeline with table and code. Missing a what/why for mulberry32 and a "do it yourself" snippet |
| UX Signals (15) | 11 | Name and role readable in under 1 s, single column. H1 is server-rendered at `opacity:0` (TextReveal inline style) and only becomes visible after JS runs | 12 | TOC, date, reading time, live demos, breadcrumb, copy buttons. The poetic headings hide what the post is about |
| Schema (15) | 0 | No Person, WebSite or ProfilePage | 0 | No BlogPosting or BreadcrumbList |
| Media (15) | 4 | Avatar with `alt=""`, a project logo, canvas tile. No OG image | 7 | Excellent interactive canvas, but it is invisible to crawlers and cards. 1 PNG |
| Authority (15) | 5 | Profiles are linked but not declared (no sameAs, no `rel="me"`) | 5 | Author only in the footer, no bio. Credits ascii.rest. No link to the source repo |
| Freshness (10) | 7 | Writing list is live; only 1 post | 9 | Published 2026-10-08, visible `<time>`; no dateModified |
| **Total** | **45** | | **53** | |

## 5. Persona scores

| Persona (page) | Weight | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|---|
| mulberry32 lookup (post) | Low | 10 | 9 | 12 | 6 | 37 | Critical Mismatch |
| OSS evaluator: better-intl and echo (home) | Medium | 8 | 14 | 5 | 14 | 41 | Needs Work |
| Recruiter (home) | High | 16 | 20 | 12 | 8 | 56 | Needs Work |
| Creative coder (post) | Medium | 17 | 13 | 17 | 9 | 56 | Needs Work |
| Engineer peer (home and post) | High | 20 | 19 | 17 | 13 | 69 | Good |

**Score notes, by persona:**
- **mulberry32 lookup:** no heading names mulberry32. The post doesn't say what it is or how it compares to `Math.random` or seedrandom, and doesn't credit its origin.
- **OSS evaluator:** one line per project and no on-site page. No status, version, adoption numbers or comparison. The outbound links do work and open in a new tab.
- **Recruiter:** name, role, employer and stack are all clear. Missing: contact, a résumé or experience timeline, location or timezone, and evidence of outcomes.
- **Creative coder:** the live demos are the strongest proof on the site. Weak points: no repo link for `src/lib/scene.ts`, no starter snippet, and only 1 post with no "next" link.
- **Engineer peer:** there's a GitHub link and a deep post. Missing: an RSS feed, a related or next post, and a source link.

### Weakest high-weight persona: Recruiter (56)
**Top issue:** the site is invisible for the person's own name. A recruiter who does land on it reaches a dead end, with no contact path except going off-site to LinkedIn.

**Fixes:**
- Add Person JSON-LD, sameAs and a sitemap (P1 below).
- Add a contact line on the homepage, e.g. `Email me` (mailto) next to the LinkedIn link.
- Add a one-line location/timezone, e.g. "Based in Brazil, working UTC-3" (wording to be confirmed by the owner).

### Systemic issues
- **Schema is 0/15 on every page.** No entity graph links the home Person, the post author and the off-site profiles.
- **No social metadata anywhere**, even though there is a Share component on every post and AskAI links on every page. Shared URLs render as bare links on LinkedIn, X and Slack. That hurts the recruiter and peer personas most.
- **Action is the lowest dimension overall.** There are no contact, subscribe, related-post or source-code paths.

## 6. Prioritized fixes

1. **CRITICAL: entity and indexing (recruiter and peer personas).**
   - Add JSON-LD to the homepage: `Person` with `name`, `alternateName: "luannzin"`, `jobTitle`, `worksFor: Loopscape`, `url`, `image`, and `sameAs` [github.com/luannzin, linkedin.com/in/luannzin, x.com/__luannzin]. Add `WebSite` and `ProfilePage`.
   - Add `rel="me"` to the social links.
   - Add `src/app/sitemap.ts` and `src/app/robots.ts`.
   - Set `metadataBase` and `alternates.canonical`.
   - Verify the site in Google Search Console and request indexing.
   - Put www.luannzin.com in the GitHub, LinkedIn and X bios so the identity links back from those profiles.
   - Suggested homepage `<title>`: "Luan Fabri: Front-end engineer (React, Next.js)". This separates him from the namesakes.
2. **HIGH: social cards.**
   - Add `openGraph` and `twitter` to the layout and to `generateMetadata` on posts.
   - Add a per-post `opengraph-image.tsx` that renders the post's seed scene to a PNG, or falls back to a static capture such as `home-tile.png`.
3. **HIGH: post vocabulary.**
   - Keep the H1 voice. Change the `<title>` to "Art from a seed: seeded generative art in TypeScript".
   - New meta description: "How one number and the mulberry32 PRNG grow a deterministic, animated halftone scene for every post: the code, the weighted choices, the shading."
   - Name the genre ("generative art") in the first paragraph.
   - Rename the H2 "One number, every choice" to "One number, every choice: seeding mulberry32".
   - Add a 3-line note on why not `Math.random`, and credit mulberry32's origin.
4. **HIGH: post schema.**
   - Add `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author` pointing to the Person `@id`, and `image` set to the OG image.
   - Add `BreadcrumbList` matching the visible "Writing > Art from a seed" breadcrumb.
5. **MEDIUM: better-intl (OSS evaluator).**
   - Publish a post, e.g. "better-intl: typed, file-based i18n for Next.js, and how it differs from next-intl". Include a comparison table, status/version, an install snippet and a link to npm. This matches the guide and comparison format the SERP rewards.
   - Link the TabNews write-up if it is his.
   - On the homepage, add a project status note to the better-intl and echo descriptions.
6. **LOW: post byline and source.**
   - Add "By Luan Fabri" next to the date in the post header.
   - Link the `src/lib/scene.ts` code-block labels to github.com/luannzin/luannzin.com, if the repo is public.
7. **LOW: hidden hero text.** The TextReveal H1 and tagline are server-rendered with an inline `opacity:0`. No-JS fetchers see invisible text, and it can delay LCP. Consider a CSS-only entrance like the existing `enter` class.
8. **LOW: RSS feed.** Add an RSS feed and a "next post" link once there are 2 or more posts.

Cross-skill follow-ups:
- `/seo schema` to generate the Person, BlogPosting and BreadcrumbList blocks.
- `/seo content` for E-E-A-T and the author entity.
- `/seo page` on the homepage for thin content (107 words).
- `/seo local` is not needed: the SERPs showed no local intent.

## 7. Limitations

- **Search data.** WebSearch is not a live Google SERP. No PAA, ads, AI Overview, featured snippet or related-search data was visible, so the user stories rely on result composition and the engine's own query interpretation. I ran 5 searches; "useecho"/echo was not searched.
- **Rendering.** `render_page.py --mode always` fell back to a raw fetch (`mode_used: raw`, no Playwright engine). The pages are server-rendered, so the text is complete, but the canvas scenes, animations and above-the-fold visuals were not assessed.
- **Not available to this audit:** Search Console, index coverage, rankings, CTR or backlink data. "Not present" means absent from this engine's top results, not confirmed as unindexed.
- **Unverified ownership.** I could not confirm that TabNews user `luansemz` is the same person.
- **Publication date.** htmldate reported 2021-10-01 for the homepage; that is likely spurious.
- **Taxonomy fit.** The taxonomy has no "person profile" type. Profile SERPs were mapped to Landing Page (branded/navigational variant).

## 8. Structured findings (audit-data.json, category "Search Experience")

```json
{
  "category": "Search Experience",
  "sxo_gap_score": {"home": 45, "post": 53},
  "findings": [
    {"id": "sxo-entity-absent", "severity": "critical", "page": "/", "title": "Site absent for own name and handle", "evidence": "Luan Fabri: 0/9 relevant; luannzin: 0/9 relevant; no Person schema, no sameAs, no rel=me, no sitemap (404)", "fix": "Person+WebSite+ProfilePage JSON-LD with alternateName and sameAs; rel=me; sitemap.ts/robots.ts; metadataBase+canonical; GSC verify"},
    {"id": "sxo-no-better-intl-page", "severity": "critical", "page": "/", "title": "No on-site page for better-intl", "evidence": "SERP rewards guides/comparisons (intlayer, next-intl); site has a one-line card", "fix": "Publish better-intl vs next-intl post with table, status, install"},
    {"id": "sxo-no-social-cards", "severity": "high", "page": "site-wide", "title": "No OG/Twitter metadata despite Share and AskAI", "evidence": "open_graph {} and twitter_card {} on both pages; /opengraph-image 404", "fix": "openGraph/twitter in layout and generateMetadata; per-post opengraph-image.tsx"},
    {"id": "sxo-post-vocabulary", "severity": "high", "page": "/writing/art-from-a-seed", "title": "Post never uses query vocabulary", "evidence": "generative 0, javascript 0, PRNG 0; title 'Art from a seed'", "fix": "Retitle <title>/meta; name genre in intro; mulberry32 in an H2"},
    {"id": "sxo-post-schema", "severity": "high", "page": "/writing/art-from-a-seed", "title": "No BlogPosting/BreadcrumbList", "evidence": "0 JSON-LD blocks; visual breadcrumb exists", "fix": "BlogPosting with author @id, dates, image; BreadcrumbList"},
    {"id": "sxo-recruiter-dead-end", "severity": "medium", "page": "/", "title": "No contact path or experience detail", "evidence": "107 words; no mailto; no location/history", "fix": "Email link, location/timezone line, experience or CV link"},
    {"id": "sxo-byline-source", "severity": "low", "page": "/writing/art-from-a-seed", "title": "Byline only in footer; no source link", "evidence": "Header shows date + read time only", "fix": "Header byline; link code labels to repo"},
    {"id": "sxo-hidden-hero", "severity": "low", "page": "site-wide", "title": "H1 server-rendered at opacity:0", "evidence": "TextReveal inline style opacity:0;filter:blur(6px)", "fix": "CSS-only entrance animation"}
  ],
  "personas": [
    {"name": "mulberry32 lookup", "page": "post", "score": 37},
    {"name": "OSS evaluator (better-intl/echo)", "page": "home", "score": 41},
    {"name": "Recruiter", "page": "home", "score": 56},
    {"name": "Creative coder", "page": "post", "score": 56},
    {"name": "Engineer peer", "page": "home+post", "score": 69}
  ]
}
```

Generate a PDF report? Use `/seo google report`.
