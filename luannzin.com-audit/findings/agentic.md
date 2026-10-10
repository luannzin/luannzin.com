# Agent-readiness audit: www.luannzin.com

Checked 2026-10-10. URLs: `https://www.luannzin.com/` and `https://www.luannzin.com/writing/art-from-a-seed`.
Tools: `lighthouse_agentic.py`, `agentic_check.py`, `agent_ux_check.py` (claude-seo 2.4.2). Vendor facts dated 2026-09-23 (vendor-matrix.md).
`--ua-matrix` was NOT run (no authorization for agent user-agent testing).

## Verdict

The site is already in good agent shape for a 2-page personal site. Nothing is broken. The open items are two 5-minute hygiene files (robots.txt, sitemap.xml) and a handful of things deliberately not worth doing.

## Lighthouse Agentic Browsing

PSI returned HTTP 429 (daily quota, no API key) for both strategies, so the fraction came from the local Lighthouse CLI instead: `npx lighthouse@13.5.0 --only-categories=agentic-browsing` on headless Chrome 154, then parsed with `lighthouse_agentic.py --from-json`. Same audit set as PSI.

| Page | Form factor | Lighthouse | Fraction |
|---|---|---|---|
| `/` | mobile | 13.5.0 | **3/3** |
| `/` | desktop | 13.5.0 | **3/3** |
| `/writing/art-from-a-seed` | mobile | 13.5.0 | **3/3** |

Per-audit status (identical on all three runs):

| Audit | Status |
|---|---|
| agent-accessibility-tree | pass (none of the 33 axe rules fail) |
| cumulative-layout-shift | pass (CLS 0) |
| llms-txt | pass (H1, Markdown links, 1016 bytes) |
| webmcp-form-coverage | not applicable (no forms) |
| webmcp-registered-tools | not applicable (informative, never counted) |
| webmcp-schema-validity | not applicable (no tools) |
| ard-schema | not applicable (no catalog signalled) |

Paths that add a counted audit: only `ard-schema` (publish `/.well-known/ai-catalog.json`). Not recommended: there are no agent resources to list, and a higher N is not a better site. Caveats: the post page was run on mobile only; WebMCP audits depend on the testing browser, but they are moot here because the site has no forms.

## Agent-UX heuristic (separate from the Lighthouse fraction)

| Page | Score | Status |
|---|---|---|
| `/` | 100 | complete |
| `/writing/art-from-a-seed` | 100 | complete |

Accessibility tree: home has 122 nodes, 12 interactive (all named links), 6 landmarks, 0 div-onclick widgets. Post has 2044 nodes, 42 interactive (7 buttons, 35 links, 0 unnamed), 7 landmarks. No input-label problems. Nothing to fix.

## Findings by priority

The tool grades some items higher than I do. "Tool" is the script's label, "Pragmatic" is my rating for this site.

### P2 (worth doing, 5 minutes): no robots.txt (tool: P0 warn)
- Evidence: `/robots.txt` returns 404 (RFC 9309: no restrictions, no stated preference).
- Impact: nothing breaks. Every crawler and agent is allowed. The only loss is that the site states no policy and points to no sitemap.
- Fix: add `src/app/robots.ts` with `rules: { userAgent: "*", allow: "/" }` and `sitemap: "https://www.luannzin.com/sitemap.xml"`. Only add per-bot groups if you want to block training crawlers (a business decision, not a default).
- Skip Content-Signal: it is a Cloudflare policy with an expired IETF draft and no confirmed consumer. Next's `robots.ts` cannot emit it without a custom route handler. Not worth it.

### P2 (worth doing, 5 minutes): no sitemap.xml
- Evidence: `/sitemap.xml` returns 404. `/writing` also 404s, so the home page is the only index of posts.
- Fix: `src/app/sitemap.ts` returning `/` and each `/writing/<slug>` from `getPosts()` (already used by the md routes). Reference it from robots.ts.

### Info (tool: P0 warn, false positive): server rendering
- Evidence: home has 110 words without JS. The tool warns below 150 words, but the 110 words are the entire page (bio, two projects, post list). No JS-shell marker. The post has 2216 words without JS and passes.
- Fix: none.

### P3 (optional): `/writing` returns 404
- Agents or people who trim the post URL land on a 404. A redirect to `/#writing` or a tiny index page fixes it. Skip if you don't care.

### P3 (outside this audit's scope): missing canonical, OG tags, JSON-LD
- Evidence: neither page has `rel="canonical"`, Open Graph tags or JSON-LD. The apex 308-redirects to www, so canonical is low urgency. Article JSON-LD on posts would be the only useful structured data. Belongs in the technical-SEO and schema findings, not here.

## What is already right (keep it)

