"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { BAYER, DUSK } from "@/components/footer-art";
import { DiceIcon } from "@/components/icons";
import { Segmented, well } from "@/components/lab/timeline";
import type { t } from "@/i18n/generated";
import { press } from "@/lib/classes";

// Live pieces of the lines (Deskline, Sightline) for posts, one per `line`
// fence. Each runs the app's own logic, copied from its repo: Deskline's is
// Rust, so its pieces are TypeScript ports of the lines they show.

type Labels = typeof t.components.lines;
export type LinePieceName = "code" | "inflight" | "link" | "critters";

export function LinePiece({
  piece,
  name,
  labels,
}: {
  piece: LinePieceName;
  // the id of the heading that names it
  name: string;
  labels: Labels;
}) {
  if (piece === "code") return <CodePiece name={name} labels={labels.code} />;
  if (piece === "inflight")
    return <InflightPiece name={name} labels={labels.inflight} />;
  if (piece === "link") return <LinkPiece name={name} labels={labels.link} />;
  return <CrittersPiece name={name} labels={labels.critters} />;
}

// The row under a piece: what it shows at the start, a button at the end.
function Caption({
  children,
  action,
  onAction,
}: {
  children: ReactNode;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-border border-t px-6 py-4 lg:px-16">
      <div aria-live="polite" className="min-w-0 text-muted-foreground">
        {children}
      </div>
      <button
        type="button"
        onClick={onAction}
        className={`-my-1 -me-1.5 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm py-1 ps-2 pe-1.5 text-muted-foreground hover:text-foreground ${press}`}
      >
        {action}
        <DiceIcon className="size-4" />
      </button>
    </div>
  );
}

// --- Deskline: a code --------------------------------------------------------

const Z32 = "ybndrfg8ejkmcpqxot1uwisza345h769";

/** z-base-32, as iroh writes an endpoint id: 32 bytes are 52 characters. */
function z32(bytes: Uint8Array) {
  let out = "";
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = ((value << 8) | byte) & 0xfff;
    bits += 8;
    while (bits >= 5) {
      out += Z32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += Z32[(value << (5 - bits)) & 31];
  return out;
}

/** A new Ed25519 public key, or 32 random bytes where WebCrypto has none. */
async function newKey() {
  try {
    const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
      "sign",
      "verify",
    ])) as CryptoKeyPair;
    const raw = await crypto.subtle.exportKey("raw", pair.publicKey);
    return { code: z32(new Uint8Array(raw)), real: true };
  } catch {
    return {
      code: z32(crypto.getRandomValues(new Uint8Array(32))),
      real: false,
    };
  }
}

/** Deskline's three even lines: 13 groups of four go 5, 5, 3 (src/look.rs). */
function codeLines(code: string) {
  const groups = code.match(/.{1,4}/g) ?? [];
  const per = Math.ceil(groups.length / 3);
  return [0, 1, 2].map((i) => groups.slice(i * per, (i + 1) * per).join("  "));
}

function CodePiece({ name, labels }: { name: string; labels: Labels["code"] }) {
  const [key, setKey] = useState<{ code: string; real: boolean } | null>(null);
  const make = () => void newKey().then(setKey);
  useEffect(make, []);

  return (
    <figure aria-labelledby={name} className={well}>
      <div className="grid place-items-center px-6 py-8 lg:px-16">
        <p className="whitespace-pre font-mono text-foreground text-sm leading-[1.7]">
          {/* the space holds three lines until the key is made */}
          {key ? codeLines(key.code).join("\n") : " \n \n "}
        </p>
      </div>
      <Caption action={labels.another} onAction={make}>
        {key && !key.real ? labels.random : labels.made}
      </Caption>
    </figure>
  );
}

// --- Deskline: frames in flight -----------------------------------------------

// A desktop at Deskline's default 30 frames a second; Rust's `gap.as_millis()`
// is whole milliseconds.
const GAP = 33;
const SLOW = 0.1;
type Rule = "two" | "trip";

/** How many frames may be unacked (src/host.rs); the first version kept two. */
function inFlight(rule: Rule, rtt: number) {
  return rule === "two"
    ? 2
    : Math.min(32, Math.max(2, Math.floor(rtt / GAP) + 2));
}

/**
 * The host's pump with fixed delays: a frame reaches the viewer half a round
 * trip after it's sent and its ack is back after a whole one. Returns the
 * send times up to `until`, newest last.
 */
