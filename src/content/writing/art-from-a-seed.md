---
title: Art from a seed
description: Each post’s picture, drawn from a single number
date: 2026-10-08
updated: 2026-10-11
metaTitle: Art from a seed: seeded generative art in TypeScript
metaDescription: How each post’s generative cover art grows from one seed: a mulberry32 PRNG picks the scene, and WebGL draws it as Bayer-dithered halftone dots.
seed: 16
---

Nobody drew the picture at the top of this post. I wanted every post to have its own picture, but I didn’t want to make cover images and keep them up to date. So each post gets a number instead, its seed, and the page builds a scene from it: the place, the time of day, what’s standing there, even the shape of the clouds.

A seed is just a number in the frontmatter. It never goes stale, and no two posts end up with the same view.

The picture also reacts to you. Move your pointer over it and a small light follows along. Tap the sky for a shooting star, or the water for a ripple. The die in the corner gives you a different scene, just for this visit.

## One number, every choice

The seed comes from the post’s frontmatter. If a post doesn’t set one, it’s a hash of the slug. Then mulberry32, a tiny seeded pseudo-random number generator (PRNG), turns it into a stream of numbers between 0 and 1. Every decision the scene makes takes the next number from that stream:

```ts title="src/lib/scene.ts"
function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

The place is picked first, because it decides what else can show up. Each place lists the times of day it can be drawn at and what can stand in it, each with a weight. The next three numbers pick the place, the time and the landmark:

```ts title="src/lib/scene.ts" {15-17}
const PLACES = {
  city: {
    words: ["alley", "crossing", "street", "district"],
    times: { rain: 3, night: 2, twilight: 1.5, storm: 1 },
    landmarks: { walker: 2, vending: 1 },
  },
  reef: {
    words: ["reef", "shoal", "lagoon", "atoll"],
    times: { deep: 1 },
    landmarks: { wreck: 1, manta: 1 },
  },
  // and seven more
};

