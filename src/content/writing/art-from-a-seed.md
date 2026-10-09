---
title: Art from a seed
description: Every post’s picture, grown from one number
date: 2026-10-08
seed: 16
---

Every post on this site opens with a scene nobody painted. Each post carries one number, its seed, and the page grows a small world from it: the place, the time of day, the thing standing in it, the shape of every cloud. Move your pointer over the one above and you carry a small light across it; tap the sky for a shooting star, or the water for a ripple. The dice in its corner draws you a different one, for this visit only.

I wanted the pictures to belong to the posts without making cover images I would have to keep up. A seed costs nothing to store, never goes stale, and gives every post a view no other post shares.

## One number, every choice

The seed comes from the post's frontmatter, or from a hash of its slug when the post leaves it out. A tiny random number generator, mulberry32, turns it into a stream of numbers between 0 and 1, and every decision the scene makes reads the next one from that stream:

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

The place comes first, because the place decides what else can happen there. Each one lists the times of day it is drawn at and what can stand in it, each with a weight, and the next three numbers from the stream pick one of each:

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

So a street is never drawn with the sun setting in it, and nothing under the sea gets snow. Because the stream is the same every time for the same seed, so is everything drawn from it. The landmark and the sun or moon land on opposite sides of the frame, so every scene starts from a composition that holds.

## A small world of parts

There are nine places, eleven times of day, and eleven things to stand in them:

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

The same code, six other seeds. Hover one to set it moving:

```scenes
2 109 103 9 46 101
```

The name under each picture comes from the same choices: a word for the time and a word for the place, like the one above. Or keep drawing; every press picks a new seed:

```roll
44
```

## Shading every cell

From the seed to the screen, a scene passes through four steps. The first two run once; the last two run every frame:

```flow
seed | one number | hash | lit
createScene | picks every part | layers
renderer(cols, rows)
frame(t) | shades every cell | grid
canvas | draws the dots on the GPU | image | lit
```

The frame is a grid of cells, one for every three pixels of width, or finer on a sharper screen, and each cell is shaded in full colour before anything is drawn.

The sky runs from its top colour down to a brighter horizon, with a glow round the sun or moon. Clouds are layers of noise, lit on the side that faces the light and kept clear of the moon's face. Mountains are ridged noise: the slopes facing the light catch it, far ranges fade toward the sky, mist pools at their feet, and the crest of each one catches a line of sky behind it, so a dark range still separates from a dark sky. At alpenglow the sun is not up yet, but the snow on the high peaks already is, so only the faces turned toward it go rose.

### Water that reflects what is above it

Water is shaded last. For each cell below the horizon, the scene looks up at the cell mirrored across the waterline, which is already shaded, and nudges it sideways by the swell. The reflection of the mountains, the clouds and every lamp falls out of that one lookup. A road of glints runs down from the sun or moon on top.

Each column mirrors about its own line: the horizon on open water, or the foot of whatever stands in it. A torii standing in a pond reflects from its own posts, and on a wet street a vending machine's light starts at its own base and runs long down the road.

## Places without a horizon

Most scenes are a sky over land over water. Two are not.

### A street that runs away

The city is drawn in one-point perspective: the street runs straight away from us to a point on the horizon. Every column of the frame looks at one wall, and how far away that wall is follows from how far the column is from the middle. Knowing the depth, the rest is division:

```ts title="src/lib/scene.ts"
const z = Math.min(end, STREET / Math.abs(x - 1));
const block = blockAt(x - 1, z);
if (y >= horizon + EYE / z) kind[k] = WATER; // the wet street
else if (y < horizon - (block.h - EYE) / z) kind[k] = SKY;
else paint(k, face(z, EYE - (y - horizon) * z, block));
```

The signs are blade signs, mounted square to the wall, which means they face straight down the street, at us. Each one is a rectangle shrunk by its depth, with a lit border and katakana drawn from five-by-five bitmaps when there is room for them; too far away, a sign is a scatter of light. Their glow is worked out once, and it lights the walls, the wet street and the rain falling past them.

### Under the sea

The reef is the sky turned upside down. The gradient runs from the bright surface down to the dark, the sun is a glare at the top with shafts of light fanning out from it, and the mountains become rock high at both edges with coral along the crest. A school of fish turns in a ring that wanders, and each fish flashes when it turns its flank to us.

## Things that move

- **Weather:** clouds drift and stars twinkle. Rain falls in slanted lanes, lit by any neon near it, and a storm sends a bolt every few seconds that flickers twice before it goes.
- **Lights:** sky lanterns rise at their own depths, the near ones big, low and quick, and the water mirrors the ones above it. Lamps float down the river, and the lighthouse turns its beam.
- **Life:** petals fall from the cherry tree, a flag streams from the temple, a windmill turns, and a manta ray glides past the reef, its wings rising and falling.

## From colour to dots

Each cell becomes one dot, in one of three sizes or none, the way a printed halftone does it. The brightest cells get the largest dots. A four-by-four ordered dither decides between neighbouring sizes, so a smooth gradient turns into an even texture instead of hard bands:

```ts title="src/lib/scene.ts" {2}
const level = floor + (1 - floor) * peak ** 0.75;
const dither = bayer[(row & 3) * 4 + (col & 3)];
const step = Math.round(level * 3 + dither);
```

Then the colour makes up what the size could not: a small dot is drawn a little brighter and a large one a little dimmer, so the picture keeps its tone across the dither's steps. Each dot's colour is also pushed away from its own grey, so coral, neon and blossom stay vivid while white snow and grey storm cloud stay as they are. Land is allowed to drop to no dot at all, which is what makes a dark hill read against a dark sky.

## Shading only what moves

The scene draws fifteen frames a second. Light that never moves, like the sky's gradient, the glow round the moon, lamplight in the air and the road of light on the water, is worked out once, and a cloud only when it drifts into view. A frame shades what is left: clouds, stars, rain and water.

Then the GPU draws the dots. The frame goes up as a small texture, one texel a cell, its colour and its dot size. One triangle covers the canvas, and every pixel works out which cell it falls in and how far it is from the middle, so every dot comes out round, with a pixel's worth of soft edge, and a frame costs the same however many dots there are.

## Touching it

- **Pointer:** a small warm light follows the mouse, and the water reflects it.
- **Tap:** on the sky, a shooting star leaves from where you pressed; on the water, a ring spreads out and fades; under the sea, a few bubbles rise.
- **Rest:** the scene stops drawing when it scrolls out of view, and it holds still if your system asks for reduced motion.

On the home page, the same seed draws a square crop of the scene inside each post's tile, around its landmark, still until you hover it. Open the post and the tile grows into the picture at the top.

![The Writing list on the home page, with this post's tile](/writing/art-from-a-seed/home-tile.png "The tile is the same scene, cropped close round its landmark.")

## Where it comes from

The look is borrowed from [ascii.rest](https://ascii.rest) by [bas3line](https://github.com/bas3line/ascii), a library of animated text art for web pages. Each of its scenes, like [night coast](https://ascii.rest/night-coast/), [tokyo rain](https://ascii.rest/tokyo-rain/) or [deep reef](https://ascii.rest/deep-reef/), is its own piece of code, shaded in colour cell by cell and drawn as dithered dots. These are grown from a number instead. Both are the same bet: a page can move a little without giving up being quiet.
