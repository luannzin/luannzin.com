# Schema / Structured Data Audit: luannzin.com

Audited 2026-10-10. Pages: `https://www.luannzin.com/` and `https://www.luannzin.com/writing/art-from-a-seed`.
Stack: Next.js 16 App Router, `cacheComponents: true`, static prerender, hosted on Vercel.

**Schema score: 10 / 100** (0 for markup present; 10 for on-page signals that make rollout trivial).
Projected after the changes below: about 85-90.

---

## 1. Detection

Method: `render_page.py --mode auto` (both pages `mode_used: raw`, `is_spa: false`; article body is already in the raw HTML), then grep of the saved HTML for `application/ld+json`, `itemscope`, `itemtype`, `typeof=`, `vocab=`, `@graph`, `schema.org`.

| Page | JSON-LD | Microdata | RDFa | Verdict |
|---|---|---|---|---|
| `/` | 0 blocks | none | none | No structured data |
| `/writing/art-from-a-seed` | 0 blocks | none | none | No structured data |

Related head metadata found (and not found):

| Signal | `/` | `/writing/art-from-a-seed` |
|---|---|---|
| `<title>` | `Luan Fabri` | `Art from a seed · Luan Fabri` |
| meta description | present | present (`Every post’s picture, grown from one number`) |
| `rel="alternate" type="text/markdown"` | `/index.md` | `/writing/art-from-a-seed.md` |
| `rel="canonical"` | missing | missing |
| `og:*` / `twitter:*` | missing | missing |
| `og:image` / any image file | missing | missing (cover is generated canvas art) |
| Visible breadcrumb | n/a | `Writing (/#writing) > Art from a seed` |
| `<time datetime="2026-10-08">` | n/a | present |

Other: `robots.txt` and `sitemap.xml` both return 404. `llms.txt` returns 200 (`text/plain`).

---

## 2. Findings

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | **High** | No Person / ProfilePage / WebSite on the homepage. For a personal-brand site this is the main entity signal: name, job title, employer and `sameAs` (GitHub, X, LinkedIn) are only in prose. WebSite also drives Google's site-name signal. | Section 4.2 |
| 2 | **High** | No BlogPosting on the post: no machine-readable author, `datePublished`, `headline`. | Section 4.3 |
| 3 | **Medium** | No BreadcrumbList although a visible breadcrumb exists. | Section 4.3 |
| 4 | **Medium** | Post has no image file, so no `image` for BlogPosting and no `og:image`. Google recommends `image` for Article markup, and Discover needs a large (1200 px wide or more) crawlable image. The cover is a runtime canvas, not crawlable. | Section 4.5 |
| 5 | **Medium** | No canonical, Open Graph or Twitter tags. Not schema, but they should agree with `url` / `mainEntityOfPage` in the JSON-LD. | Section 4.6 |
| 6 | **Low** | The visible breadcrumb's first item links to `/#writing` (a fragment of the homepage; there is no `/writing` index). Google ignores fragments, so the item resolves to the homepage. Valid, and it matches the visible UI, so kept as is. | Optional: add a real `/writing` index page later and point item 1 at it. |
| 7 | **Low** | Avatar `https://github.com/luannzin.png` is a 302 redirect to `https://avatars.githubusercontent.com/u/107646613?v=4` (JPEG, 27 KB). Crawlers handle image redirects inconsistently, and the file changes whenever the GitHub avatar does. | Self-host `public/luan.jpg` (or use the final avatars URL) for the schema `image`. |
| 8 | **Low** | No `robots.txt` / `sitemap.xml` (404). Outside schema scope, but they are the cheapest crawl-discovery win. | Next `app/robots.ts` and `app/sitemap.ts` (file conventions are in the bundled docs). |
| 9 | **Info** | No `dateModified` source: frontmatter has only `date`. | Optional `updated:` frontmatter key (4.4). Never fake it. |
| 10 | **Info** | Expectation setting: Person, ProfilePage and WebSite produce no visible SERP feature for a personal site. Value is entity disambiguation, the site-name signal, and cleaner parsing by search and AI systems. BlogPosting supports the Article treatment (title, image, date) and Discover. | n/a |

