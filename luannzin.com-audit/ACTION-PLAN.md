# Action Plan: luannzin.com

Health score 58/100. There are no Critical issues. Order follows dependencies: `metadataBase` comes before canonicals, OG and sitemap URLs; the Person `@id` before BlogPosting `author`; the OG image before BlogPosting `image`; and deploying the sitemap before submitting it.

Each item lists:
- **Why:** the first-principle reason it matters.
- **Unblocks / Needs:** what it depends on and what it unblocks.
- **Failed if:** how you'd know it didn't work.
- **Watch:** a leading indicator you can check without rerunning the audit.

## Phase 1: Foundations (Week 1, about 2 hours)

### 1. `metadataBase` plus per-page canonicals (High)
- **Do:** In `src/app/layout.tsx`, add `metadataBase: new URL(site)`. In `src/app/page.tsx`, export `metadata` with `alternates: { canonical: "/", types: { "text/markdown": "/index.md" } }`. In the post's `generateMetadata`, set `alternates: { canonical: \`/writing/${slug}\`, types: {...} }`. Don't set a canonical in the layout.
- **Why:** Next.js can't resolve absolute URLs for canonical or OG tags without a base. Four text/plain duplicates exist, and nothing tells crawlers which URL is the master copy.
- **Unblocks:** items 3, 6, 7 and 8.
- **Failed if:** `curl -s https://www.luannzin.com/writing/art-from-a-seed | grep canonical` prints nothing, or prints a relative URL. Also failed if the 404 page shows a canonical tag.
- **Watch:** Search Console › URL Inspection › "Google-selected canonical" equals the user-declared one.

### 2. `src/app/robots.ts` and `src/app/sitemap.ts` (High)
- **Do:** robots allows `*` and has `sitemap: \`${site}/sitemap.xml\``. The sitemap lists `site` plus `getPosts().map(p => ({ url: \`${site}/writing/${p.slug}\`, lastModified: p.date }))`. Skip Content-Signal.
- **Why:** this is a brand-new domain with almost no inbound links. A sitemap is the fastest guaranteed discovery path, and the robots file is where crawlers look for it.
- **Unblocks:** item 4. **Needs:** item 1 for consistent URLs.
- **Failed if:** either URL returns anything other than 200 with an XML or plain-text content type.
- **Watch:** the Search Console Sitemaps report shows "Success" with 2 discovered URLs.

### 3. `Link: rel="canonical"` headers on the Markdown twins (Medium)
- **Do:** In `next.config.ts`, add `async headers()` with these source → canonical header pairs:
  - `/index.md` → `Link: <https://www.luannzin.com/>; rel="canonical"`
  - `/llms.txt` → the same header as `/index.md`
  - `/writing/:slug.md` → `Link: <https://www.luannzin.com/writing/:slug>; rel="canonical"`

  Check that the `:slug` substitution works in header values on a preview deploy.
- **Why:** text/plain files can be indexed. A canonical keeps them readable by AI tools without competing with the HTML pages.
- **Needs:** item 1.
- **Failed if:** `curl -sI https://www.luannzin.com/writing/art-from-a-seed.md | grep -i '^link'` is empty, or shows a literal `:slug`.
- **Watch:** Search Console › Pages › "Alternate page with proper canonical tag" lists the `.md` URLs, if they get crawled at all.

### 4. Deploy, then submit to Google Search Console and Bing Webmaster Tools (High)
- **Do:** Verify the www domain with a DNS TXT record on the domain property. Submit `sitemap.xml`. Request indexing for `/` and the post. Import the property into Bing Webmaster Tools.
- **Why:** Bing's index feeds ChatGPT Search and Copilot. Waiting for organic discovery on a two-day-old domain costs weeks.
- **Needs:** items 1–2 deployed.
- **Failed if:** URL Inspection still says "URL is not on Google" 14 days after the request. If so, look for crawl errors before changing anything else.
- **Watch:** a `site:luannzin.com` search returns 2 results. Search Console shows impressions for "luan fabri".

### 5. Home title and off-site identity (High, about 20 minutes)
- **Do:**
  - Change the title default in `layout.tsx` to "Luan Fabri · Front-end engineer", or set it in `page.tsx`.
  - On GitHub, set the profile name to "Luan Fabri" and the website to `https://www.luannzin.com`.
  - Add `author` and `homepage` to better-intl's `package.json`, and publish a patch release.
  - Point LinkedIn and X website fields at the site.
  - Add `rel="me"` to the GitHub, X and LinkedIn links in `page.tsx` (`InlineLink` accepts a `rel` prop).
- **Why:** search engines can't tie "Luan Fabri", "luannzin" and this domain together today. Consistent names and links on several sites are how a person entity gets recognised.
- **Unblocks:** item 6 (`sameAs` points to the profiles this step updates).
- **Failed if:** 6–8 weeks after Phase 1, a "Luan Fabri" search still shows namesakes and none of your profiles.
- **Watch:** the GitHub profile shows the site link, and npm shows the homepage.

## Phase 2: High-impact improvements (Weeks 2–3)

### 6. JSON-LD (High)
- **Do:** Create `src/lib/json-ld.tsx` with a shared `person` object (`@id` `${site}/#person`) and a `<JsonLd>` component that escapes `<` as `<`.
  - Home: a `@graph` with `WebSite` and a `ProfilePage` whose `mainEntity` is the person.
  - Post: a `@graph` with `BlogPosting` (author `{ "@id": ".../#person" }`, `datePublished`, `image` from item 7) and a two-item `BreadcrumbList`.
  - The full code is in `findings/schema.md`.