function sendTimes(rule: Rule, rtt: number, until: number) {
  const limit = inFlight(rule, rtt);
  const sent: number[] = [];
  let next = 0;
  while (next <= until) {
    // wait for the ack that frees a slot, then send and sleep a frame
    const free = sent.length >= limit ? sent[sent.length - limit] + rtt : 0;
    const at = Math.max(next, free);
    if (at > until) break;
    sent.push(at);
    next = at + GAP;
  }
  return sent;
}

function InflightPiece({
  name,
  labels,
}: {
  name: string;
  labels: Labels["inflight"];
}) {
  const [rtt, setRtt] = useState(200);
  const [rule, setRule] = useState<Rule>("two");
  const canvas = useRef<HTMLCanvasElement>(null);
  const flight = inFlight(rule, rtt);
  const fps = Math.round(Math.min(1000 / GAP, (flight * 1000) / rtt));

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;
    let visible = false;

    const draw = (now: number) => {
      const dpr = devicePixelRatio || 1;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== Math.round(w * dpr)) el.width = Math.round(w * dpr);
      if (el.height !== Math.round(h * dpr)) el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(el).color;

      // a moment well past the start, so the pipe is already full
      const t = 4000 + (still ? 0 : (now - started) * SLOW);
      const pad = 7;
      const span = w - pad * 2;
      const half = rtt / 2;
      const frames = h * 0.36;
      const acks = h * 0.68;
      // the two computers, a hairline each, and the two ways between them
      ctx.globalAlpha = 0.25;
      ctx.fillRect(pad - 1, 12, 1, h - 24);
      ctx.fillRect(w - pad, 12, 1, h - 24);
      ctx.globalAlpha = 0.08;
      ctx.fillRect(pad, frames, span, 1);
      ctx.fillRect(pad, acks, span, 1);
      for (const at of sendTimes(rule, rtt, t)) {
        const age = t - at;
        if (age >= rtt) continue;
        if (age < half) {
          // a frame on its way: a small screen
          ctx.globalAlpha = 1;
          ctx.fillRect(pad + (age / half) * span - 6, frames - 4, 12, 9);
        } else {
          // its ack on the way back
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(w - pad - ((age - half) / half) * span, acks + 0.5, 3, 0, 7);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      draw(performance.now());
    });
    seen.observe(el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [rule, rtt]);

  return (
    <figure aria-labelledby={name} className={well}>
      <div className="flex justify-between px-6 pt-5 font-mono text-muted-foreground text-sm lg:px-16">
        <span>{labels.sharing}</span>
        <span>{labels.viewing}</span>
      </div>
      <div aria-hidden="true" className="px-6 lg:px-16">
        <canvas ref={canvas} className="block h-24 w-full text-foreground" />
      </div>
      <p
        aria-live="polite"
        className="px-6 pb-5 font-mono text-foreground text-sm tabular-nums lg:px-16"
      >
        {labels.upTo} {flight} {labels.inFlight}, {fps} {labels.arrive}
      </p>
      <div className="grid gap-4 border-border border-t px-6 py-4 lg:px-16">
        <div className="flex items-center gap-4">
          <label
            htmlFor={`${name}-rtt`}
            className="shrink-0 text-muted-foreground"
          >
            {labels.roundTrip}
          </label>
          <input
            id={`${name}-rtt`}
            type="range"
            min={10}
            max={400}
            step={10}
            value={rtt}
            aria-valuetext={`${rtt} ms`}
            onChange={(e) => setRtt(Number(e.target.value))}
            className="h-8 min-w-0 flex-1 cursor-pointer accent-foreground"
          />
          <output
            htmlFor={`${name}-rtt`}
            className="w-16 shrink-0 text-end font-mono text-foreground text-sm tabular-nums"
          >
            {rtt} ms
          </output>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <span className="text-muted-foreground">{labels.rule}</span>
          <Segmented
            name={`${name}-rule`}
            label={labels.rule}
            options={["two", "trip"] as const}
            labelOf={(r) => (r === "two" ? labels.two : labels.trip)}
            value={rule}
            onChange={setRule}
          />
        </div>
        <p className="text-muted-foreground">{labels.slowed}</p>
      </div>
    </figure>
  );
}

