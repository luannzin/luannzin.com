---
name: Luan Fabri
description: A quiet, text-led dark portfolio where the copy and real projects carry the page.
colors:
  ground: "#161616"
  ink: "#f5f5f5"
  ink-soft: "#b2b2b2"
  ink-muted: "#818181"
  tile: "#1f1f1f"
  well: "#1c1c1c"
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
  mono-label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
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
    backgroundColor: "{colors.well}"
    typography: "{typography.code}"
    rounded: "{rounded.row}"
    padding: "12px 24px 16px"
  code-header:
    textColor: "{colors.ink-muted}"
    typography: "{typography.mono-label}"
    padding: "12px 24px 0"
  code-badge:
    backgroundColor: "#323232"
    textColor: "{colors.ink}"
    rounded: "4px"
    size: "16px"
  code-copy:
    textColor: "{colors.ink-muted}"
    rounded: "8px"
    size: "28px"
  code-copy-hover:
    textColor: "{colors.ink}"
  flow-node:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.row}"
    padding: "8px"
  flow-node-lit:
    backgroundColor: "#262626"
  flow-icon:
    backgroundColor: "#242424"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    size: "36px"
  flow-icon-lit:
    backgroundColor: "#323232"
    textColor: "{colors.ink}"
  flow-label:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
  frame:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.row}"
    padding: "40px"
  frame-image:
    rounded: "{rounded.tile}"
  scene-card:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.tile}"
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