const place = weighted(random, PLACE_WEIGHTS);
const time = TIMES[weighted(random, PLACES[place].times)];
const landmark = weighted(random, PLACES[place].landmarks);
```

That’s why a street is never drawn at sunset, and nothing under the sea gets snow. And since the same seed always gives the same stream, it always gives the same scene. One more rule: the landmark and the sun or moon go on opposite sides of the frame, so every scene starts from a balanced composition.

## What a scene is made of

There are nine places, eleven times of day and eleven landmarks:

| Place | Drawn at | What stands in it |
| --- | --- | --- |
| Coast | Night, twilight, dusk, dawn, aurora, storm | A lighthouse or a cabin |
| Fjord | Night, twilight, dawn, aurora, alpenglow, storm | A cabin or a sailboat |
| Lake | Night, twilight, dusk, dawn, aurora, alpenglow, lanterns | A sailboat or a cabin |
| Valley | Night, twilight, dusk, dawn, aurora, alpenglow, storm, lanterns | A windmill or a cabin |
| Dunes | Night, twilight, dusk, dawn, storm | Only the sky |
| Garden | Plum dusk, dusk, twilight, night, dawn, lanterns | A pagoda or a torii, under a cherry tree |
| River | Dusk, dawn, twilight, night, lanterns | A temple over steps down to the water |
| City | Rain, night, twilight, storm | Someone under an umbrella, or a vending machine |
| Reef | Deep water | A wreck, or a manta ray |

Here’s the same code with six other seeds. Hover one to make it move:

```scenes
2 109 103 9 46 58
```

The name under each picture comes from the same choices: a word for the time and a word for the place. This one picks a new seed every time you press the button:

```roll
44
```

## Shading every cell

There are four steps between the seed and the screen. The first two run once, and the last two run on every frame:

```flow
seed | one number | hash | lit
createScene | picks every part | layers
renderer(cols, rows)
frame(t) | shades every cell | grid
canvas | dots on the GPU | image | lit
```

A frame is a grid of cells, one for every three pixels of width (smaller on sharper screens). Each cell gets its final colour before anything hits the screen.

The sky goes from its top colour down to a brighter horizon, with a glow around the sun or moon. Clouds are layers of noise, lit on the side facing the light and kept away from the moon. Mountains are ridged noise. The slopes facing the light catch it, far ranges fade into the sky, and mist collects at their base. Each crest also gets a thin line of sky behind it, so a dark range still stands out against a dark sky. At alpenglow the sun hasn’t risen yet but already reaches the snow on the high peaks, so only the faces turned toward it turn pink.

### Water that reflects what’s above it

Water is shaded last. For each cell below the horizon, the scene looks at the cell mirrored across the waterline, which is already shaded, and shifts it sideways a little to follow the swell. No second render, no ray tracing. That one lookup gives you the reflection of the mountains, the clouds and every lamp. On top of it, a trail of glints runs down from the sun or moon.

Each column mirrors around its own line: the horizon on open water, or the base of whatever is standing there. A torii in a pond reflects from its own posts, and on a wet street a vending machine’s light starts at its base and stretches down the road.

## Places without a horizon

Most scenes are sky, then land, then water. Two aren’t.

### The city street

The city uses one-point perspective: the street goes straight ahead to a single point on the horizon. Each column of the frame looks at one wall, and the wall’s distance depends on how far the column is from the middle. Once you know the depth, the rest is division. Simplified, it looks like this:

```ts title="src/lib/scene.ts"
const z = Math.min(end, STREET / Math.abs(x - 1));
const block = blockAt(x - 1, z);
if (y >= horizon + EYE / z) kind[k] = WATER; // the wet street
else if (y < horizon - (block.h - EYE) / z) kind[k] = SKY;
else paint(k, face(z, EYE - (y - horizon) * z, block));
```

The signs are blade signs, mounted perpendicular to the wall, so they face down the street, toward us. Each one is a rectangle scaled by its depth, with a lit border and katakana from five-by-five bitmaps when there’s room for them. Far enough away, a sign is just a few points of light. Their glow is calculated once and lights the walls, the wet street and the rain falling in front of them.

### Under the sea

The reef is basically the sky upside down. The gradient goes from the bright surface down into the dark, the sun becomes a glare at the top with rays of light spreading from it, and the mountains turn into tall rock at both edges with coral along the top. A school of fish swims in a loose ring that drifts around, and each fish flashes when it turns its side to us.

## Things that move

- **Weather:** clouds drift and stars twinkle. Rain falls in slanted lines, lit by any neon nearby, and a storm sends a bolt every few seconds that flickers twice before it’s gone.
- **Lights:** sky lanterns rise at different depths (the close ones big, low and fast), and the water reflects the ones above it. Lamps float down the river, and the lighthouse beam turns.
- **Life:** petals fall from the cherry tree, a flag waves on the temple, a windmill turns, and a manta ray glides past the reef, its wings rising and falling.

## From colour to halftone dots

Each cell becomes one dot, in one of three sizes or no dot at all, like a printed halftone. The brightest cells get the biggest dots. A four-by-four ordered dither, the Bayer matrix, decides between neighbouring sizes, so a smooth gradient becomes an even texture instead of hard bands. Simplified, it’s three lines:

```ts title="src/lib/scene.ts" {2}
const level = floor + (1 - floor) * peak ** 0.75;
const dither = bayer[(row & 3) * 4 + (col & 3)];
const step = Math.round(level * 3 + dither);
```

Then colour makes up for what size can’t do. A small dot is drawn a bit brighter and a large one a bit dimmer, so the picture keeps its tone across the dither steps. Each dot’s colour is also pushed away from its own grey, which keeps coral, neon and blossoms vivid without touching white snow or grey storm clouds. Land can drop to no dot at all, and that’s what makes a dark hill visible against a dark sky.

## Shading only what moves

The scene draws fifteen frames per second. Light that never moves, like the sky gradient, the glow around the moon, lamplight in the air and the trail of light on the water, is calculated once. A cloud gets the same treatment when it drifts into view. Each frame only shades what’s left: clouds, stars, rain and water.

Then the GPU draws the dots in a WebGL shader. Each frame is uploaded as a small texture, one texel per cell, holding its colour and dot size. A single triangle covers the canvas, and each pixel works out which cell it’s in and how far it is from the cell’s center. That way every dot comes out round with a one-pixel soft edge, and a frame costs the same no matter how many dots there are.

If frames get slow (eight in a row over 30 milliseconds), the cells get bigger so there are fewer to shade. Past 320 columns the cells grow instead of multiplying, and without WebGL the dots are drawn on a regular canvas, fewer and larger.

## Interacting with it

- **Pointer:** a small warm light follows the mouse, and the water reflects it.
- **Tap:** on the sky, a shooting star starts where you tapped; on the water, a ring spreads out and fades; under the sea, a few bubbles float up.
- **Dice:** each press rolls the die and picks a new seed, just for this visit. While it rolls, the old scene melts into the new one: both get warped by noise, and the new one shows through where the noise is lowest.
- **Rest:** the scene stops drawing when it scrolls out of view, and it stays still if your system asks for reduced motion.

On the home page, the same seed draws a square crop of the scene inside each post’s tile, centered on its landmark. It stays still until you hover or focus it. When you open the post, the tile grows into the picture at the top.

![The Writing list on the home page, with this post's tile](/writing/art-from-a-seed/home-tile.png "The tile is the same scene, cropped around its landmark.")

## Where the idea came from

I got the look from [ascii.rest](https://ascii.rest) by [bas3line](https://github.com/bas3line/ascii), a library of animated text art for web pages. Each of its scenes, like [night coast](https://ascii.rest/night-coast/), [tokyo rain](https://ascii.rest/tokyo-rain/) or [deep reef](https://ascii.rest/deep-reef/), is its own piece of code, shaded in colour cell by cell and drawn as dithered dots. The ones here come from a number instead. Different approach, same idea: a page can have a bit of motion and still be calm.
