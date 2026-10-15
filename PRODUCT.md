# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engineers, design engineers, founders and recruiters who land on luannzin.com from GitHub, X or LinkedIn and want to know, in under a minute, who Luan is, what he builds and whether his work is worth a closer look.

## Product Purpose

Personal portfolio of Luan Fabri, front-end engineer at Loopscape (Jaú / SP, Brazil). It introduces him, shows recent open source work, and routes visitors to GitHub, X and LinkedIn. Success: a visitor leaves knowing what he does and opens at least one project or profile.

## Positioning

A front-end engineer who ships production ERPs and multi-tenant platforms at Loopscape (since 2023) and builds his own tools in the open (echo, better-intl). The site itself is the proof of craft: minimal, fast, every detail deliberate.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, cache components, React Compiler), Tailwind CSS v4, coss UI (Base UI), Bun, Biome.
- Language: English and Brazilian Portuguese via better-intl, picked from the `locale` cookie, else Accept-Language. Translated posts live in `src/content/writing/pt/`.
- Theme: dark, light and dawn, picked in the dock; a first visit follows the system's light or dark (next-themes, kept in localStorage). Share cards stay dark.
- Current sections: header (name, role, avatar), hero bio, projects (echo, better-intl, and Seeded scenes, the posts' scene engine as a playground at `/projects/seeded-scenes`), writing, Lab (two rows: the motion at `/lab/motion`, and Bug hunt, a platformer at `/lab/bug-hunt`; `/lab` lists them like posts); the CV lives at `/cv` (linked from the home footer), not on the home page.
- Source of facts: `LUAN FABRI.md` (RH-oriented, written ~April 2026, partly outdated) plus GitHub.

## Brand Commitments

- Minimalist, text-led portfolio on a neutral background. Binding references: Jakub Krehel's site, Lee Robinson's site, Emil Kowalski's site, interfaces.dev.
- Icons come from Central Icons (`round-outlined-radius-2-stroke-1.5`), drawn in `currentColor`.
- Avatar is the GitHub avatar (`https://github.com/luannzin.png`).
- Role line: "Front-end engineer at Loopscape".

## Evidence on Hand

- Loopscape: https://loopscape.com.br
- echo: "The note taker that learns with you". https://useecho.dev, https://github.com/luannzin/echo. Mark: `src/assets/echo.png` (echo's own app icon).
- better-intl: typed, file-based i18n for Next.js. https://github.com/luannzin/better-intl
- Profiles: github.com/luannzin, x.com/__luannzin, linkedin.com/in/luannzin.
- Work history and metrics live in `LUAN FABRI.md`; its numbers are self-reported estimates. Do not publish metrics, phone number or email without asking. The CV (`/cv` and its PDF) publishes the email, never the phone, and leaves the CV's numbers out (user decision, 2026-10-11).

## Product Principles

- Show the work, do not describe it: projects and links over adjectives.
- Every claim must be true today; when the source doc is outdated, ask.
- Craft is the argument: the page's own details are the portfolio.

## Accessibility & Inclusion

WCAG AA contrast in every theme, full keyboard access with visible focus, reduced motion respected.
