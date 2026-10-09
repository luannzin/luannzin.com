---
version: 1
slug: "src-app-writing-slug-page-tsx"
primary_target: "src/app/writing/[slug]/page.tsx"
related_targets: ["src/app/page.tsx","src/components/scene-art.tsx","src/lib/scene.ts"]
---

# Writing article (src/app/writing/[slug]/page.tsx)

Scope: one markdown post per route (`src/content/writing/*.md`), plus the Writing list on the home page. Visitor mode: Read. The reader came to understand one idea; the world owns the frame (breadcrumb, art figure, contents rail), the column stays calm.

Audience: same visitors as home, now reading. Job: read the post, jump between sections, share the link. Proof: the seeded art itself, live. Constraints: English, dark only, Central-style icons, coss tokens, One Size Rule (title stays 16px, user-confirmed), seeded full-colour scene allowed in the art only (user-confirmed: seeded colour, then upgraded to ascii.rest-grade scenes; no seed shown, a generated scene name instead), markdown source files only.

## Direction contract

THESIS: A post is the Quiet Column plus one living figure grown from its seed; it refuses the cover-image hero, big display title, and sidebar-heavy docs chrome.

OWN-WORLD: Home's world unchanged (near-black ground, three ink tiers, Inter 16px, hairline underlines, inset 1px rings). One exception: the art figure, a seeded halftone scene (time of day, place, landmark) drawn as dithered dots in full colour on a canvas, 2:1, 14px corners with a white-10% inset outline from sm up and full-bleed with square corners and no outline on phones, captioned with its generated two-word name. Copy link swaps its label letter by letter (beUI Action Swap cascade) with a rolling icon; the phone contents disclosure grows open (::details-content block-size). Code in Geist Mono 14px, highlighted in the ink tiers only.

STORY: Reader lands, sees where they are (Writing > title) and can copy the link, reads title and date, meets the moving picture and stirs it, scans the contents, reads, jumps by "#" anchors, ends at the author row that leads home.

FIRST VIEWPORT: Breadcrumb row 40px from top with Copy link at its right edge; title and meta 80px below; the 2:1 scene breaking out 64px each side at lg; the scene's name under it in muted ink; contents rail at xl 64px left of the column, sticky.

FORM: Extension of the pinned home world (Read surface inside an established world). No concept roll; seed key: none (pinned). Signature interaction: the home tile morphs into the article figure (React ViewTransition, share="morph"), and the scene animates (clouds, stars, water, beam, lamps), the pointer carries a small warm light that the water reflects, and a tap drops a shooting star (sky) or a ripple (water).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
