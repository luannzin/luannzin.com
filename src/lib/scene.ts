// Seeded scenes drawn as halftone dots, after ascii.rest's scene pieces
// (night coast, aurora fjord). One seed picks the time of day, the place, the
// landmark and every shape in it. Each frame shades every cell in colour, then
// turns it into a dot whose size is its brightness, ordered-dithered so
// gradients read as texture.
//
// Coordinates: the full scene is 2 units wide and 1 tall, y growing down.

type RGB = [number, number, number];

type Time = {
  words: string[];
  top: RGB;
  mid: RGB;
  horizon: RGB;
  band?: RGB; // a thin bright band just above the horizon
  body: "moon" | "sun";
  bodyColor: RGB;
  halo: RGB;
  stars: number;
  aurora?: boolean;
  light: RGB; // what the sun or moon casts on land and cloud
  shade: RGB; // land in shadow
  water: RGB;
  cloud: [RGB, RGB, RGB]; // shadow, middle, lit rim
  warm: RGB; // lamps and windows
  snow: boolean;
  ground: string;
};

const TIMES: Record<string, Time> = {
  night: {
    words: ["night", "moonlit", "midnight", "silver"],
    top: [0.02, 0.035, 0.1],
    mid: [0.045, 0.075, 0.18],
    horizon: [0.2, 0.25, 0.42],
    body: "moon",
    bodyColor: [0.95, 0.96, 1],
    halo: [0.3, 0.35, 0.45],
    stars: 1,
    light: [0.5, 0.58, 0.78],
    shade: [0.035, 0.05, 0.075],
    water: [0.05, 0.09, 0.2],
    cloud: [
      [0.09, 0.12, 0.24],
      [0.33, 0.39, 0.55],
      [0.9, 0.92, 0.98],
    ],
    warm: [1, 0.78, 0.42],
    snow: false,
    ground: "#070a12",
  },
  twilight: {
    words: ["twilight", "indigo", "violet", "late"],
    top: [0.035, 0.05, 0.16],
    mid: [0.14, 0.15, 0.37],
    horizon: [0.62, 0.42, 0.5],
    band: [0.98, 0.6, 0.36],
    body: "moon",
    bodyColor: [1, 0.97, 0.9],
    halo: [0.4, 0.35, 0.5],
    stars: 0.55,
    light: [0.66, 0.56, 0.74],
    shade: [0.05, 0.045, 0.1],
    water: [0.1, 0.11, 0.27],
    cloud: [
      [0.15, 0.13, 0.32],
      [0.48, 0.36, 0.56],
      [1, 0.72, 0.6],
    ],
    warm: [1, 0.76, 0.4],
    snow: false,
    ground: "#080913",
  },
  dusk: {
    words: ["dusk", "ember", "amber", "evening"],
    top: [0.08, 0.06, 0.2],
    mid: [0.48, 0.2, 0.38],
    horizon: [1, 0.6, 0.32],
    band: [1, 0.82, 0.5],
    body: "sun",
    bodyColor: [1, 0.9, 0.66],
    halo: [0.95, 0.45, 0.24],
    stars: 0.12,
    light: [1, 0.6, 0.4],
    shade: [0.08, 0.04, 0.1],
    water: [0.22, 0.11, 0.24],
    cloud: [
      [0.27, 0.1, 0.28],
      [0.74, 0.33, 0.4],
      [1, 0.8, 0.52],
    ],
    warm: [1, 0.82, 0.5],
    snow: false,
    ground: "#0d0811",
  },
  dawn: {
    words: ["dawn", "rose", "morning", "pale"],
    top: [0.09, 0.15, 0.33],
    mid: [0.5, 0.46, 0.66],
    horizon: [1, 0.78, 0.62],
    band: [1, 0.9, 0.74],
    body: "sun",
    bodyColor: [1, 0.97, 0.86],
    halo: [1, 0.72, 0.58],
    stars: 0.08,
    light: [1, 0.8, 0.68],
    shade: [0.08, 0.085, 0.16],
    water: [0.24, 0.27, 0.45],
    cloud: [
      [0.3, 0.3, 0.48],
      [0.78, 0.6, 0.72],
      [1, 0.92, 0.84],
    ],
    warm: [1, 0.85, 0.55],
    snow: false,
    ground: "#0b0d18",
  },
  aurora: {
    words: ["aurora", "polar", "northern", "boreal"],
    top: [0.01, 0.02, 0.055],
    mid: [0.025, 0.055, 0.11],
    horizon: [0.1, 0.18, 0.26],
    body: "moon",
    bodyColor: [0.92, 0.96, 1],
    halo: [0.2, 0.28, 0.32],
    stars: 1,
    aurora: true,
    light: [0.42, 0.7, 0.66],
    shade: [0.02, 0.035, 0.055],
    water: [0.03, 0.07, 0.12],
    cloud: [
      [0.05, 0.08, 0.14],
      [0.2, 0.28, 0.36],
      [0.6, 0.72, 0.78],
    ],
    warm: [1, 0.74, 0.38],
    snow: true,
    ground: "#04070d",
  },
};

const PLACES = {
  coast: ["coast", "cove", "headland", "harbor"],
  fjord: ["fjord", "sound", "inlet"],
  lake: ["lake", "shore", "mere"],
  valley: ["valley", "ridge", "highlands", "pass"],
  dunes: ["dunes", "desert", "mesa"],
};
type Place = keyof typeof PLACES;
type Landmark = "lighthouse" | "cabin" | "windmill" | "boat" | "none";

type Range = {
  base: number;
  amp: number;
  freq: number;
  phase: number;
  haze: number;
  sides: number; // 0 even, 1 high at the edges and low in the middle
  smoothness: number; // 0 ridged rock, 1 rounded dunes
};