- Markdown delivery: `/index.md` and `/writing/<slug>.md` return 200 with `text/plain; charset=utf-8`. Both pages carry `<link rel="alternate" type="text/markdown">`. The post twin keeps code fences and states "The live scenes are only on the page". `text/plain` is intentional (ChatGPT's fetcher refuses `text/markdown`); the audit respects that and does not recommend changing it. No source gap: the md routes are statically generated and 404 correctly for unknown slugs.
- llms.txt: `/llms.txt` is a rewrite to `/index.md`, passes the Lighthouse rules, and links to the `.md` twins. `llms-full.txt` is 404, which is fine at this size.
- Real 404s: unknown URLs return 404 (no soft-404 catch-all).
- Header-based negotiation (`Accept: text/markdown`) is not served. Opportunity only: no consumer agent is confirmed to send it (vendor-matrix, 2026-09-23), and the `.md` twins plus alternate links already cover discovery.

## Deliberately not worth doing

| Item | Why skip |
|---|---|
| WebMCP | No forms or transactions to expose. W3C Community Group draft, Chrome origin trial only, WebKit opposes (checked 2026-09-23). |
| `/.well-known/ai-catalog.json` | Nothing to list (no MCP server, A2A agent, skills). ARD spec 1.0 is checked by Lighthouse 13.5 (checked 2026-09-23). |
| api-catalog, oauth-*, agent-card.json, ucp | Only for sites that operate those services. All 404, all correctly not applicable. |
| Web Bot Auth | Agents sign requests; site owners only verify at the edge. Draft `draft-ietf-webbotauth-httpsig-protocol-00` (2026-09-01). |
| `Link:` header for markdown alternate | The `<link>` tag is enough. |

## Access policy (robots.txt 404, so default allow, no stated preference)

- Training (GPTBot, ClaudeBot, Google-Extended, others): not restricted. No robots.txt, so compliant crawlers treat everything as allowed.
- Search (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot): not restricted.
- User-triggered agents (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): not restricted. Several of these generally ignore robots.txt anyway, so robots.txt is a preference signal, not access control.
- Edge behaviour (Vercel WAF or bot protection challenging unverified agents): not tested, since `--ua-matrix` was not authorized. Confirm in Vercel logs if you care.

## Standards status notes (checked 2026-09-23 per vendor-matrix.md)

- WebMCP: W3C Community Group draft, not a standard. Chrome origin trial M149 to M156, no ship milestone. WebKit opposes, Mozilla neutral.
- Content-Signal: Cloudflare CC0 policy (launched 2025-09-24). IETF individual draft expired 2026-04-04. No confirmed Google support.
- ai-catalog.json: Agentic Resource Discovery spec 1.0, checked by Lighthouse 13.5. Early, not widely consumed.
- Web Bot Auth: IETF draft `draft-ietf-webbotauth-httpsig-protocol-00` (2026-09-01).
- Lighthouse Agentic Browsing: labelled under development and subject to change; 13.5.0 is current as of 2026-09-18.
- Markdown for agents: no primary source shows a consumer agent sending `Accept: text/markdown`. No ranking, citation or traffic effect is promised from any item here.

## Structured findings (audit-data.json, AI Search Readiness)

```json
[
  {
    "title": "No robots.txt",
    "severity": "low",
    "description": "/robots.txt returns 404. All crawlers and agents are allowed by default and no AI-usage preference or sitemap is declared. Tool grades this P0; pragmatically P2 for a 2-page site.",
    "recommendation": "Add src/app/robots.ts allowing * and referencing the sitemap. Skip Content-Signal (draft policy, no confirmed consumer)."
  },
  {
    "title": "No sitemap.xml",
    "severity": "low",
    "description": "/sitemap.xml returns 404 and /writing has no index page, so the home page is the only list of posts.",
    "recommendation": "Add src/app/sitemap.ts listing / and each /writing/<slug> from getPosts()."
  },
  {
    "title": "Markdown twins and llms.txt in place (text/plain by design)",
    "severity": "info",
    "description": "/index.md, /llms.txt and /writing/<slug>.md return 200 text/plain, with rel=alternate links on pages. Lighthouse llms-txt passes. text/plain is deliberate for ChatGPT fetcher compatibility.",
    "recommendation": "Keep as is. Do not switch to text/markdown."
  },
  {
    "title": "Agent accessibility tree clean; Lighthouse Agentic Browsing 3/3",
    "severity": "info",
    "description": "Lighthouse 13.5.0 local CLI: 3/3 on home (mobile, desktop) and post (mobile). PSI was rate limited (429). Agent-UX heuristic 100 (complete) on both pages.",
    "recommendation": "No action. WebMCP and ai-catalog.json are opportunities only and not worth it here."
  },
  {
    "title": "/writing returns 404",
    "severity": "info",
    "description": "Trimming a post URL to /writing lands on a 404 page.",
    "recommendation": "Optional: redirect /writing to /#writing."
  }
]
```
