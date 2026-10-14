<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->


# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

# luannzin.com

## Purpose

- Personal site of Luan Fabri: a one-column portfolio (bio, projects, one of them Seeded scenes, a playground for the engine behind every post's picture) plus writing, a Lab (an index of pieces: the site's motion slowed down, and Bug hunt, a platformer) and a CV that prints as its PDF, in English and Brazilian Portuguese, deployed on Vercel at `https://www.luannzin.com`
- `PRODUCT.md` is the product brief (audience, positioning, facts on hand); `DESIGN.md` is the binding design system ("The Quiet Column") for every visual change; `IDENTITY.md` is the binding voice for every user-facing string, in both languages

## Ownership

Root owns repo-wide config and the folders without their own AGENTS.md:

- `package.json`, `bun.lock`: Bun 1.4; scripts `dev`, `build`, `start`, `lint` (`biome check`), `format` (repo-wide `biome format --write`), `cv:pdf`
- `scripts/bug-hunt-art.py` (`python scripts/bug-hunt-art.py [preview-dir]`, needs Pillow): draws every sprite of Bug hunt, the Lab's platformer, into `public/lab/bug-hunt/atlas.png`, its row tile `public/lab/bug-hunt/tile.png` (44px, the hero on a dot field, composed like a post's tile) and the atlas map `src/lib/bug-hunt/atlas.json`; deterministic, and the art direction is its docstring
- `scripts/bug-hunt-check.ts` (`bun scripts/bug-hunt-check.ts`): grows thousands of Bug hunt levels and fails if one can't be finished or a trap can't be got past
- `scripts/cv-pdf.mjs` (`bun run cv:pdf [origin]`): prints `/cv` in each language through headless Chrome (`CHROME` overrides its path) into the PDFs under `public/cv/`; run it against a production server (`next build` then `next start`), since the dev server's CSS can lag behind `globals.css`
- `next.config.ts`: Next.js 16.4 flags (`cacheComponents`, `reactCompiler`, `partialPrefetching`, `experimental.agentFeedback`), security headers, temporary `/writing` to `/#writing` and `/projects` to `/#projects` redirects, markdown-twin rewrites (`/llms.txt` to `/index.md`, `/writing/:slug.md` to `/writing/:slug/md`), Tailwind v4 Turbopack loader, better-intl wrapper
- `intl.config.ts`: better-intl locales `en` and `pt`, `onMissing: "error"`; generates `src/i18n/generated.ts` from every `t.ts` under `src/` (gitignored, regenerated by `next dev` and `next build`; never edit or commit it)
- `biome.json`, `tsconfig.json` (`@/*` maps to `src/*`), `components.json` (shadcn config, `@coss` registry, style `base-nova`)
- `public/`: `avatar.jpg` (pages, share images, JSON-LD), `writing/<slug>/` post images, `cv/` (the CV PDFs, generated by `cv:pdf`) and `lab/bug-hunt/` (generated by `bug-hunt-art.py`); never edit generated files by hand
- `src/assets/`: `echo.png` (echo's app icon on the home page), `fonts/Inter-*.ttf` (read by `src/lib/og.tsx`)
- `src/hooks/use-media-query.ts`: used only by the ui kit
- `luannzin.com-audit/`: SEO audit snapshot of 2026-10-10 (report, action plan, per-domain findings, OG captures); a dated record, so the code is the current truth
- `.impeccable/`: impeccable skill state behind `DESIGN.md` (`design.json`, per-surface briefs); `.impeccable/review/` is gitignored
- `.claude/launch.json`: `dev` preview server (`bun run dev`, port 3000)
- `.claude/skills/luan-writing-way/`: project skill that reviews and rewrites copy into Luan's voice, from `IDENTITY.md`

## Local Contracts

- Every user-facing string lives in a `t.ts` with both `en` and `pt`; the namespace follows the folder (`src/app/t.ts` is `t.app`, `src/app/writing/t.ts` is `t.app.writing`, `src/components/t.ts` is `t.components`)
- The language comes from the `locale` cookie, else Accept-Language, so pages render per request
- `site` in `src/lib/site.ts` is the only canonical origin; never hard-code the domain
- Every claim on the site must be true today; do not publish metrics, phone number or email without asking (`PRODUCT.md`); the CV carries the email and no metrics or phone (user decision)
- The CV's facts live once, in `src/app/cv/t.ts`; after changing them, regenerate the PDFs with `cv:pdf` and commit them together
- Bug hunt's art changes only through `scripts/bug-hunt-art.py`; rerun it and commit the script with `atlas.png`, `tile.png` and `atlas.json` together, since the game reads frames by name from the JSON
- The home bio and projects exist in four places: `src/app/page.tsx` with `src/app/t.ts` (Seeded scenes' row copy in `src/app/projects/t.ts`), `src/app/index.md/route.ts`, `src/lib/og.tsx` and `src/lib/json-ld.tsx`; change them together
- Files are stored LF (`core.autocrlf=true`); scripted edits must not write CRLF (Python: `newline=""`; check with `git ls-files --eol <file>`)

## Work Guidance

- Before Next.js API work, read the matching guide in `node_modules/next/dist/docs/` (top of this file)
- Run Biome `--write` (`check --write` or `format --write`) only on the exact files changed, never on a folder or through `bun run format`: `src/app/globals.css` and `src/components/ui/` are not Biome-formatted and a wide write reformats them; compare `git diff --stat` before and after
- For any new or changed user-facing copy, run the `luan-writing-way` skill; never invent reasons or opinions for Luan, ask instead
- For design work, follow `DESIGN.md` and reach for the `better-*` skills (better-typography, better-layout)

## Verification

- `bun run lint`: currently fails on formatting in `src/app/globals.css` and `src/components/ui/`, which are not Biome-formatted; judge it by the files you changed
- `bun scripts/bug-hunt-check.ts`: after any change to `src/lib/bug-hunt/level.ts`
- `bun run build`: type check, i18n completeness (a missing `pt` string fails), post frontmatter parsing, static params for every post
- Previewable changes: preview server `dev`, then check `/`, a post, `/index.md`, `/llms.txt` and `/writing/<slug>.md` in both languages

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

- Share images mirror the landing page (Inter on the dark ground, ink tiers, no colour); scene art never goes on a share card (details in `src/lib/AGENTS.md`)

## Child DOX Index

- `src/app/AGENTS.md`: routes, metadata, markdown twins, share and tile images, page copy, `globals.css`
- `src/components/AGENTS.md`: site components (article islands, scene players, share, locale toggle, contents, icons, motion)
  - `src/components/ui/AGENTS.md`: vendored coss UI kit
- `src/lib/AGENTS.md`: shared logic (scene engine, markdown renderer, post loader, share images, structured data, site constants, class tokens)
- `src/content/AGENTS.md`: posts, translations, frontmatter and markdown fence contract