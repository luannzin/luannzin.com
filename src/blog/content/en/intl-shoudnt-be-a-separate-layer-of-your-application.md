---
title: "Internationalization shouldn't be a separate layer of your application."
excerpt: "better-intl rethinks how i18n works in Next.js. Instead of organizing translations by language, you organize them by feature. Everything is generated at build time (or during development), with full type safety and zero i18n runtime. It's still an evolving project, originally built as a production-validated proof of concept."
publishedAt: "2026-07-13"
author: "Luan Fabri"
tags:
  - i18n
rating: 19
---

> Internationalization shouldn't be a separate layer of your application.

### TL;DR

> I know reading project pitches can be boring as hell, but give this post a chance. I'd also love your feedback on how to simplify ideas that are naturally hard to explain.

`better-intl` rethinks how i18n works in Next.js.

Instead of organizing translations by language, you organize them by **feature**.

Everything is generated at build time (or during development), with full type safety and zero i18n runtime.

It's still an evolving project, originally built as a production-validated proof of concept.

> The project's README does a much better job of explaining the idea and will probably answer some of your questions.

Links:

[https://github.com/luannzin/better-intl](https://github.com/luannzin/better-intl)

[https://www.npmjs.com/package/better-intl](https://www.npmjs.com/package/better-intl)

## The problem

Today, most internationalization libraries follow the same pattern:

* translation files split by language
* strings scattered throughout the project
* abstract translation keys
* runtime responsible for resolving everything

In practice, this creates a parallel layer alongside your code.

You stop thinking about features.

You start thinking, *"Where is this translation?"*

## A different mindset

`better-intl` flips this idea on its head.

> Your project's file system becomes your internationalization system.

## What it looks like

Instead of this:

```text
/locales/en.json
/locales/pt.json
```

You write this:

```ts
// src/components/header/t.ts
export default {
  greeting: {
    en: "Hello {name}",
    pt: "Olá {name}",
  },
}
```

And use it like this:

```ts
t.components.header.greeting({ name: "Ada" })
```

## What changes?

Translations stop being "key lookups" and become part of the feature itself.

Everything is fully typed.

There's no i18n runtime.

No provider.

No hooks.

No string keys.

## The core idea

> Eliminate hooks, contexts, providers, missing type safety, and improve the overall developer experience.

## Why does this exist?

Most i18n libraries treat internationalization as a separate system.

`better-intl` tries to make it part of the application code itself.

No extra layer.

No runtime abstraction.

## Current status

This isn't the "final" version yet.

It's a practical exploration of a different way to approach internationalization in Next.js.
