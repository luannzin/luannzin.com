---
name: Luan Fabri
description: A quiet, text-led dark portfolio where the copy and real projects carry the page.
colors:
  ground: "#161616"
  ink: "#f5f5f5"
  ink-soft: "#b2b2b2"
  ink-muted: "#818181"
  tile: "#1f1f1f"
  hairline: "#242424"
  focus-ring: "#737373"
typography:
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
rounded:
  sm: "6px"
  tile: "10px"
  row: "14px"
  full: "9999px"
spacing:
  hair: "4px"
  pair: "12px"
  line: "16px"
  list: "24px"
  gutter: "24px"
  block: "32px"
  rail: "64px"
  section: "80px"
components:
  inline-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
  project-row:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.row}"
  project-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.tile}"
    size: "44px"
  project-tile-hover:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
  writing-row:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.row}"
  scene-tile:
    rounded: "{rounded.tile}"
    size: "44px"
  scene-figure:
    rounded: "{rounded.row}"
  breadcrumb-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  copy-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  copy-link-hover:
    textColor: "{colors.ink}"
  contents-disclosure:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.row}"
    padding: "12px 16px"
  inline-code:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  code-block:
    backgroundColor: "{colors.tile}"
    typography: "{typography.code}"
    rounded: "{rounded.row}"
    padding: "16px 24px"
  avatar:
    rounded: "{rounded.full}"
    size: "40px"
---

# Design System: Luan Fabri

## Overview

**Creative North Star: "The Quiet Column"**

One narrow column of text on a near-black neutral ground. The copy and the work carry the page; the interface recedes until a link or a row is touched. Hierarchy comes from weight and tone, never from size: everything is Inter at 16px, separated into three ink tiers and set apart by generous vertical space.

The world is brief-pinned. Its form follows the user's four reference sites (Jakub Krehel, Lee Robinson, Emil Kowalski, interfaces.dev); no concept roll ran, seed key "none (pinned)". It is dark only and carries no accent color. Detail lives in small, deliberate touches: hairline underlines, 1.5px stroke icons in currentColor, faint inset rings, one staggered blur-up entrance.

Writing extends the column without changing it. A post is the same column plus one living figure: a seeded halftone scene (time of day, place, landmark) drawn as dithered dots on a canvas. That figure is the only colour in the world, and it is art, not interface. Everything around it (breadcrumb, title, contents, prose, code) stays in the ink tiers at one size.

**Key Characteristics:**
- Single 576px column, top-left aligned; the article figure and the contents rail are the only things allowed outside it.
- One type size (16px); hierarchy by weight (500 vs 400) and ink tier. Code is the one deliberate step down (Geist Mono 14px).
- Neutral greys only in the interface; full colour lives inside the seeded scene art and nowhere else.
- Hairline underlines and inset 1px rings instead of borders and shadows.
- Motion is one staged entrance, 150ms hover state changes, and one shared-element morph from tile to figure.

## Colors

A strictly neutral, near-black palette resolved from the coss UI dark tokens (`.dark` on `<html>`); the CSS custom properties in `src/app/globals.css` are the source, hex values here are their rendered results.

### Neutral
- **Soft Black Ground** (`--background`): page background everywhere.
- **Paper White Ink** (`--foreground`): names, headings, link text, the current breadcrumb crumb, the active contents entry; the only full-strength text.
- **Soft Ink** (`--foreground` at 70%): long-form bio and article prose, so links and bold in it stand forward.
- **Muted Ink** (`--muted-foreground`): role line, project and post descriptions, article meta and scene caption, breadcrumb parent, Copy link at rest, contents entries at rest, list markers, heading "#" anchors, resting tile icons, the hover arrows.
- **Tile Grey** (`--muted`, white at 4%): fill of project icon tiles, inline code, and code blocks.
- **Hairline** (`--border`, white at 6%): inset 1px ring on tiles, inline code, code blocks, and the contents disclosure; also the rule under table rows and the `hr`.
- **Focus Grey** (`--ring`): 2px keyboard focus outline.

### Scene Art
Each post's scene picks its own palette from its seed (a time of day: night, twilight, dusk, dawn, aurora, each with its own near-black sky ground). Those colours are generated per post, not tokens; they exist only on the scene canvas, at full strength in the article figure and in the 44px home tile crop.

### Named Rules
**The No Accent Rule.** The interface has no hue. Emphasis is earned by moving up an ink tier (muted, soft, full), never by color.