// --- Sightline: a link --------------------------------------------------------

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** 22 Base62 characters, as Sightline makes its secret (src/lib/link.ts). */
function newSecret() {
  let out = "";
  while (out.length < 22) {
    for (const byte of crypto.getRandomValues(new Uint8Array(32))) {
      // 248 = 4 * 62: dropping the top bytes keeps every character equally likely
      if (byte < 248 && out.length < 22) out += BASE62[byte % 62];
    }
  }
  return out;
}

/** The room name for a secret: hex SHA-256, so the relays never see it. */
async function roomName(secret: string) {
  const data = new TextEncoder().encode(`sightline:${secret}`);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  return Array.from(hash.subarray(0, 16), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

function LinkPiece({ name, labels }: { name: string; labels: Labels["link"] }) {
  const [link, setLink] = useState<{
    secret: string;
    host: string;
    room: string;
  } | null>(null);
  const make = () => {
    const secret = newSecret();
    void roomName(secret).then((room) =>
      setLink({ secret, host: newSecret(), room }),
    );
  };
  useEffect(make, []);

  return (
    <figure aria-labelledby={name} className={well}>
      <p className="break-all px-6 py-6 font-mono text-sm leading-[1.7] lg:px-16">
        <span className="text-muted-foreground">
          https://sightline.luannzin.com/
        </span>
        <span className="text-foreground">
          {link ? `#${link.secret}~${link.host}` : " "}
        </span>
      </p>
      <dl className="grid gap-x-6 gap-y-1 border-border border-t px-6 py-4 sm:grid-cols-[auto_1fr] lg:px-16">
        <dt className="text-muted-foreground">{labels.server}</dt>
        <dd className="mb-2 font-mono text-foreground text-sm leading-6 sm:mb-0">
          GET /
        </dd>
        <dt className="text-muted-foreground">{labels.relays}</dt>
        <dd className="break-all font-mono text-foreground text-sm leading-6">
          {link?.room ?? " "}
        </dd>
      </dl>
      <Caption action={labels.another} onAction={make}>
        {labels.made}
      </Caption>
    </figure>
  );
}

// --- Sightline: critters ------------------------------------------------------

// Sightline's src/lib/avatar.ts and palette.ts: a 16x16 critter from one
// 32-bit seed, so the seed is all that travels and every browser draws the
// same one.
const NIGHT = "#110d24";
const LINE = "#1a1424";
const WHITE = "#e8e4f0";
const SIZE = 16;

const dither = (n: number, at: number, col: number, row: number) =>
  Math.max(
    0,
    Math.min(
      n - 1,
      Math.round(at * (n - 1) + BAYER[(row % 4) * 4 + (col % 4)] / 16 - 0.5),
    ),
  );

// Half a body, outer column first, mirrored at the centre: 0 never, 1 maybe,
// 2 always. Placed at (2, 2), so the outline always has a pixel of room.
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
const AT = 2;
// adjacent dusk stops only, so the dither reads as one colour
const RAMPS = [
  [1, 2],
  [2, 3],
  [0, 1, 2],
  [1, 2, 3],
].map((r) => r.map((i) => DUSK[i]));

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The critter for `seed`: SIZE x SIZE colours, row by row. */
function drawCritter(seed: number): string[] {
  const rand = mulberry32(seed);
  const pick = <T,>(list: readonly T[]) =>
    list[Math.floor(rand() * list.length)];
  const W = HALF[0].length * 2;
  const H = HALF.length;
  const body = HALF.map((row) => {
    const half = [...row].map((c) => c === "2" || (c === "1" && rand() < 0.5));
    return [...half, ...[...half].reverse()];
  });

  // eyes: a pair, or now and then one big one like the mark's
  const cyclops = rand() < 0.25;
  const ey = pick([4, 5]);
  const ex = cyclops ? 4 : pick([2, 3]);
  const ew = cyclops ? 4 : 2;
  const eh = cyclops ? 3 : 2;
  const look = { x: pick([0, 1]), y: pick([0, 1]) };
  const closed = !cyclops && rand() < 0.12;
  const mouth = rand() < 0.4;
  for (let y = ey - 1; y <= ey + eh + (mouth ? 2 : 0); y++)
    for (let x = ex - 1; x < W / 2; x++) {
      body[y][x] = true;
      body[y][W - 1 - x] = true;
    }

  // drop what doesn't touch the face, so no pixel floats
  const keep = body.map((row) => row.map(() => false));
  const queue = [[ey, W / 2]];
  while (queue.length) {
    const [y, x] = queue.pop() as number[];
    if (y < 0 || y >= H || x < 0 || x >= W || keep[y][x] || !body[y][x])
      continue;
    keep[y][x] = true;
    queue.push([y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]);
  }
  const filled = keep.map((row) => row.includes(true));
  const top = filled.indexOf(true);
  const bottom = filled.lastIndexOf(true);

  const ramp = [...pick(RAMPS)];
  if (rand() < 0.5) ramp.reverse();
  const out: string[] = [];
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      out.push(dither(2, (y / (SIZE - 1)) ** 3 * 0.3, x, y) ? DUSK[0] : NIGHT);
  const set = (x: number, y: number, color: string) => {
    out[(y + AT) * SIZE + x + AT] = color;
  };
  const isBody = (x: number, y: number) => keep[y]?.[x] ?? false;

  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (isBody(x, y)) {
        const k = bottom > top ? (y - top) / (bottom - top) : 0;
        set(x, y, ramp[dither(ramp.length, k, x + AT, y + AT)]);
      }
  for (let y = -1; y <= H; y++)
    for (let x = -1; x <= W; x++)
      if (
        !isBody(x, y) &&
        (isBody(x + 1, y) ||
          isBody(x - 1, y) ||
          isBody(x, y + 1) ||
          isBody(x, y - 1))
      )
        set(x, y, LINE);

  const eyes = cyclops ? [W / 2 - 2] : [ex, W - ex - ew];
  for (const left of eyes) {
    if (closed) {
      for (let x = left; x < left + ew; x++) set(x, ey + 1, LINE);
      continue;
    }
    for (let y = ey; y < ey + eh; y++)
      for (let x = left; x < left + ew; x++) set(x, y, WHITE);
    const p = cyclops ? 2 : 1;
    const px = left + look.x * (ew - p);
    const py = ey + look.y * (eh - p);
    for (let y = py; y < py + p; y++)
      for (let x = px; x < px + p; x++) set(x, y, NIGHT);
  }
  if (mouth) for (const x of [W / 2 - 1, W / 2]) set(x, ey + eh + 1, LINE);
  return out;
}

/** One SVG path per colour, so a critter is a handful of nodes, not 256. */
function critterPaths(seed: number) {
  const byColor = new Map<string, string>();
  drawCritter(seed).forEach((color, i) => {
    const d = `M${i % SIZE} ${Math.floor(i / SIZE)}h1v1h-1z`;
    byColor.set(color, (byColor.get(color) ?? "") + d);
  });
  return [...byColor];
}

// Sightline's made-up names (src/lib/profile.ts): 24 by 24.
const ADJECTIVES =
  "Amber Violet Ember Golden Plum Velvet Lunar Hazy Quiet Sleepy Dusky Rosy Misty Starry Mellow Cosmic Sunny Gentle Brave Swift Cozy Lucky Tiny Fuzzy".split(
    " ",
  );
const ANIMALS =
  "Fox Owl Moth Heron Otter Lynx Finch Badger Hare Wren Crow Gecko Newt Koala Panda Raven Seal Sparrow Toad Yak Lemur Marten Quokka Bat".split(
    " ",
  );
const any = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function CrittersPiece({
  name,
  labels,
}: {
  name: string;
  labels: Labels["critters"];
}) {
  const [critter, setCritter] = useState<{ seed: number; name: string } | null>(
    null,
  );
  const roll = () =>
    setCritter({
      seed: crypto.getRandomValues(new Uint32Array(1))[0],
      name: `${any(ADJECTIVES)} ${any(ANIMALS)}`,
    });
  useEffect(roll, []);

  return (
    <figure aria-labelledby={name} className={well}>
      <div className="grid place-items-center px-6 py-8">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={
            critter ? `${labels.label} ${critter.name}` : labels.label
          }
          shapeRendering="crispEdges"
          className="size-32 rounded-[10px] outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
          style={{ background: NIGHT }}
        >
          {critter &&
            critterPaths(critter.seed).map(([color, d]) => (
              <path key={color} d={d} fill={color} />
            ))}
        </svg>
      </div>
      <Caption action={labels.another} onAction={roll}>
        {critter && (
          <>
            <span className="text-foreground">{critter.name}</span>
            <span className="ms-3 font-mono text-sm tabular-nums">
              {labels.seed} {critter.seed}
            </span>
          </>
        )}
      </Caption>
    </figure>
  );
}
