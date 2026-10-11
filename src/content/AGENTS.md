# src/content

## Purpose

- Posts in markdown, loaded by `@/lib/writing` and rendered by `@/lib/markdown`

## Ownership

- `writing/<slug>.md`: English post; the file name is the slug and the URL `/writing/<slug>`
- `writing/pt/<slug>.md`: Portuguese translation; without one, Portuguese readers get the English post
- Post images live outside this folder, in `public/writing/<slug>/`

## Local Contracts

- Every `.md` file in `writing/` and `writing/pt/` is parsed as a post; keep docs (this file included) out of those folders
- Frontmatter is flat `key: value`: `title` and `date` (`YYYY-MM-DD`) required; `description`, `updated`, `metaTitle`, `metaDescription`, `seed` optional; without `seed` the slug is hashed; a translation keeps the original's `date`, `updated` and `seed`
- The seed is the post's art: the cover and the home tile both draw it
- `##` and `###` headings become anchors and the contents list
- Code fence: language, then optional title (`title="path"` or a bare name) and marked lines (`{1,4-6}`)
- `flow` fence: one node a line, `title | note | icon | lit`; a line without a pipe labels the arrow into the next node; icons are `hash`, `layers`, `grid`, `image`, `file`
- `scenes` fence: seeds, drawn as a gallery of live scenes; `roll` fence: one seed, with a button that draws another
- An image alone in its paragraph becomes a framed figure; its title is the caption; PNGs are drawn at 2x and shown at half size
- Internal links are root-relative (`/writing/...`); the markdown twin makes them absolute

## Work Guidance

- Prose follows `DESIGN.md` (Prose, Code Box, Flow Diagram, Framed Image, Scene Gallery, Scene Roller)

## Verification

- `bun run build` (frontmatter errors throw)
- Preview the post in both languages and its `/writing/<slug>.md` twin

## Child DOX Index

- None