**The Art Exception.** The seeded scene is the one place full colour is allowed, and it stays inside the art. Scene colour never reaches text, links, rings, or fills outside the canvas. The seed is never shown; the scene is captioned only by its generated two-word name (time word plus place word, first letter capitalised) in Muted Ink.

**The Three Tiers Rule.** Text uses exactly three tones: full ink for things you can act on or name, soft ink for prose, muted ink for supporting lines. A fourth tone is drift. Syntax highlighting in code is the scoped case: it stays on the same neutral axis (keywords, classes and entities full ink; identifiers, properties and JSX text at 80%; strings at 60%; punctuation and comments muted), never hued.

## Typography

**Body Font:** Inter (with ui-sans-serif, system-ui fallback), via `next/font` as `--font-sans`.
**Mono Font:** Geist Mono (with ui-monospace fallback), via `next/font` as `--font-mono`; applied to `code`, `kbd`, `samp`, `pre`.

**Character:** One neutral grotesque at one size; the page reads like a well-set note, not a poster. Geist Mono is its quiet companion for code, sized down only so it looks the same size.

### Hierarchy
- **Title** (500, 16px, 1.375): the name in the header, section headings ("Projects", "Writing"), the article title (balanced wrap), article h2/h3, "On this page", table headers, prose bold. Weight is the only thing that sets it apart.
- **Body** (400, 16px, 1.625): bio and article prose in Soft Ink, `text-wrap: pretty`, within the 576px column (about 65-70ch).
- **Label** (400, 16px, 1.375): header role line, project and post row name/description pairs, article meta line ("date · N min read"), contents entries; tighter so pairs read as one unit.
- **Code** (400, Geist Mono 14px, 1.7): code blocks at 14px; inline code at 0.875em of its surroundings. Mono runs large, so 14px Geist Mono optically matches 16px Inter. This is a deliberate step, not an off-ramp size.

### Named Rules
**The One Size Rule.** All text is 16px, article titles included (user-confirmed). New sections get hierarchy from weight 500, ink tier, and space, not from a larger size. The only exception is code, set at 14px / 0.875em so it matches Inter optically.

## Layout

A single centered column, `max-width` 576px with 24px side gutters, top-left aligned content. Home: top padding 80px on mobile and 112px from 640px up; bottom padding 96px.

