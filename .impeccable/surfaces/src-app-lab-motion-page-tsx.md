---
version: 1
slug: "src-app-lab-motion-page-tsx"
primary_target: "src/app/lab/motion/page.tsx"
related_targets: ["src/components/lab/specimens.tsx","src/components/lab/timeline.tsx"]
---

# Motion, frame by frame (src/app/lab/motion/page.tsx)

Scope: one page of live, inspectable pieces of this site (seeded scenes with the melt and a seed field, the die, the hand-drawn arrow, the text reveal), each with a timing sheet and a short write-up. Visitor mode: Experience, read-like: the pieces lead, the prose under each explains them.

Audience: design engineers, engineers and recruiters judging craft. Job: see the motion up close (replay, slow, step, scrub) and understand how it is built. Proof: the real components the site ships, driven by the sheet, not recordings. Constraints: English and Portuguese, dark only, One Size Rule, Central-style icons, reduced motion respected (nothing plays by itself).

## Direction contract

THESIS: The Quiet Column turned into a test bench: each piece runs live above a ruled timing sheet that replays, slows and steps it, with a short write-up under it like a post. It refuses the component-gallery grid of equal cards and Storybook-style tool chrome.

OWN-WORLD: Home and Writing unchanged: ground #161616, three ink tiers, Inter 16px, Geist Mono 14px for numbers and track names, inset hairline rings, Well Grey frames with 14px corners breaking out 64px at lg. Timing sheets in hairlines: Tile Grey track bars with their easing drawn as a 1px curve, the elapsed part lit one step up the neutral axis, a full-ink playhead. Scene art stays the only colour; the seed is shown and editable here only.

STORY: The visitor reads what the lab is, sees the contents, watches each piece perform once as it arrives, then replays it, slows it to a quarter or a tenth, steps it a frame at a time or scrubs, and reads how it works.

FIRST VIEWPORT: Breadcrumb (Lab, Motion, frame by frame); title "Motion, frame by frame" over a muted subtitle; two-line intro; then the first entry heading and the Seeded scenes specimen: a 2:1 live scene breaking out at lg, its name and the seed field (die inside, at the end) under it, then the timing sheet (transport, ruler, melt / hop / tumble). Contents rail at xl.

FORM: Specimens with timing sheets, candidate 1 on the ordered list, user-locked with the steer "a description under each, like a post"; seed key 28dbfd26. Signature interaction: the playhead drives the real code (melt layer, die projection, CSS animations through the Web Animations API), so scrubbing moves the actual piece.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
