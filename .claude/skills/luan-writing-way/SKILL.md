---
name: luan-writing-way
description: Review and rewrite copy so it sounds like Luan Fabri actually writes, not like documentation, marketing or generic AI prose. Use on any new or changed user-facing text in English or Brazilian Portuguese (site copy in `t.ts` files, page write-ups, project blurbs, bios, posts in src/content, meta descriptions, markdown twins), and whenever the user asks to review copy, fix the voice, "write like me" or invokes /luan-writing-way.
---

# Luan's writing way

Review copy against how Luan really writes, then rewrite what is off. The voice is defined in `IDENTITY.md` at the repo root; its REFERENCE SAMPLES (his own LinkedIn posts) are the ground truth and win over any rule when they disagree.

## Before reviewing

1. Read `IDENTITY.md` in full, samples included. Do not work from memory.
2. Read the copy in place and the copy around it (the rest of the page, the other language), so a rewrite fits the page.
3. Find the facts each sentence claims. Check them against the code or content they describe. Copy that describes the site must be true today.

## What his writing does

- Opens where the thought starts: a blunt claim, a confession, a concrete observation. Never a warm-up, never "passionate about".
- First person ("I", "eu", "a gente"), talking straight to the reader ("you", "você"). Prefers active voice: "I draw it by hand", not "it is projected by hand".
- Gives the reason. A detail is followed by why it is that way: the problem he had, the trade-off, what he refused to add.
- Itemised specifics from a real situation instead of adjectives ("3 arquivos novos, um provider, um hook customizado", not "complex code").
- A concession, then the turn: "Funcionou? É... funcionou. Mas eu não pedi isso."
- Contrasts he holds: working vs good, one run vs a success rate, complexity vs quality, features vs usefulness, tools vs caring about the user.
- Short and longer sentences mixed; a conclusion gets its own sentence.
- Humour from a real situation, usually at his own expense. Never a joke written as a joke.
- Portuguese: natural Brazilian, "pra", "tá", "tão", casual imperatives used consistently ("digita", "deixa", "pausa"), English tech terms as Brazilian devs say them ("frame", "seed", "path", "deploy"). Uppercase on the one word he would stress out loud, at most once or twice per text.
- English: plain, contracted, idiomatic, understated. No translated Portuguese structures, no uppercase stress, no "LOL". Not more polished or American than the Portuguese.

## Adapt to the surface

- **UI labels** (buttons, menus, aria labels, breadcrumbs, "Copy code"): leave neutral and short. Voice does not apply; clarity does.
- **Site prose** (bio, Lab write-ups, project descriptions, 404, intros): professional but his. Keep the first person, the reason and the contrast. No profanity, no KKKKK, no one-line-paragraph rhythm, no closing question to the reader.
- **Posts**: technical and precise, still in first person with his reasons and opinions where the source supports them.
- **Meta descriptions, share text, markdown twins for agents**: factual and plain; voice only as far as it does not cost clarity.
- **Social posts**: the LinkedIn format is fine here (hook, line breaks, uppercase stress, a question at the end, KKKKK when it fits).

## Red flags to rewrite

- Passive, impersonal description of something he built ("a cube is turned and projected").
- Résumé or marketing lines ("I pay a lot of attention to details", "seamless", "powerful", "delightful", "passionate").
- A claim with no specific behind it.
- A sentence that only restates the one before it; an ending that restates the opening.
- Em dashes, stacked adjectives, rhetorical questions with no point, forced slang, slang in every sentence.
- Portuguese that reads like a translation from English (or the reverse); mixed formal and casual imperatives; mixed terms for the same thing ("frame" and "quadro").

## Never

- Invent a reason, feeling, opinion, metric or experience. If the copy needs his reason and nothing in the repo or the conversation states it, ask him with one specific question instead of guessing. Reasons may come from his own words, `PRODUCT.md`, posts, code comments and commit history.
- Make every text provocative, funny or informal. Edit as little as the copy needs; strong copy stays.
- Change facts while changing voice.

## Output

1. One line per change: where (file and key), what was off, the new text. Both languages when the string has both, written as native versions, not translations.
2. Apply the rewrite when asked to fix; otherwise list it.
3. List any question that blocks a rewrite (a missing reason only he knows).

In this repo: copy lives in `t.ts` files with `en` and `pt`; the home bio also lives in `src/app/index.md/route.ts`, `src/lib/og.tsx` and `src/lib/json-ld.tsx`, so change them together. Run `bun run build` after editing `t.ts` (a missing `pt` string fails it).