Vertical rhythm on home, as built: avatar to name/role 12px apart horizontally; header to bio 32px; bio paragraphs 16px apart; bio to the next section heading 80px; section heading to its list 16px; list rows 24px apart (the heading sits closer to its list than rows sit to each other, so it reads as the list's owner, not a third row). The 80px break is the section separator; there are no rules or dividers between sections. Writing follows Projects as the next 80px section.

Article, as built: top padding 24px (40px from sm); the breadcrumb row; title and meta 64px below (80px from sm); the scene figure 32px below the meta, its caption 12px under it; the body 48px below the figure; the author footer 80px below the body; bottom padding 96px. Inside the prose: blocks 16px apart, 48px above an h2, 32px above an h3, 12px from a heading to its first block, list items 8px apart, 48px around an `hr`. Headings scroll into place with a 48px top margin; smooth scrolling only under `prefers-reduced-motion: no-preference`.

Breakouts are the only departures from the column:
- **Scene figure:** full-bleed (column gutters cancelled) below sm; inside the column from sm; breaking out 64px each side at lg. Its caption realigns with the column text at each step.
- **Code blocks:** hang 24px into each gutter at every width, so code text lines up with the prose beside it.
- **Contents rail:** from xl, a 240px sticky rail (48px from the top) sits 64px left of the column. Below xl it becomes a disclosure 40px above the prose.

Breakpoints in use: sm 640px, lg 1024px, xl 1280px.

## Elevation & Depth

Flat. There are no drop shadows. Depth is tonal: a tile sits on the ground as a 4% white fill with a 1px inset ring in Hairline (`box-shadow: inset 0 0 0 1px var(--border)`), which reads as an edge rather than a lift. Inline code, code blocks (from sm), and the contents disclosure use the same ring. Images and art (avatar, project marks, scene tile, scene figure from sm) use a 1px white-at-10% outline drawn 1px inside the edge so they never bleed into the ground. On phones the full-bleed code block keeps only top and bottom inset hairlines, and the full-bleed figure carries no outline at all.

Text-level rules are hairlines too: table rows and `hr` take a 1px Hairline rule; blockquotes a 1px ink-at-20% bar at their start edge. These mark text, not containers.

### Named Rules
**The Inset Edge Rule.** Containers are defined by a 1px inset ring, never by an outer shadow or a solid border.

## Shapes

Soft, small corners. Tiles use 10px (the coss `--radius`, 0.625rem); larger containers (scene figure from sm, code blocks from sm, contents disclosure) and row focus outlines use 14px, concentric with the tile at its 4px offset; inline-link, inline-code, breadcrumb, Copy link, contents entry and heading-anchor focus use 6px. The avatar is a full circle. Anything full-bleed on a phone (scene figure, code block) has square corners, because it meets the screen edge. Icons are Central Icons, round-outlined, radius 2, 1.5px stroke, always `currentColor`, never filled glyphs; the set includes arrow-up-right, arrow-right, chevron-right, link and check.

## Components

### Inline Link
Text-weight link that sits inside prose.
- **Style:** full ink over Soft Ink prose, 1px underline in ink at 25%, offset 3px, no wrap.
- **Icon:** optional leading Central icon at 1em, baseline-aligned at -0.125em, 4px gap.
- **Hover / Focus:** underline rises to ink at 60% over 150ms; focus is a 2px Focus Grey outline at 2px offset, 6px corners. Article prose links follow the same treatment.

### Project Row
The signature component: a whole-row link to a piece of work.
- **Structure:** 44px tile, 16px gap, then name (full ink, underlined as above) over description (Muted Ink), both at label leading.
- **Tile:** Tile Grey fill, 10px corners, inset Hairline ring, 20px Central icon in Muted Ink. When a project has its own mark, the mark fills the tile instead (10px corners, 1px white-at-10% outline inset by 1px, like the avatar); a real mark always beats a library glyph.
- **Hover:** tile icon brightens to full ink, underline rises to 60%, and a 14px arrow-up-right fades in beside the name while sliding 2px up-right into place, all 150ms.
- **Focus:** 2px Focus Grey outline at 4px offset with 14px corners.

### Writing Row
The Project Row's sibling for posts, linking within the site.
- **Tile:** the post's own scene, cropped to a square around its landmark (18 dot columns so it reads at 44px), 10px corners, white-at-10% inset outline. The scene is the post's mark, so it follows the real-mark rule. It plays only while its row is hovered or focused, and holds still otherwise.
- **Text:** title (full ink, underlined) over description (Muted Ink).
- **Hover:** underline rises to 60%; a 14px arrow-right fades in sliding 4px from the left (internal link, so not up-right), 150ms. Focus as Project Row.
- **Morph:** the tile is a shared element with the article figure (React `ViewTransition`, `share="morph"`). It grows into the figure over 450ms on `cubic-bezier(0.32, 0.72, 0, 1)`, passing through a 3px blur at 30%. Reduced motion swaps in place.

### Scene Art
The living figure, the world's one exception.
- **Form:** a 2:1 canvas of dithered dots in the seed's full colour, on its own sky ground.
- **Life:** animates at 15fps (clouds, stars, water, beam, lamps) only while on screen. On the article, a mouse pointer carries a small warm light the water reflects, and a tap drops a shooting star in the sky or a ripple on the water (up to 4 at once, each fading over 2.5s).
- **Still:** under reduced motion it draws one frame and stays still; no pointer light, no taps.
- **Label:** the wrapper is `role="img"` with "An animated scene drawn in dots: [name]"; the caption shows the name only.

### Article Breadcrumb
A single row at the top of a post.
- **Left:** "Writing" link in Muted Ink (to full ink on hover, 150ms), a 16px chevron-right in Muted Ink, 6px gaps, then the current title in full ink, truncated to one line.
- **Right:** Copy link, held at the row's end edge.

### Copy Link
A quiet text button with a rolling label.
- **Rest:** "Copy link" plus a 16px link icon, Muted Ink, 6px gap, 4px by 8px padding pulled back into the row so text aligns with the edge, 6px corners.
- **Hover / Press:** full ink over 150ms; presses scale to 0.96.
- **Swap:** on copy the label rolls letter by letter to "Copied" (or "Copy failed") and the icon rolls to check; letters enter from below on a spring (stiffness 460, damping 30, mass 0.55) with 3px blur, 25ms apart, and exit upward in 160ms at half the stagger. It returns to "Copy link" after 2s. A polite live region announces the result. Vendored from beUI Action Swap (`src/components/motion/action-swap.tsx`).

### Heading Anchors
Article h2 and h3 are links to themselves.
- A "#" in Muted Ink hangs 8px into the left gutter, hidden at rest, shown on hover (hover-capable pointers only) and on keyboard focus, 150ms. On touch it stays visible at 40% as the affordance.

### Contents
- **Rail (xl):** "On this page" (weight 500) over an ordered list 16px below; entries 8px apart, h3 entries indented 16px, Muted Ink rising to full ink on hover; the section being read (the last heading past 120px from the top) is full ink.
- **Disclosure (below xl):** a 14px-corner container with an inset Hairline ring; summary row "On this page" (weight 500, 12px by 16px padding) with a 16px chevron-right that rotates 90 degrees when open (200ms). The body grows open to its content height (220ms, `cubic-bezier(0.23, 1, 0.32, 1)`, opacity 160ms) rather than jumping; reduced motion opens instantly.

### Prose
The article body, rendered from markdown, in the three ink tiers.
- **Text:** Soft Ink, pretty wrap; headings, bold, links and table headers in full ink at weight 500 where they carry weight.
- **Lists:** 20px indent, disc or decimal markers in Muted Ink with tabular numerals.
- **Blockquote:** full ink, 16px start padding, 1px ink-at-20% bar.
- **Tables:** full width, tabular numerals, 8px vertical cell padding, 16px end padding, a Hairline rule under every row; no fills, no vertical rules.
- **Inline code:** Geist Mono at 0.875em, full ink, Tile Grey fill, inset Hairline ring, 6px corners, 2px by 6px padding.
- **Code block:** Geist Mono 14px at 1.7, Tile Grey fill, 16px by 24px padding, 2-space tabs, horizontal scroll with a thin ink-at-15% scrollbar, hanging 24px into each gutter. Phones: square corners, top and bottom hairlines only. From sm: 14px corners and a full inset ring. Highlighting per the Three Tiers Rule.

### Author Footer
The article ends on the home header's identity row (40px avatar, name underlined in full ink, role in Muted Ink) as one link back home, 80px below the body; focus 4px offset, 14px corners.

### Avatar
40px circle with a 1px white-at-10% outline inset by 1px; sits 12px left of the name and role.

### Entrance
The name and role are the focal moment: `TextReveal` (`src/components/motion/text-reveal.tsx`, adapted from beUI, uses `motion`) reveals them word by word, each word rising 20% from 6px blur on a spring, 50ms apart; the name starts at 0ms, the role at 150ms. Reduced motion keeps a plain opacity fade. The avatar (0ms), bio (400ms), projects (500ms) and writing (600ms) are CSS blocks (tw-animate-css) that fade in from 4px blur and 12px below over 500ms on `cubic-bezier(0.2, 0, 0, 1)`, only under `prefers-reduced-motion: no-preference`. New sections join at the next 100ms step.

On an article the same grammar runs once: breadcrumb at 0ms, title words (TextReveal) from 100ms, meta at 300ms, caption and article at 400ms, contents rail or disclosure at 500ms. The figure itself does not fade; it arrives by the morph, or is simply present.

### Browser Surfaces
`color-scheme: dark`; text selection is ink at 15% behind full ink; every `:focus-visible` gets a 2px Focus Grey outline. Page titles read "[Post title] · Luan Fabri".

## Do's and Don'ts

### Do:
- **Do** keep every new section inside the 576px column, separated by 80px, with a weight-500 16px heading 16px above its content.
- **Do** use the three ink tiers: full for names and links, 70% for prose, muted for supporting lines.
- **Do** draw icons from Central Icons (round-outlined, radius 2, 1.5px stroke) in currentColor.
- **Do** signal interactivity with the 25% to 60% underline shift and 150ms transitions.
- **Do** gate entrance motion behind reduced-motion and keep it to one staged reveal.
- **Do** keep scene colour inside the canvas, and caption a scene with its generated name only.
- **Do** set code in Geist Mono at 14px (0.875em inline) so it matches Inter 16px optically.
- **Do** let full-bleed elements on phones go square and edge-to-edge; give them 14px corners and an inset edge once they sit inside the column.

### Don't:
- **Don't** introduce an accent color; the interface is neutral by commitment, and the scene art is the only exception.
- **Don't** raise font size for hierarchy; the system is one size, article titles included.
- **Don't** show a post's seed or any technical scene parameter to the reader.
- **Don't** use drop shadows or solid borders on containers; use the 1px inset ring.
- **Don't** ship a light theme; the system is dark only.