export type Scene = {
  seed: number;
  name: string;
  ground: string;
  // Where the eye lands, for the square crop of the home page tile.
  focus: number;
  focusY: number;
  time: Time;
  place: Place;
  horizon: number;
  water: boolean;
  ranges: Range[];
  body: { x: number; y: number; r: number; phase: number };
  clouds: number;
  side: number; // -1 headland or hill on the left, 1 on the right
  landmark: Landmark;
  mark: number; // the landmark's x
  stripes: boolean;
  snow: boolean;
  wind: number;
};

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(input: string | number): number {
  if (typeof input === "number") return input >>> 0;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function weighted<T extends string>(
  random: () => number,
  weights: Record<T, number>,
): T {
  const entries = Object.entries(weights) as [T, number][];
  let roll = random() * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [key, w] of entries) {
    roll -= w;
    if (roll <= 0) return key;
  }
  return entries[0][0];
}

export function createScene(seed: number): Scene {
  const random = mulberry32(seed);
  const timeKey = weighted(random, {
    night: 2,
    twilight: 1.5,
    dusk: 2.5,
    dawn: 2,
    aurora: 2,
  });
  const time = TIMES[timeKey];
  const place = weighted<Place>(random, {
    coast: 3,
    fjord: timeKey === "dusk" ? 1 : 2.5,
    lake: 2,
    valley: 2,
    dunes: time.snow ? 0 : 1.2,
  });
  const water = place !== "valley" && place !== "dunes";
  const horizon = water ? 0.6 + random() * 0.08 : 0.62 + random() * 0.06;
  const side = random() < 0.5 ? -1 : 1;

  const landmark: Landmark =
    place === "coast"
      ? random() < 0.6
        ? "lighthouse"
        : "cabin"
      : place === "fjord"
        ? "cabin"
        : place === "lake"
          ? random() < 0.5
            ? "boat"
            : "cabin"
          : place === "valley"
            ? random() < 0.5
              ? "windmill"
              : "cabin"
            : "none";

  // The landmark sits on a third; the sun or moon balances it on the other.
  const third = side < 0 ? 0.38 + random() * 0.18 : 1.44 + random() * 0.18;
  const mark = place === "fjord" ? 1 + side * (0.18 + random() * 0.12) : third;
  const bodyX = side < 0 ? 1.3 + random() * 0.4 : 0.3 + random() * 0.4;
  const sunLow = time.body === "sun";
  const body = {
    x: bodyX,
    y: sunLow ? horizon - 0.05 - random() * 0.08 : 0.14 + random() * 0.14,
    r: sunLow ? 0.06 + random() * 0.03 : 0.035 + random() * 0.025,
    phase: random() < 0.5 ? 0 : 0.25 + random() * 0.45,
  };

  const ranges: Range[] = [];
  const add = (
    base: number,
    amp: number,
    haze: number,
    sides = 0,
    smooth = 0,
  ) =>
    ranges.push({
      base,
      amp,
      freq: 1.4 + random() * 1.8,
      phase: random() * 100,
      haze,
      sides,
      smoothness: smooth,
    });
  if (place === "coast") {
    add(horizon, 0.05 + random() * 0.04, 0.72);
  } else if (place === "fjord") {
    add(horizon, 0.12 + random() * 0.06, 0.62);
    add(horizon, 0.3 + random() * 0.12, 0.3, 1);
  } else if (place === "lake") {
    add(horizon, 0.16 + random() * 0.08, 0.6);
    add(horizon, 0.07 + random() * 0.05, 0.3);
  } else if (place === "valley") {
    add(horizon - 0.04, 0.2 + random() * 0.1, 0.66);
    add(horizon + 0.04, 0.16 + random() * 0.08, 0.45);
    add(horizon + 0.14, 0.12 + random() * 0.06, 0.22);
  } else {
    add(horizon, 0.06 + random() * 0.04, 0.6, 0, 1);
    add(horizon + 0.1, 0.07 + random() * 0.04, 0.35, 0, 1);
    add(horizon + 0.22, 0.08 + random() * 0.05, 0.12, 0, 1);
  }

  const name = `${pick(random, time.words)} ${pick(random, PLACES[place])}`;
  return {
    seed,
    name,
    ground: time.ground,
    focus: landmark === "none" ? bodyX : mark,
    focusY: landmark === "none" ? body.y : horizon - 0.08,
    time,
    place,
    horizon,
    water,
    ranges,
    body,
    clouds: time.aurora ? 0.25 + random() * 0.25 : 0.35 + random() * 0.6,
    side,
    landmark,
    mark,
    stripes: random() < 0.5,
    snow:
      time.snow ||
      ((place === "fjord" || place === "valley") &&
        timeKey !== "dusk" &&
        random() < 0.6),
    wind: 0.006 + random() * 0.01,
  };
}

// --- noise --------------------------------------------------------------

