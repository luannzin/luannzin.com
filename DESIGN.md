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
  avatar:
    rounded: "{rounded.full}"
    size: "40px"
---

# Design System: Luan Fabri

## Overview

**Creative North Star: "The Quiet Column"**

One narrow column of text on a near-black neutral ground. The copy and the work carry the page; the interface recedes until a link or a row is touched. Hierarchy comes from weight and tone, never from size: everything is Inter at 16px, separated into three ink tiers and set apart by generous vertical space.

The world is brief-pinned. Its form follows the user's four reference sites (Jakub Krehel, Lee Robinson, Emil Kowalski, interfaces.dev); no concept roll ran, seed key "none (pinned)". It is dark only and carries no accent color. Detail lives in small, deliberate touches: hairline underlines, 1.5px stroke icons in currentColor, faint inset rings, one staggered blur-up entrance.

**Key Characteristics:**
- Single 576px column, top-left aligned.
- One type size (16px); hierarchy by weight (500 vs 400) and ink tier.
- Neutral greys only; no accent hue anywhere.
- Hairline underlines and inset 1px rings instead of borders and shadows.
- Motion is one staged entrance plus 150ms hover state changes.

## Colors

A strictly neutral, near-black palette resolved from the coss UI dark tokens (`.dark` on `<html>`); the CSS custom properties in `src/app/globals.css` are the source, hex values here are their rendered results.

### Neutral
- **Soft Black Ground** (`--background`): page background everywhere.
- **Paper White Ink** (`--foreground`): names, headings, link text; the only full-strength text.
- **Soft Ink** (`--foreground` at 70%): long-form bio prose, so links in it stand forward.
- **Muted Ink** (`--muted-foreground`): role line, project descriptions, resting tile icons, the hover arrow.
- **Tile Grey** (`--muted`, white at 4%): fill of project icon tiles.
- **Hairline** (`--border`, white at 6%): inset 1px ring on tiles.
- **Focus Grey** (`--ring`): 2px keyboard focus outline.

### Named Rules
**The No Accent Rule.** The palette has no hue. Emphasis is earned by moving up an ink tier (muted, soft, full), never by color.

**The Three Tiers Rule.** Text uses exactly three tones: full ink for things you can act on or name, soft ink for prose, muted ink for supporting lines. A fourth tone is drift.

## Typography

**Body Font:** Inter (with ui-sans-serif, system-ui fallback), via `next/font` as `--font-sans`.

**Character:** One neutral grotesque at one size; the page reads like a well-set note, not a poster.

### Hierarchy
- **Title** (500, 16px, 1.375): the name in the header and section headings ("Projects"). Weight is the only thing that sets it apart.
- **Body** (400, 16px, 1.625): bio paragraphs in Soft Ink, `text-wrap: pretty`, within the 576px column (about 65-70ch).
- **Label** (400, 16px, 1.375): header role line and project row name/description pairs, tighter so the pairs read as one unit.

### Named Rules
**The One Size Rule.** All text is 16px. New sections get hierarchy from weight 500, ink tier, and space, not from a larger size.

## Layout

A single centered column, `max-width` 576px with 24px side gutters, top-left aligned content. Top padding is 80px on mobile and 112px from 640px up; bottom padding 96px. No grid, no sidebar, no breakpoint other than that top-padding step.

Vertical rhythm, as built: avatar to name/role 12px apart horizontally; header to bio 32px; bio paragraphs 16px apart; bio to the next section heading 80px; section heading to its list 16px; list rows 24px apart (the heading sits closer to its list than rows sit to each other, so it reads as the list's owner, not a third row). The 80px break is the section separator; there are no rules or dividers.

## Elevation & Depth

Flat. There are no drop shadows. Depth is tonal: a tile sits on the ground as a 4% white fill with a 1px inset ring in Hairline (`box-shadow: inset 0 0 0 1px var(--border)`), which reads as an edge rather than a lift. The avatar uses the same idea, a 1px white-at-10% outline drawn 1px inside its edge so the photo never bleeds into the ground.

### Named Rules
**The Inset Edge Rule.** Containers are defined by a 1px inset ring, never by an outer shadow or a solid border.

## Shapes

Soft, small corners. Tiles use 10px (the coss `--radius`, 0.625rem); the row focus outline uses 14px so it stays concentric with the tile at its 4px offset; inline-link focus uses 6px. The avatar is a full circle. Icons are Central Icons, round-outlined, radius 2, 1.5px stroke, always `currentColor`, never filled glyphs.

## Components

### Inline Link
Text-weight link that sits inside prose.
- **Style:** full ink over Soft Ink prose, 1px underline in ink at 25%, offset 3px, no wrap.
- **Icon:** optional leading Central icon at 1em, baseline-aligned at -0.125em, 4px gap.
- **Hover / Focus:** underline rises to ink at 60% over 150ms; focus is a 2px Focus Grey outline at 2px offset, 6px corners.

### Project Row
The signature component: a whole-row link to a piece of work.
- **Structure:** 44px tile, 16px gap, then name (full ink, underlined as above) over description (Muted Ink), both at label leading.
- **Tile:** Tile Grey fill, 10px corners, inset Hairline ring, 20px Central icon in Muted Ink. When a project has its own mark, the mark fills the tile instead (10px corners, 1px white-at-10% outline inset by 1px, like the avatar); a real mark always beats a library glyph.
- **Hover:** tile icon brightens to full ink, underline rises to 60%, and a 14px arrow-up-right fades in beside the name while sliding 2px up-right into place, all 150ms.
- **Focus:** 2px Focus Grey outline at 4px offset with 14px corners.

### Avatar
40px circle with a 1px white-at-10% outline inset by 1px; sits 12px left of the name and role.

### Entrance
Every unit fades in from 4px blur and 12px below over 500ms on `cubic-bezier(0.2, 0, 0, 1)`, and only under `prefers-reduced-motion: no-preference`. The name is the focal moment and reveals word by word: avatar and "Luan" at 0ms, "Fabri" at 80ms, then the role line at 180ms, bio at 280ms, projects at 380ms (80ms between title words, 100ms between blocks). New sections join at the next 100ms step. Pure CSS (tw-animate-css), server-rendered, no motion library.

### Browser Surfaces
`color-scheme: dark`; text selection is ink at 15% behind full ink; every `:focus-visible` gets a 2px Focus Grey outline.

## Do's and Don'ts

### Do:
- **Do** keep every new section inside the 576px column, separated by 80px, with a weight-500 16px heading 16px above its content.
- **Do** use the three ink tiers: full for names and links, 70% for prose, muted for supporting lines.
- **Do** draw icons from Central Icons (round-outlined, radius 2, 1.5px stroke) in currentColor.
- **Do** signal interactivity with the 25% to 60% underline shift and 150ms transitions.
- **Do** gate entrance motion behind reduced-motion and keep it to one staged reveal.

### Don't:
- **Don't** introduce an accent color; the palette is neutral by commitment.
- **Don't** raise font size for hierarchy; the system is one size.
- **Don't** use drop shadows or solid borders on containers; use the 1px inset ring.
- **Don't** ship a light theme; the system is dark only.