### Deliberately NOT recommended

- **HowTo**: rich results removed Sept 2023.
- **FAQPage**: Google retired FAQ rich results for all sites on 2026-05-07. No SERP benefit; AI/GEO benefit unconfirmed. Not worth adding.
- **WebSite `SearchAction`**: the sitelinks search box was retired, and the site has no search.
- **Publisher / Organization for the blog**: not required by Google for Article markup; author is enough for a personal blog.
- **Review / AggregateRating / Product-style markup** for echo: no real ratings or offers to mark up.

---

## 3. Recommended types

| Page | Types |
|---|---|
| `/` | `ProfilePage` (mainEntity `Person`) + `WebSite` in one `@graph` |
| `/writing/[slug]` | `BlogPosting` + `BreadcrumbList` in one `@graph` |
| `/` (optional, low value) | `SoftwareApplication` (echo), `SoftwareSourceCode` (better-intl) |

---

## 4. Implementation (Next.js App Router)

The bundled guide (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`) recommends a plain `<script type="application/ld+json">` rendered in `page.js` / `layout.js` (not `next/script`), with `<` replaced by `<` after `JSON.stringify`. The snippets follow that.

### 4.1 One shared file: `src/lib/json-ld.tsx` (new)

```tsx
import { site } from "@/lib/site";

export const personId = `${site}/#person`;

// The one Person entity: full on the home page, referenced as author on posts.
export const person = {
  "@type": "Person",
  "@id": personId,
  name: "Luan Fabri",
  alternateName: "luannzin",
  url: `${site}/`,
  image: "https://github.com/luannzin.png", // better: self-hosted /luan.jpg, see finding 7
  jobTitle: "Front-end engineer",
  description:
    "Front-end engineer building ERPs and multi-tenant platforms with React and Next.js.",
  knowsAbout: ["React", "Next.js"],
  worksFor: {
    "@type": "Organization",
    name: "Loopscape",
    url: "https://loopscape.com.br",
  },
  sameAs: [
    "https://github.com/luannzin",
    "https://x.com/__luannzin",
    "https://linkedin.com/in/luannzin",
  ],
};

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output with "<" escaped, so it cannot close the script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
```

### 4.2 Homepage: `src/app/page.tsx`

Add the import, a module-level constant, and render `<JsonLd>` as the first child of `<main>`.

```tsx
import { JsonLd, person } from "@/lib/json-ld";

const jsonLd = {
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: `${site}/`,
      name: "Luan Fabri",
      alternateName: "luannzin.com",
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${site}/#profile`,
      url: `${site}/`,
      name: "Luan Fabri",
      isPartOf: { "@id": `${site}/#website` },
      dateCreated: "2026-10-08", // first commit; drop if you prefer not to state it
      mainEntity: person,
    },
  ],
};

// inside Home():
<main className="...">
  <JsonLd data={jsonLd} />
  <header ...>
```

`mainEntity` is the full Person inline (not an `@id` reference) because Google's ProfilePage parsing is safest when the Person object sits directly under `mainEntity`.

Optional, low value (no Google rich result; for entity completeness only). Append to the `@graph` above:

```tsx
{
  "@type": "SoftwareApplication",
  name: "echo",
  url: "https://useecho.dev",
  description: "The note taker that learns with you",
  creator: { "@id": person["@id"] },
},
{
  "@type": "SoftwareSourceCode",
  name: "better-intl",
  codeRepository: "https://github.com/luannzin/better-intl",
  description: "Typed, file-based i18n for Next.js",
  author: { "@id": person["@id"] },
},
```

### 4.3 Post: `src/app/writing/[slug]/page.tsx`

Inside `Post()`, after `const url = ...`, and render as the first child of `<main>`.

```tsx
import { JsonLd, person } from "@/lib/json-ld";

