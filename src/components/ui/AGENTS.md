# src/components/ui

## Purpose

- coss UI kit (Base UI plus Tailwind), installed from the `@coss` shadcn registry configured in `components.json`

## Ownership

- Vendored component files; the site uses only `menu.tsx` (from `src/components/share.tsx`)
- The rest is kit inventory; files import each other, `@/lib/utils` (`cn`), `@/lib/segmented-control` and `@/hooks/use-media-query`

## Local Contracts

- Files come from the registry; re-adding a component overwrites local edits
- Not Biome-formatted: never run Biome `--write` over this folder
- `src/app/globals.css` skips this folder when generating classes; a component the site starts using needs `@source "../components/ui/<name>.tsx";` there, or its classes never ship

## Work Guidance

- Use the `coss` skill when composing kit components

## Verification

- `bun run build`; preview the component where the site uses it

## Child DOX Index

- None