- **Why:** this is the machine-readable statement of who wrote what. Google, Bing and AI systems use it to resolve the entity, even without a visible rich result.
- **Needs:** items 1 and 5, and item 7 for `image`.
- **Failed if:** the Rich Results Test or validator.schema.org reports errors, or the `@id` differs between the two pages.
- **Watch:** Search Console › Enhancements shows no structured-data errors.

### 7. Open Graph, Twitter and OG images (High)
- **Do:**
  - Add `openGraph` and `twitter: { card: "summary_large_image" }` to the layout defaults. Override them in the post's `generateMetadata` with `type: "article"` and `publishedTime`.
  - Add `src/app/opengraph-image.tsx` and `src/app/writing/[slug]/opengraph-image.tsx` (`ImageResponse` title cards).
  - Run `next build` to confirm they prerender with `cacheComponents`.
- **Why:** the site is built to be shared (Share and Ask AI buttons), but every share today renders as a bare URL.
- **Needs:** item 1.
- **Failed if:** LinkedIn Post Inspector or opengraph.xyz shows no image, or `/writing/art-from-a-seed/opengraph-image` returns 404.
- **Watch:** shares on LinkedIn and X show a card. Vercel Analytics shows referrals from linkedin.com and t.co.

### 8. Ship the post HTML visible (High)
- **Do:** Read `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md` first. Then, in `src/app/writing/[slug]/page.tsx`, await `params` outside the `<Suspense>` (or remove the wrapper) and add `export const dynamicParams = false`. Unknown slugs are already `notFound()`.
- **Why:** every slug is prerendered, yet the whole page ships hidden and only appears after a script runs. It's blank without JS, and mobile lab LCP is about 4.1 s.
- **Failed if:** `curl -s https://www.luannzin.com/writing/art-from-a-seed | grep 'hidden id="S:'` still matches, or `next build` errors about uncached data outside Suspense.
- **Watch:** mobile Lighthouse on the post shows LCP under 2.5 s and FCP near the home page's 0.22 s.

### 9. Post title, description and wording (High)
- **Do:**
  - Give the post a separate SEO title, e.g. a `seoTitle` frontmatter key used only in `generateMetadata`, so the H1 stays as it is.
  - Write a 140–155 character description naming seeded generative art, mulberry32, Bayer dithering and WebGL.
  - Add a 2–3 sentence summary at the top that states the technique.
  - Name each technique once in the prose, and make 2–3 headings descriptive.
- **Why:** a page can't rank for words it never uses. "generative", "PRNG" and "javascript" each appear 0 times today.
- **Failed if:** after indexing, Search Console shows no impressions for any "seeded", "generative" or "mulberry32" query within 6 weeks.
- **Watch:** Search Console › Performance › Queries for the post URL.

### 10. CSS-first entrance animations (Medium)
- **Do:**
  - Make `TextReveal` render visible text and move the start state into CSS behind `@media (prefers-reduced-motion: no-preference)`.
  - Drop the blur from `enter` in `src/lib/classes.ts`, and cap delays on content above the fold.
  - Self-host the avatar.
- **Why:** the H1 and tagline exist in HTML but stay invisible until JS hydrates, which costs no-JS readers, screenshot crawlers and LCP.
- **Failed if:** the JS-disabled screenshot still hides the name and role.
- **Watch:** Lighthouse "Avoid non-composited animations" count goes from 12–15 to 0.

## Phase 3: Content and authority (Month 2)

### 11. Homepage depth and contact (Medium)
Add 3–5 true facts to the homepage: problems you solve, years of experience, location or timezone, and an email link. Mirror them in `index.md/route.ts` and the `llms.txt` summary line. Fix the comma splice ("at Loopscape, where I build").
- **Failed if:** the homepage is still under about 250 words.
- **Watch:** contact emails arrive, and recruiter traffic shows up on LinkedIn.

### 12. Publish 2–3 posts (Medium)
Ordered by SXO gap:
1. **"better-intl vs next-intl"**: a comparison table, project status and install steps. This is the biggest page gap.
2. **echo build notes.**
3. **Lessons from multi-tenant Next.js and ERP interfaces**, with client details removed.

Cross-link the posts. Add a `/writing` index (or a redirect to `/#writing`) once there are about 5 posts.
- **Failed if:** the posts get no impressions 8 weeks after publishing.
- **Watch:** Search Console impressions grow week over week, with non-brand queries appearing.

### 13. JS weight (Medium)
Use a static thumbnail instead of a live WebGL scene in the home writing list. Lazy-init canvases below the fold on the post. Switch to `LazyMotion` with `m` components.
- **Failed if:** mobile TBT on the post stays above 600 ms.
- **Watch:** Lighthouse TBT, and INP in CrUX once the site has traffic.

### 14. Hygiene (Low)
- Security headers in `headers()`: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- `src/app/icon.png` and `apple-icon.png`, replacing the GitHub-hosted favicon.
- `src/app/not-found.tsx` (fixes the two titles).
- A "By Luan Fabri" byline in the post header.
- `tabindex="0"` on scrollable `<pre>` elements.
- Optionally, redirect `/writing/:slug/md` to `/writing/:slug.md`. Test that the existing rewrite still serves after this change.

### 15. Off-site presence (Medium)
Share the post on r/generative, HN and dev.to. Put a "by Luan Fabri" link in the useecho.dev footer.
- **Watch:** referral traffic in Vercel Analytics, and mentions that link to the site.

## Phase 4: Monitoring (ongoing)

- After Phase 1 deploys, run `/seo drift baseline https://www.luannzin.com/`. Run `/seo drift compare` after each larger change.
- Weekly: check the Search Console Pages, Sitemaps and Performance reports.
- After 4–6 weeks of traffic, configure a Google API key (`google_auth.py --setup`) so the next audit uses CrUX field data and INP instead of lab-only numbers.
- Re-run `/seo audit` once Phases 1–2 ship. Target score: 80 or higher.