const jsonLd = {
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      headline: post.title,
      description: post.description,
      datePublished: post.date, // "2026-10-08": date-only ISO 8601, matches the visible <time>
      dateModified: post.updated ?? post.date, // see 4.4
      inLanguage: "en",
      author: { "@type": "Person", "@id": person["@id"], name: person.name, url: person.url },
      // add ONLY once 4.5 exists; a 404 image URL is worse than none:
      // image: `${url}/opengraph-image`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Writing", item: `${site}/#writing` },
        { "@type": "ListItem", position: 2, name: post.title, item: url },
      ],
    },
  ],
};

// <main ...>
//   <JsonLd data={jsonLd} />
//   <nav aria-label="Breadcrumb" ...>
```

Notes:
- The post renders inside `<Suspense>` (needed for `await params` under `cacheComponents`). The fetch showed the article body is already in the raw HTML (inside the streamed hidden boundary), so a script in the same component is in the raw HTML too. Re-check with the curl command in section 6.
- The breadcrumb mirrors the visible one (two items, no "Home"), as Google expects markup to match the page.
- The author is repeated inline (name + url + `@id`) rather than only referenced, because `@id` references do not resolve across pages.

### 4.4 Optional `updated` frontmatter (honest `dateModified`)

`src/lib/writing.ts` parses flat `key: value` frontmatter, so this is a two-line change:

```ts
// type Post: add
updated?: string;
// parse() return: add
updated: data.updated,
```

Then add `updated: 2026-10-20` to a post's frontmatter only when you really revise it. Until then `post.updated ?? post.date` falls back to the publish date.

### 4.5 Post image (new file: `src/app/writing/[slug]/opengraph-image.tsx`)

The cover is drawn at runtime by `renderer()` onto a canvas, so there is no file to point at. Lowest-effort route: the `opengraph-image` file convention (1200x630 PNG, `og:image` meta added automatically). Simple title card, not the scene art:

```tsx
import { ImageResponse } from "next/og";
import { getPost } from "@/lib/writing";

export const alt = "Article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: "#0a0a0a", color: "#fafafa", padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.1 }}>{post?.title}</div>
        <div style={{ fontSize: 32, color: "#a1a1aa" }}>Luan Fabri · luannzin.com</div>
      </div>
    ),
    size,
  );
}
```

Not built or run here (read-only audit): run `next build` to confirm it prerenders under `cacheComponents`. Next appends a hash to the `og:image` URL it emits; the unhashed `${url}/opengraph-image` path still serves the image, so it is fine for the JSON-LD `image`.

Ceiling: a title card. To show the real scene art, render the `renderer()` frame to a PNG at build time and serve that instead (more work, only worth it if share previews matter).

Google image guidance for `image`: crawlable, indexable URL, at least 50K pixels, ideally in 16:9, 4:3 and 1:1 (a single 1200x630 is accepted).

### 4.6 Adjacent metadata (keep URLs consistent with the JSON-LD)

```ts
// layout.tsx metadata: add
metadataBase: new URL(site),
alternates: { canonical: "/", types: { "text/markdown": `${site}/index.md` } },
openGraph: { type: "website", siteName: "Luan Fabri" },

