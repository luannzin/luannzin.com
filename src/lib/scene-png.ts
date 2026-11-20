import { deflateSync } from "node:zlib";
import { createScene, RADIUS, renderer, START, viewOf } from "@/lib/scene";

// The whole 2:1 scene as a PNG, 240 dots across at 5px a cell (1200x600),
// for a picture shown outside the site. Drawn straight into pixels instead of
// through next/og: an SVG of 28,800 dots takes seconds to rasterize, and
// GitHub's image proxy gives up after about four.
const COLS = 240;
const ROWS = 120;
const CELL = 5;
const W = COLS * CELL;
const H = ROWS * CELL;

export function sceneWide(seed: number) {
  const scene = createScene(seed);
  const frame = renderer(scene, COLS, ROWS, viewOf(scene, false))(START);
  const ground = [1, 3, 5].map((i) =>
    Number.parseInt(scene.time.ground.slice(i, i + 2), 16),
  );
  // One filter byte (0, none) then RGB for each row, as PNG wants it.
  const raw = new Uint8Array(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) raw.set(ground, y * (1 + W * 3) + 1 + x * 3);
  }
  for (let k = 0; k < COLS * ROWS; k++) {
    const step = frame[k * 4 + 3];
    if (!step) continue;
    const r = RADIUS[step] * CELL;
    const cx = ((k % COLS) + 0.5) * CELL;
    const cy = (Math.floor(k / COLS) + 0.5) * CELL;
    // A round dot with a one-pixel soft edge, as the shader draws it.
    for (let y = Math.floor(cy - r); y < cy + r; y++) {
      for (let x = Math.floor(cx - r); x < cx + r; x++) {
        const a = Math.min(
          1,
          Math.max(0, r - Math.hypot(x + 0.5 - cx, y + 0.5 - cy) + 0.5),
        );
        if (!a) continue;
        const at = y * (1 + W * 3) + 1 + x * 3;
        for (let c = 0; c < 3; c++) {
          raw[at + c] = ground[c] + (frame[k * 4 + c] - ground[c]) * a;
        }
      }
    }
  }
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
