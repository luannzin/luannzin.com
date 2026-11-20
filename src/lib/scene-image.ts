import { deflateSync } from "node:zlib";
import {
  createScene,
  type Frame,
  RADIUS,
  renderer,
  type Scene,
  START,
  viewOf,
} from "@/lib/scene";

// Scenes as image files, for pictures shown outside the site (the GitHub
// profile). Drawn straight into pixels instead of through next/og: an SVG of
// thousands of dots takes seconds to rasterize, and GitHub's image proxy
// gives up after about four.
const CELL = 5;

// How many looping scenes `scripts/scene-loops.ts` draws into
// `public/scene-loop/` before each build.
export const POOL = 30;

const groundOf = (scene: Scene) =>
  [1, 3, 5].map((i) => Number.parseInt(scene.time.ground.slice(i, i + 2), 16));

// One frame into RGB pixels at `at`: the ground, then a round dot per cell
// with a one-pixel soft edge, as the shader draws it. `lead` bytes open each
// row (PNG's filter byte).
function paint(
  out: Uint8Array,
  at: number,
  frame: Frame,
  ground: number[],
  cols: number,
  rows: number,
  lead: number,
) {
  const W = cols * CELL;
  const stride = lead + W * 3;
  for (let y = 0; y < rows * CELL; y++) {
    for (let x = 0; x < W; x++) out.set(ground, at + y * stride + lead + x * 3);
  }
  for (let k = 0; k < cols * rows; k++) {
    const step = frame[k * 4 + 3];
    if (!step) continue;
    const r = RADIUS[step] * CELL;
    const cx = ((k % cols) + 0.5) * CELL;
    const cy = (Math.floor(k / cols) + 0.5) * CELL;
    for (let y = Math.floor(cy - r); y < cy + r; y++) {
      for (let x = Math.floor(cx - r); x < cx + r; x++) {
        const a = Math.min(
          1,
          Math.max(0, r - Math.hypot(x + 0.5 - cx, y + 0.5 - cy) + 0.5),
        );
        if (!a) continue;
        const p = at + y * stride + lead + x * 3;
        for (let c = 0; c < 3; c++) {
          out[p + c] = ground[c] + (frame[k * 4 + c] - ground[c]) * a;
        }
      }
    }
  }
}

// The whole 2:1 scene's first frame as a PNG, 240 dots across (1200x600),
// encoded with node:zlib so it draws in about 0.2s at request time.
export function sceneWide(seed: number) {
  const cols = 240;
  const rows = 120;
  const W = cols * CELL;
  const H = rows * CELL;
  const scene = createScene(seed);
  const frame = renderer(scene, cols, rows, viewOf(scene, false))(START);
  const raw = new Uint8Array(H * (1 + W * 3));
  paint(raw, 0, frame, groundOf(scene), cols, rows, 1);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(W, 0);
  header.writeUInt32BE(H, 4);
  header.set([8, 2], 8); // 8 bits a channel, RGB
  return new Uint8Array(
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", header),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

// The whole scene moving for four seconds at its own 15 frames a second, as a
// looping lossless WebP, 120 dots across (600x300). Too slow to draw per
// request (about 3s), so `scripts/scene-loops.ts` draws the pool before each
// build. sharp is imported here, not at the top, so the PNG route never
// loads it.
export async function sceneLoop(seed: number) {
  const { default: sharp } = await import("sharp");
  const cols = 120;
  const rows = 60;
  const fps = 15;
  const frames = 60;
  const size = cols * CELL * rows * CELL * 3;
  const scene = createScene(seed);
  const draw = renderer(scene, cols, rows, viewOf(scene, false));
  const ground = groundOf(scene);
  // A second past the end is drawn too and faded into the opening second, so
  // the loop wraps without lanterns or rain jumping back to where they began.
  const fade = fps;
  const drawn = new Uint8Array(size * (frames + fade));
  for (let f = 0; f < frames + fade; f++) {
    paint(drawn, f * size, draw(START + f / fps), ground, cols, rows, 0);
  }
  const raw = drawn.slice(0, size * frames);
  for (let f = 0; f < fade; f++) {
    const w = f / fade;
    for (let p = f * size; p < (f + 1) * size; p++) {
      raw[p] = drawn[p + frames * size] * (1 - w) + drawn[p] * w;
    }
  }
  const webp = await sharp(raw, {
    raw: {
      width: cols * CELL,
      height: rows * CELL * frames,
      channels: 3,
      pageHeight: rows * CELL,
    },
  })
    .webp({
      lossless: true,
      loop: 0,
      delay: Array(frames).fill(Math.round(1000 / fps)),
    })
    .toBuffer();
  return new Uint8Array(webp);
}

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

// A PNG chunk: length, type, data, then the CRC of type and data.
function chunk(type: string, data: Buffer) {
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  let crc = 0xffffffff;
  for (const byte of body) crc = CRC[(crc ^ byte) & 255] ^ (crc >>> 8);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE((crc ^ 0xffffffff) >>> 0, body.length + 4);
  return out;
}