function hash(x: number, y: number, s: number): number {
  let h =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Value noise, wrapping every `period` lattice cells in x when period > 0.
function noise(x: number, y: number, s: number, period = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  let x0 = xi;
  let x1 = xi + 1;
  if (period) {
    x0 = ((xi % period) + period) % period;
    x1 = (x0 + 1) % period;
  }
  const a = hash(x0, yi, s);
  const b = hash(x1, yi, s);
  const c = hash(x0, yi + 1, s);
  const d = hash(x1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, s: number, octaves: number, period = 0) {
  let sum = 0;
  let norm = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * f, y * f, s + i, period * f);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

// --- rendering ----------------------------------------------------------

// The clock starts here, mid-motion, so the first frame is never a blank sky
// waiting for its clouds.
export const START = 12;

export type View = { x: number; y: number; w: number; h: number };
export type Pointer = { x: number; y: number; strength: number };
export type Tap = { x: number; y: number; t: number };

// One frame: a dot size (0 to 3) and a 24-bit colour per cell.
export type Frame = { step: Uint8Array; color: Uint32Array };

// Dot area for each step, against the largest, and the radius each step is
// drawn at, in cells: a pinprick, a bead, a full dot.
export const COVER = [0, 0.3, 0.6, 1];
export const RADIUS = [0, 0.13, 0.26, 0.42];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => v / 16 - 0.47,
);

const SKY = 0;
const SOLID = 1;
const WATER = 2;

type Light = { x: number; y: number; power: number; beam?: boolean };

export function renderer(scene: Scene, cols: number, rows: number, view: View) {
  const { time, horizon: H, body } = scene;
  const S = scene.seed % 100000;
  const n = cols * rows;
  const cw = view.w / cols;
  const ch = view.h / rows;
  const X = new Float32Array(cols);
  const Y = new Float32Array(rows);
  for (let c = 0; c < cols; c++) X[c] = view.x + (c + 0.5) * cw;
  for (let r = 0; r < rows; r++) Y[r] = view.y + (r + 0.5) * ch;

  // --- land, built once ---------------------------------------------------
  const ridge = (range: Range, x: number) => {
    const f = range.freq;
    const p = range.phase;
    let h: number;
    if (range.smoothness) {
      // dunes: long swells with a sharp crest
      const s = Math.sin(x * f * 2.2 + p) * 0.5 + 0.5;
      h = 0.55 * s ** 2.2 + 0.45 * noise(x * f * 1.3 + p, 1, S);
    } else {
      const rn = (k: number) =>
        1 - Math.abs(2 * noise(x * f * k + p, k, S) - 1);
      h = 0.55 * rn(1) + 0.3 * rn(2.1) + 0.15 * rn(4.3);
      h = h ** 1.6;
    }
    const sides = range.sides
      ? 0.18 + 0.82 * smooth(0.32, 0.92, Math.abs(x - 1))
      : 1;
    return range.base - range.amp * h * sides;
  };

  const headland = (x: number) => {
    const d = scene.side < 0 ? x : 2 - x;
    const top =
      H -
      (0.13 + 0.05 * noise(S, 7, S)) * smooth(0.95, 0.15, d) -
      0.012 * fbm(x * 9, 3.7, S, 3);
    const bottom = H + 0.03 + 0.42 * smooth(0.7, 0, d);
    return { top, bottom, reach: d < 0.95 };
  };

  // the ground the landmark and its trees stand on
  const groundAt = (x: number): number => {
    if (scene.place === "coast") return headland(x).top;
    if (scene.place === "valley")
      return ridge(scene.ranges[scene.ranges.length - 1], x);
    if (scene.place === "dunes") return H;
    // fjord and lake: a low spit of shore at the waterline
    return H - 0.004;
  };
  const markBase = groundAt(scene.mark);

  type Tree = { x: number; base: number; h: number; w: number };
  const trees: Tree[] = [];
  const random = mulberry32(scene.seed ^ 0x9e3779b9);
  const plant = (from: number, to: number, scale: number) => {
    for (let x = from; x < to; x += (0.014 + random() * 0.03) * scale) {
      if (Math.abs(x - scene.mark) < 0.07 && scene.landmark !== "boat")
        continue;
      trees.push({
        x,
        base: groundAt(x) + 0.004,
        h: (0.025 + random() * 0.045) * scale,
        w: (0.008 + random() * 0.006) * scale,
      });
    }
  };
  if (scene.place === "coast") {
    scene.side < 0 ? plant(0, 0.62, 1) : plant(1.38, 2, 1);
  } else if (scene.place === "valley") {
    plant(0, 2, 1.6);
  } else if (scene.place === "fjord" || scene.place === "lake") {
    plant(scene.mark - 0.2, scene.mark + 0.2, 0.7);
    plant(0, 2, 0.4);
  }

  const kind = new Uint8Array(n);
  const base = new Float32Array(n * 3); // static colour of land
  const haze = new Float32Array(n);
  const lights: Light[] = [];
  // what distance fades land toward: the horizon, dimmed into the shade
  const hazeColor: RGB = [
    mix(time.shade[0], time.horizon[0], 0.62),
    mix(time.shade[1], time.horizon[1], 0.62),
    mix(time.shade[2], time.horizon[2], 0.66),
  ];
  const lightDir = Math.sign(body.x - 1) || 1;

  const paint = (k: number, rgb: RGB) => {
    kind[k] = SOLID;
    base[k * 3] = rgb[0];
    base[k * 3 + 1] = rgb[1];
    base[k * 3 + 2] = rgb[2];
  };
  const tint = (a: RGB, b: RGB, t: number): RGB => [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
  ];

  for (let r = 0; r < rows; r++) {
    const y = Y[r];
    for (let c = 0; c < cols; c++) {
      const x = X[c];
      const k = r * cols + c;
      haze[k] = fbm(x * 2.2, y * 3.4, S + 50, 3);
      kind[k] = scene.water && y >= H ? WATER : SKY;

      // ranges, far to near
      for (let i = 0; i < scene.ranges.length; i++) {
        const range = scene.ranges[i];
        const top = ridge(range, x);
        if (y < top || (scene.water && y >= H)) continue;
        const depth = y - top;
        const slope =
          (ridge(range, x + 0.004) - ridge(range, x - 0.004)) / 0.008;
        const facing = clamp(0.5 + slope * lightDir * 2.4);
        const grain = noise(x * 60 + depth * 18, depth * 30, S + 9);
        let lit = facing * (0.55 + 0.45 * grain) * smooth(0.3, 0, depth);
        if (range.smoothness)
          lit = clamp(facing * 1.2 - 0.1) * (0.8 + 0.2 * grain);
        let rgb = tint(time.shade, time.light, lit * 0.5);
        const peak = range.base - top > range.amp * 0.42;
        if (scene.snow && !range.smoothness && peak) {
          const line = 0.015 + 0.045 * noise(x * 14, 2, S + 3);
          if (depth < line * (1 + slope * lightDir * 0.3)) {
            const s = 0.35 + 0.65 * facing;
            rgb = tint(time.shade, [0.85, 0.9, 1], s * 0.85);
          }
        }
        // aerial perspective: far ranges and low ground fade toward the sky
        rgb = tint(rgb, hazeColor, range.haze);
        // the crest catches the sky behind it, one cell thick
        rgb = tint(rgb, time.horizon, 0.45 * smooth(ch * 1.3, 0, depth));
        // mist pooled at the foot of every range but the nearest
        if (i < scene.ranges.length - 1 || scene.water) {
          const mist =
            0.55 *
            smooth(range.base - 0.09, range.base, y) *
            (0.75 + 0.25 * grain);
          rgb = tint(rgb, time.horizon, mist * (0.5 + 0.5 * range.haze));
        }
        paint(k, rgb);
      }

      if (scene.place === "coast") {
        const land = headland(x);
        if (land.reach && y >= land.top && y < land.bottom) {
          const rock = fbm(x * 30, y * 30, S + 4, 3);
          const brow = smooth(land.top + 0.02, land.top, y);
          const s =
            0.1 +
            0.35 * rock * smooth(land.top + 0.2, land.top, y) +
            0.9 * brow;
          paint(k, tint(time.shade, time.light, s * 0.4));
        }
        // a low island on the far side
        const ix = scene.side < 0 ? 1.65 : 0.35;
        const isle =
          H -
          0.035 * Math.max(0, 1 - ((x - ix) / 0.28) ** 2) -
          0.012 * fbm(x * 18, 9, S, 2);
        if (y >= isle && y < H) paint(k, tint(time.shade, hazeColor, 0.55));
      }

      if (scene.place === "fjord" || scene.place === "lake") {
        // the spit of shore the landmark stands on
        if (
          Math.abs(x - scene.mark) < 0.22 &&
          y >=
            H - 0.006 - 0.008 * smooth(0.22, 0.05, Math.abs(x - scene.mark)) &&
          y < H + 0.008
        ) {
          paint(k, tint(time.shade, time.light, 0.12));
        }
      }
    }
  }

  // trees, each over only the cells its box covers
  for (const tree of trees) {
    const c0 = Math.max(0, Math.floor((tree.x - tree.w - 0.004 - view.x) / cw));
    const c1 = Math.min(
      cols - 1,
      Math.ceil((tree.x + tree.w + 0.004 - view.x) / cw),
    );
    const r0 = Math.max(0, Math.floor((tree.base - tree.h - view.y) / ch));
    const r1 = Math.min(rows - 1, Math.ceil((tree.base + 0.006 - view.y) / ch));
    for (let r = r0; r <= r1; r++) {
      const y = Y[r];
      const dy = y - (tree.base - tree.h);
      if (dy < 0 || y > tree.base + 0.006) continue;
      const along = dy / tree.h;
      const tier = 0.72 + 0.28 * ((along * 4) % 1);
      for (let c = c0; c <= c1; c++) {
        const k = r * cols + c;
        const dx = X[c] - tree.x;
        if (Math.abs(dx) <= tree.w * Math.min(1, along) * tier + 0.002) {
          const edge = dx * lightDir > tree.w * 0.2 ? 0.28 : 0.06;
          const fog = smooth(0.05, -0.05, tree.base - H) * 0.15;
          paint(k, tint(tint(time.shade, time.light, edge), hazeColor, fog));
          if (scene.snow && tier > 0.9)
            paint(k, tint(time.shade, [0.8, 0.85, 0.95], 0.45));
        }
      }
    }
  }

  // --- the landmark ---------------------------------------------------------
  const mx = scene.mark;
  const towerH = 0.2;
  const lampY = markBase - towerH - 0.02;
  const cabin = { w: 0.05, h: 0.036, roof: 0.036 };
  const boatY = H + 0.06;
  if (scene.landmark === "lighthouse") {
    lights.push({ x: mx, y: lampY, power: 1, beam: true });
  } else if (scene.landmark === "cabin") {
    lights.push({
      x: mx - cabin.w * 0.45,
      y: markBase - cabin.h * 0.5,
      power: 0.55,
    });
    lights.push({
      x: mx + cabin.w * 0.45,
      y: markBase - cabin.h * 0.5,
      power: 0.55,
    });
  } else if (scene.landmark === "windmill") {
    lights.push({ x: mx, y: markBase - 0.03, power: 0.45 });
  } else if (scene.landmark === "boat") {
    lights.push({ x: mx, y: boatY - 0.075, power: 0.6 });
  }

  for (let r = 0; r < rows; r++) {
    const y = Y[r];
    for (let c = 0; c < cols; c++) {
      const x = X[c];
      const k = r * cols + c;
      const dx = x - mx;
      if (scene.landmark === "lighthouse") {
        const top = markBase - towerH;
        if (y >= top && y < markBase + 0.01) {
          // never thinner than three cells, so it stands at any size
          const hw =
            Math.max(0.026, cw * 1.6) - 0.009 * smooth(markBase, top, y);
          if (Math.abs(dx) <= hw) {
            const s = 0.5 + 0.5 * ((dx / hw) * lightDir);
            const band =
              scene.stripes && Math.floor((markBase - y) / 0.034) % 2 === 1;
            const wall: RGB = band ? [0.62, 0.16, 0.14] : [0.86, 0.88, 0.92];
            paint(k, tint(tint(time.shade, wall, 0.35), wall, s * 0.75));
          }
        }
        if (
          y >= top - 0.008 &&
          y < top &&
          Math.abs(dx) <= Math.max(0.028, cw * 2)
        )
          paint(k, tint(time.shade, time.light, 0.35));
        if (
          y >= top - 0.036 &&
          y < top - 0.006 &&
          Math.abs(dx) <= Math.max(0.018, cw * 1.1)
        )
          kind[k] = 3; // lamp, lit per frame
        if (
          y >= top - 0.054 &&
          y < top - 0.034 &&
          Math.abs(dx) <= Math.max(0.024, cw * 1.8) - (top - 0.034 - y) * 1.1
        )
          paint(k, tint(time.shade, [0.4, 0.15, 0.12], 0.8));
      } else if (scene.landmark === "cabin") {
        const top = markBase - cabin.h;
        if (y >= top && y < markBase + 0.004 && Math.abs(dx) <= cabin.w) {
          const s = 0.3 + 0.4 * clamp(0.5 + (dx / cabin.w) * lightDir * 0.5);
          paint(k, tint(time.shade, [0.55, 0.42, 0.34], s));
          if (
            Math.abs(Math.abs(dx) - cabin.w * 0.45) < 0.009 &&
            y > top + 0.008 &&
            y < markBase - 0.007
          )
            kind[k] = 3;
        }
        const ry = top - y;
        if (
          ry > 0 &&
          ry < cabin.roof &&
          Math.abs(dx) <= cabin.w + 0.01 - (ry / cabin.roof) * (cabin.w + 0.01)
        ) {
          paint(
            k,
            scene.snow
              ? tint(time.shade, [0.85, 0.9, 1], 0.6)
              : tint(time.shade, [0.5, 0.16, 0.12], 0.7),
          );
        }
        // chimney
        const cx = mx + cabin.w * 0.5 * -lightDir;
        if (
          Math.abs(x - cx) < 0.006 &&
          y > top - cabin.roof * 0.95 &&
          y < top - cabin.roof * 0.3
        )
          paint(k, tint(time.shade, [0.4, 0.3, 0.28], 0.5));
      } else if (scene.landmark === "windmill") {
        const top = markBase - 0.11;
        if (y >= top && y < markBase + 0.006) {
          const hw = 0.026 - 0.014 * smooth(markBase, top, y);
          if (Math.abs(dx) <= hw) {
            const s = 0.35 + 0.4 * clamp(0.5 + (dx / hw) * lightDir * 0.5);
            paint(k, tint(time.shade, [0.82, 0.78, 0.7], s));
            if (
              Math.abs(dx) < 0.006 &&
              y > markBase - 0.04 &&
              y < markBase - 0.02
            )
              kind[k] = 3;
          }
        }
      }
    }
  }

  // --- clouds: heaps of noise that wrap, so they can drift forever ----------
  const period = 6;
  const span = Math.max(1, Math.round(period / cw));
  const skyRows = Math.max(0, Math.min(rows, Math.ceil((H - view.y) / ch)));
  const cover = new Float32Array(span * skyRows);
  const litc = new Float32Array(span * skyRows);
  const density = (x: number, y: number) => {
    const q = fbm(x * 1.4, y * 2.6, S + 20, 3, period * 1.4);
    const d = fbm(x * 3 + q * 1.6, y * 6 + q, S + 30, 5, period * 3);
    return (
      d +
      0.07 * smooth(0.08, 0.3, y) -
      0.05 * smooth(0.12, 0, y) -
      0.16 * smooth(H - 0.22, H - 0.02, y)
    );
  };
  const threshold = 0.68 - scene.clouds * 0.1;
  for (let r = 0; r < skyRows; r++) {
    const y = Y[r];
    for (let i = 0; i < span; i++) {
      const x = i * cw;
      const d = density(x, y);
      cover[r * span + i] = smooth(threshold, threshold + 0.1, d);
      const toward = density(x + 0.03 * lightDir, y - 0.04);
      litc[r * span + i] = clamp(
        0.5 + (d - toward) * 9 - (d - threshold) * 1.2,
      );
    }
  }

  const rgb = new Float32Array(n * 3);
  const out: Frame = { step: new Uint8Array(n), color: new Uint32Array(n) };

  return (t: number, pointer?: Pointer, taps: Tap[] = []): Frame => {
    // The beam turns every fourteen seconds and, at START, sweeps out across
    // the frame rather than off its edge.
    const aim = Math.acos(0.8 * (Math.sign(1 - scene.mark) || 1));
    const beam = ((t - START) / 14) * Math.PI * 2 - aim;
    const cb = Math.cos(beam);
    const flash = Math.max(0, Math.sin(beam)) ** 14 * 2.2;
    const drift = t * scene.wind;
    const dark = time.stars > 0.5;

    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      for (let c = 0; c < cols; c++) {
        const x = X[c];
        const k = r * cols + c;
        const kk = kind[k];
        let cr = 0;
        let cg = 0;
        let cb2 = 0;
        if (kk === WATER) continue; // second pass, once the sky is known

        const dbx = x - body.x;
        const dby = y - body.y;
        const dm = Math.sqrt(dbx * dbx + dby * dby);

        if (kk === SKY) {
          const v = clamp((y - 0.0) / H);
          const veil = 0.88 + 0.24 * haze[k];
          const lo = smooth(0, 0.6, v);
          const hi = smooth(0.55, 1, v);
          cr =
            mix(mix(time.top[0], time.mid[0], lo), time.horizon[0], hi) * veil;
          cg =
            mix(mix(time.top[1], time.mid[1], lo), time.horizon[1], hi) * veil;
          cb2 =
            mix(mix(time.top[2], time.mid[2], lo), time.horizon[2], hi) * veil;
          if (time.band) {
            const b = Math.exp(-(((H - y) / 0.035) ** 2)) * 0.55;
            cr += time.band[0] * b;
            cg += time.band[1] * b;
            cb2 += time.band[2] * b;
          }
          // the glow round the sun or moon, wide and low for a setting sun
          const halo =
            time.body === "sun"
              ? Math.exp(-((dbx / 0.7) ** 2) - (dby / 0.2) ** 2) * 0.5 +
                Math.exp(-dm / 0.09) * 0.6
              : Math.exp(-dm / 0.25) * 0.3 + Math.exp(-dm / 0.08) * 0.45;
          cr += time.halo[0] * halo;
          cg += time.halo[1] * halo;
          cb2 += time.halo[2] * halo;

          if (time.aurora) {
            for (let a = 0; a < 2; a++) {
              const edge =
                0.2 +
                a * 0.09 +
                0.06 * Math.sin(x * (1.6 + a) + S * 0.1 + t * 0.06) +
                0.05 * (noise(x * 2.4 + t * 0.05, a, S + 60) - 0.5);
              const above = edge - y;
              const fold = smooth(
                0.25,
                0.7,
                noise(x * 1.7 + a * 5 - t * 0.04, 3, S + 61),
              );
              const rays =
                0.35 +
                0.65 * noise(x * 70 + t * 0.6, a + t * 0.15, S + 62) ** 2;
              const shape =
                above > 0
                  ? Math.exp(-above / (0.16 - a * 0.05))
                  : Math.exp(above / 0.012);
              const g =
                shape *
                fold *
                rays *
                (a ? 0.55 : 0.95) *
                smooth(H, H - 0.18, y);
              const up = smooth(0, 0.14, above);
              cr += g * mix(0.18, 0.55, up);
              cg += g * mix(1, 0.32, up);
              cb2 += g * mix(0.55, 0.9, up);
            }
          }

          // clouds, broken round the sun or moon
          if (r < skyRows) {
            const sx = (x + drift) / cw;
            const ix = Math.floor(sx);
            const fx = sx - ix;
            const i0 = r * span + (((ix % span) + span) % span);
            const i1 = r * span + ((((ix + 1) % span) + span) % span);
            const cov =
              (cover[i0] + (cover[i1] - cover[i0]) * fx) *
              (0.04 + 0.96 * smooth(body.r * 1.4, body.r * 5, dm));
            const l = litc[i0] + (litc[i1] - litc[i0]) * fx;

            if (dm < body.r) {
              const face =
                time.body === "moon"
                  ? 0.82 + 0.18 * fbm(x * 90, y * 90, S + 7, 2)
                  : 1;
              let a = (1 - cov * 0.8) * smooth(body.r, body.r * 0.85, dm);
              if (body.phase && time.body === "moon") {
                // a crescent: the shadowed part of the disc
                const sx2 = dbx - body.r * (0.4 + body.phase) * lightDir * -1;
                if (Math.sqrt(sx2 * sx2 + dby * dby) < body.r * 0.95) a *= 0.06;
              }
              const warmBottom =
                time.body === "sun" ? smooth(-body.r, body.r, dby) * 0.25 : 0;
              cr = mix(cr, time.bodyColor[0] * face, a);
              cg = mix(cg, time.bodyColor[1] * face * (1 - warmBottom), a);
              cb2 = mix(
                cb2,
                time.bodyColor[2] * face * (1 - warmBottom * 1.6),
                a,
              );
            } else if (
              cov < 0.05 &&
              hash(c, r * 3 + 11, S) > 1 - 0.022 * time.stars
            ) {
              const tw =
                0.6 +
                0.4 *
                  Math.sin(
                    t * (1.5 + hash(c, r, S) * 3) + hash(r, c, S) * 6.28,
                  );
              const s =
                (0.45 + 0.55 * tw) *
                smooth(H, 0.2, y) *
                (1 - Math.min(1, halo));
              cr = Math.max(cr, s * 0.92);
              cg = Math.max(cg, s * 0.94);
              cb2 = Math.max(cb2, s);
            }

            if (cov > 0.01) {
              const near = Math.exp(-dm / 0.3);
              const b = clamp(
                l * (0.45 + 0.6 * near) + 0.25 * smooth(H - 0.25, H, y),
              );
              const [s0, s1, s2] = time.cloud;
              const kr =
                b < 0.5
                  ? mix(s0[0], s1[0], b * 2)
                  : mix(s1[0], s2[0], (b - 0.5) * 2);
              const kg =
                b < 0.5
                  ? mix(s0[1], s1[1], b * 2)
                  : mix(s1[1], s2[1], (b - 0.5) * 2);
              const kb =
                b < 0.5
                  ? mix(s0[2], s1[2], b * 2)
                  : mix(s1[2], s2[2], (b - 0.5) * 2);
              const a = Math.min(1, cov * 1.1);
              cr = mix(cr, kr, a);
              cg = mix(cg, kg, a);
              cb2 = mix(cb2, kb, a);
            }
          }
        } else if (kk === SOLID) {
          cr = base[k * 3];
          cg = base[k * 3 + 1];
          cb2 = base[k * 3 + 2];
        } else {
          // a lamp or window, flickering a little
          const g =
            0.82 +
            0.12 * Math.sin(t * 3.1 + c * 1.7) +
            0.06 * Math.sin(t * 7.3 + r) +
            0.25 * flash;
          // the lighthouse lamp burns white-hot at its core
          const hot = scene.landmark === "lighthouse" ? 0.45 : 0;
          cr = mix(time.warm[0], 1, hot) * g * (1 + hot * 0.3);
          cg = mix(time.warm[1], 1, hot) * g * (1 + hot * 0.3);
          cb2 = mix(time.warm[2], 1, hot) * g * (1 + hot * 0.3);
        }

        // the windmill's sails, turning
        if (scene.landmark === "windmill") {
          const hx = x - mx;
          const hy = y - (markBase - 0.11);
          const d = Math.sqrt(hx * hx + hy * hy);
          if (d < 0.085) {
            const a = Math.atan2(hy, hx) - t * 0.9;
            const arm = Math.abs(
              (((a % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2)) -
                Math.PI / 4,
            );
            const width = d * Math.sin(Math.PI / 4 - arm);
            if (width < 0.006 + (d > 0.025 ? 0.008 : 0)) {
              const s: RGB = d < 0.01 ? [0.3, 0.25, 0.22] : [0.8, 0.76, 0.68];
              cr = mix(time.shade[0], s[0], 0.55);
              cg = mix(time.shade[1], s[1], 0.55);
              cb2 = mix(time.shade[2], s[2], 0.55);
            }
          }
        }

        // smoke from the cabin's chimney, drifting with the wind
        if (scene.landmark === "cabin") {
          const sx = mx + cabin.w * 0.5 * -lightDir;
          const rise = markBase - cabin.h - cabin.roof * 0.95 - y;
          if (rise > 0 && rise < 0.16) {
            const off =
              x - sx - rise * rise * 3 - 0.004 * Math.sin(t + rise * 40);
            const puff = noise(off * 40, rise * 30 - t * 0.8, S + 70);
            const s =
              Math.exp(-((off / (0.006 + rise * 0.12)) ** 2)) *
              smooth(0.16, 0.02, rise) *
              smooth(0.35, 0.75, puff);
            const smoke = 0.3 * s;
            cr = mix(cr, time.light[0] * 0.55, smoke);
            cg = mix(cg, time.light[1] * 0.55, smoke);
            cb2 = mix(cb2, time.light[2] * 0.55, smoke);
          }
        }

        // lamps glow into the air round them; the lighthouse sweeps its beam
        if (kk !== 3) {
          for (const light of lights) {
            const lx = x - light.x;
            const ly = y - light.y;
            const d2 = lx * lx + ly * ly;
            if (d2 > 0.09 && !light.beam) continue; // the glow is gone by 0.3
            const dl = Math.sqrt(d2);
            let g =
              (light.beam
                ? Math.exp(-dl / 0.022) * 0.7 + Math.exp(-dl / 0.1) * 0.2
                : Math.exp(-dl / 0.012) * 0.5 + Math.exp(-dl / 0.06) * 0.1) *
              light.power;
            if (light.beam) {
              g *= 1 + flash * 0.8;
              if (lx * cb > 0) {
                const along = Math.abs(lx) / (Math.abs(cb) * 1.1 + 0.01);
                if (along < 1) {
                  // a pale wedge, white enough to read against a lit sky
                  const spread = 0.02 + Math.abs(lx) * 0.2;
                  const b =
                    (1 - along) ** 1.6 *
                    Math.exp(-((ly / spread) ** 2)) *
                    (dark ? 0.6 : 0.5);
                  cr += b * 0.95;
                  cg += b * 0.92;
                  cb2 += b * 0.8;
                }
              }
            }
            cr += time.warm[0] * g;
            cg += time.warm[1] * g;
            cb2 += time.warm[2] * g;
          }
        }

        if (pointer && pointer.strength > 0.01) {
          const px = x - pointer.x;
          const py = y - pointer.y;
          const dp = Math.sqrt(px * px + py * py);
          const g =
            (Math.exp(-dp / Math.max(0.012, ch * 1.2)) * 0.75 +
              Math.exp(-dp / 0.07) * 0.2) *
            pointer.strength;
          cr += time.warm[0] * g;
          cg += time.warm[1] * g;
          cb2 += time.warm[2] * g;
        }

        for (const tap of taps) {
          if (tap.y >= H && scene.water) continue;
          // a shooting star from where the sky was touched
          const age = t - tap.t;
          const hx = tap.x - lightDir * age * 0.9;
          const hy = tap.y + age * 0.35;
          const len = 0.14;
          const ux = -lightDir * 0.93;
          const uy = 0.36;
          const qx = x - hx;
          const qy = y - hy;
          const along = -(qx * ux + qy * uy);
          if (along > -0.01 && along < len) {
            const across = Math.abs(qx * uy - qy * ux);
            const s =
              Math.exp(-across / (ch * 0.6)) *
              1.2 *
              (1 - Math.max(0, along) / len) *
              smooth(1.1, 0.6, age);
            cr += s;
            cg += s * 0.95;
            cb2 += s * 0.85;
          }
        }

        rgb[k * 3] = cr;
        rgb[k * 3 + 1] = cg;
        rgb[k * 3 + 2] = cb2;
      }
    }

    // --- water: the sky and land above, mirrored and broken by the swell -----
    if (scene.water) {
      for (let r = 0; r < rows; r++) {
        const y = Y[r];
        if (y < H) continue;
        const depth = y - H;
        for (let c = 0; c < cols; c++) {
          const k = r * cols + c;
          if (kind[k] !== WATER) continue;
          const x = X[c];
          const w =
            0.6 * noise(x * 7 + t * 0.12, y * 55 - t * 0.6, S + 80) +
            0.4 * noise(x * 20 - t * 0.25, y * 110 - t * 1.1, S + 81);
          let ripple = 0;
          for (const tap of taps) {
            if (tap.y < H) continue;
            const age = t - tap.t;
            const d = Math.sqrt(((x - tap.x) / 3) ** 2 + (y - tap.y) ** 2);
            ripple +=
              Math.exp(-(((d - age * 0.05) / ch) ** 2)) * Math.exp(-age * 1.4);
          }
          const sway = (w - 0.5) * (0.012 + depth * 0.15) + ripple * 0.01;
          const my = 2 * H - y - depth * 0.15;
          const mr = Math.round((my - view.y) / ch - 0.5);
          const mc = Math.round((x + sway - view.x) / cw - 0.5);
          let fr = time.horizon[0];
          let fg = time.horizon[1];
          let fb = time.horizon[2];
          if (mr >= 0 && mr < rows && mc >= 0 && mc < cols) {
            const m = (mr * cols + mc) * 3;
            fr = rgb[m];
            fg = rgb[m + 1];
            fb = rgb[m + 2];
          }
          const swell = 0.5 + 0.9 * w;
          const mirror =
            (0.62 - 0.3 * smooth(0, 0.35, depth)) * (0.7 + 0.5 * w);
          let cr = mix(time.water[0] * swell, fr, mirror);
          let cg = mix(time.water[1] * swell, fg, mirror);
          let cb2 = mix(time.water[2] * swell, fb, mirror);
          // the road of light under the sun or moon
          const roadW = 0.02 + depth * 0.5;
          const road =
            Math.exp(-(((x - body.x) / roadW) ** 2)) * smooth(0.5, 0.82, w);
          const glint = road * (time.body === "sun" ? 0.8 : 0.7);
          cr += time.bodyColor[0] * glint;
          cg += time.bodyColor[1] * glint * (time.body === "sun" ? 0.8 : 1);
          cb2 += time.bodyColor[2] * glint * (time.body === "sun" ? 0.6 : 1);
          // lamps drawn down the water as broken streaks
          for (const light of lights) {
            const lw = 0.004 + depth * 0.06;
            const s =
              Math.exp(-(((x - light.x) / lw) ** 2)) *
              smooth(0.45, 0.8, w) *
              light.power *
              smooth(0.3, 0, depth) *
              (light.beam ? 0.8 + 0.6 * flash : 0.9);
            cr += time.warm[0] * s;
            cg += time.warm[1] * s;
            cb2 += time.warm[2] * s;
          }
          if (pointer && pointer.strength > 0.01 && pointer.y < H) {
            const s =
              Math.exp(-(((x - pointer.x) / (0.006 + depth * 0.05)) ** 2)) *
              smooth(0.45, 0.8, w) *
              pointer.strength *
              0.6 *
              smooth(0.25, 0, depth);
            cr += time.warm[0] * s;
            cg += time.warm[1] * s;
            cb2 += time.warm[2] * s;
          }
          cr += ripple * 0.5;
          cg += ripple * 0.55;
          cb2 += ripple * 0.6;
          // mist on the water at the horizon
          const mist = Math.exp(-depth / 0.025) * 0.14;
          cr += hazeColor[0] * mist;
          cg += hazeColor[1] * mist;
          cb2 += hazeColor[2] * mist;
          // the boat, riding the swell
          if (scene.landmark === "boat") {
            const by = boatY + Math.sin(t * 1.3) * 0.003;
            const bx = x - mx;
            const hull =
              y > by - 0.012 &&
              y < by &&
              Math.abs(bx) < 0.05 - (y - by + 0.012) * 1.2;
            const sail =
              y > by - 0.085 &&
              y < by - 0.014 &&
              bx * -lightDir > 0 &&
              Math.abs(bx) < (y - (by - 0.085)) * 0.55;
            const mast =
              Math.abs(bx) < 0.0025 && y > by - 0.09 && y < by - 0.012;
            if (hull || mast) {
              cr = time.shade[0] * 1.4;
              cg = time.shade[1] * 1.4;
              cb2 = time.shade[2] * 1.4;
            } else if (sail) {
              const s = 0.35 + 0.35 * smooth(by - 0.085, by - 0.02, y);
              cr = mix(time.shade[0], time.light[0], s);
              cg = mix(time.shade[1], time.light[1], s);
              cb2 = mix(time.shade[2], time.light[2], s);
            }
          }
          rgb[k * 3] = cr;
          rgb[k * 3 + 1] = cg;
          rgb[k * 3 + 2] = cb2;
        }
      }
    }

    // --- halftone -----------------------------------------------------------
    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      const fade = smooth(1, 0.82, y) * 0.35 + 0.65;
      for (let c = 0; c < cols; c++) {
        const k = r * cols + c;
        const cr = rgb[k * 3];
        const cg = rgb[k * 3 + 1];
        const cb2 = rgb[k * 3 + 2];
        // Land and the darkest sky drop to bare ground, so silhouettes and
        // stars read against true black.
        const floor = kind[k] === SKY ? 0.1 : kind[k] === WATER ? 0.12 : 0.03;
        const peak = Math.max(cr, cg, cb2, 1e-4);
        const level = clamp(floor + (1 - floor) * peak ** 0.85 * 0.95) * fade;
        const step = Math.max(
          0,
          Math.min(3, Math.round(level * 3 + BAYER[(r & 3) * 4 + (c & 3)])),
        );
        out.step[k] = step;
        if (step) {
          // A small dot is drawn brighter and a large one dimmer, so a gradient
          // stays smooth across the dither's steps.
          const want = Math.min(1, (level + 0.06) / COVER[step]);
          const s = (0.3 + 0.7 * want) / peak;
          // 6 bits a channel: enough for smooth tones, few enough to reuse fills
          out.color[k] =
            (Math.round(clamp(cr * s) * 63) << 12) |
            (Math.round(clamp(cg * s) * 63) << 6) |
            Math.round(clamp(cb2 * s) * 63);
        } else {
          out.color[k] = 0;
        }
      }
    }
    return out;
  };
}

export function colorString(packed: number) {
  const ch = (v: number) => Math.round((v / 63) * 255);
  return `rgb(${ch((packed >> 12) & 63)} ${ch((packed >> 6) & 63)} ${ch(packed & 63)})`;
}
