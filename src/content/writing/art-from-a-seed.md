---
title: Art from a seed
description: Every post’s picture, grown from one number
date: 2026-10-08
seed: 6
---

Every post on this site opens with a scene nobody painted. Each post carries one number, its seed, and the page grows a small landscape from it: the time of day, the place, the thing standing in it, the shape of every cloud. Move your pointer over the one above and you carry a small light across it; tap the sky for a shooting star, or the water for a ripple.

I wanted the pictures to belong to the posts without making cover images I would have to keep up. A seed costs nothing to store, never goes stale, and gives every post a view no other post shares.

## One number, every choice

The seed comes from the post's frontmatter, or from a hash of its slug when the post leaves it out. A tiny random number generator, mulberry32, turns it into a stream of numbers between 0 and 1, and every decision the scene makes reads the next one from that stream:

```ts
function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(seed);
const time = weighted(random, {
  night: 3, twilight: 2, dusk: 2, dawn: 1.5, aurora: 2,
});
const side = random() < 0.5 ? -1 : 1;
```

Because the stream is the same every time for the same seed, so is everything drawn from it. The landmark and the sun or moon land on opposite sides of the frame, so every scene starts from a composition that holds.

## A small world of parts

A scene is put together from a few kinds of parts, and the seed picks one of each:

| Part | Choices | What it sets |
| --- | --- | --- |
| Time | Night, twilight, dusk, dawn, aurora | Sky, light, water, and the warmth of the lamps |
| Place | Coast, fjord, lake, valley, dunes | Which ranges rise, and whether there is water |
| Landmark | Lighthouse, cabin, windmill, boat | What stands in it, and which lights it holds |

The name under the picture comes from the same choices: a word for the time and a word for the place, like the one above.

## Shading every cell

The frame is a grid of cells, about one for every four and a half pixels of width, and each cell is shaded in full colour before anything is drawn.

The sky runs from its top colour down to a brighter horizon, with a glow round the sun or moon. Clouds are layers of noise, lit on the side that faces the light and kept clear of the moon's face. Mountains are ridged noise: the slopes facing the light catch it, far ranges fade toward the sky, mist pools at their feet, and the crest of each one catches a line of sky behind it, so a dark range still separates from a dark sky.

### Water that reflects what is above it

Water is shaded last. For each cell below the horizon, the scene looks up at the cell mirrored across the horizon, which is already shaded, and nudges it sideways by the swell. The reflection of the mountains, the clouds and every lamp falls out of that one lookup. A road of glints runs down from the sun or moon on top.

## From colour to dots

Each cell becomes one dot, in one of three sizes or none, the way a printed halftone does it. The brightest cells get the largest dots. A four-by-four ordered dither decides between neighbouring sizes, so a smooth gradient turns into an even texture instead of hard bands:

```ts
const level = floor + (1 - floor) * peak ** 0.85 * 0.95;
const dither = bayer[(row & 3) * 4 + (col & 3)];
const step = Math.round(level * 3 + dither);
```

Then the colour makes up what the size could not: a small dot is drawn a little brighter and a large one a little dimmer, so the picture keeps its tone across the dither's steps. Land is allowed to drop to no dot at all, which is what makes a dark hill read against a dark sky.

## Drawing only what changed

The scene draws on a canvas, fifteen frames a second. Every cell owns a whole-pixel square, so a cell can be cleared and redrawn without touching its neighbours, and a frame only redraws the cells whose dot changed. Hills and towers stay put; clouds, stars and water move. The dots that are left are grouped by colour, six bits a channel, and each group is filled at once.

## Touching it

- **Pointer:** a small warm light follows the mouse, and the water reflects it.
- **Tap:** on the sky, a shooting star leaves from where you pressed; on the water, a ring spreads out and fades.
- **Rest:** the scene stops drawing when it scrolls out of view, and it holds still if your system asks for reduced motion.

On the home page, the same seed draws a square crop of the scene inside each post's tile, around its landmark, still until you hover it. Open the post and the tile grows into the picture at the top.

## Where it comes from

The look is borrowed from [ascii.rest](https://ascii.rest) by [bas3line](https://github.com/bas3line/ascii), a library of animated text art for web pages. Each of its scenes, like [night coast](https://ascii.rest/night-coast/), is its own piece of code, shaded in colour cell by cell and drawn as dithered dots. These are grown from a number instead. Both are the same bet: a page can move a little without giving up being quiet.