Articles also carry five richer blocks, all authored in markdown and rendered to static HTML at build time: a code box with a file header, a flow diagram, a framed image, a gallery of live scenes, and a scene roller. They stay in the same neutral tiers; the gallery and the roller are the Art Exception repeated, not a new one. The few parts that need the client (copy buttons, live scenes, the roller's button) mount into placeholders the HTML leaves.

**Key Characteristics:**
- Single 576px column, top-left aligned; the article figure, framed images, scene galleries, scene rollers, code boxes and the contents rail are the only things allowed outside it.
- One type size (16px); hierarchy by weight (500 vs 400) and ink tier. Code is the one deliberate step down (Geist Mono 14px).
- Neutral greys only in the interface; full colour lives inside the seeded scene art and nowhere else.
- Hairline underlines and inset 1px rings instead of borders and shadows.
- Motion is one staged entrance, 150ms hover state changes, presses that dip to 0.96 on a strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`, the `press` class in `src/lib/classes.ts`), and one shared-element morph from tile to figure.

## Colors

A strictly neutral, near-black palette resolved from the coss UI dark tokens (`.dark` on `<html>`); the CSS custom properties in `src/app/globals.css` are the source, hex values here are their rendered results.

### Neutral
- **Soft Black Ground** (`--background`): page background everywhere.
- **Paper White Ink** (`--foreground`): names, headings, link text, the current breadcrumb crumb, the active contents entry; the only full-strength text.
- **Soft Ink** (`--foreground` at 70%): long-form bio and article prose, so links and bold in it stand forward.
- **Muted Ink** (`--muted-foreground`): role line, project and post descriptions, article meta and scene caption, breadcrumb parent, Share and Ask AI at rest, contents entries at rest, list markers, heading "#" anchors, resting tile icons, the hover arrows.
- **Tile Grey** (`--muted`, white at 4%): fill of project icon tiles, inline code, and flow diagram nodes.
- **Well Grey** (white at 2.5%): the recessed fill behind code boxes and framed images; a shade quieter than Tile Grey so the content inside, not the box, is what reads.
- **Hairline** (`--border`, white at 6%): inset 1px ring on tiles, inline code, code boxes, framed images, flow nodes, flow icon tiles and arrow labels, and the contents disclosure; also the rule under table rows and the `hr`.
- **Focus Grey** (`--ring`): 2px keyboard focus outline.

### Scene Art
Each post's scene picks its own palette from its seed (a time of day: night, twilight, dusk, dawn, aurora, alpenglow, plum dusk, lanterns, rain, storm, or deep water, each with its own near-black ground; the place picked first decides which times it can have). Those colours are generated per post, not tokens; they exist only on the scene canvas, at full strength in the article figure and in the 44px home tile crop. Each dot's colour is pushed away from its own grey before it is drawn, so the art reads vivid while whites and greys stay neutral.

### Named Rules
**The No Accent Rule.** The interface has no hue. Emphasis is earned by moving up an ink tier (muted, soft, full), never by color.

**The Art Exception.** The seeded scene is the one place full colour is allowed, and it stays inside the art. Scene colour never reaches text, links, rings, or fills outside the canvas. The seed is never shown; the scene is captioned only by its generated two-word name (time word plus place word, first letter capitalised) in Muted Ink.

**The Three Tiers Rule.** Text uses exactly three tones: full ink for things you can act on or name, soft ink for prose, muted ink for supporting lines. A fourth tone is drift. Syntax highlighting in code is the scoped case: it stays on the same neutral axis (keywords, classes and entities full ink; identifiers, properties and JSX text at 80%; strings at 60%; punctuation and comments muted), never hued. Code line numbers are the other scoped case: gutter marks at ink 28%, below muted, because they are a ruler, not text.

**The Lit Node Rule.** Inside article blocks, emphasis is a step up the same neutral axis, never a hue. A lit flow node takes a stronger fill (ink at 7%) and ring (ink at 18%), and its icon goes to full ink on an ink-at-12% tile; a marked code line takes a full-width ink-at-6% band.

## Typography

**Body Font:** Inter (with ui-sans-serif, system-ui fallback), via `next/font` as `--font-sans`.
**Mono Font:** Geist Mono (with ui-monospace fallback), via `next/font` as `--font-mono`; applied to `code`, `kbd`, `samp`, `pre`.

**Character:** One neutral grotesque at one size; the page reads like a well-set note, not a poster. Geist Mono is its quiet companion for code, sized down only so it looks the same size.

### Hierarchy
- **Title** (500, 16px, 1.375): the name in the header, section headings ("Projects", "Writing"), the article title (balanced wrap), article h2/h3, "On this page", table headers, prose bold. Weight is the only thing that sets it apart.
- **Body** (400, 16px, 1.625): bio and article prose in Soft Ink, `text-wrap: pretty`, within the 576px column (about 65-70ch).
- **Label** (400, 16px, 1.375): header role line, project and post row name/description pairs, article meta line ("date · N min read"), contents entries; tighter so pairs read as one unit.
- **Code** (400, Geist Mono 14px, 1.7): code blocks at 14px; inline code at 0.875em of its surroundings. Mono runs large, so 14px Geist Mono optically matches 16px Inter. This is a deliberate step, not an off-ramp size.
- **Mono Label** (400, Geist Mono 14px, 1.5): the code box header (file name) and all flow diagram text (node titles at 500 in full ink, notes and arrow labels in Muted Ink). The code step at a tighter leading, for one-line labels.
- **Language badge** (600, Geist Mono 9px, in a 16px tile): not text but a mark, treated as an icon and hidden from assistive tech; the file name beside it carries the meaning. No other text goes below 14px.

### Named Rules
**The One Size Rule.** All text is 16px, article titles included (user-confirmed). New sections get hierarchy from weight 500, ink tier, and space, not from a larger size. The only exception is code, set at 14px / 0.875em so it matches Inter optically.

## Layout

A single centered column, `max-width` 576px with 24px side gutters, top-left aligned content. Home: top padding 80px on mobile and 112px from 640px up; bottom padding 96px.

Vertical rhythm on home, as built: avatar to name/role 12px apart horizontally; header to bio 32px; bio paragraphs 16px apart; bio to the next section heading 80px; section heading to its list 16px; list rows 24px apart (the heading sits closer to its list than rows sit to each other, so it reads as the list's owner, not a third row). The 80px break is the section separator; there are no rules or dividers between sections. Writing follows Projects as the next 80px section.

Article, as built: top padding 24px (40px from sm); the breadcrumb row; title and meta 64px below (80px from sm); the scene figure 32px below the meta, its caption 12px under it; the body 48px below the figure; the author footer 80px below the body; bottom padding 96px. Inside the prose: blocks 16px apart, 48px above an h2, 32px above an h3, 12px from a heading to its first block, list items 8px apart, 48px around an `hr`. Headings scroll into place with a 48px top margin; smooth scrolling only under `prefers-reduced-motion: no-preference`.

Article blocks get more air than paragraphs: 24px above and below a code box, 32px above and below a flow diagram, a framed image, or a scene gallery.

Breakouts are the only departures from the column:
- **Scene figure:** full-bleed (column gutters cancelled) below sm; inside the column from sm; breaking out 64px each side at lg. Its caption realigns with the column text at each step.
- **Code boxes:** full-bleed on phones (the 24px gutters cancelled); from sm they hang 24px into each gutter as a rounded box, so code text lines up with the prose beside it.
- **Framed images:** full-bleed on phones, inside the column from sm, breaking out 64px each side at lg like the scene figure; the caption realigns with the column text at each step.
- **Scene galleries:** two columns at every width (20px between rows, 12px between columns), inside the column on phones, breaking out 64px each side at lg with 16px columns.
- **Scene rollers:** placed like a framed image: full-bleed on phones, inside the column from sm, breaking out 64px each side at lg; the caption row realigns with the column text at each step.
- **Flow diagrams:** stay in the column. From sm, two nodes per row with a 64px arrow track between them, and a turn connector (40px on phones, 56px from sm) leading down to the next row; on phones every node stacks in one column joined by vertical arrows.
- **Contents rail:** from xl, a 240px sticky rail (48px from the top) sits 64px left of the column. Below xl it becomes a disclosure 40px above the prose.

Breakpoints in use: sm 640px, lg 1024px, xl 1280px.

## Elevation & Depth

Flat. There are no drop shadows. Depth is tonal: a tile sits on the ground as a 4% white fill with a 1px inset ring in Hairline (`box-shadow: inset 0 0 0 1px var(--border)`), which reads as an edge rather than a lift. Inline code, flow nodes, code boxes and framed images (from sm), and the contents disclosure use the same ring; code boxes and frames sit in Well Grey, flow nodes in Tile Grey. Images and art (avatar, project marks, scene tile, scene figure from sm) use a 1px white-at-10% outline drawn 1px inside the edge so they never bleed into the ground. On phones the full-bleed code box and framed image keep only top and bottom inset hairlines, and the full-bleed figure carries no outline at all. Images inside a frame and scenes in a gallery take the art edge.

Flow diagram connectors are drawn in hairline strokes too: a 1px line at ink 25%, starting from a 5px dot at ink 60% and ending in a 7px open chevron at ink 45%. Turns between rows bend with 8px rounded elbows. An arrow label sits on the line as a small Ground-filled tag with a Hairline ring, so the line appears to pass behind it.

Text-level rules are hairlines too: table rows and `hr` take a 1px Hairline rule; blockquotes a 1px ink-at-20% bar at their start edge. These mark text, not containers.

### Named Rules
**The Inset Edge Rule.** Containers are defined by a 1px inset ring, never by an outer shadow or a solid border.

## Shapes

Soft, small corners. Tiles use 10px (the coss `--radius`, 0.625rem); larger containers (scene figure from sm, code blocks from sm, contents disclosure) and row focus outlines use 14px, concentric with the tile at its 4px offset; inline-link, inline-code, breadcrumb, contents entry, heading-anchor focus, flow icon tiles, arrow labels and the cover dice use 6px. The code copy button, Share and Ask AI tiles use 8px; the language badge 4px. The avatar is a full circle. Anything full-bleed on a phone (scene figure, code block) has square corners, because it meets the screen edge. Icons are Central Icons, round-outlined, radius 2, 1.5px stroke, always `currentColor`, never filled glyphs; the set includes arrow-up-right, arrow-right, chevron-right, link, check, copy and dice (Central's outlined die keeps its pips solid; that is the icon, not a filled variant). Flow diagrams draw Central-style strokes inline in the static HTML (hash, layers, grid, image, file), falling back to file.

**The Concentric Corner Rule.** A rounded thing inside a rounded thing takes the outer radius minus the gap between them: a flow node is 14px because its 6px icon tile sits 8px in; a row's focus outline is 14px because it sits 4px outside a 10px tile.

## Components

### Inline Link
Text-weight link that sits inside prose.
- **Style:** full ink over Soft Ink prose, 1px underline in ink at 25%, offset 3px, no wrap.
- **Icon:** optional leading Central icon at 1em, baseline-aligned at -0.125em, 4px gap.
- **Hover / Focus:** underline rises to ink at 60% over 150ms; focus is a 2px Focus Grey outline at 2px offset, 6px corners. Article prose links follow the same treatment.

### Project Row
The signature component: a whole-row link to a piece of work.
- **Structure:** 44px tile in a frame, 16px gap, then name (full ink, underlined as above) over description (Muted Ink), both at label leading.
- **Tile:** Tile Grey fill, 10px corners, inset Hairline ring, 20px Central icon in Muted Ink. When a project has its own mark, the mark fills the tile instead (10px corners, 1px white-at-10% outline inset by 1px, like the avatar); a real mark always beats a library glyph.
- **Frame:** the tile sits 4px inside a 52px frame with 14px corners (concentric), Well Grey fill and an inset Hairline ring; writing tiles share it. The morph moves only the tile, never the frame.
- **Hover:** frame ring rises to ink at 10%, tile icon brightens to full ink, underline rises to 60%, and a 14px arrow-up-right fades in beside the name while sliding 2px up-right into place, all 150ms.
- **Focus:** 2px Focus Grey outline at 4px offset with 14px corners.

### Writing Row
The Project Row's sibling for posts, linking within the site.
- **Tile:** the post's own scene, cropped to a square around its landmark (18 dot columns so it reads at 44px), 10px corners, white-at-10% inset outline. The scene is the post's mark, so it follows the real-mark rule. It plays only while its row is hovered or focused, and holds still otherwise.
- **Text:** title (full ink, underlined) over description (Muted Ink).
- **Hover:** underline rises to 60%; a 14px arrow-right fades in sliding 4px from the left (internal link, so not up-right), 150ms. Focus as Project Row.
- **Morph:** the tile is a shared element with the article figure (React `ViewTransition`, `share="morph"`). It grows into the figure over 450ms on `cubic-bezier(0.32, 0.72, 0, 1)`, passing through a 3px blur at 30%. Reduced motion swaps in place.

### Scene Art
The living figure, the world's one exception.
- **Form:** a 2:1 canvas of dithered dots in the seed's full colour, on its own sky ground. One dot a 3px cell, or a 4.5-device-pixel cell on denser screens, drawn on the GPU (`src/lib/dots.ts`) as round, soft-edged dots; without WebGL, larger 4.5px cells (3.4px on phones) on a 2D canvas. Specks (fish, bubbles, petals, floating lamps) keep a fixed size, a small square of dots once cells are fine. A slow device gets larger cells.
- **Life:** animates at 15fps (clouds, stars, water, rain, lightning, lanterns, fish, petals, beam, lamps) only while on screen. On the article, a mouse pointer carries a small warm light the water reflects, and a tap drops a shooting star in the sky, a ripple on the water, or bubbles under the sea (up to 4 at once, each fading over 2.5s).
- **Still:** under reduced motion it draws one frame and stays still; no pointer light, no taps.
- **Hover play:** inside a link (the home tile) or a card marked to play on hover (the scene gallery), it holds still until that container is hovered or focused.
- **Label:** the wrapper is `role="img"` with "An animated scene drawn in dots: [name]"; the caption shows the name only.
- **Dice (article figure):** a 32px button 8px in from the figure's top-right corner (6px corners, concentric with the 14px figure), black at 40% with a backdrop blur and an inset white-at-10% ring, and in it a 22px die in line art (`src/components/die.tsx`) at white 80% rising to full on hover, presses to 0.96. The die is a real cube projected into one 1px stroke path (a hairline, finer than the 1.5px icons, so the cube reads as drawn rather than as an icon; round joins, never filled) and one path of pips as foreshortened discs; it rests tilted to show three faces, front face up for the seed's number (seed mod 6). It is hidden (and unreachable) until ready, then arrives in 280ms (opacity, 0.9 scale and a 2px blur): 500ms after the cover mounts, so after the morph from the home tile, or the moment the dice hint finishes drawing; at once under reduced motion. Each press draws a random seed for this visit only (a reload restores the post's own) and throws the die: it hops (4px up, 1.12 scale, a small 0.96 landing, 760ms) while it tumbles at least a turn on each axis over 1100ms on an exponential ease-out, coming to rest on the new seed's face; a press mid-throw picks up from wherever it is. Under reduced motion it turns to the new face at once. While the die tumbles, the old scene melts into the new one (`src/lib/melt.ts`, after React Bits' Morph Slider "melt"): a WebGL canvas laid over the art for 1100ms on power2.inOut, warping both scenes through fbm noise, letting the new one break through where the noise is lowest, with a slight red/blue split at the height of it; the new scene keeps animating underneath and the last frame matches it exactly, so the layer leaves without a seam. A throw mid-melt melts onward from the current frame. Reduced motion: a plain 350ms crossfade. No WebGL: an instant swap. The caption follows the new name (announced politely). Labelled "Draw another scene".
- **Dice hint:** the first cover a visitor ever sees (remembered in local storage) draws a hand-drawn arrow to the dice in Muted Ink: a 2px marker line that swoops, loops once and runs out to the dice (900ms from 900ms), then a concave head outlined (260ms) and hatched stroke by stroke (260ms). A 5px Ground-at-60% halo under the strokes keeps the part over the art legible. It sits in a 132 by 64 box over the figure's top-right with its head level with the dice and 14px short of it, decorative and hidden from assistive tech, and fades over 200ms once the dice is pressed. Under reduced motion it appears already drawn. The one place the interface draws freehand; it is a pointer, never content.

### Article Breadcrumb
A single row at the top of a post.
- **Left:** "Writing" link in Muted Ink (to full ink on hover, 150ms), a 16px chevron-right in Muted Ink, 6px gaps, then the current title in full ink, truncated to one line.

### Share
A split button at the end of the author footer (`src/components/share.tsx`).
- **Shape:** at least 32px tall, Tile Grey fill, inset Hairline ring, 8px corners; a 1px Hairline divides the two halves. Text and icons in Muted Ink, each half to full ink on hover over 150ms; pressing either half scales the whole control to 0.96, so it reads as one button.
- **Main half:** a 16px link icon then "Share" (10px start, 12px end padding, 6px gap). It copies the canonical post URL (`src/lib/site.ts`).
- **Chevron half:** a 16px chevron pointing down that turns up while open (200ms, `cubic-bezier(0.23, 1, 0.32, 1)`). It opens a coss Menu aligned to the end: "Share on X" (intent with the title, URL and via), "Share on LinkedIn", and "Share on other apps" (the Web Share sheet, listed only where the browser has one). The popup drops coss's border and shadow for the inset Hairline ring, and fades from 0.96 scale over 150ms; it leaves on opacity alone in 100ms, faster than it came.
- **Swap:** the label always reads "Share"; on copy only the icon changes, to check (or a cross when copying fails), for 2s. The Action Swap (`src/components/motion/action-swap.tsx`, from beUI) shrinks the old icon out as the new one grows in: scale 0.25 to 1, opacity, 4px blur to none, a 0.3s spring with no bounce; reduced motion keeps only a 150ms crossfade. A polite live region announces the result.

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
- **Code:** every fenced block renders as a Code Box (below), unless it is a flow, scenes or roll block.

### Code Box
A fenced code block with a header. Authored as ```` ```lang title="file" {marked lines} ````.
- **Box:** Well Grey fill; full-bleed on phones with top and bottom hairlines, from sm a 14px-corner box with an inset Hairline ring, hanging 24px into the gutters.
- **Header:** Mono Label in Muted Ink, 12px by 24px padding above the code, 8px gaps: the language badge, the file name (or the language name when untitled, truncated to one line), and the copy button at the end edge.
- **Language badge:** a 16px tile, 4px corners, ink-at-12% fill, the short language name (TS, TSX, CSS, SH...) in 9px Geist Mono 600 full ink. It is an icon, not a label.
- **Copy:** an icon-only button (16px copy icon in a 28px hit area, 8px corners), Muted Ink rising to full ink in 150ms, pressing to 0.96. On copy the icon swaps to check with the Action Swap motion and returns after 2s; it is labelled "Copy code" / "Copied" and a polite live region announces the result.
- **Code:** Geist Mono 14px at 1.7, 12px top and 16px bottom padding, 24px sides, 2-space tabs, horizontal scroll with a thin ink-at-15% scrollbar. Highlighting per the Three Tiers Rule.
- **Line numbers:** only when the block has two or more lines; right-aligned in 2ch, 20px before the code, ink at 28%.
- **Marked lines:** a band of ink at 6% across the full width of the box, reaching the end edge even when the code scrolls.

### Flow Diagram
A small process diagram, authored as ```` ```flow ````: one node per line as "title | note | icon | lit"; a line without a pipe labels the next arrow.
- **Node:** Tile Grey fill, inset Hairline ring, 14px corners, 8px padding, 12px gap; a 36px icon tile (6px corners, ink-at-6% fill, Hairline ring, 18px icon in Muted Ink) beside the title (Mono Label 500, full ink) over the note (Muted Ink). Both lines truncate rather than wrap.
- **Lit node:** per the Lit Node Rule; use it for the start and the end, or the one step the prose is about.
- **Arrows:** per Elevation & Depth; labels centred on the arrow from sm, set beside the stem on phones.
- **Reading order:** left to right, two per row, then a turn down to the next row's first node, like reading text. One column on phones.
- **Accessibility:** the whole figure is one image named "Diagram: A, then B, then C"; connectors are hidden.

### Framed Image
An image alone in its paragraph becomes a figure; its markdown title is the caption.
- **Frame:** Well Grey, 24px padding on phones (full-bleed, top and bottom hairlines), 40px from sm with 14px corners and an inset ring; 64px breakout at lg.
- **Image:** centred, never wider than the frame, 10px corners with the art edge. Screenshots are exported at 2x; their PNG size is read at build time and halved, so the frame reserves its space and the image draws at 1x.
- **Caption:** Muted Ink, 12px below, aligned with the column text.

### Scene Gallery
A grid of live scenes from other seeds, authored as ```` ```scenes ```` with a list of seeds.
- **Card:** a 2:1 Scene Art slot, 10px corners, art edge, painted in its sky ground until the live scene mounts; the generated name below in Muted Ink, 8px under, first letter capitalised.
- **Life:** each scene holds still and plays only while its card is hovered, the same rule as the home tile.

### Scene Roller
One live scene and a button that draws another, authored as ```` ```roll ```` with a starting seed.
- **Scene:** a 2:1 Scene Art slot that plays while on screen and takes the pointer light and taps, like the article figure; square and edge-to-edge on phones, 14px corners with the art edge from sm. Before the client mounts, its sky ground and generated name hold the place.
- **Caption row:** the generated name in Muted Ink (first letter capitalised, announced politely when it changes) at the start, and "Another scene" with a 16px dice icon at the end, styled as Copy Link (Muted Ink to full ink, 150ms, presses to 0.96). Each press draws a fresh random seed; the seed is never shown.

### Author Footer
80px below the body, a Hairline rule with a 6px diamond at its centre (a square in Muted Ink turned 45 degrees, cut out of the rule by a 4px Ground ring). 40px below it, one row that wraps (24px across, 16px down) when it runs out of room: the home header's identity (40px avatar, name underlined in full ink, role in Muted Ink) as one link back home, focus 4px offset with 14px corners; Share at the row's end.

### Ask AI
A row that opens a prompt in ChatGPT, Claude, Perplexity and Grok (`src/components/ask-ai.tsx`, each reading `?q=`). A Muted Ink label, 12px gap, then four 32px tiles 8px apart: Tile Grey fill, inset Hairline ring, 8px corners, the assistant's 16px mark in Muted Ink rising to full ink on hover over 150ms, presses at 0.96. The label is hidden from assistive tech and folded into each link's name ("Summarize with Claude"). Home carries "Ask about me on", 80px below Writing; an article carries "Summarize with" 16px under its meta line, entering at 400ms, half the 32px gap to the figure so it reads with the header. Prompts link the canonical URL so they work from any host.

### Markdown Link
Home ends on a footer 80px below Ask AI, entering at 800ms: one link, "index.md", in Mono Label and Muted Ink, underlined, to full ink on hover over 150ms. It opens the home page as plain markdown for agents (`src/app/index.md/route.ts`, also served at `/llms.txt`); each post has its own twin at `/writing/[slug].md`, announced to agents with `<link rel="alternate" type="text/markdown">` rather than shown.

### Avatar
40px circle with a 1px white-at-10% outline inset by 1px; sits 12px left of the name and role.

### Entrance
The name and role are the focal moment: `TextReveal` (`src/components/motion/text-reveal.tsx`, adapted from beUI, uses `motion`) reveals them word by word, each word rising 20% from 6px blur on a spring, 50ms apart; the name starts at 0ms, the role at 150ms. Reduced motion keeps a plain opacity fade. The avatar (0ms), bio (400ms), projects (500ms), writing (600ms) and Ask AI (700ms) are CSS blocks (tw-animate-css) that fade in from 4px blur and 12px below over 500ms on `cubic-bezier(0.2, 0, 0, 1)`, only under `prefers-reduced-motion: no-preference`. New sections join at the next 100ms step.

On an article the same grammar runs once: breadcrumb at 0ms, title words (TextReveal) from 100ms, meta at 300ms, Summarize with, caption and article at 400ms, contents rail or disclosure at 500ms. The figure itself does not fade; it arrives by the morph, or is simply present.

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
- **Do** mark what matters in an article block by stepping up the neutral axis (a lit node, a marked line), never with a hue.
- **Do** nest corners concentrically: inner radius equals outer radius minus the gap.

### Don't:
- **Don't** introduce an accent color; the interface is neutral by commitment, and the scene art is the only exception.
- **Don't** raise font size for hierarchy; the system is one size, article titles included.
- **Don't** show a post's seed or any technical scene parameter to the reader.
- **Don't** use drop shadows or solid borders on containers; use the 1px inset ring.
- **Don't** ship a light theme; the system is dark only.
- **Don't** set readable text below 14px; the 9px language badge is a mark, hidden from assistive tech, and the only exception.
