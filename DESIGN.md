---
name: Luan Fabri
description: A quiet, text-led portfolio, dark by default, where the copy and real projects carry the page.
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

The world is brief-pinned. Its form follows the user's four reference sites (Jakub Krehel, Lee Robinson, Emil Kowalski, interfaces.dev); no concept roll ran, seed key "none (pinned)". It follows the system's light or dark until a visitor picks a theme, with a third, Dawn, that tints its neutral axis (see Themes), and carries no accent color. Detail lives in small, deliberate touches: hairline underlines, 1.5px stroke icons in currentColor, faint inset rings, one staggered blur-up entrance.

Writing extends the column without changing it. A post is the same column plus one living figure: a seeded halftone scene (time of day, place, landmark) drawn as dithered dots on a canvas. That figure is the only colour in the world, and it is art, not interface. Everything around it (breadcrumb, title, contents, prose, code) stays in the ink tiers at one size.

Articles also carry six richer blocks, all authored in markdown and rendered to static HTML at build time: a code box with a file header, a flow diagram, a framed image, a gallery of live scenes, a scene roller, and a Lab specimen. They stay in the same neutral tiers; the gallery and the roller are the Art Exception repeated, not a new one. The few parts that need the client (copy buttons, live scenes, the roller's button, specimens) mount into placeholders the HTML leaves.

**Key Characteristics:**
- Single 576px column, top-left aligned; the article figure, framed images, scene galleries, scene rollers, Lab specimens (Bug hunt's frame and Seeded scenes' Wells among them), code boxes and the contents rail are the only things allowed outside it.
- One type size (16px); hierarchy by weight (500 vs 400) and ink tier. Code is the one deliberate step down (Geist Mono 14px).
- Neutral greys only in the interface, each theme tinting them one hue; full colour lives inside the seeded scene art (and the dock's orbs, which are art) and nowhere else.
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

### Themes
Three themes, set on `<html>` as a class by next-themes before the first paint: the system's light or dark on a first visit (and while nothing is picked, following it live), then the Dock's pick, kept in localStorage. Each theme is four seeds, ground, ink, muted ink and focus; every other token derives from its ink (Tile Grey ink at 4%, Hairline at 7%, 10% on light grounds, Popover the ground with 3% ink), so the tiers, tiles, wells and hairlines read the same in all three. Muted ink keeps 4.5:1 on the ground and on Tile Grey, focus 3:1.
- **Dark:** the neutral greys above. Share cards always use it.
- **Light:** the same graphite on a barely warm paper: ground `oklch(0.985 0.002 90)`, ink `oklch(0.24 0 0)`, muted `oklch(0.53 0 0)`.
- **Dawn:** a pale rose morning written in the indigo still left at the top of its sky: ground `oklch(0.975 0.014 15)`, ink `oklch(0.3 0.06 278)`, muted `oklch(0.51 0.06 305)`.

A theme tints the whole neutral axis; it never adds an accent. Scene art keeps its own colours in every theme.

### Scene Art
Each post's scene picks its own palette from its seed (a time of day: night, twilight, dusk, dawn, aurora, alpenglow, plum dusk, lanterns, rain, storm, or deep water, each with its own near-black ground; the place picked first decides which times it can have). Those colours are generated per post, not tokens; they exist only on the scene canvas, at full strength in the article figure and in the 44px home tile crop. Each dot's colour is pushed away from its own grey before it is drawn, so the art reads vivid while whites and greys stay neutral.

### Named Rules
**The No Accent Rule.** The interface has no hue beyond its theme's tint. Emphasis is earned by moving up an ink tier (muted, soft, full), never by color.

**The Art Exception.** The seeded scene is the one place full colour is allowed, and it stays inside the art. Bug hunt's canvas is the same exception: its neons live inside the game's canvas and its home tile, never in the interface around it. Scene colour never reaches text, links, rings, or fills outside the canvas. The seed is never shown, except in the Lab and on Seeded scenes, where the machinery is the subject and a seed field drives the scene; elsewhere the scene is captioned only by its generated two-word name (time word plus place word, first letter capitalised) in Muted Ink.

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

Article blocks get more air than paragraphs: 24px above and below a code box, 32px above and below a flow diagram, a framed image, a scene gallery, a scene roller or a Lab specimen.

Breakouts are the only departures from the column:
- **Scene figure:** full-bleed (column gutters cancelled) below sm; inside the column from sm; breaking out 64px each side at lg. Its caption realigns with the column text at each step.
- **Code boxes:** full-bleed on phones (the 24px gutters cancelled); from sm they hang 24px into each gutter as a rounded box, so code text lines up with the prose beside it.
- **Framed images:** full-bleed on phones, inside the column from sm, breaking out 64px each side at lg like the scene figure; the caption realigns with the column text at each step.
- **Scene galleries:** two columns at every width (20px between rows, 12px between columns), inside the column on phones, breaking out 64px each side at lg with 16px columns.
- **Scene rollers:** placed like a framed image: full-bleed on phones, inside the column from sm, breaking out 64px each side at lg; the caption row realigns with the column text at each step.
- **Flow diagrams:** stay in the column. From sm, two nodes per row with a 64px arrow track between them, and a turn connector (40px on phones, 56px from sm) leading down to the next row; on phones every node stacks in one column joined by vertical arrows.
- **Contents rail:** from xl, a 240px sticky rail (48px from the top) sits 96px left of the column, so it stays 32px clear of anything breaking out 64px. Below xl it becomes a disclosure 40px above the prose.

Breakpoints in use: sm 640px, lg 1024px, xl 1280px.

## Elevation & Depth

Flat. There are no drop shadows. Depth is tonal: a tile sits on the ground as a 4% white fill with a 1px inset ring in Hairline (`box-shadow: inset 0 0 0 1px var(--border)`), which reads as an edge rather than a lift. Inline code, flow nodes, code boxes and framed images (from sm), and the contents disclosure use the same ring; code boxes and frames sit in Well Grey, flow nodes in Tile Grey. Images and art (avatar, project marks, scene tile, scene figure from sm, the dock's orbs and flags) take the art edge: a 1px outline drawn 1px inside the edge, white at 10% on dark grounds and black at 10% on light ones, never tinted, so they never bleed into the ground. On phones the full-bleed code box and framed image keep only top and bottom inset hairlines, and the full-bleed figure carries no outline at all. Images inside a frame and scenes in a gallery take the art edge.

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
- **Tile:** Tile Grey fill, 10px corners, inset Hairline ring, 20px Central icon in Muted Ink. When a project has its own mark, the mark fills the tile instead (10px corners, the art edge, like the avatar); a real mark always beats a library glyph.
- **Frame:** the tile sits 4px inside a 52px frame with 14px corners (concentric), Well Grey fill and an inset Hairline ring; writing tiles share it. The morph moves only the tile, never the frame.
- **Hover:** frame ring rises to ink at 10%, tile icon brightens to full ink, underline rises to 60%, and a 14px arrow-up-right fades in beside the name while sliding 2px up-right into place, all 150ms.
- **Focus:** 2px Focus Grey outline at 4px offset with 14px corners.
- **Internal project:** Seeded scenes, the third row, lives on the site, so its row takes the Writing Row's arrow-right and opens in place; its mark is its own scene (seed 36, a reef), a still PNG with the live scene loaded over it on hover, like a post's tile.

### Writing Row
The Project Row's sibling for posts, linking within the site.
- **Tile:** the post's own scene, cropped to a square around its landmark (18 dot columns so it reads at 44px), 10px corners, the art edge. The scene is the post's mark, so it follows the real-mark rule. It plays only while its row is hovered or focused, and holds still otherwise.
- **Text:** title (full ink, underlined) over description (Muted Ink).
- **Hover:** underline rises to 60%; a 14px arrow-right fades in sliding 4px from the left (internal link, so not up-right), 150ms. Focus as Project Row.
- **Morph:** the tile is a shared element with the article figure (React `ViewTransition`, `share="morph"`). It grows into the figure over 450ms on `cubic-bezier(0.32, 0.72, 0, 1)`, passing through a 3px blur at 30%. Reduced motion swaps in place.

### Scene Art
The living figure, the world's one exception.
- **Form:** a 2:1 canvas of dithered dots in the seed's full colour, on its own sky ground. One dot a 3px cell, or a 4.5-device-pixel cell on denser screens, drawn on the GPU (`src/lib/dots.ts`) as round, soft-edged dots; without WebGL, larger 4.5px cells (3.4px on phones) on a 2D canvas. Specks (fish, bubbles, petals, floating lamps) keep a fixed size, a small square of dots once cells are fine. A slow device gets larger cells.
- **Life:** animates at 15fps (clouds, stars, water, rain, lightning, lanterns, fish, petals, beam, lamps) only while on screen. On the article, a mouse pointer carries a small warm light the water reflects, and a tap drops a shooting star in the sky, a ripple on the water, or bubbles under the sea (up to 4 at once, each fading over 2.5s).
- **Still:** under reduced motion it draws one frame and stays still; no pointer light, no taps.
- **Hover play:** inside a link (the home tile) or a card marked to play on hover (the scene gallery), it holds still until that container is hovered or focused.
- **Home tile:** ships as a still PNG of the scene's first frame (`/writing/[slug]/tile.png`, drawn at build by `src/lib/scene-tile.tsx` the way the GPU draws it, 18 dots across at 3x), so the home page loads no scene code. The first hover or focus loads the live canvas over it (`src/components/live-tile.tsx`); same frame, no seam, and it plays from there.
- **Lazy start:** a canvas below the fold takes its GPU context and shades its first frame only when it comes within 200px of the screen.
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
Home ends on a footer 80px below Ask AI, entering at 800ms. It opens on a 32px dither strip (`DitherStrip`, `src/components/footer-art.tsx`): four equal blocks in the dusk scene's sky (violet, plum, ember, gold), 2px dots on a 3px grid centred in the column, at 25, 50, 75 and 100% Bayer density; the pointer pushes dots within 28px aside and they spring back, still under reduced motion. It is scene art, so the Art Exception covers its colour. 64px below sits a row: on the left two links 16px apart, "index.md" and "cv" (to `/cv`), in Mono Label and Muted Ink, underlined, to full ink on hover over 150ms. It opens the home page as plain markdown for agents (`src/app/index.md/route.ts`, also served at `/llms.txt`); each post has its own twin at `/writing/[slug].md`, announced to agents with `<link rel="alternate" type="text/markdown">` rather than shown. On the right, "Luan" as a hand-drawn 1.5px stroke in Muted Ink (`Signature`), written over 1400ms then underlined once it is fully in view (after the footer's own entrance when it is in view at load); reduced motion shows it drawn.

### Lab
`/lab` is an index, like Writing on the home page: breadcrumb (Luan Fabri, then Lab), the title (TextReveal) over the subtitle, the intro in Soft Ink, then one row per piece 48px below (`LabRows`, `src/components/lab/rows.tsx`, the same rows as the home page's Lab section: Writing Row structure in the Project Row frame; a piece with its own art shows it as a real mark, one without gets an icon on Tile Grey), and the Author Footer with Share. The pieces are their own pages under it.

`/lab/motion`, the site's motion slowed down (breadcrumb: Lab, then the title): the article column, each piece a section with its heading, a specimen and a write-up below it in Soft Ink. A specimen is a Well frame (14px corners, inset Hairline ring; full-bleed with top and bottom hairlines on phones, hanging 24px into the gutters from sm, 64px breakout at lg) holding the live piece above its timing sheet. Inside it, muted ink steps 12% toward the ink (`--muted-strong`, per theme), so it keeps 4.5:1 on the Well and Tile fills. The timing sheet: a transport (replay, play and pause through the Action Swap, previous and next frame as 32px tiles, a 1x / 0.25x / 0.1x segmented control), then a Mono Label grid: the time in full ink over a 5.5rem label column, a ruler of numbers and ticks, a 20px Tile Grey bar per track with its easing drawn as a 1px curve (ink 40%, full ink up to the playhead), the played part lit at ink 7%, the active track's ring at ink 18% and label in full ink, and a 1px full-ink playhead with a 7px dot. The bars' column is a slider (arrows step a frame, Home and End, Space plays). Each specimen performs once at 60% in view, never under reduced motion. A post can carry one under its own heading (a ```` ```lab ```` fence naming the piece): the same specimen, placed as on `/lab/motion`, with the article's 32px of block air around it.

### Bug hunt
`/lab/bug-hunt`, a pixel art platformer, the second row of the Lab. Its 44px tile is its own art, so it follows the real-mark rule like a post's tile (edge to edge, 10px corners, the art edge) and is composed like one: a field of 1px dots on a 2px grid filling the square, dithered from the room's dark violet at the top to the rosé of the laptop's light, and the hero in the middle at 1x, typing; drawn by the art script, `image-rendering: pixelated`. The column: breadcrumb (Lab, then the title), the title (TextReveal) over the subtitle, then the game straight away in a specimen's Well (`well` from `src/components/lab/timeline.tsx`), since it's what the page is for and an intro above it would push it under the fold on a phone; then the intro in Soft Ink, a "How it's made" prose section, and the Author Footer with Share. The game (`src/components/lab/bug-hunt.tsx`) is a 2D canvas, edge to edge in the Well, always at a whole number of device pixels per game pixel, as many as keep the view at least 256 game px wide; the view's height is 192 game px and its width takes the room left (up to 400). No transport under it. On fine pointers, the controls: two columns (moving, acting) of `kbd` tiles in Mono Label beside what they do in Muted Ink, then one line naming the keyboard fallback. Mouse and keyboard: A/D move, W jumps, S crouches, S+W drops through a catwalk; a click throws at the cursor (he keeps running and jumping through a throw, and a click while his arm is still out is kept for the next one), a right click fires the special, Esc pauses; arrows, Space, J and K work too. While playing, the system cursor hides and the canvas draws a 1px white crosshair with a rosé centre. On coarse pointers, a pad instead: a 128px joystick on the leading side (Tile Grey, a 48px knob that follows the thumb, leaning down crouches and its direction aims a throw) and on the trailing side three 56px round buttons in an arc round the thumb (special on top, throw out at the edge, jump at the bottom, nearest the thumb), Central-style icons, 4px apart. Overlays (loading, Play, Paused, the end of a run with its level and bugs fixed) sit on the canvas over Ground at 70%, a label, one Share-style button and beside it a 36px icon button for fullscreen ("Play fullscreen" on the title, then "Enter fullscreen" or "Exit fullscreen"); F toggles it too, and on touch a 40px round button sits between the joystick and the buttons. Fullscreen is the browser's or, where there is none (iPhone), the figure covering the page; the same layout either way: the game's black edge to edge over everything, the page behind it inert and still, the canvas at the largest whole scale that fits both ways (up to 480 game px wide), no controls legend, a top-centre bar of 40px round buttons floating on the game (black at 40%, backdrop blur, white-at-10% ring: pause while playing, then exit), and on touch the pad floating over the bottom edge, see-through (white at 8% with a blur), clear of the safe areas. Esc or the exit button leaves it, and leaving pauses the run. Keys reach the game only while it has focus (`role="application"`), which it holds through the whole run, so it draws no focus ring (the overlays' buttons keep theirs); it pauses when focus leaves the figure, the window blurs, the tab hides or the figure scrolls under a quarter in view. Reduced motion turns off the screen shake.

Inside the canvas the look is its own (Art Exception): line art on black after Tomb of the Mask, every shape a black fill closed by a 1px line in its own colour, ordered 4x4 Bayer dither for texture and fades (the bugs' shells, the spikes, bricks fading the deeper they sit, the door's light, the wipe between levels), and a few flat neons by meaning: white for the world, green and cyan for the two bugs, rosé for the special, yellow for the way out, red for damage and for the traps, violet for the far server racks and the one-way catwalks. The hero is the one exception to the line art, so he reads as a person at 36px: solid masses lit from the upper left (his line white on the lit sides, grey on the others, a dark crease where a near limb crosses what's behind it), about three heads tall: auburn curls with lit arcs, white skin, a black hoodie with its hood down and a rosé drawstring, black cargo pants, white sneakers, the far limbs a step darker. The traps: spikes on the floor (red points with white tips), a laser in a grey floor housing that warns with a climbing dotted red line, then fires a white-cored red beam to the top of the view, and a red-toothed saw rolling back and forth along a groove cut in the floor. Bursts are 1px particles with a two-frame trail that thin out in dither. Every sprite comes from `scripts/bug-hunt-art.py`; none is drawn by hand.

Feel: the simulation steps at most 1/120s and plays each frame out in full, so motion keeps the display's pace; the camera holds him at an exact offset in the view (it eases across when he turns), so he never shimmers against the floor; the run's frames step with the ground his feet cover; a held jump hangs a little at its peak; pushing against his own speed skids him into the turn. Traps come one to a run with plain floor at both ends: spikes from level 1 (a pit's cost: a heart and back to firm floor), lasers from level 2 and saws from level 3 (a heart and a knock back).

### Seeded scenes
`/projects/seeded-scenes`, the engine behind every post's picture as a playground, the Projects row's internal page: the article's scenes and the Lab's specimen in one column, with no code. Breadcrumb (Projects, to `/#projects`, then the title), the title (TextReveal) over the subtitle, then the Lab's seeded scenes specimen straight away (live scene, its name, the seed field with the die, the timing sheet with melt, hop and tumble), as Bug hunt puts its game first; the two intro paragraphs in Soft Ink 32px below. Then the prose sections, laid out like `/lab/motion` (heading, its piece, the write-up 24px under it, sections 80px apart):
- **Same seed, same scene:** a Scene Gallery of six seeds; each caption carries the name at the start and the seed at the end in Geist Mono 14px, both Muted Ink, so a seed can be typed into the field above.
- **The place comes first:** a Well (`well`) with a live scene across its top (pointer light and taps), a caption row (the name, announced politely; "Another scene" with a 16px dice icon, styled as in the Scene Roller, drawing another seed in the same place), then under a Hairline the nine places as radio chips in even rows 8px apart (three columns on phones, five from sm): at least 32px tall (a long label wraps), 8px corners, Tile Grey with a Hairline ring, Muted Ink rising to full ink on hover; the chosen one steps up the neutral axis (ink at 7% fill, 18% ring, full ink), presses to 0.96, 150ms. Under them, 16px down, a definition list: "Drawn at" and "What stands in it" in Muted Ink beside the chosen place's times and landmarks once the box is 20rem wide (a container query), stacked under them below that, 8px between pairs.
- **One dot per cell:** the same Well, one scene, its caption row holding the name and a Dot size segmented control (3, 6, 12, 24px, the timing sheet's speed control; its label goes over it where a narrow phone can't fit both) that pins the cell size, so the halftone and the dither come apart into single dots. A new size lays the frame out again in place: the scene keeps playing from where it was.
- **The whole story:** outside the prose, the heading (500), a Soft Ink paragraph 12px under it and a Writing Row to "Art from a seed" 24px under that (its tile morphs into the post's figure like the home page's).
Enter: breadcrumb 0ms, title from 100ms, subtitle and specimen 300ms, intro 400ms, sections 500ms, the whole story 600ms. Author Footer with Share.

### CV
`/cv`, the work and the CV as one page, never on the home page. The column: the breadcrumb, the name (TextReveal) over the role, the contact on one line down to 360px (12px apart, 16px from sm, no separators on screen): the place in Muted Ink, then Email, LinkedIn and GitHub as inline links by name, the profiles opening in a new tab, Download PDF and Print as Share-style tiles (16px icons); the header enters name 100ms, role 250ms, contact 300ms, actions 400ms, summary 500ms, prose 600ms; the summary in Soft Ink, the contents rail or disclosure, then the prose: Experience opens on a timeline drawn as a Lab timing sheet (the month as the readout, past years along the ruler from their first tick, a bar per role and the school, each row a link to its entry; the current role lit, ending on a full-ink playhead at today; the bars draw in from their start in turn (a clip rounded like the bar, so ends and ring never squash), 600ms, 80ms apart, from 700ms, then the playhead draws down from its dot, 500ms, a clip on `cubic-bezier(0.2, 0, 0, 1)`; only without reduced motion), then each entry: its h3 with the dates trailing on the same row (wrapping under it when there is no room, tabular, Muted Ink), the company or school under it in Muted Ink, then its bullets; an entry sits 32px below the one before and 12px under its section head; projects, open source, skills as an inline definition list, education and languages follow. The footer is the Author Footer with Share.

### Paper
The CV's print styles (Ctrl+P, Print, and the PDFs made from them) are the one place the site leaves the dark ground: an A4 sheet, 14mm by 16mm margins, Inter at 10pt in ink `#111` with `#444` for supporting lines. The name is centred at 1.75rem and 600, over the role and the contact line (the address behind each link spelled out, joined by " · "), closed by a 1.5px rule; section heads are uppercase 700 at 0.04em tracking over a 1px rule; entry titles 600 with their dates at the trailing edge. Links print as plain text, the open source links add their address, and a keywords line closes the sheet in small `#444` above a grey rule. Breadcrumb, controls, timeline, contents, footer and site chrome never print. Paper is its own material: it follows the CV's print tradition, not the One Size Rule.

### Dock
The theme and the language in one control (`src/components/dock.tsx`): bottom-right on a phone (16px in, above the safe area), on the right edge and vertically centred from lg (24px in). It enters with the home blocks at 700ms.
- **Rest:** a 40px pill (Popover fill, inset Hairline ring, the floating control's soft shadow) holding the current theme as a 32px Orb, and the language as a 14px flag moon on the orb's lower left, cut out of it by a 4px ring of the pill's fill.
- **Orb** (`src/components/orb.tsx`): a theme as a halftone world: its ground as a disc and its ink as dots on a 2.75px grid, sized by tone as in print, shaded as a sphere lit from the upper left and banded in swirls, turning at 0.3 rad/s at the scenes' 15fps (30fps while awake, one shared clock); the night side keeps fine dots so the disc reads as a globe. Dark grounds print light (dots grow into the light); light grounds print ink (dots grow into the shadow). Each theme's dots run through its own colours (dawn: rose through mauve to indigo; dark and light: greys). While the list is open it spins up to 1.4 rad/s and its light leans toward the pointer. It is art, so the Art Exception covers its colour, and it takes the art edge. Reduced motion draws one still frame.
- **Open:** a hover (mouse), the keyboard or a tap unfolds the list around the orb, which never moves: the languages (English, Português), a 1px Hairline, then the three themes, each in a 40px row; the orb takes its own theme's row and the moon flies to its language's (14px to 32px). The pill grows to the list on a spring (zeta 0.7, 550ms, about 4% overshoot) while rows arrive from 0.6 scale and a 4px blur, 28ms apart by distance from the orb; it folds back in 250ms on `cubic-bezier(0.23, 1, 0.32, 1)`, all rows at once. A mouse leaving closes it after 280ms. On a phone the list always opens upward from the orb, which rises to its row, so nothing reaches the home indicator; on the right edge it hangs both ways and keeps 16px clear of the screen's edges.
- **Running dots:** as on a dock, a 4px full-ink dot 4px outside the pill's screen side marks the theme and the language in use while the list is open, riding the same spring when the choice moves.
- **Rows:** the row in reach swells to 1.14 and its neighbours to 1.05, on the same spring; presses dip to 0.96. A label (Popover, inset Hairline ring, 8px corners, 28px tall, 16px text, 14px from sm) sits 8px to the start of the pill, level with the row in reach (the current theme when none), sliding between rows in 200ms, its text arriving from a 2px blur.
- **Theme switch:** the new theme grows out of the picked orb as a blurred circle (the beUI circle blur, from the barber app: a View Transition clipping the new page to a circle from 0 to 150% around the orb, from an 8px blur, 700ms on `cubic-bezier(0.4, 0, 0.2, 1)`, over the old page held still; the new page also settles from 1.04 scale, so the blur never fades its edges into a seam of the old one). Page transitions are off for the swap, so no hover colour or ring fades under the wipe; the orb glides into its new row on the spring, and the list stays open to try another. Reduced motion, or no View Transitions: the theme swaps at once.
- **Language switch:** closes the list; the page cross-fades as before and the new flag develops in the moon (the flag flash).
- **Keyboard:** the orb is a menu button: Enter, Space, ArrowUp or ArrowDown open the list on the current theme; the arrows, Home and End move; Escape closes back to the orb (from the orb too, when a hover opened it); Tab closes and moves on past the dock. Rows are radio items in two labelled groups, Language and Theme; the orb's name says both current choices.

### Avatar
40px circle with the art edge; sits 12px left of the name and role.

### Entrance
The name and role are the focal moment: `TextReveal` (`src/components/motion/text-reveal.tsx`, adapted from beUI, in CSS: `.text-reveal` in `globals.css`) reveals them word by word, each word rising 20% from 6px blur over 800ms on `cubic-bezier(0.16, 1, 0.3, 1)`, 50ms apart; the name starts at 0ms, the role at 150ms. The words are visible in the HTML; only the animation's first frame hides them. Reduced motion keeps a plain 250ms opacity fade. The avatar (0ms), bio (400ms), projects (500ms), writing (600ms), Lab (700ms), Ask AI (800ms) and the index.md footer (900ms) are CSS blocks (tw-animate-css) that fade in from 12px below over 500ms, without blur (a blur over a whole block cannot run on the compositor; the title keeps the one blur-up) on `cubic-bezier(0.2, 0, 0, 1)`, only under `prefers-reduced-motion: no-preference`. New sections join at the next 100ms step.

On an article the same grammar runs once: breadcrumb at 0ms, title words (TextReveal) from 100ms, meta at 300ms, Summarize with and caption at 400ms, contents rail or disclosure and article at 500ms (below xl the disclosure sits above the article, so neither enters before the other). The figure itself does not fade; it arrives by the morph, or is simply present.

### Browser Surfaces
`color-scheme` follows the theme (dark on dark grounds, light on light ones); text selection is ink at 15% behind full ink; every `:focus-visible` gets a 2px Focus Grey outline. Page titles read "[Post title] · Luan Fabri".

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
- **Do** take every interface colour from the tokens, so every theme holds; art edges are pure black or white at 10%, never tinted.

### Don't:
- **Don't** introduce an accent color; the interface is neutral by commitment, and the scene art is the only exception.
- **Don't** raise font size for hierarchy; the system is one size, article titles included.
- **Don't** show a post's seed or any technical scene parameter to the reader, outside the Lab and Seeded scenes.
- **Don't** use drop shadows or solid borders on containers; use the 1px inset ring.
- **Don't** add a theme without its four seeds checked for contrast (muted 4.5:1 on the ground and on Tile Grey, focus 3:1), its orb and its name in both languages, and never give a theme an accent.
- **Don't** set readable text below 14px; the 9px language badge is a mark, hidden from assistive tech, and the only exception.

### Share images
Open Graph and X cards (`src/lib/og.tsx`, generated at build by `opengraph-image.tsx` at the root and per post) are the page itself at 2.5x, in the dark theme whatever the visitor picked, so at a feed's usual 480px they read at the page's 16px: Ground fill, Inter 400/500, hierarchy by weight and ink tier, no art and no accent. Home: the header (40px avatar, name over role in Muted Ink) and the bio's first sentence in ink at 70%, centred in the column. Post: "Writing" in Muted Ink, the title one step up (28px, 24px past 44 characters; 500, 1.1 leading, -2% tracking, balanced) over date and reading time, and the home header as the author's footer. 40px by 36px margins at page scale.