// writing/[slug]/page.tsx generateMetadata: add
alternates: { canonical: `${site}/writing/${post.slug}`, types: { ... } },
openGraph: { type: "article", publishedTime: post.date, authors: ["Luan Fabri"] },
```

---

## 5. Generated JSON-LD (what the pages will render)

### 5.1 `/` (home)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.luannzin.com/#website",
      "url": "https://www.luannzin.com/",
      "name": "Luan Fabri",
      "alternateName": "luannzin.com",
      "inLanguage": "en"
    },
    {
      "@type": "ProfilePage",
      "@id": "https://www.luannzin.com/#profile",
      "url": "https://www.luannzin.com/",
      "name": "Luan Fabri",
      "isPartOf": { "@id": "https://www.luannzin.com/#website" },
      "dateCreated": "2026-10-08",
      "mainEntity": {
        "@type": "Person",
        "@id": "https://www.luannzin.com/#person",
        "name": "Luan Fabri",
        "alternateName": "luannzin",
        "url": "https://www.luannzin.com/",
        "image": "https://github.com/luannzin.png",
        "jobTitle": "Front-end engineer",
        "description": "Front-end engineer building ERPs and multi-tenant platforms with React and Next.js.",
        "knowsAbout": ["React", "Next.js"],
        "worksFor": {
          "@type": "Organization",
          "name": "Loopscape",
          "url": "https://loopscape.com.br"
        },
        "sameAs": [
          "https://github.com/luannzin",
          "https://x.com/__luannzin",
          "https://linkedin.com/in/luannzin"
        ]
      }
    }
  ]
}
```

### 5.2 `/writing/art-from-a-seed`

(Includes `image`, which should be added only once 4.5 is deployed.)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://www.luannzin.com/writing/art-from-a-seed#article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.luannzin.com/writing/art-from-a-seed"
      },
      "url": "https://www.luannzin.com/writing/art-from-a-seed",
      "headline": "Art from a seed",
      "description": "Every post’s picture, grown from one number",
      "datePublished": "2026-10-08",
      "dateModified": "2026-10-08",
      "inLanguage": "en",
      "image": "https://www.luannzin.com/writing/art-from-a-seed/opengraph-image",
      "author": {
        "@type": "Person",
        "@id": "https://www.luannzin.com/#person",
        "name": "Luan Fabri",
        "url": "https://www.luannzin.com/"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.luannzin.com/writing/art-from-a-seed#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Writing",
          "item": "https://www.luannzin.com/#writing"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Art from a seed",
          "item": "https://www.luannzin.com/writing/art-from-a-seed"
        }
      ]
    }
  ]
}
```

---

## 6. Validation

Checklist applied to the two blocks above. A script extracted both blocks from this file and checked: valid JSON, https `@context`, allowed types only (no HowTo/FAQPage/deprecated), 23 URLs all absolute https, `date*` values ISO 8601, no placeholder text, ProfilePage/BlogPosting/BreadcrumbList required and recommended fields present, and headline/date match the live page. Result: 0 errors. (This is a structural check, not Google's validator; run the tools below after deploy.)

- `@context` is `https://schema.org` (https, not http): pass
- All `@type` values valid and none deprecated (WebSite, ProfilePage, Person, Organization, BlogPosting, WebPage, BreadcrumbList, ListItem): pass
- Google Article properties: all recommended ones present (`author.name`, `author.url`, `datePublished`, `dateModified`, `headline`, `image`); there are no required ones: pass
- Google ProfilePage: `mainEntity` is a Person with `name`; recommended `image`, `sameAs`, `description`, `dateCreated` present (`dateModified` omitted on purpose, see below): pass
- BreadcrumbList: at least 2 ListItems, each with `position`, `name`, `item`: pass
- No placeholder text, all URLs absolute, dates ISO 8601: pass
- Content matches visible page content (title, date, breadcrumb, job title, links): pass

Not included on purpose: `ProfilePage.dateModified` (no honest source; a build-time timestamp would change every deploy), `publisher`, `wordCount`.

After deploying, verify:

```bash
curl -s https://www.luannzin.com/ | grep -c 'application/ld+json'                          # expect 1
curl -s https://www.luannzin.com/writing/art-from-a-seed | grep -c 'application/ld+json'    # expect 1
```

Then run both URLs through the Rich Results Test (https://search.google.com/test/rich-results) and the Schema Markup Validator (https://validator.schema.org/). Expect Rich Results Test to report no eligible rich result for Person/WebSite; that is normal. Profile page and Breadcrumb should show as detected.

Optional typing: `schema-dts` (`WithContext<BlogPosting>`) is not installed; add it only if you want compile-time checks.
