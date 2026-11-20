---
title: Everything after the #
description: How Sightline turns your screen into a link
date: 2026-11-20
metaTitle: "Everything after the #: screen sharing over WebRTC with no server"
metaDescription: How Sightline shares a screen from the browser as a link: a secret in the URL fragment, signalling through public Nostr relays with Trystero, WebRTC straight between browsers, and pixel critters drawn from a 32-bit seed.
seed: 123
---

Discord stopped letting me share my screen from the app, and the way around it everybody uses is opening a Google Meet. A whole meeting, with a lobby and a camera prompt, for "hey, look at this". So I made only the part I wanted. You share your screen and get a link, and whoever opens it watches, live, in the browser, with sound. There's no server of mine in the middle, because there's no server of mine at all: the site is a static page.

[PartyLine and Deskline](/writing/no-server-to-run#where-it-started) already connect two computers with no server of mine, but they're apps you install, and they do it with iroh. A link has to work in whatever browser opens it, so Sightline does the same thing with what browsers already have: WebRTC.

## A link that carries its own secret

A share link looks like `https://sightline.luannzin.com/#<secret>~<host id>`. Both parts are 22 characters, and both come after the `#`. Browsers never send what's after the `#` to the server, so the site hosting the page only ever gets asked for `/`.

The secret is 22 characters from 62, picked from random bytes:

```ts title="src/lib/link.ts" {5}
export function newSecret(): string {
  let out = "";
  while (out.length < 22) {
    for (const byte of crypto.getRandomValues(new Uint8Array(32))) {
      if (byte < 248 && out.length < 22) out += BASE62[byte % 62];
    }
  }
  return out;
}
```

The `248` is there on purpose. A byte has 256 values and there are 62 characters, so `byte % 62` alone would pick the first eight characters a little more often than the rest. 248 is four times 62, so dropping the bytes above it keeps every character equally likely, and 22 of them carry 131 bits.

The secret is the room's password and, hashed, its name. So it never leaves the browsers that have the link. Here's a link made by your browser, and what each side of it gets:

```line
link
```

The host id is the other half. Each share gets a fresh identity, and viewers only accept a stream from that one. Someone else holding the link can't pretend to be you, and two of your shares can't be tied together by it.

## Meeting through Nostr

Two browsers can't talk until they've swapped a few details: what each one can send, and the addresses it might be reached at. Something has to carry that first hello, and Sightline uses public Nostr relays, through [Trystero](https://github.com/dmotz/trystero). The details are encrypted with a key derived from the secret, and the room is named by its hash, so the relays see neither. They do see that two IP addresses met.

Once they've met, the picture and the sound go from one browser to the other over WebRTC, encrypted with DTLS-SRTP. This is everyone who's involved, and what they get:

| Who | What they get |
| --- | --- |
| The site's server | A request for `/`, like anyone opening the page |
| The Nostr relays | The room's hash, encrypted connection details, two IP addresses |
| Public STUN servers | A question from each browser: what's my public address? |
| Whoever opens the link | The picture and the sound, and your IP address |

Public STUN servers are enough for most home and office networks. Some networks don't allow a direct path, like mobile carriers that put many phones behind one address, or strict corporate firewalls. The fix there is a TURN relay, which passes the video along, and Sightline doesn't come with one, because a shared relay is exactly the server in the middle this was supposed to avoid. You can set your own in Network settings, and the video stays encrypted through it.

## Text or Motion

Text and Motion are two ways to spend the same bits. Text keeps every pixel sharp and lets the frame rate drop, for code and documents. Motion keeps 60 frames a second and lets the resolution give, for video and games:

```ts title="src/lib/tuning.ts"
export const MODES: Record<Mode, { hint: string; fps: number; bitrate: number }> = {
  // text and code: keep every pixel, frames can wait
  sharp: { hint: "detail", fps: 30, bitrate: 6_000_000 },
  // video and games: keep the motion, resolution can give
  smooth: { hint: "motion", fps: 60, bitrate: 8_000_000 },
};
```

The `hint` goes on the video track as its `contentHint`, which tells the browser's encoder what to give up first when the bits run out. The other two are caps for each viewer. The browser's own congestion control still adapts below them.

The codec is picked on the computer that shares. Sightline asks the browser which of AV1, VP9 and H.264 it encodes in hardware at 1080p and 60 frames a second, and uses the best of those. Without one, it takes VP9, because AV1 costs a lot more CPU and the browser encodes the video once per viewer.

Sound takes one more step. Browsers negotiate mono speech by default, and an encoder only sends stereo when the other side's description says `stereo=1`. So Sightline rewrites every description a browser receives to ask for stereo Opus at 128 kbps, and captures with the browser's sound processing off, so music and games arrive as they are.

## Critters from a seed

Everyone in a share gets a made-up name and a pixel critter the first time, so nobody has to type anything to watch. The critter grows from one 32-bit number, the same way this site's covers do in [Art from a seed](/writing/art-from-a-seed): mulberry32 turns the seed into a stream of numbers, and every choice takes the next one. The seed is all that travels, and every browser draws the same critter from it.

A critter starts as half a body, mirrored:

```ts title="src/lib/avatar.ts"
// Half a body, outer column first, mirrored at the centre: 0 never, 1 maybe, 2 always.
const HALF = [
  "000011",
  "000112",
  "001122",
  "011222",
  "012222",
  "112222",
  "112222",
  "012222",
  "011222",
  "011122",
  "010011",
  "010010",
];
```

Every 1 is a coin flip. Then come the eyes: a pair, or one time in four a single big one like the mark's. Some pairs are closed, and 40% of critters get a mouth. A flood fill from the face keeps only what touches it, so no pixel floats on its own. The body takes two or three neighbouring dusk colours, Bayer-dithered from top to bottom, inside a dark outline. Roll a few:

```line
critters
```

The names are an adjective and an animal, 24 of each, so 576 of them, from Amber Moth to Cozy Quokka. Click yours in Sightline to change either, even in the middle of a share, and everyone sees it at once.

## The rest of it

- **Sound depends on the browser.** Chrome and Edge on Windows capture the sound of a whole screen, a window or a tab. Firefox and Safari capture none at all. Chrome on Linux only captures a tab's sound, and the README has a two-line `pactl` way around it.
- **Viewers wait for you.** If your connection drops without you stopping, viewers keep the last picture and wait up to a minute for you to come back.
- **Removing someone.** The same link won't let them back in from that browser. A private window gets around it, so for someone who really shouldn't watch, stop and share again: the new link is a new room.
- **Every viewer costs you.** Your browser encodes the video once per viewer, so a handful of people is the comfortable range.
- **The link meter.** Each connection is drawn as [Deskline's link meter](/writing/no-server-to-run#the-dusk), from the same route and round trip.
- **Not measured yet.** The delay from your screen to theirs, and how often a connection needs a relay.

The page is a static Vite build, and the dithered sky behind it comes from the footer of this site.
