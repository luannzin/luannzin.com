// Seeded scenes drawn as halftone dots, after ascii.rest's scene pieces
// (night coast, alpine dawn, kyoto dusk, tokyo rain, deep reef, varanasi
// ghats). One seed picks the place, the time of day, the landmark and every
// shape in it. Each frame shades every cell in colour, then turns it into a
// dot whose size is its brightness, ordered-dithered so gradients read as
// texture.
//
// Coordinates: the full scene is 2 units wide and 1 tall, y growing down.

type RGB = [number, number, number];

export type Time = {
  words: string[];
  top: RGB;
  mid: RGB;
  horizon: RGB;
  band?: RGB; // a thin bright band just above the horizon
  body?: "moon" | "sun"; // none behind an overcast sky
  sunk?: boolean; // the sun just gone, its glow still on the horizon
  bodyColor: RGB;
  halo: RGB;
  stars: number;
  clouds: [number, number]; // how much sky they cover, at least and at most
  aurora?: boolean;
  lanterns?: boolean; // sky lanterns rising, and embers
  rain?: number; // the share of the frame with rain falling in it
  lightning?: boolean;
  light: RGB; // what the sun or moon casts on land and cloud
  shade: RGB; // land in shadow
  water: RGB;
  cloud: [RGB, RGB, RGB]; // shadow, middle, lit rim
  warm: RGB; // lamps and windows
  snow: boolean;
  peak?: RGB; // rose light on high peaks, raised behind the rest
  ground: string;
};

const TIMES = {
  night: {
    words: ["night", "moonlit", "midnight", "silver"],
    top: [0.02, 0.035, 0.1],
    mid: [0.045, 0.075, 0.18],
    horizon: [0.2, 0.25, 0.42],
    body: "moon",
    bodyColor: [0.95, 0.96, 1],
    halo: [0.3, 0.35, 0.45],
    stars: 1,
    clouds: [0.35, 0.95],
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
    clouds: [0.35, 0.95],
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
    clouds: [0.35, 0.95],
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
    clouds: [0.35, 0.95],
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
    clouds: [0.25, 0.5],
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
  // the sun not yet up, and the snow on the peaks already rose
  alpenglow: {
    words: ["alpenglow", "daybreak", "sunrise", "blush"],
    top: [0.02, 0.03, 0.1],
    mid: [0.05, 0.07, 0.19],
    horizon: [0.44, 0.3, 0.44],
    band: [1, 0.62, 0.5],
    body: "sun",
    bodyColor: [1, 0.94, 0.82],
    halo: [1, 0.55, 0.45],
    stars: 0.45,
    clouds: [0.05, 0.3],
    light: [1, 0.55, 0.5],
    shade: [0.025, 0.03, 0.075],
    water: [0.05, 0.07, 0.18],
    cloud: [
      [0.1, 0.1, 0.24],
      [0.5, 0.32, 0.45],
      [1, 0.72, 0.6],
    ],
    warm: [1, 0.8, 0.5],
    snow: true,
    peak: [1, 0.64, 0.56],
    ground: "#070a16",
  },
  plum: {
    words: ["plum", "mauve", "blossom", "spring"],
    top: [0.035, 0.022, 0.06],
    mid: [0.1, 0.06, 0.15],
    horizon: [0.5, 0.28, 0.4],
    band: [1, 0.62, 0.6],
    body: "moon",
    bodyColor: [1, 0.96, 0.84],
    halo: [0.4, 0.28, 0.38],
    stars: 0.7,
    clouds: [0.15, 0.5],
    light: [0.95, 0.6, 0.7],
    shade: [0.045, 0.028, 0.06],
    water: [0.08, 0.04, 0.1],
    cloud: [
      [0.12, 0.07, 0.16],
      [0.42, 0.24, 0.36],
      [0.95, 0.68, 0.72],
    ],
    warm: [1, 0.72, 0.36],
    snow: false,
    ground: "#0b0710",
  },
  // after dark, with the sun's glow still low and lanterns going up
  lantern: {
    words: ["lantern", "festival", "wishing", "candlelit"],
    top: [0.012, 0.022, 0.07],
    mid: [0.03, 0.05, 0.15],
    horizon: [0.42, 0.25, 0.3],
    band: [1, 0.5, 0.3],
    body: "sun",
    sunk: true,
    bodyColor: [1, 0.62, 0.3],
    halo: [0.9, 0.4, 0.25],
    stars: 0.9,
    clouds: [0.1, 0.35],
    lanterns: true,
    light: [0.55, 0.45, 0.6],
    shade: [0.02, 0.025, 0.05],
    water: [0.03, 0.05, 0.12],
    cloud: [
      [0.05, 0.06, 0.14],
      [0.3, 0.2, 0.3],
      [0.9, 0.55, 0.4],
    ],
    warm: [1, 0.66, 0.26],
    snow: false,
    ground: "#04060f",
  },
  rain: {
    words: ["rain", "rainy", "wet", "drizzle"],
    top: [0.025, 0.025, 0.05],
    mid: [0.06, 0.05, 0.1],
    horizon: [0.3, 0.18, 0.3],
    bodyColor: [1, 1, 1],
    halo: [0, 0, 0],
    stars: 0,
    clouds: [2.2, 2.6],
    rain: 0.5,
    light: [0.45, 0.42, 0.6],
    shade: [0.025, 0.025, 0.04],
    water: [0.035, 0.035, 0.05],
    cloud: [
      [0.05, 0.045, 0.08],
      [0.16, 0.12, 0.2],
      [0.45, 0.32, 0.45],
    ],
    warm: [1, 0.72, 0.4],
    snow: false,
    ground: "#050409",
  },
  storm: {
    words: ["storm", "thunder", "squall", "tempest"],
    top: [0.04, 0.045, 0.06],
    mid: [0.1, 0.11, 0.15],
    horizon: [0.66, 0.68, 0.74], // a pale gap under the cloud
    bodyColor: [1, 1, 1],
    halo: [0, 0, 0],
    stars: 0,
    clouds: [2.1, 2.6],
    rain: 0.7,
    lightning: true,
    light: [0.55, 0.6, 0.72],
    shade: [0.03, 0.035, 0.05],
    water: [0.08, 0.09, 0.12],
    cloud: [
      [0.09, 0.1, 0.14],
      [0.3, 0.32, 0.4],
      [0.72, 0.76, 0.88],
    ],
    warm: [1, 0.78, 0.45],
    snow: false,
    ground: "#06070b",
  },
  // underwater: top is the lit surface, horizon the dark below
  deep: {
    words: ["deep", "sunken", "tidal", "blue"],
    top: [0.22, 0.66, 0.64],
    mid: [0.05, 0.23, 0.27],
    horizon: [0.008, 0.04, 0.06],
    body: "sun",
    bodyColor: [0.8, 1, 0.97],
    halo: [0.3, 0.85, 0.8],
    stars: 0,
    clouds: [0, 0],
    light: [0.42, 0.86, 0.82],
    shade: [0.01, 0.03, 0.045],
    water: [0, 0, 0],
    cloud: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    warm: [0.5, 0.95, 1],
    snow: false,
    ground: "#020a0d",
  },
} satisfies Record<string, Time>;
type TimeKey = keyof typeof TIMES;

type Place =
  | "coast"
  | "fjord"
  | "lake"
  | "valley"
  | "dunes"
  | "garden"
  | "river"
  | "city"
  | "reef";
type Landmark =
  | "lighthouse"
  | "cabin"
  | "windmill"
  | "boat"
  | "pagoda"
  | "torii"
  | "temple"
  | "walker"
  | "vending"
  | "wreck"
  | "manta"
  | "none";
type Weights<T extends string> = Partial<Record<T, number>>;

// Every place: how often it comes up, the times it is drawn at, and what can
// stand in it.
const PLACES: Record<
  Place,
  {
    words: string[];
    weight: number;
    times: Weights<TimeKey>;
    landmarks: Weights<Landmark>;
  }
> = {
  coast: {
    words: ["coast", "cove", "headland", "harbor"],
    weight: 3,
    times: {
      night: 2,
      twilight: 1.5,
      dusk: 2.5,
      dawn: 2,
      aurora: 1.5,
      storm: 1,
    },
    landmarks: { lighthouse: 3, cabin: 2 },
  },
  fjord: {
    words: ["fjord", "sound", "inlet"],
    weight: 2,
    times: {
      night: 2,
      twilight: 1.5,
      dawn: 2,
      aurora: 2.5,
      alpenglow: 2,
      storm: 0.6,
    },
    landmarks: { cabin: 2, boat: 1 },
  },
  lake: {
    words: ["lake", "shore", "mere", "tarn"],
    weight: 2.2,
    times: {
      night: 2,
      twilight: 1.5,
      dusk: 2,
      dawn: 2,
      aurora: 1.5,
      alpenglow: 2,
      lantern: 2.5,
    },
    landmarks: { boat: 1, cabin: 1 },
  },
  valley: {
    words: ["valley", "ridge", "highlands", "pass"],
    weight: 2,
    times: {
      night: 1.5,
      twilight: 1.5,
      dusk: 2,
      dawn: 2,
      aurora: 1,
      alpenglow: 1.5,
      storm: 1.2,
      lantern: 1,
    },
    landmarks: { windmill: 1, cabin: 1 },
  },
  dunes: {
    words: ["dunes", "desert", "mesa"],
    weight: 1.2,
    times: { night: 2, twilight: 1.5, dusk: 2.5, dawn: 1.5, storm: 0.5 },
    landmarks: { none: 1 },
  },
  garden: {
    words: ["garden", "shrine", "grove", "pond"],
    weight: 2,
    times: { plum: 3, dusk: 1.5, twilight: 1.5, night: 1, dawn: 1, lantern: 1 },
    landmarks: { pagoda: 2, torii: 1 },
  },
  river: {
    words: ["ghats", "river", "riverbank", "steps"],
    weight: 2,
    times: { dusk: 3, dawn: 2, twilight: 1.5, night: 1, lantern: 1.5 },
    landmarks: { temple: 1 },
  },
  city: {
    words: ["alley", "crossing", "street", "district"],
    weight: 2,
    times: { rain: 3, night: 2, twilight: 1.5, storm: 1 },
    landmarks: { walker: 2, vending: 1 },
  },
  reef: {
    words: ["reef", "shoal", "lagoon", "atoll"],
    weight: 1.5,
    times: { deep: 1 },
    landmarks: { wreck: 1, manta: 1 },
  },
};
const PLACE_WEIGHTS = Object.fromEntries(
  Object.entries(PLACES).map(([key, { weight }]) => [key, weight]),
) as Weights<Place>;
const WATERS: Place[] = ["coast", "fjord", "lake", "garden", "river"];

// The city street, in world units: how high we stand, and how far each side's
// buildings are from the middle of the road.
const EYE = 0.16;
const STREET = 0.9;
// The ghats: the depth of the steps down to the river.
const STEPS = 0.05;

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
  // Where the eye lands, for the square crop of the home page tile.
  focus: number;
  focusY: number;
  time: Time;
  place: Place;
  horizon: number; // in the city, the point the street runs away to
  water: boolean;
  ranges: Range[];
  body: { x: number; y: number; r: number; phase: number };
  clouds: number;
  side: number; // -1 headland or hill on the left, 1 on the right
  landmark: Landmark;
  mark: number; // the landmark's x
  depth: number; // in the city, how far up the street the landmark stands
  stripes: boolean;
  snow: boolean;
  pines: boolean; // tall pines framing both edges
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

// One key, by weight. A single choice takes no roll, so it leaves the stream
// (and every pick after it) as it was.
function weighted<T extends string>(
  random: () => number,
  weights: Weights<T>,
): T {
  const entries = Object.entries(weights) as [T, number][];
  if (entries.length === 1) return entries[0][0];
  let roll = random() * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [key, w] of entries) {
    roll -= w;
    if (roll <= 0) return key;
  }
  return entries[0][0];
}

export function createScene(seed: number): Scene {
  const random = mulberry32(seed);
  const place = weighted(random, PLACE_WEIGHTS);
  const spec = PLACES[place];
  const time: Time = TIMES[weighted(random, spec.times)];
  const landmark = weighted(random, spec.landmarks);
  const water = WATERS.includes(place);
  const city = place === "city";
  const reef = place === "reef";
  const horizon = reef
    ? 1
    : city
      ? 0.44 + random() * 0.06
      : water
        ? 0.6 + random() * 0.08
        : 0.62 + random() * 0.06;
  const side = random() < 0.5 ? -1 : 1;

  // The landmark sits on a third; the sun or moon balances it on the other.
  // In a garden the moon keeps the landmark company and a tree takes the far
  // side; in the city both are up the street.
  let mark = side < 0 ? 0.38 + random() * 0.18 : 1.44 + random() * 0.18;
  let bodyX = side < 0 ? 1.3 + random() * 0.4 : 0.3 + random() * 0.4;
  if (place === "fjord") mark = 1 + side * (0.18 + random() * 0.12);
  if (place === "garden") bodyX = 1 + side * (0.72 + random() * 0.14);
  let depth = 0;
  if (city) {
    const vending = landmark === "vending";
    depth = vending ? 0.9 + random() * 0.35 : 1.3 + random() * 0.5;
    mark =
      1 + (side * (vending ? STREET - 0.075 : 0.05 + random() * 0.25)) / depth;
    bodyX = 0.88 + random() * 0.24;
  }
  const sun = time.body === "sun";
  const body = {
    x: bodyX,
    y: reef
      ? -0.02
      : time.sunk
        ? horizon + 0.09
        : sun
          ? horizon - 0.05 - random() * 0.08
          : city
            ? 0.06 + random() * 0.05
            : 0.14 + random() * 0.14,
    r: reef
      ? 0.07 + random() * 0.02
      : sun
        ? 0.06 + random() * 0.03
        : 0.035 + random() * 0.025,
    phase: random() < 0.5 ? 0 : 0.25 + random() * 0.45,
  };

  const ranges: Range[] = [];
  const add = (
    base: number,
    amp: number,
    haze: number,
    sides = 0,
    smooth = 0,
    freq = 1.4 + random() * 1.8,
  ) =>
    ranges.push({
      base,
      amp,
      freq,
      phase: random() * 100,
      haze,
      sides,
      smoothness: smooth,
    });
  if (
    time.peak &&
    (place === "lake" || place === "fjord" || place === "valley")
  )
    add(
      horizon - 0.02,
      0.36 + random() * 0.12,
      0.2,
      0,
      0,
      0.7 + random() * 0.5,
    );
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
  } else if (place === "dunes") {
    add(horizon, 0.06 + random() * 0.04, 0.6, 0, 1);
    add(horizon + 0.1, 0.07 + random() * 0.04, 0.35, 0, 1);
    add(horizon + 0.22, 0.08 + random() * 0.05, 0.12, 0, 1);
  } else if (place === "garden") {
    add(horizon, 0.05 + random() * 0.05, 0.68);
  } else if (place === "river") {
    add(horizon - 0.03, 0.04 + random() * 0.03, 0.78);
  } else if (reef) {
    // rock high at both edges and sand in the middle, far then near
    add(1, 0.62 + random() * 0.14, 0.6, 1);
    add(1.03, 0.95 + random() * 0.2, 0.08, 1);
  }

  const name = `${pick(random, time.words)} ${pick(random, spec.words)}`;
  let focus = mark;
  let focusY = horizon - 0.08;
  if (landmark === "none") {
    focus = bodyX;
    focusY = body.y;
  } else if (landmark === "pagoda" || landmark === "temple") {
    focusY = horizon - 0.15;
  } else if (landmark === "torii") {
    focusY = horizon - 0.05;
  } else if (city) {
    focusY = horizon + (EYE - 0.1) / depth;
  } else if (landmark === "wreck") {
    focusY = 0.84;
  } else if (landmark === "manta") {
    focusY = 0.32;
  }
  return {
    seed,
    name,
    focus,
    focusY,
    time,
    place,
    horizon,
    water,
    ranges,
    body,
    clouds: time.clouds[0] + random() * (time.clouds[1] - time.clouds[0]),
    side,
    landmark,
    mark,
    depth,
    stripes: random() < 0.5,
    snow:
      time.snow ||
      ((place === "fjord" || place === "valley") &&
        (time === TIMES.night ||
          time === TIMES.twilight ||
          time === TIMES.dawn) &&
        random() < 0.6),
    pines:
      (place === "lake" || place === "fjord" || place === "valley") &&
      random() < (time.peak ? 0.8 : 0.3),
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
    // the same wrap as `%` twice, without the cost of a float remainder
    x0 = xi - Math.floor(xi / period) * period;
    x1 = x0 + 1 < period ? x0 + 1 : x0 + 1 - period;
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
const frac = (v: number) => v - Math.floor(v);

// Katakana, five cells square, for the city's signs.
const GLYPHS = [
  ["#####", ".....", "#####", "....#", "..##."],
  ["....#", "#..#.", ".##..", ".#.#.", "#...#"],
  ["#...#", ".#..#", "....#", "...#.", "###.."],
  ["...#.", "#####", "..##.", ".#.#.", "#.##."],
  [".#...", ".####", "#..#.", "...#.", "..#.."],
  [".#...", ".#...", ".###.", ".#...", ".#..."],
  ["#####", "#...#", "#...#", "#...#", "#####"],
  ["#####", "..#..", "..#..", "..#..", "#####"],
  [".#...", "#####", ".#..#", ".#..#", "#..##"],
  [".#.#.", "#####", ".#.#.", "...#.", "..#.."],
  ["#####", "....#", "...#.", "..##.", "##..#"],
  ["..#..", "#####", "#.#.#", "#####", "..#.."],
];

// One cell of a sign `w` by `h` cells: a lit border, and glyphs running down
// it (or across, when it is wide) once there is room to draw them.
function signPixel(i: number, j: number, w: number, h: number, glyph: number) {
  if (w < 3 || h < 3) return true;
  if (i === 0 || j === 0 || i === w - 1 || j === h - 1) return true;
  const wide = w > h;
  const size = (wide ? h : w) - 4;
  if (size < 3) return hash(i, j, glyph) < 0.5; // too small to read: a scatter
  const along = (wide ? i : j) - 2;
  const across = (wide ? j : i) - 2;
  const n = Math.floor(along / (size + 1));
  const a = along - n * (size + 1);
  if (along < 0 || across < 0 || across >= size || a >= size) return false;
  if (n * (size + 1) + size > (wide ? w : h) - 4) return false;
  const g = GLYPHS[(glyph + n) % GLYPHS.length];
  const gx = Math.floor(((wide ? a : across) * 5) / size);
  const gy = Math.floor(((wide ? across : a) * 5) / size);
  return g[gy][gx] === "#";
}

// --- rendering ----------------------------------------------------------

// The clock starts here, mid-motion, so the first frame is never a blank sky
// waiting for its clouds.
export const START = 12;

export type View = { x: number; y: number; w: number; h: number };

// The window a frame draws: the whole 2:1 scene, or, for a post's tile on the
// home page, a close square round its landmark, so it still reads at 44px.
export function viewOf(scene: Scene, crop: boolean): View {
  const size = 0.45;
  return crop
    ? {
        x: Math.min(2 - size, Math.max(0, scene.focus - size / 2)),
        y: Math.min(1 - size, Math.max(0, scene.focusY - size * 0.6)),
        w: size,
        h: size,
      }
    : { x: 0, y: 0, w: 2, h: 1 };
}

export type Pointer = { x: number; y: number; strength: number };
export type Tap = { x: number; y: number; t: number };

// One frame: four bytes a cell, its colour and then its dot size (0 to 3), so
// it goes to the GPU as it is.
export type Frame = Uint8ClampedArray;

// Dot area for each step, against the largest, and the radius each step is
// drawn at, in cells: a pinprick, a bead, a full dot.
const COVER = [0, 0.3, 0.6, 1];
export const RADIUS = [0, 0.13, 0.26, 0.42];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => v / 16 - 0.47,
);
// How far a dot's colour is pushed from grey, and how bright the dimmest dot
// is drawn.
const VIVID = { chroma: 1.45, least: 0.38 };

const SKY = 0;
const SOLID = 1;
const WATER = 2; // water, or a wet street: anything that mirrors
const LAMP = 3; // a cell lit per frame: a lamp or a window
const SIGN = 4; // a neon sign: its own light, so none falls back on it
const BLINK = 6; // a neon sign with a failing tube
const SEA = 5; // open water all round, under the surface

type Light = { x: number; y: number; power: number; beam?: boolean };

const WHITE: RGB = [1, 1, 1];
const STAR: RGB = [0.92, 0.94, 1];
const TRAIL: RGB = [1, 0.95, 0.85];
const BEAM: RGB = [0.95, 0.92, 0.8];
const RIPPLE: RGB = [0.5, 0.55, 0.6];
const AURORA_LOW: RGB = [0.18, 1, 0.55];
const AURORA_HIGH: RGB = [0.55, 0.32, 0.9];
const HUB: RGB = [0.3, 0.25, 0.22];
const SAIL: RGB = [0.8, 0.76, 0.68];
const SNOW: RGB = [0.85, 0.9, 1];
const BOLT: RGB = [0.85, 0.85, 1];
const RAIN: RGB = [0.55, 0.6, 0.78];
const COOL: RGB = [0.62, 0.8, 1];
const LANTERN_TOP: RGB = [0.95, 0.4, 0.12];
const LANTERN_FOOT: RGB = [1, 0.92, 0.55];
const BLOSSOM: [RGB, RGB, RGB] = [
  [0.34, 0.13, 0.27],
  [0.9, 0.5, 0.66],
  [1, 0.85, 0.9],
];
const VERMILION: RGB = [0.9, 0.28, 0.16];
const WOOD: RGB = [0.36, 0.17, 0.14];
const SANDSTONE: RGB = [0.82, 0.56, 0.42];
const NEON: RGB[] = [
  [1, 0.32, 0.62],
  [1, 0.74, 0.28],
  [0.3, 0.88, 1],
  [1, 0.3, 0.22],
  [0.92, 0.94, 1],
  [0.68, 0.5, 1],
];
const CORAL: RGB[] = [
  [1, 0.5, 0.28],
  [0.74, 0.42, 0.86],
  [0.98, 0.84, 0.34],
  [1, 0.42, 0.56],
  [0.95, 0.3, 0.24],
];
const SILVER: RGB = [0.85, 0.95, 1];
const BUBBLE: RGB = [0.8, 1, 1];

export function renderer(scene: Scene, cols: number, rows: number, view: View) {
  const { time, horizon: H, body, place, landmark } = scene;
  const S = scene.seed % 100000;
  const n = cols * rows;
  const cw = view.w / cols;
  const ch = view.h / rows;
  const X = new Float32Array(cols);
  const Y = new Float32Array(rows);
  for (let c = 0; c < cols; c++) X[c] = view.x + (c + 0.5) * cw;
  for (let r = 0; r < rows; r++) Y[r] = view.y + (r + 0.5) * ch;
  const city = place === "city";
  const reef = place === "reef";
  // what distance fades into: the sky at the horizon, or underwater the sea
  const air = reef ? time.mid : time.horizon;

  // Every cell a box touches, never fewer than one when it is in view, with
  // its place in the box (i, j) and the box's size in cells (w, h).
  const each = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    fn: (
      k: number,
      x: number,
      y: number,
      i: number,
      j: number,
      w: number,
      h: number,
    ) => void,
  ) => {
    const a = Math.floor((x0 - view.x) / cw);
    const b = Math.floor((y0 - view.y) / ch);
    const w = Math.floor((x1 - view.x) / cw) - a + 1;
    const h = Math.floor((y1 - view.y) / ch) - b + 1;
    for (let r = Math.max(0, b); r < Math.min(rows, b + h); r++)
      for (let c = Math.max(0, a); c < Math.min(cols, a + w); c++)
        fn(r * cols + c, X[c], Y[r], c - a, r - b, w, h);
  };
  const cellAt = (x: number, y: number) => {
    const c = Math.floor((x - view.x) / cw);
    const r = Math.floor((y - view.y) / ch);
    return c < 0 || c >= cols || r < 0 || r >= rows ? -1 : r * cols + c;
  };
  // A speck: a lamp, a fish, a bubble, a petal. One cell while cells are
  // large, and a small square of them once they are fine, so it keeps its
  // size however many dots the frame is drawn in.
  const grain = Math.max(1, Math.round(0.012 / cw));
  const speck = (x: number, y: number, fn: (k: number) => void) => {
    const c0 = Math.floor((x - view.x) / cw - (grain - 1) / 2);
    const r0 = Math.floor((y - view.y) / ch - (grain - 1) / 2);
    for (let r = Math.max(0, r0); r < Math.min(rows, r0 + grain); r++)
      for (let c = Math.max(0, c0); c < Math.min(cols, c0 + grain); c++)
        fn(r * cols + c);
  };

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
    if (place === "coast") return headland(x).top;
    if (place === "valley" || reef)
      return ridge(scene.ranges[scene.ranges.length - 1], x);
    if (place === "dunes") return H;
    if (place === "river") return H - STEPS;
    if (city) return H + EYE / scene.depth;
    // fjord, lake and garden: a low spit of shore at the waterline
    return H - 0.004;
  };
  const markBase = groundAt(scene.mark);

  type Tree = { x: number; base: number; h: number; w: number; tiers: number };
  const trees: Tree[] = [];
  const random = mulberry32(scene.seed ^ 0x9e3779b9);
  const plant = (from: number, to: number, scale: number) => {
    for (let x = from; x < to; x += (0.014 + random() * 0.03) * scale) {
      if (Math.abs(x - scene.mark) < 0.07 && landmark !== "boat") continue;
      trees.push({
        x,
        base: groundAt(x) + 0.004,
        h: (0.025 + random() * 0.045) * scale,
        w: (0.008 + random() * 0.006) * scale,
        tiers: 4,
      });
    }
  };
  if (place === "coast") {
    scene.side < 0 ? plant(0, 0.62, 1) : plant(1.38, 2, 1);
  } else if (place === "valley") {
    plant(0, 2, 1.6);
  } else if (place === "fjord" || place === "lake") {
    plant(scene.mark - 0.2, scene.mark + 0.2, 0.7);
    plant(0, 2, 0.4);
  }
  if (scene.pines) {
    // standing close, at both edges, so the view opens between them
    for (const edge of [-1, 1])
      for (let i = 0; i < 3; i++)
        trees.push({
          x: 1 + edge * (1.03 - random() * 0.17),
          base: 1.04,
          h: 0.5 + random() * 0.34,
          w: 0.055 + random() * 0.04,
          tiers: 9,
        });
  }

  const kind = new Uint8Array(n);
  const base = new Float32Array(n * 3); // static colour of land
  const glow = new Float32Array(n * 3); // light that never moves
  const lights: Light[] = [];
  // what distance fades land toward: the horizon, dimmed into the shade
  const hazeColor: RGB = [
    mix(time.shade[0], air[0], 0.62),
    mix(time.shade[1], air[1], 0.62),
    mix(time.shade[2], air[2], 0.66),
  ];
  const lightDir = Math.sign(body.x - 1) || 1;

  const paint = (k: number, rgb: ArrayLike<number>) => {
    kind[k] = SOLID;
    base[k * 3] = rgb[0];
    base[k * 3 + 1] = rgb[1];
    base[k * 3 + 2] = rgb[2];
  };
  const tint = (a: ArrayLike<number>, b: ArrayLike<number>, t: number): RGB => [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
  ];
  // Light that falls round a box (a point, when it has no size): windows,
  // lamps, signs. Built once and added to every frame.
  const shine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    rgb: RGB,
    power: number,
    fall: number,
  ) =>
    each(
      x0 - fall * 4,
      y0 - fall * 4,
      x1 + fall * 4,
      y1 + fall * 4,
      (k, x, y) => {
        const dx = Math.max(x0 - x, 0, x - x1);
        const dy = Math.max(y0 - y, 0, y - y1);
        const g = power * Math.exp(-Math.sqrt(dx * dx + dy * dy) / fall);
        glow[k * 3] += rgb[0] * g;
        glow[k * 3 + 1] += rgb[1] * g;
        glow[k * 3 + 2] += rgb[2] * g;
      },
    );

  // A crest, its slope, the headland and the island only change along x:
  // worked out once a column, not once a cell.
  const crests = scene.ranges.map((range) => {
    const top = new Float64Array(cols);
    const slope = new Float64Array(cols);
    for (let c = 0; c < cols; c++) {
      top[c] = ridge(range, X[c]);
      slope[c] =
        (ridge(range, X[c] + 0.004) - ridge(range, X[c] - 0.004)) / 0.008;
    }
    return { top, slope };
  });
  const coast = place === "coast";
  const heads = coast ? Array.from(X, (x) => headland(x)) : [];
  const isles = coast
    ? Array.from(X, (x) => {
        const ix = scene.side < 0 ? 1.65 : 0.35;
        return (
          H -
          0.035 * Math.max(0, 1 - ((x - ix) / 0.28) ** 2) -
          0.012 * fbm(x * 18, 9, S, 2)
        );
      })
    : [];

  for (let r = 0; r < rows; r++) {
    const y = Y[r];
    for (let c = 0; c < cols; c++) {
      const x = X[c];
      const k = r * cols + c;
      kind[k] = reef ? SEA : scene.water && y >= H ? WATER : SKY;

      // ranges, far to near
      for (let i = 0; i < scene.ranges.length; i++) {
        const range = scene.ranges[i];
        const top = crests[i].top[c];
        if (y < top || (scene.water && y >= H)) continue;
        const depth = y - top;
        const slope = crests[i].slope[c];
        const facing = clamp(0.5 + slope * lightDir * 2.4);
        const grain = noise(x * 60 + depth * 18, depth * 30, S + 9);
        let lit = facing * (0.55 + 0.45 * grain) * smooth(0.3, 0, depth);
        if (range.smoothness)
          lit = clamp(facing * 1.2 - 0.1) * (0.8 + 0.2 * grain);
        let rgb = tint(time.shade, time.light, lit * (time.peak ? 0.62 : 0.5));
        const peak = range.base - top > range.amp * 0.42;
        if (scene.snow && !range.smoothness && peak) {
          // at alpenglow the snow runs further down, and only the faces
          // turned to the light catch it
          const line =
            (0.015 + 0.045 * noise(x * 14, 2, S + 3)) * (time.peak ? 2.2 : 1);
          if (depth < line * (1 + slope * lightDir * 0.3)) {
            const s = time.peak
              ? 0.08 + 0.92 * facing ** 1.5
              : 0.35 + 0.65 * facing;
            rgb = tint(time.shade, time.peak ?? SNOW, s * 0.85);
          }
        }
        // aerial perspective: far ranges and low ground fade toward the sky
        rgb = tint(rgb, hazeColor, range.haze);
        // the crest catches the sky behind it, one cell thick
        rgb = tint(rgb, air, 0.45 * smooth(ch * 1.3, 0, depth));
        // mist pooled at the foot of every range but the nearest
        if (i < scene.ranges.length - 1 || scene.water) {
          const mist =
            0.55 *
            smooth(range.base - 0.09, range.base, y) *
            (0.75 + 0.25 * grain);
          rgb = tint(rgb, air, mist * (0.5 + 0.5 * range.haze));
        }
        paint(k, rgb);
      }

      if (coast) {
        const land = heads[c];
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
        if (y >= isles[c] && y < H) paint(k, tint(time.shade, hazeColor, 0.55));
      }

      if (place === "fjord" || place === "lake") {
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

  // --- the river town: a skyline over steps down to the water -----------
  type Skiff = {
    x: number;
    y: number;
    len: number;
    dir: number;
    phase: number;
  };
  const skiffs: Skiff[] = [];
  const diyas: { x: number; y: number; v: number; phase: number }[] = [];
  let flag: { x: number; y: number } | undefined;
  if (place === "river") {
    const bank = H - STEPS;
    // the town runs from the edge on the temple's side to short of the sun
    const s0 = scene.side < 0 ? -0.02 : body.x + 0.24;
    const s1 = scene.side < 0 ? body.x - 0.24 : 2.02;
    const thin = scene.side < 0 ? s1 : s0;
    const house = (x0: number, x1: number, h: number, roof: string) => {
      const top = bank - h;
      const w = x1 - x0;
      const xm = (x0 + x1) / 2;
      const tone = random();
      const id = Math.floor(tone * 1e4);
      const pin = Math.max(0.0025, cw * 0.5);
      each(x0, top - w - 0.02, x1, bank, (k, x, y) => {
        const dx = x - xm;
        const up = top - y;
        let inside = y >= top && Math.abs(dx) <= w / 2;
        if (roof === "dome") {
          const rx = w * 0.32;
          inside ||=
            (dx / rx) ** 2 + (up / (rx * 0.95)) ** 2 < 1 ||
            (Math.abs(dx) < pin && up > 0 && up < rx * 0.95 + 0.014);
        } else if (roof === "kiosk") {
          // a chhatri: a little dome up on posts
          const rx = w * 0.2;
          inside ||=
            (up > 0 && up < 0.018 && Math.abs(Math.abs(dx) - rx * 0.8) < pin) ||
            (up >= 0.018 &&
              (dx / rx) ** 2 + ((up - 0.018) / (rx * 0.8)) ** 2 < 1);
        } else if (roof === "spire") {
          const u = up / (w * 0.95);
          inside ||=
            u > 0 &&
            u < 1 &&
            Math.abs(dx) < Math.max(w * 0.26 * (1 - u ** 1.5), pin);
        } else {
          inside ||= up > 0 && up < 0.006 && frac((x - x0) / 0.012) < 0.5;
        }
        if (!inside) return;
        const edge = (dx * lightDir) / (w / 2);
        let rgb = tint(
          time.shade,
          time.light,
          0.06 + 0.06 * tone + 0.35 * smooth(0.6, 0.95, edge),
        );
        // windows in rows, a few of them lit
        if (y > top + 0.008 && y < bank - 0.006) {
          const wx = (x - x0) / 0.02;
          const wy = (bank - y) / 0.024;
          if (
            frac(wx) > 0.3 &&
            frac(wx) < 0.75 &&
            frac(wy) > 0.35 &&
            frac(wy) < 0.8
          ) {
            const lit = hash(Math.floor(wx), Math.floor(wy) + id, S + 8);
            if (lit < 0.05) {
              kind[k] = LAMP;
              return;
            }
            rgb =
              lit < 0.16
                ? tint(time.warm, time.shade, 0.15)
                : tint(rgb, time.shade, 0.5);
          }
        }
        paint(k, tint(rgb, hazeColor, 0.22));
      });
    };
    for (let x = s0; x < s1; ) {
      const w = 0.04 + random() * 0.08;
      const fall = smooth(0, 0.45, Math.abs(x + w / 2 - thin));
      const temple = Math.abs(x + w / 2 - scene.mark) < 0.12 ? 0.55 : 1;
      const h = (0.05 + random() * 0.14) * (0.3 + 0.7 * fall) * temple;
      house(
        x,
        Math.min(x + w, s1),
        h,
        weighted(random, { flat: 3, dome: 1, kiosk: 1, spire: 0.6 }),
      );
      x += w * (0.75 + random() * 0.3);
    }
    // the steps: lit treads over dark risers, a row of cells each
    const g0 = Math.max(0, s0);
    const g1 = Math.min(2, s1);
    each(g0, bank, g1, H - 1e-6, (k, _x, y) => {
      if (y >= H) return;
      const tread = frac(((y - bank) / STEPS) * 4) < 0.5;
      paint(
        k,
        tint(time.shade, tint(time.light, time.warm, 0.4), tread ? 0.3 : 0.08),
      );
    });
    // oil lamps along the steps
    for (let i = 0; i < 28; i++) {
      const lx = g0 + random() * (g1 - g0);
      const ly = bank + (Math.floor(random() * 4) + 0.3) * (STEPS / 4);
      speck(lx, ly, (k) => {
        kind[k] = LAMP;
      });
      shine(lx, ly, lx, ly, time.warm, 0.3, 0.01);
    }

    // the temple: a curved spire between two smaller ones, over a hall
    if (landmark === "temple") {
      const tall = 0.28 + random() * 0.08;
      const wide = 0.044 + random() * 0.012;
      const pin = Math.max(0.003, cw * 0.5);
      const stone = tint(SANDSTONE, time.light, 0.45);
      each(
        scene.mark - 0.12,
        bank - 0.07,
        scene.mark + 0.12,
        bank,
        (k, x, y) => {
          const dx = Math.abs(x - scene.mark);
          const up = bank - y;
          const hall = dx < 0.12 && up < 0.045;
          const domes =
            up >= 0.045 &&
            ((dx - 0.04) / 0.02) ** 2 + ((up - 0.045) / 0.018) ** 2 < 1;
          if (hall || domes)
            paint(k, tint(time.shade, stone, 0.2 + 0.12 * frac(up / 0.012)));
        },
      );
      for (const [dx, f] of [
        [-0.075, 0.55],
        [0.075, 0.5],
        [0, 1],
      ]) {
        const sx = scene.mark + dx;
        const h = tall * f;
        const w = wide * (f === 1 ? 1 : 0.62);
        each(sx - w - 0.01, bank - h - 0.04, sx + w + 0.01, bank, (k, x, y) => {
          const ox = x - sx;
          const u = (bank - y) / h;
          let hw = u < 1 ? w * (1 - u ** 1.9) : 0;
          // the ribbed stone disc on top, and the finial over it
          if (u > 0.96 && u < 1.04)
            hw = Math.max(hw, w * 0.45 * Math.sqrt(1 - ((u - 1) / 0.04) ** 2));
          if (u >= 1.04 && u < 1.04 + 0.025 / h) hw = pin;
          if (Math.abs(ox) > Math.max(hw, u < 1.04 ? 0 : pin)) return;
          const s = clamp(0.5 + (ox / Math.max(hw, 1e-3)) * lightDir * 0.5);
          const rib = frac(u * 15) < 0.28 ? 0.6 : 1;
          paint(k, tint(time.shade, stone, (0.2 + 0.7 * s) * rib));
        });
      }
      flag = { x: scene.mark, y: bank - tall * 1.04 - 0.025 };
      lights.push({ x: scene.mark, y: bank + STEPS * 0.6, power: 0.55 });
    }

    // boats with a lamp at the bow, and lamps floating downstream
    for (let i = 0; i < 2; i++)
      skiffs.push({
        x: 0.2 + random() * 1.6,
        y: H + 0.06 + random() * 0.12,
        len: 0.07 + random() * 0.04,
        dir: random() < 0.5 ? -1 : 1,
        phase: random() * 6,
      });
    for (let i = 0; i < 16; i++)
      diyas.push({
        x: random() * 2.1,
        y: H + 0.02 + random() ** 1.4 * 0.32,
        v: -lightDir * (0.004 + random() * 0.008),
        phase: random(),
      });
  }

  // --- the city: a street running straight away, in one-point perspective --
  if (city) {
    const zEnd = 6 + random() * 3;
    type Block = { z: number; h: number; tone: number; shop: number };
    // the buildings down each side, nearest first, and the one at the end
    const sides = [0, 1].map(() => {
      const list: Block[] = [];
      for (let z = 0.2; z < zEnd; z += 0.35 + random() * 0.9)
        list.push({
          z,
          h: 0.45 + random() * 1.1,
          tone: random(),
          shop: random(),
        });
      return list;
    });
    const end: Block = {
      z: zEnd,
      h: 0.4 + random() * 0.5,
      tone: random(),
      shop: random(),
    };
    const blockAt = (s: number, z: number) => {
      if (z >= zEnd) return end;
      const list = sides[s < 0 ? 0 : 1];
      let found = list[0];
      for (const b of list) if (b.z <= z) found = b;
      return found;
    };
    const fog = tint(time.horizon, time.shade, 0.3);
    // the city's own light, hanging in the air where the street ends
    shine(1, H - 0.03, 1, H - 0.03, tint(time.horizon, NEON[0], 0.3), 0.4, 0.1);
    // A building's face at `along` across it and `up` above the street:
    // rows of windows, a few lit, over a shopfront or a shutter.
    const face = (along: number, up: number, b: Block): RGB => {
      const wall = tint(time.shade, time.light, 0.06 + 0.1 * b.tone);
      if (up < 0.1) {
        if (up > 0.085) return wall;
        if (b.shop < 0.6)
          return frac(along / 0.22) < 0.08 || up < 0.012
            ? wall
            : (tint(b.shop < 0.3 ? time.warm : COOL, WHITE, 0.15).map(
                (v) => v * 0.72,
              ) as RGB);
        return tint(wall, time.light, frac(up / 0.012) < 0.5 ? 0.1 : 0);
      }
      const fy = frac((up - 0.1) / 0.11);
      const wz = along / 0.16;
      if (fy > 0.3 && fy < 0.78 && frac(wz) > 0.22 && frac(wz) < 0.72) {
        const lit = hash(
          Math.floor(wz),
          Math.floor((up - 0.1) / 0.11) + Math.floor(b.tone * 1e4),
          S + 12,
        );
        if (lit < 0.24) return tint(time.warm, time.shade, 0.3);
        if (lit < 0.32) return tint(COOL, time.shade, 0.4);
        return tint(wall, time.shade, 0.5);
      }
      return wall;
    };
    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      for (let c = 0; c < cols; c++) {
        const x = X[c];
        const k = r * cols + c;
        // the face this column looks at, and how far away it is
        const z = Math.min(zEnd, STREET / Math.max(1e-4, Math.abs(x - 1)));
        const b = blockAt(x - 1, z);
        if (y >= H + EYE / z) {
          kind[k] = WATER;
          continue;
        }
        if (y < H - (b.h - EYE) / z) continue; // sky over the roofs
        const up = EYE - (y - H) * z;
        const along = z >= zEnd ? (x - 1) * z : z;
        paint(
          k,
          tint(face(along, up, b), fog, 0.85 * (1 - Math.exp(-(z - 0.3) / 5))),
        );
      }
    }
    // wires slung across the street
    for (let i = 0; i < 2; i++) {
      const z = 1.3 + random() * 2.5;
      const up = 0.5 + random() * 0.25;
      const sag = 0.025 + random() * 0.03;
      const reach = STREET / z;
      each(
        1 - reach,
        H - (up - EYE) / z - ch,
        1 + reach,
        H - (up - sag - EYE) / z + ch,
        (k, x, y) => {
          const u = (x - 1) / reach;
          const wy = H - (up - sag * (1 - u * u) - EYE) / z;
          if (Math.abs(y - wy) < ch * 0.5)
            paint(k, tint(time.shade, time.light, 0.04));
        },
      );
    }

    // blade signs, sticking out from the walls toward the middle of the
    // street, so they face us
    type Sign = {
      x0: number;
      x1: number;
      y0: number;
      y1: number;
      z: number;
      color: RGB;
      fill: boolean;
      glyph: number;
    };
    const signs: Sign[] = [];
    const count = 16 + Math.floor(random() * 8);
    for (let i = 0; i < count; i++) {
      const s = random() < 0.5 ? -1 : 1;
      const z = 0.75 + random() ** 1.4 * (zEnd - 1.5);
      // placed by where it lands in the frame, so near ones stay in view
      const top = Math.min(
        blockAt(s, z).h - 0.04,
        EYE + (H - 0.02 - random() * 0.3) * z,
      );
      const bottom = Math.max(0.17, top - (0.1 + random() * 0.25) * z);
      const out = 0.07 + random() * 0.09;
      const color = pick(random, NEON);
      const fill = random() < 0.3;
      const glyph = Math.floor(random() * GLYPHS.length);
      if (top - bottom < 0.08) continue;
      const xa = 1 + (s * (STREET - 0.012)) / z;
      const xb = 1 + (s * (STREET - 0.012 - out)) / z;
      signs.push({
        x0: Math.min(xa, xb),
        x1: Math.max(xa, xb),
        y0: H - (top - EYE) / z,
        y1: H - (bottom - EYE) / z,
        z,
        color,
        fill,
        glyph,
      });
    }
    // and a wide one across the building at the end
    signs.push({
      x0: 1 - 0.32 / zEnd,
      x1: 1 + 0.32 / zEnd,
      y0: H - (end.h - 0.06 - EYE) / zEnd,
      y1: H - (end.h - 0.2 - EYE) / zEnd,
      z: zEnd,
      color: pick(random, NEON),
      fill: false,
      glyph: Math.floor(random() * GLYPHS.length),
    });
    signs.sort((a, b) => b.z - a.z);
    // one of them has a failing tube
    const broken = Math.floor(random() * signs.length);
    signs.forEach((sign, i) => {
      const near = 0.45 + 0.55 * Math.exp(-(sign.z - 0.6) / 6);
      each(sign.x0, sign.y0, sign.x1, sign.y1, (k, _x, _y, i0, j0, w, h) => {
        const on = signPixel(i0, j0, w, h, sign.glyph);
        const level = (sign.fill ? (on ? 0.12 : 0.85) : on ? 1 : 0.1) * near;
        paint(k, tint([0, 0, 0], sign.color, level));
        kind[k] = i === broken ? BLINK : SIGN;
      });
      shine(
        sign.x0,
        sign.y0,
        sign.x1,
        sign.y1,
        sign.color,
        0.28 * near,
        0.02 + 0.05 / sign.z,
      );
    });

    if (landmark === "walker") {
      // someone under an umbrella, a sign's light in the rain behind them
      const z = scene.depth;
      const foot = H + EYE / z;
      const px = 0.5 * cw * z; // half a cell, in the walker's own units
      shine(
        scene.mark,
        foot - 0.16 / z,
        scene.mark,
        foot - 0.16 / z,
        NEON[0],
        0.55,
        0.06,
      );
      each(
        scene.mark - 0.09 / z,
        foot - 0.24 / z,
        scene.mark + 0.09 / z,
        foot,
        (k, x, y) => {
          const u = (x - scene.mark) * z;
          const v = (foot - y) * z;
          const dome = 0.032 * Math.sqrt(Math.max(0, 1 - (u / 0.085) ** 2));
          const rim = Math.abs(u) < 0.085 && v > 0.19 && v < 0.19 + px * 1.6;
          const shape =
            (v < 0.075 && Math.abs(u) < Math.max(0.016, px)) ||
            (v >= 0.07 &&
              v < 0.155 &&
              Math.abs(u) < Math.max(0.021 + (0.155 - v) * 0.1, px)) ||
            u * u + (v - 0.165) ** 2 < Math.max(0.012, px) ** 2 ||
            (Math.abs(u - 0.008) < Math.max(0.002, px) &&
              v > 0.12 &&
              v < 0.2) ||
            (Math.abs(u) < 0.085 &&
              v > 0.19 &&
              v < 0.19 + Math.max(dome, px * 1.6));
          if (!shape) return;
          paint(k, rim ? tint(time.shade, NEON[0], 0.22) : time.shade);
          // a silhouette: the light behind it only catches the edge
          for (let i = 0; i < 3; i++) glow[k * 3 + i] *= rim ? 0.4 : 0.08;
        },
      );
    } else if (landmark === "vending") {
      // a vending machine against the wall: a lit window of cans
      const z = scene.depth;
      const xa = 1 + (scene.side * (STREET - 0.03)) / z;
      const xb = 1 + (scene.side * (STREET - 0.12)) / z;
      const x0 = Math.min(xa, xb);
      const x1 = Math.max(xa, xb);
      const y0 = H - (0.19 - EYE) / z;
      const y1 = H + EYE / z - 1e-6;
      each(x0, y0, x1, y1, (k, _x, _y, i, j, w, h) => {
        const v = (j + 0.5) / h;
        let col: RGB;
        if (i === 0 || i === w - 1 || j === h - 1)
          col = tint(time.shade, [0.7, 0.75, 0.85], 0.35);
        else if (v < 0.12) col = [0.95, 0.25, 0.2];
        else if (v < 0.58)
          col =
            j % 2 === 0 && i % 2 === 1
              ? pick(() => hash(i, j, S + 13), NEON)
              : [0.82, 0.88, 1];
        else if (v < 0.8)
          col =
            j % 3 === 0 && i % 2 === 1 ? [1, 0.55, 0.2] : [0.12, 0.13, 0.17];
        else col = [0.05, 0.05, 0.07];
        paint(k, col);
      });
      shine(x0, y0, x1, y1, [0.75, 0.85, 1], 0.4, 0.05);
    }
  }

  // --- the reef: coral along the near rock, and maybe a wreck -------------
  type Swimmer = {
    x: number;
    y: number;
    reach: number;
    speed: number;
    phase: number;
  };
  const fish: { a: number; r: number; y: number }[] = [];
  const reds: Swimmer[] = [];
  let vent = { x: 0, y: 0 };
  if (reef) {
    const crest = (x: number) => ridge(scene.ranges[1], x);
    for (let x = random() * 0.05; x < 2; x += 0.045 + random() * 0.08) {
      const y = crest(x);
      const r = 0.035 + random() * 0.045;
      const form = Math.floor(random() * 4);
      const color = pick(random, CORAL);
      if (y > 0.92) continue; // the sand in the middle stays bare
      const dim = 1.15 - 0.55 * y;
      each(x - r * 1.2, y - r * 1.5, x + r * 1.2, y + r * 0.3, (k, cx, cy) => {
        const u = (cx - x) / r;
        const v = (y - cy) / r; // up from where it stands
        let on = false;
        let s = 0.6;
        if (form === 0) {
          // brain coral: a grooved dome
          on = u * u + (v / 0.8) ** 2 < 1 && v > -0.3;
          s =
            0.55 +
            0.35 * v -
            (Math.abs(fbm(cx * 70, cy * 70, S + 40, 2) - 0.5) < 0.07
              ? 0.35
              : 0);
        } else if (form === 1) {
          // branching coral: fingers reaching up
          const f = Math.round(u * 2.2);
          const tall = 0.8 + 0.5 * hash(f + 9, Math.floor(x * 100), S);
          on =
            Math.abs(u) < 1 &&
            v > -0.3 &&
            v < tall &&
            Math.abs(u * 2.2 - f + 0.15 * v * Math.sin(f * 2.3)) < 0.26;
          s = 0.4 + 0.5 * (v / tall);
        } else if (form === 2) {
          // a sea fan: lace spread on ribs
          const d = Math.sqrt(u * u + (v - 0.2) ** 2) / 1.2;
          const rib =
            Math.abs(frac((Math.atan2(u, v + 0.2) * 3) / Math.PI) - 0.5) < 0.12;
          on =
            d < 1 &&
            v > -0.2 &&
            (rib || noise(cx * 120, cy * 120, S + 41) > 0.5);
          s = 0.5 + 0.3 * (1 - d);
        } else {
          // an anemone: a stub with a fringe
          on =
            (v < 0.35 && u * u + v * v * 4 < 0.5) ||
            (v >= 0.2 &&
              v < 0.75 + 0.2 * hash(Math.floor(u * 4), 3, S) &&
              Math.abs(frac((u + 1) * 3.5) - 0.5) < 0.24 &&
              Math.abs(u) < 0.75);
          s = 0.5 + 0.4 * v;
        }
        if (on) paint(k, tint(time.shade, color, clamp(s) * dim));
      });
    }

    if (landmark === "wreck") {
      // a sunken boat, listing on the slope
      const wy = crest(scene.mark) + 0.025;
      const ang = -scene.side * 0.14;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const pin = Math.max(0.004, cw * 0.5);
      each(
        scene.mark - 0.26,
        wy - 0.28,
        scene.mark + 0.26,
        wy + 0.04,
        (k, x, y) => {
          const dx = x - scene.mark;
          const dy = y - wy;
          const u = (dx * ca + dy * sa) * -scene.side; // bow away from the edge
          const v = -dx * sa + dy * ca; // down
          const deck = -0.085;
          const rise = clamp(-v / 0.085);
          const hull =
            v < 0.01 &&
            v > deck &&
            u > -(0.18 + 0.05 * rise) &&
            u < 0.15 + 0.11 * rise ** 1.5;
          const cabin = u > -0.13 && u < -0.03 && v > deck - 0.045 && v <= deck;
          const mast = Math.abs(u - 0.03) < pin && v > deck - 0.19 && v <= deck;
          if (!hull && !cabin && !mast) return;
          // weathered plates, lit along the deck edge, portholes dark
          let s =
            0.4 +
            0.45 * smooth(deck + 0.016, deck, v) +
            0.2 * (noise(u * 60, v * 60, S + 14) - 0.5);
          if (
            hull &&
            Math.abs(v - deck - 0.03) < 0.007 &&
            frac(u / 0.035) < 0.3
          )
            s = 0.05;
          paint(k, tint(time.shade, [0.5, 0.66, 0.62], s));
        },
      );
    }

    // a school of fish turning in the open water, a few red ones by the
    // rock, and a thread of bubbles from a crack in it
    for (let i = 0; i < 46; i++)
      fish.push({
        a: random() * Math.PI * 2,
        r: 0.35 + 0.65 * Math.sqrt(random()),
        y: (random() - 0.5) * 0.05,
      });
    for (let i = 0; i < 5; i++) {
      const x = 0.15 + random() * 1.7;
      reds.push({
        x,
        y: Math.min(crest(x), 0.95) - 0.03 - random() * 0.06,
        reach: 0.03 + random() * 0.08,
        speed: 0.15 + random() * 0.25,
        phase: random() * 6,
      });
    }
    const vx = scene.mark + scene.side * (0.25 + random() * 0.2);
    vent = { x: vx, y: crest(vx) - 0.005 };
  }

  // trees, each over only the cells its box covers
  for (const tree of trees) {
    each(
      tree.x - tree.w - 0.004,
      tree.base - tree.h,
      tree.x + tree.w + 0.004,
      tree.base + 0.006,
      (k, x, y) => {
        const dy = y - (tree.base - tree.h);
        if (dy < 0 || y > tree.base + 0.006) return;
        const along = dy / tree.h;
        const tier = 0.72 + 0.28 * ((along * tree.tiers) % 1);
        const dx = x - tree.x;
        if (Math.abs(dx) > tree.w * Math.min(1, along) * tier + 0.002) return;
        // the framing pines stand close, near black with a thin lit edge
        const near = tree.tiers > 4;
        const lit = near
          ? dx * lightDir > tree.w * Math.min(1, along) * tier - cw
            ? 0.1
            : 0
          : dx * lightDir > tree.w * 0.2
            ? 0.28
            : 0.06;
        const fog = smooth(0.05, -0.05, tree.base - H) * 0.15;
        const dark = near ? time.shade.map((v) => v * 0.5) : time.shade;
        paint(k, tint(tint(dark, time.light, lit), hazeColor, fog));
        if (scene.snow && tier > 0.9)
          paint(k, tint(time.shade, [0.8, 0.85, 0.95], 0.45));
      },
    );
  }

  // --- the landmark ---------------------------------------------------------
  const mx = scene.mark;
  const towerH = 0.2;
  const lampY = markBase - towerH - 0.02;
  const cabin = { w: 0.05, h: 0.036, roof: 0.036 };
  const boatY = H + 0.06;
  const boatDark = time.shade.map((v) => v * 1.4);
  const smokeColor = time.light.map((v) => v * 0.55);
  if (landmark === "lighthouse") {
    lights.push({ x: mx, y: lampY, power: 1, beam: true });
  } else if (landmark === "cabin") {
    for (const side of [-1, 1])
      lights.push({
        x: mx + side * cabin.w * 0.45,
        y: markBase - cabin.h * 0.5,
        power: 0.55,
      });
  } else if (landmark === "windmill") {
    lights.push({ x: mx, y: markBase - 0.03, power: 0.45 });
  } else if (landmark === "boat") {
    lights.push({ x: mx, y: boatY - 0.075, power: 0.6 });
  }

  if (
    landmark === "lighthouse" ||
    landmark === "cabin" ||
    landmark === "windmill"
  ) {
    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      for (let c = 0; c < cols; c++) {
        const x = X[c];
        const k = r * cols + c;
        const dx = x - mx;
        if (landmark === "lighthouse") {
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
            kind[k] = LAMP;
          if (
            y >= top - 0.054 &&
            y < top - 0.034 &&
            Math.abs(dx) <= Math.max(0.024, cw * 1.8) - (top - 0.034 - y) * 1.1
          )
            paint(k, tint(time.shade, [0.4, 0.15, 0.12], 0.8));
        } else if (landmark === "cabin") {
          const top = markBase - cabin.h;
          if (y >= top && y < markBase + 0.004 && Math.abs(dx) <= cabin.w) {
            const s = 0.3 + 0.4 * clamp(0.5 + (dx / cabin.w) * lightDir * 0.5);
            paint(k, tint(time.shade, [0.55, 0.42, 0.34], s));
            if (
              Math.abs(Math.abs(dx) - cabin.w * 0.45) < 0.009 &&
              y > top + 0.008 &&
              y < markBase - 0.007
            )
              kind[k] = LAMP;
          }
          const ry = top - y;
          if (
            ry > 0 &&
            ry < cabin.roof &&
            Math.abs(dx) <=
              cabin.w + 0.01 - (ry / cabin.roof) * (cabin.w + 0.01)
          ) {
            paint(
              k,
              scene.snow
                ? tint(time.shade, SNOW, 0.6)
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
        } else {
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
                kind[k] = LAMP;
            }
          }
        }
      }
    }
  } else if (landmark === "pagoda") {
    // tiers of dark wood under wide eaves whose tips curl up, catching light
    const tiers = random() < 0.6 ? 5 : 3;
    const tierH = tiers === 5 ? 0.05 : 0.068;
    const lip = Math.max(0.008, ch * 1.05);
    const pin = Math.max(0.0025, cw * 0.45);
    const top = markBase - tiers * tierH;
    const eave = tint(time.light, WHITE, 0.3);
    each(mx - 0.1, top - 0.09, mx + 0.1, markBase, (k, x, y) => {
      const dx = x - mx;
      const up = markBase - y;
      const i = Math.floor(up / tierH);
      if (i >= tiers) {
        // the spire, ringed
        const rise = top - y;
        const ring = rise < 0.06 && frac(rise / 0.01) < 0.35;
        if (rise < 0.085 && Math.abs(dx) < (ring ? pin * 2.2 : pin))
          paint(k, tint(time.shade, eave, 0.6));
        return;
      }
      const yt = markBase - (i + 1) * tierH;
      const bw = 0.03 * (1 - i * 0.09);
      const ew = bw * 2;
      const u = Math.abs(dx) / ew;
      const roof = yt + tierH * (0.2 + 0.36 * u - 0.24 * u ** 8);
      if (u < 1 && y >= roof && y < roof + lip)
        paint(k, tint(time.shade, eave, 0.8 + 0.2 * u));
      else if (Math.abs(dx) < bw && y >= yt + tierH * 0.2 + lip) {
        const s = clamp(0.5 + (dx / bw) * lightDir * 0.5);
        paint(k, tint(time.shade, WOOD, 0.08 + 0.22 * s));
        if (
          i === 0 &&
          Math.abs(dx) < bw * 0.35 &&
          up > tierH * 0.15 &&
          up < tierH * 0.5
        )
          kind[k] = LAMP;
      }
    });
    // stone lanterns either side
    for (const side of [-1, 1]) {
      speck(mx + side * 0.1, markBase - 0.008, (k) => {
        kind[k] = LAMP;
      });
      lights.push({ x: mx + side * 0.1, y: markBase - 0.008, power: 0.25 });
    }
  } else if (landmark === "torii") {
    // a gate standing just out in the water
    const foot = H + 0.012;
    const tall = 0.2;
    const span = 0.075;
    const pw = Math.max(0.008, cw * 0.55);
    const beam = Math.max(0.012, ch * 1.05);
    each(mx - 0.15, foot - tall - 0.05, mx + 0.15, foot, (k, x, y) => {
      const dx = x - mx;
      const up = foot - y;
      const u = Math.abs(dx) / 0.135;
      const lift = 0.018 * u ** 3; // the top beam sweeps up at its ends
      const kasagi = u < 1 && up > tall + lift && up < tall + beam + lift;
      const posts =
        Math.abs(Math.abs(dx) - span * (1 - up * 0.15)) < pw && up < tall;
      const nuki =
        up > tall * 0.72 &&
        up < tall * 0.72 + beam &&
        Math.abs(dx) < span + 0.03;
      const strut = Math.abs(dx) < pw * 0.8 && up > tall * 0.72 && up < tall;
      if (kasagi)
        paint(
          k,
          up > tall + lift + beam * 0.6
            ? tint(time.shade, [0.12, 0.07, 0.07], 0.8)
            : tint(time.shade, VERMILION, 0.7),
        );
      else if (posts || nuki || strut) {
        const s = posts ? clamp(0.5 + Math.sign(dx) * lightDir * 0.4) : 0.6;
        paint(k, tint(time.shade, VERMILION, 0.55 + 0.45 * s));
      }
    });
  }

  // --- the garden: a teahouse, mist, and a cherry tree over it all ---------
  const petals: { x: number; y: number; v: number; phase: number }[] = [];
  if (place === "garden") {
    const away = -scene.side; // the tree's side
    const tx = 1 + away * (0.78 + random() * 0.12);
    // a teahouse under the tree, its paper window lit
    const hx = tx - away * 0.24;
    const hb = H - 0.004;
    const w = 0.042;
    const h = 0.028;
    const roofH = 0.026;
    each(hx - w - 0.018, hb - h - roofH, hx + w + 0.018, hb, (k, x, y) => {
      const dx = x - hx;
      const up = hb - h - y;
      if (up <= 0 && Math.abs(dx) < w) {
        if (Math.abs(dx) < w * 0.62 && y > hb - h + 0.006 && y < hb - 0.004) {
          if (frac((dx + w) / 0.011) < 0.18)
            paint(k, tint(time.shade, WOOD, 0.3));
          else kind[k] = LAMP;
        } else paint(k, tint(time.shade, [0.7, 0.62, 0.55], 0.25));
      } else if (
        up > 0 &&
        up < roofH &&
        Math.abs(dx) < (w + 0.018) * (1 - (up / roofH) * 0.8)
      ) {
        paint(k, tint(time.shade, time.light, up < ch ? 0.4 : 0.1));
      }
    });
    lights.push({ x: hx, y: hb - h * 0.5, power: 0.5 });

    // mist lying along the far shore, lit from the sky
    const mist = tint(time.horizon, time.band ?? time.horizon, 0.5);
    for (let k = 0; k < n; k++) {
      if (kind[k] !== SOLID) continue;
      const y = Y[Math.floor(k / cols)];
      const m = 0.55 * Math.exp(-(((y - (H - 0.014)) / 0.03) ** 2));
      const b = tint(base.subarray(k * 3, k * 3 + 3), mist, m);
      base.set(b, k * 3);
    }

    // the tree: a trunk leaning in, limbs to clouds of blossom
    const fork: [number, number] = [tx - away * 0.1, 0.52 + random() * 0.06];
    // clumps of blossom, thinning and dropping toward the far end of the
    // spread, like a bough bent under its weight
    const blooms = Array.from({ length: 22 }, () => {
      const out = random();
      return {
        x: tx - away * (-0.16 + out * 0.78),
        y: 0.08 + random() * 0.22 + out * out * 0.16,
        r: (0.05 + random() * 0.05) * (1.15 - out * 0.45),
      };
    });
    const limb = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      w0: number,
      w1: number,
    ) =>
      each(
        Math.min(ax, bx) - w0,
        Math.min(ay, by) - w0,
        Math.max(ax, bx) + w0,
        Math.max(ay, by) + w0,
        (k, x, y) => {
          const ex = bx - ax;
          const ey = by - ay;
          const t = clamp(
            ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey),
          );
          const d = Math.hypot(x - ax - ex * t, y - ay - ey * t);
          const wd = Math.max(mix(w0, w1, t), cw * 0.5);
          if (d < wd)
            paint(
              k,
              tint(
                time.shade,
                time.light,
                (x - (ax + ex * t)) * lightDir > 0 ? 0.12 : 0.03,
              ),
            );
        },
      );
    limb(tx, 1.04, fork[0], fork[1], 0.026, 0.014);
    for (const b of blooms.slice(0, 6))
      limb(fork[0], fork[1], b.x, b.y, 0.011, 0.004);
    const x0 = Math.min(...blooms.map((b) => b.x - b.r)) - 0.03;
    const x1 = Math.max(...blooms.map((b) => b.x + b.r)) + 0.03;
    const blossom = BLOSSOM.map((c) => tint(c, time.light, 0.2));
    each(x0, 0, x1, 0.7, (k, x, y) => {
      // the clump this cell falls in, its edge warped by noise
      const wx = x + 0.04 * (fbm(x * 7, y * 7, S + 47, 2) - 0.5);
      const wy = y + 0.04 * (fbm(x * 7 + 9, y * 7, S + 47, 2) - 0.5);
      let f = -1;
      let top = 0;
      for (const b of blooms) {
        const g = 1 - Math.hypot(wx - b.x, wy - b.y) / b.r;
        if (g > f) {
          f = g;
          top = (b.y - wy) / b.r; // 1 at the clump's crown, -1 underneath
        }
      }
      f += 0.3 * (fbm(x * 16, y * 16, S + 44, 3) - 0.5);
      if (f <= 0) return;
      // lacy at the edges, so sky and limbs show through
      if (f < 0.3 && fbm(x * 50, y * 50, S + 45, 2) < 0.45) return;
      // lit on top of each clump, in shadow underneath, flecked all over
      const s = clamp(
        0.3 +
          0.4 * top +
          0.4 * f +
          0.45 * (fbm(x * 30, y * 30, S + 46, 2) - 0.5),
      );
      paint(
        k,
        s < 0.5
          ? tint(blossom[0], blossom[1], s * 2)
          : tint(blossom[1], blossom[2], s * 2 - 1),
      );
    });
    for (let i = 0; i < 36; i++) {
      const b = pick(random, blooms);
      petals.push({
        x: b.x + (random() - 0.5) * b.r * 1.6,
        y: b.y,
        v: 0.025 + random() * 0.03,
        phase: random(),
      });
    }
  }

  // Each column of water mirrors about its own line: the horizon, or in the
  // city the foot of whatever stands at the edge of the street.
  const mirror = new Float32Array(cols).fill(H);
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++)
      if (kind[r * cols + c] === WATER) {
        mirror[c] = Math.max(H, Y[r] - ch / 2);
        break;
      }

  // sky lanterns, each at its own depth: near ones big, low and quick
  const lanterns = time.lanterns
    ? Array.from({ length: 28 }, () => {
        const d = random();
        return {
          x: 0.05 + random() * 1.9,
          d,
          size: 0.005 + d ** 1.5 * 0.02,
          v: 0.008 + d * 0.018,
          phase: random(),
        };
      })
    : [];
  const embers = time.lanterns
    ? Array.from({ length: 50 }, () => ({
        x: random() * 2,
        v: 0.01 + random() * 0.02,
        phase: random(),
      }))
    : [];

  // --- clouds: heaps of noise that wrap, so they can drift forever ----------
  const period = 6;
  const span = Math.max(1, Math.round(period / cw));
  const skyRows = reef
    ? 0
    : Math.max(0, Math.min(rows, Math.ceil((H - view.y) / ch)));
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
  // A column of cloud is worked out the first time it drifts into view: the
  // band is three frames wide and takes minutes to come round.
  const ready = new Uint8Array(span);
  const fill = (i: number) => {
    ready[i] = 1;
    const x = i * cw;
    for (let r = 0; r < skyRows; r++) {
      const y = Y[r];
      const d = density(x, y);
      cover[r * span + i] = smooth(threshold, threshold + 0.1, d);
      const toward = density(x + 0.03 * lightDir, y - 0.04);
      litc[r * span + i] = clamp(
        0.5 + (d - toward) * 9 - (d - threshold) * 1.2,
      );
    }
  };

  // --- light that never moves, worked out once ----------------------------
  // The sky and the open sea under any cloud, the glow lamps cast into the
  // air, where the stars are, and on water the road under the sun or moon,
  // the lamps' streaks and the mist: the same every frame, so shaded here.
  const under = new Float32Array(n * 3);
  const clear = new Float32Array(n); // cloud broken round the sun or moon
  const near = new Float32Array(n); // how much the sun or moon lights cloud
  const star = new Float32Array(n); // a star's brightness, where there is one
  const lamps = new Float32Array(n); // lamplight in the air, in warm
  const sweep = new Float32Array(n); // the lighthouse lamp's, which flashes
  const road = new Float32Array(n);
  const streaks = new Float32Array(n); // lamps drawn down the water
  const beamStreak = new Float32Array(n);
  const mist = new Float32Array(n);
  // under the sea: the angle up to the sun, and how far its shafts reach
  const fan = new Float32Array(reef ? n : 0);
  const shaft = new Float32Array(reef ? n : 0);
  const lighthouse = lights.find((light) => light.beam);
  for (let r = 0; r < rows; r++) {
    const y = Y[r];
    for (let c = 0; c < cols; c++) {
      const x = X[c];
      const k = r * cols + c;
      const kk = kind[k];
      const dbx = x - body.x;
      const dby = y - body.y;
      const dm = Math.sqrt(dbx * dbx + dby * dby);
      if (kk === WATER) {
        if (city) continue;
        const depth = y - mirror[c];
        road[k] = Math.exp(-((dbx / (0.02 + depth * 0.5)) ** 2));
        for (const light of lights) {
          const g =
            Math.exp(-(((x - light.x) / (0.004 + depth * 0.06)) ** 2)) *
            light.power *
            smooth(0.3, 0, depth);
          if (light.beam) beamStreak[k] += g;
          else streaks[k] += g * 0.9;
        }
        mist[k] = Math.exp(-depth / 0.025) * 0.14;
        continue;
      }
      if (kk !== LAMP) {
        for (const light of lights) {
          const lx = x - light.x;
          const ly = y - light.y;
          const d2 = lx * lx + ly * ly;
          if (d2 > 0.09 && !light.beam) continue; // the glow is gone by 0.3
          const dl = Math.sqrt(d2);
          if (light.beam)
            sweep[k] +=
              (Math.exp(-dl / 0.022) * 0.7 + Math.exp(-dl / 0.1) * 0.2) *
              light.power;
          else
            lamps[k] +=
              (Math.exp(-dl / 0.012) * 0.5 + Math.exp(-dl / 0.06) * 0.1) *
              light.power;
        }
      }
      if (kk !== SKY && kk !== SEA) continue;
      const haze = fbm(x * 2.2, y * 3.4, S + 50, 3);
      if (kk === SKY) {
        const v = clamp(y / H);
        const high = smooth(0, 0.6, v);
        const low = smooth(0.55, 1, v);
        const band = time.band ? Math.exp(-(((H - y) / 0.035) ** 2)) * 0.55 : 0;
        // the glow round the sun or moon, wide and low for a setting sun
        const halo = !time.body
          ? 0
          : time.body === "sun"
            ? Math.exp(-((dbx / 0.7) ** 2) - (dby / 0.2) ** 2) * 0.5 +
              Math.exp(-dm / 0.09) * 0.6
            : Math.exp(-dm / 0.25) * 0.3 + Math.exp(-dm / 0.08) * 0.45;
        for (let i = 0; i < 3; i++)
          under[k * 3 + i] =
            mix(mix(time.top[i], time.mid[i], high), time.horizon[i], low) *
              (0.88 + 0.24 * haze) +
            (time.band?.[i] ?? 0) * band +
            time.halo[i] * halo;
        clear[k] = time.body
          ? 0.04 + 0.96 * smooth(body.r * 1.4, body.r * 5, dm)
          : 1;
        near[k] = time.body ? Math.exp(-dm / 0.3) : 0;
        if (
          r < skyRows &&
          !(time.body && dm < body.r) &&
          hash(c, r * 3 + 11, S) > 1 - 0.022 * time.stars
        )
          star[k] = smooth(H, 0.2, y) * (1 - Math.min(1, halo));
      } else {
        // open water: bright under the surface, dark below, and the sun's
        // glare through it
        const high = smooth(0, 0.55, y);
        const low = smooth(0.5, 1.05, y);
        const glare = Math.exp(-dm / 0.12) * 0.55 + Math.exp(-dm / 0.4) * 0.2;
        for (let i = 0; i < 3; i++)
          under[k * 3 + i] =
            mix(mix(time.top[i], time.mid[i], high), time.horizon[i], low) *
              (0.9 + 0.2 * haze) +
            time.halo[i] * glare;
        fan[k] = Math.atan2(dbx, dby + 0.15);
        shaft[k] = Math.exp(-dm / 0.7) * 0.3;
      }
    }
  }
  // a lamp or window, white-hot at its core in the lighthouse
  const hot = landmark === "lighthouse" ? 0.45 : 0;
  const lampColor = tint(time.warm, WHITE, hot).map((v) => v * (1 + hot * 0.3));
  const flame = tint(time.warm, WHITE, 0.3); // a lamp floating on the river
  const [cloud0, cloud1, cloud2] = time.cloud;

  const rgb = new Float32Array(n * 3);
  const out: Frame = new Uint8ClampedArray(n * 4);
  const bolt = new Float32Array(20);
  // The cell being shaded, and the three ways colour lands on it.
  const p = [0, 0, 0];
  const above = [0, 0, 0]; // what a cell of water mirrors
  const keep = (k: number) => {
    rgb[k * 3] = p[0];
    rgb[k * 3 + 1] = p[1];
    rgb[k * 3 + 2] = p[2];
  };
  const put = (col: ArrayLike<number>) => {
    p[0] = col[0];
    p[1] = col[1];
    p[2] = col[2];
  };
  const add = (col: ArrayLike<number>, s: number) => {
    p[0] += col[0] * s;
    p[1] += col[1] * s;
    p[2] += col[2] * s;
  };
  const blend = (col: ArrayLike<number>, a: number) => {
    p[0] = mix(p[0], col[0], a);
    p[1] = mix(p[1], col[1], a);
    p[2] = mix(p[2], col[2], a);
  };
  // the light that never moves, falling on cell k
  const addGlow = (k: number, s: number) => {
    p[0] += glow[k * 3] * s;
    p[1] += glow[k * 3 + 1] * s;
    p[2] += glow[k * 3 + 2] * s;
  };
  // the same, for a cell already shaded: drawn over it, or lit on top of it
  const over = (k: number, col: ArrayLike<number>, a: number) => {
    if (k < 0) return;
    for (let i = 0; i < 3; i++) rgb[k * 3 + i] = mix(rgb[k * 3 + i], col[i], a);
  };
  const lift = (k: number, col: ArrayLike<number>, s: number) => {
    if (k < 0) return;
    for (let i = 0; i < 3; i++) rgb[k * 3 + i] += col[i] * s;
  };

  return (t: number, pointer?: Pointer, taps: Tap[] = []): Frame => {
    // The beam turns every fourteen seconds and, at START, sweeps out across
    // the frame rather than off its edge.
    const aim = Math.acos(0.8 * (Math.sign(1 - scene.mark) || 1));
    const beam = ((t - START) / 14) * Math.PI * 2 - aim;
    const cb = Math.cos(beam);
    const flash = Math.max(0, Math.sin(beam)) ** 14 * 2.2;
    const drift = t * scene.wind;
    const dark = time.stars > 0.5;

    // Lightning every few seconds: a bright stroke that flickers twice, and
    // the clouds lit from inside.
    let strike = 0;
    let bx0 = 0;
    let bx1 = 0;
    if (time.lightning) {
      const every = 6 + 3 * hash(S, 1, 7);
      const since = t - START + 3;
      const n = Math.floor(since / every);
      const tau = since - n * every;
      strike =
        tau < 0.7
          ? Math.exp(-tau / 0.08) +
            0.75 * Math.exp(-(((tau - 0.25) / 0.05) ** 2))
          : 0;
      if (strike > 0.03) {
        let x = 0.25 + 1.5 * hash(n, 1, S);
        bx0 = bx1 = x;
        for (let i = 0; i < 10; i++) {
          bolt[i * 2] = x;
          bolt[i * 2 + 1] = 0.16 + (i / 9) * (H - 0.18);
          x += (hash(n, i + 10, S) - 0.5) * 0.08;
          bx0 = Math.min(bx0, x);
          bx1 = Math.max(bx1, x);
        }
      }
    }
    const blink = hash(Math.floor(t * 9), 0, S) < 0.18 ? 0.12 : 1;

    if (skyRows) {
      const from = Math.floor((X[0] + drift) / cw);
      for (let i = from; i <= from + cols + 1; i++) {
        const j = ((i % span) + span) % span;
        if (!ready[j]) fill(j);
      }
    }

    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      for (let c = 0; c < cols; c++) {
        const x = X[c];
        const k = r * cols + c;
        const kk = kind[k];
        if (kk === WATER) continue; // second pass, once the sky is known
        p[0] = p[1] = p[2] = 0;

        const dbx = x - body.x;
        const dby = y - body.y;
        const dm = Math.sqrt(dbx * dbx + dby * dby);

        if (kk === SKY) {
          p[0] = under[k * 3];
          p[1] = under[k * 3 + 1];
          p[2] = under[k * 3 + 2];

          // (the aurora's lower edge never comes below 0.38)
          if (time.aurora && y < 0.47) {
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
              // green at the lower edge, violet up in the rays
              const high = smooth(0, 0.14, above);
              add(AURORA_LOW, g * (1 - high));
              add(AURORA_HIGH, g * high);
            }
          }

          // clouds, broken round the sun or moon
          let cov = 0;
          if (r < skyRows) {
            const sx = (x + drift) / cw;
            const ix = Math.floor(sx);
            const fx = sx - ix;
            const i0 = r * span + (((ix % span) + span) % span);
            const i1 = r * span + ((((ix + 1) % span) + span) % span);
            cov = (cover[i0] + (cover[i1] - cover[i0]) * fx) * clear[k];
            const l = litc[i0] + (litc[i1] - litc[i0]) * fx;

            if (time.body && dm < body.r) {
              const face =
                time.body === "moon"
                  ? 0.82 + 0.18 * fbm(x * 90, y * 90, S + 7, 2)
                  : 1;
              let a = (1 - cov * 0.8) * smooth(body.r, body.r * 0.85, dm);
              if (body.phase && time.body === "moon") {
                // a crescent: the shadowed part of the disc
                const sx2 = dbx + body.r * (0.4 + body.phase) * lightDir;
                if (Math.sqrt(sx2 * sx2 + dby * dby) < body.r * 0.95) a *= 0.06;
              }
              const warm =
                time.body === "sun" ? smooth(-body.r, body.r, dby) * 0.25 : 0;
              const [br, bg, bb] = time.bodyColor;
              blend(
                [
                  br * face,
                  bg * face * (1 - warm),
                  bb * face * (1 - warm * 1.6),
                ],
                a,
              );
            } else if (cov < 0.05 && star[k]) {
              const tw =
                0.6 +
                0.4 *
                  Math.sin(
                    t * (1.5 + hash(c, r, S) * 3) + hash(r, c, S) * 6.28,
                  );
              const s = (0.45 + 0.55 * tw) * star[k];
              for (let i = 0; i < 3; i++) p[i] = Math.max(p[i], s * STAR[i]);
            }

            if (cov > 0.01) {
              const b = clamp(
                l * (0.45 + 0.6 * near[k]) + 0.25 * smooth(H - 0.25, H, y),
              );
              const lo = b < 0.5 ? cloud0 : cloud1;
              const hi = b < 0.5 ? cloud1 : cloud2;
              const m = b < 0.5 ? b * 2 : b * 2 - 1;
              const a = Math.min(1, cov * 1.1);
              for (let i = 0; i < 3; i++)
                p[i] = mix(p[i], mix(lo[i], hi[i], m), a);
            }
          }

          if (strike > 0.03) {
            add(
              time.cloud[2],
              strike * (0.1 + 0.3 * cov) * Math.exp(-Math.abs(x - bx0) / 1.2),
            );
            if (x > bx0 - 0.03 && x < bx1 + 0.03 && y < H) {
              let d = 1;
              for (let i = 0; i < 9; i++) {
                const ax = bolt[i * 2];
                const ay = bolt[i * 2 + 1];
                const ex = bolt[i * 2 + 2] - ax;
                const ey = bolt[i * 2 + 3] - ay;
                const f = clamp(
                  ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey),
                );
                d = Math.min(d, Math.hypot(x - ax - ex * f, y - ay - ey * f));
              }
              add(
                BOLT,
                strike *
                  (2.4 * Math.exp(-d / Math.max(cw * 0.8, 0.004)) +
                    0.35 * Math.exp(-d / 0.04)),
              );
            }
          }
          // neon hanging in the wet air
          addGlow(k, 0.6);
        } else if (kk === SEA) {
          p[0] = under[k * 3];
          p[1] = under[k * 3 + 1];
          p[2] = under[k * 3 + 2];
          // the sun through the surface
          if (dm < body.r)
            blend(
              time.bodyColor,
              smooth(body.r, body.r * 0.6, dm) *
                (0.75 + 0.25 * Math.sin(t * 2 + x * 40)),
            );
          // shafts of light fanning down from it, swaying
          add(
            time.light,
            smooth(
              0.45,
              0.8,
              noise(fan[k] * 4.5 + t * 0.07, t * 0.05, S + 90),
            ) * shaft[k],
          );
          // ripples of light just under the surface
          add(
            time.light,
            smooth(
              0.62,
              0.8,
              noise(x * 16 + t * 0.3, y * 26 - t * 0.2, S + 91),
            ) *
              smooth(0.22, 0, y) *
              0.25,
          );
          // specks drifting slowly down
          if (hash(c, r - Math.floor(t * 0.6), S + 92) > 0.988)
            add(SILVER, 0.22 + 0.12 * Math.sin(t * 2 + c));
        } else if (kk === SOLID) {
          p[0] = base[k * 3] + glow[k * 3];
          p[1] = base[k * 3 + 1] + glow[k * 3 + 1];
          p[2] = base[k * 3 + 2] + glow[k * 3 + 2];
          if (strike > 0.03) add(time.light, strike * 0.08);
        } else if (kk === SIGN || kk === BLINK) {
          const s = kk === BLINK ? blink : 1;
          p[0] = base[k * 3] * s;
          p[1] = base[k * 3 + 1] * s;
          p[2] = base[k * 3 + 2] * s;
        } else {
          // a lamp or window, flickering a little
          add(
            lampColor,
            0.82 +
              0.12 * Math.sin(t * 3.1 + c * 1.7) +
              0.06 * Math.sin(t * 7.3 + r) +
              0.25 * flash,
          );
        }

        // the windmill's sails, turning
        if (landmark === "windmill") {
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
            if (width < 0.006 + (d > 0.025 ? 0.008 : 0))
              put(tint(time.shade, d < 0.01 ? HUB : SAIL, 0.55));
          }
        }

        // the temple's flag, streaming
        if (
          flag &&
          Math.abs(x - flag.x) < 0.05 &&
          y > flag.y - 0.04 &&
          y < flag.y
        ) {
          const u = (x - flag.x) * -lightDir;
          const pole = Math.abs(x - flag.x) < Math.max(0.0015, cw * 0.45);
          const wave = flag.y - 0.032 + 0.004 * Math.sin(t * 5 - u * 60);
          if (pole) put(tint(time.shade, time.light, 0.3));
          else if (
            u > 0 &&
            u < 0.035 &&
            Math.abs(y - wave) < Math.max(0.008 * (1 - u / 0.035), ch * 0.5)
          )
            put(tint(time.shade, [1, 0.55, 0.15], 0.8));
        }

        // smoke from the cabin's chimney, drifting with the wind
        if (landmark === "cabin") {
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
            blend(smokeColor, 0.3 * s);
          }
        }

        // lamps glow into the air round them; the lighthouse sweeps its beam
        if (kk !== LAMP) {
          if (lighthouse) {
            const lx = x - lighthouse.x;
            const along = Math.abs(lx) / (Math.abs(cb) * 1.1 + 0.01);
            if (lx * cb > 0 && along < 1) {
              // a pale wedge, white enough to read against a lit sky
              const spread = 0.02 + Math.abs(lx) * 0.2;
              add(
                BEAM,
                (1 - along) ** 1.6 *
                  Math.exp(-(((y - lighthouse.y) / spread) ** 2)) *
                  (dark ? 0.6 : 0.5),
              );
            }
          }
          add(time.warm, lamps[k] + sweep[k] * (1 + flash * 0.8));
        }

        // (by half a unit away the pointer's light is gone)
        if (
          pointer &&
          pointer.strength > 0.01 &&
          Math.abs(x - pointer.x) < 0.5 &&
          Math.abs(y - pointer.y) < 0.5
        ) {
          const px = x - pointer.x;
          const py = y - pointer.y;
          const dp = Math.sqrt(px * px + py * py);
          add(
            time.warm,
            (Math.exp(-dp / Math.max(0.012, ch * 1.2)) * 0.75 +
              Math.exp(-dp / 0.07) * 0.2) *
              pointer.strength,
          );
        }

        if (kk === SKY) {
          for (const tap of taps) {
            if (tap.y >= H && scene.water) continue;
            // a shooting star from where the sky was touched
            const age = t - tap.t;
            const len = 0.14;
            const ux = -lightDir * 0.93;
            const uy = 0.36;
            const qx = x - (tap.x - lightDir * age * 0.9);
            const qy = y - (tap.y + age * 0.35);
            const along = -(qx * ux + qy * uy);
            if (along > -0.01 && along < len) {
              const across = Math.abs(qx * uy - qy * ux);
              add(
                TRAIL,
                Math.exp(-across / (ch * grain * 0.6)) *
                  1.2 *
                  (1 - Math.max(0, along) / len) *
                  smooth(1.1, 0.6, age),
              );
            }
          }
        }

        keep(k);
      }
    }

    // --- things in the air and the sea, drawn over what is behind them -----
    // Sky lanterns, on one side of the waterline per call, so the water below
    // can mirror the ones above it.
    const drawLanterns = (wet: boolean) => {
      for (const l of lanterns) {
        const from = mix(H + 0.02, 1.08, l.d);
        const travel = from + 0.1;
        const y = from - frac((t * l.v) / travel + l.phase) * travel;
        const x = l.x + 0.012 * Math.sin(t * 0.25 + l.phase * 9);
        const hw = l.size;
        const hh = l.size * 1.4;
        const a = smooth(from, from - 0.05, y);
        const fl = 0.85 + 0.15 * Math.sin(t * 6 + l.phase * 40);
        const core = cellAt(x, y);
        each(x - hw * 5, y - hh * 4, x + hw * 5, y + hh * 4, (k, cx, cy) => {
          if ((kind[k] === WATER) !== wet) return;
          const dx = Math.max(Math.abs(cx - x) - hw, 0);
          const dy = Math.max(Math.abs(cy - y) - hh, 0);
          if (k === core || (dx === 0 && dy === 0)) {
            // paper lit from the flame at its foot
            const v = clamp((cy - (y - hh)) / (2 * hh));
            over(
              k,
              tint(LANTERN_TOP, LANTERN_FOOT, v).map((c) => c * fl),
              a,
            );
          } else {
            const d = Math.hypot(dx, dy);
            lift(
              k,
              time.warm,
              a * fl * 0.45 * Math.exp(-d / (hw * 1.4 + cw * 0.3)),
            );
          }
        });
      }
    };
    drawLanterns(false);
    for (const e of embers)
      speck(
        e.x + 0.01 * Math.sin(t * 0.7 + e.phase * 20),
        1.02 - frac(t * e.v + e.phase) * 1.1,
        (k) => {
          if (kind[k] !== WATER)
            lift(k, time.warm, 0.3 + 0.25 * Math.sin(t * 3 + e.phase * 30));
        },
      );

    if (reef) {
      // the school turns in a ring that wanders; each fish flashes as it
      // turns its flank to us
      const cx = 1 - scene.side * 0.15 + 0.22 * Math.sin(t * 0.045 + S);
      const cy = 0.5 + 0.07 * Math.sin(t * 0.07 + S);
      for (const f of fish) {
        const a = f.a + t * 0.32;
        const rr = 0.13 * f.r;
        const fx = cx + Math.cos(a) * rr + 0.01 * Math.sin(t * 1.3 + f.a * 5);
        const fy = cy + Math.sin(a) * rr * 0.42 + f.y;
        const vx = -Math.sin(a);
        const vy = Math.cos(a) * 0.42;
        const vl = Math.hypot(vx, vy);
        const b = 0.4 + 0.6 * Math.abs(vx / vl);
        const tail = 1.2 * grain;
        speck(fx, fy, (k) => over(k, SILVER, b));
        speck(fx - (vx / vl) * cw * tail, fy - (vy / vl) * ch * tail, (k) =>
          over(k, SILVER, b * 0.45),
        );
      }
      for (const s of reds) {
        const x = s.x + s.reach * Math.sin(t * s.speed + s.phase);
        const dir = Math.sign(Math.cos(t * s.speed + s.phase)) || 1;
        speck(x, s.y, (k) => over(k, [1, 0.38, 0.24], 0.9));
        speck(x - dir * cw * grain, s.y, (k) => over(k, [1, 0.38, 0.24], 0.5));
      }
      for (let i = 0; i < 8; i++) {
        const rise = frac(t * 0.06 + i / 8);
        speck(
          vent.x +
            0.006 * Math.sin(t * 2.2 + i * 1.9) +
            rise * 0.02 * Math.sin(i),
          vent.y - rise * (vent.y - 0.02),
          (k) => over(k, BUBBLE, 0.55 * smooth(0, 0.05, rise)),
        );
      }
      // a touch lets a few bubbles go
      for (const tap of taps) {
        const age = t - tap.t;
        for (let i = 0; i < 6; i++)
          speck(
            tap.x + (i - 2.5) * 0.006 + 0.01 * Math.sin(age * 5 + i * 2),
            tap.y - age * (0.08 + i * 0.015),
            (k) => over(k, BUBBLE, 0.7 * smooth(2.5, 1.5, age)),
          );
      }
      if (landmark === "manta") {
        // a manta ray gliding, its wings rising and falling
        const ox = mx + 0.2 * Math.sin(t * 0.05 + S);
        const oy = 0.3 + 0.025 * Math.sin(t * 0.09 + S);
        const beat = 0.05 * Math.sin(t * 1.1);
        const pin = Math.max(0.0025, cw * 0.45);
        const span = 0.17;
        each(ox - span, oy - 0.1, ox + span, oy + 0.16, (k, x, y) => {
          const u = x - ox;
          const au = Math.abs(u);
          const off = -beat * (au / span) ** 2;
          // seen from below: a diamond, head up, thickest at the body
          const thick = 0.006 + 0.044 * (1 - au / span);
          const v = y - oy - off;
          const wing = au < span && Math.abs(v) < Math.max(thick, ch * 0.5);
          const horns =
            Math.abs(au - 0.02) < pin * 1.5 && y > oy - 0.066 && y < oy - 0.04;
          const tail = au < pin && y > oy && y < oy + 0.14;
          if (!wing && !horns && !tail) return;
          // a pale belly between dark wings
          over(
            k,
            wing && v > -thick * 0.2 && au < span * 0.35
              ? [0.4, 0.55, 0.58]
              : tint(time.shade, time.light, 0.06),
            0.95,
          );
        });
      }
    }

    // --- water: what is above, mirrored and broken by the swell -------------
    const skiffX = skiffs.map(
      (s) => s.x + 0.025 * Math.sin(t * 0.04 + s.phase),
    );
    for (let r = 0; r < rows; r++) {
      const y = Y[r];
      if (y < H) continue;
      for (let c = 0; c < cols; c++) {
        const k = r * cols + c;
        if (kind[k] !== WATER) continue;
        const x = X[c];
        const m = mirror[c];
        const depth = y - m;
        const w = city
          ? 0.65 * noise(x * 90, y * 5 - t * 0.4, S + 82) +
            0.35 * noise(x * 30 + t * 0.2, y * 40, S + 83)
          : 0.6 * noise(x * 7 + t * 0.12, y * 55 - t * 0.6, S + 80) +
            0.4 * noise(x * 20 - t * 0.25, y * 110 - t * 1.1, S + 81);
        let ripple = 0;
        for (const tap of taps) {
          if (tap.y < H) continue;
          const age = t - tap.t;
          const ring = ch * grain;
          const reach = age * 0.05 + ring * 4; // past it, the ring is gone
          if (Math.abs(y - tap.y) > reach || Math.abs(x - tap.x) > reach * 3)
            continue;
          const d = Math.sqrt(((x - tap.x) / 3) ** 2 + (y - tap.y) ** 2);
          ripple +=
            Math.exp(-(((d - age * 0.05) / ring) ** 2)) * Math.exp(-age * 1.4);
        }
        // a wet street stretches what it mirrors into long smears
        const sway = city
          ? (w - 0.5) * 0.004 + ripple * 0.01
          : (w - 0.5) * (0.012 + depth * 0.15) + ripple * 0.01;
        const mr = Math.round(
          (2 * m - y - depth * (city ? -0.35 : 0.15) - view.y) / ch - 0.5,
        );
        const mc = Math.round((x + sway - view.x) / cw - 0.5);
        const mk = mr * cols + mc;
        const inside =
          mr >= 0 && mr < rows && mc >= 0 && mc < cols && kind[mk] !== WATER;
        const from = inside ? rgb : air;
        const at = inside ? mk * 3 : 0;
        above[0] = from[at];
        above[1] = from[at + 1];
        above[2] = from[at + 2];
        if (city) {
          // asphalt, with a zebra crossing near us and a curb each side
          const z = EYE / Math.max(1e-3, y - H);
          const across = (x - 1) * z;
          const zebra =
            z > 0.42 &&
            z < 0.62 &&
            frac(across / 0.16) < 0.5 &&
            Math.abs(across) < STREET - 0.18;
          const curb =
            Math.abs(Math.abs(across) - (STREET - 0.15)) <
            Math.max(0.01, cw * z * 0.6);
          put(
            zebra ? [0.2, 0.2, 0.22] : curb ? [0.12, 0.12, 0.14] : time.water,
          );
          const sheen = 0.7 + 0.6 * w;
          p[0] *= sheen;
          p[1] *= sheen;
          p[2] *= sheen;
          blend(above, (0.55 - 0.25 * smooth(0, 0.4, depth)) * (0.6 + 0.6 * w));
          addGlow(k, 0.8);
        } else {
          const swell = 0.5 + 0.9 * w;
          put(time.water);
          p[0] *= swell;
          p[1] *= swell;
          p[2] *= swell;
          blend(above, (0.62 - 0.3 * smooth(0, 0.35, depth)) * (0.7 + 0.5 * w));
          // the road of light under the sun or moon
          if (time.body) {
            const sun = time.body === "sun";
            const glint = road[k] * smooth(0.5, 0.82, w) * (sun ? 0.8 : 0.7);
            p[0] += time.bodyColor[0] * glint;
            p[1] += time.bodyColor[1] * glint * (sun ? 0.8 : 1);
            p[2] += time.bodyColor[2] * glint * (sun ? 0.6 : 1);
          }
          // lamps drawn down the water as broken streaks
          add(
            time.warm,
            smooth(0.45, 0.8, w) *
              (streaks[k] + beamStreak[k] * (0.8 + 0.6 * flash)),
          );
          // mist on the water at the horizon
          add(hazeColor, mist[k]);
        }
        if (
          pointer &&
          pointer.strength > 0.01 &&
          pointer.y < H &&
          Math.abs(x - pointer.x) < 0.024 + depth * 0.2
        ) {
          add(
            time.warm,
            Math.exp(-(((x - pointer.x) / (0.006 + depth * 0.05)) ** 2)) *
              smooth(0.45, 0.8, w) *
              pointer.strength *
              0.6 *
              smooth(0.25, 0, depth),
          );
        }
        add(RIPPLE, ripple);
        // the boat, riding the swell
        if (landmark === "boat") {
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
          const mast = Math.abs(bx) < 0.0025 && y > by - 0.09 && y < by - 0.012;
          if (hull || mast) put(boatDark);
          else if (sail)
            put(
              tint(
                time.shade,
                time.light,
                0.35 + 0.35 * smooth(by - 0.085, by - 0.02, y),
              ),
            );
        }
        // long river boats, a boatman standing at the stern
        for (let i = 0; i < skiffs.length; i++) {
          const s = skiffs[i];
          const bx = skiffX[i];
          const u = (x - bx) / s.len;
          if (Math.abs(u) > 1) continue;
          const v = y - s.y;
          const deck = -Math.max(0.01, ch) - 0.012 * u ** 4;
          const man =
            Math.abs(x - (bx - 0.7 * s.len * s.dir)) <
              Math.max(0.003, cw * 0.45) &&
            v > deck - 0.045 &&
            v <= deck;
          if ((v < 0.002 && v > deck) || man) put(boatDark);
        }
        keep(k);
      }
    }

    drawLanterns(true);
    // lamps floating downstream, each with its streak in the water
    const bows = skiffs.map((s, i) => ({
      x: skiffX[i] + 0.85 * s.len * s.dir,
      y: s.y - Math.max(0.01, ch) - 0.006,
      phase: s.phase,
    }));
    for (const d of [
      ...diyas.map((d) => ({
        x: frac((d.x + t * d.v + 0.05) / 2.1) * 2.1 - 0.05,
        y: d.y,
        phase: d.phase,
      })),
      ...bows,
    ]) {
      const fl = 0.8 + 0.2 * Math.sin(t * 7 + d.phase * 30);
      speck(d.x, d.y, (k) => over(k, flame, 0.9 * fl));
      for (let i = 1; i <= 3; i++)
        speck(d.x + 0.003 * Math.sin(t * 3 + i), d.y + i * ch * grain, (k) => {
          if (kind[k] === WATER) lift(k, time.warm, 0.35 * (1 - i / 4) * fl);
        });
    }
    // petals falling from the blossom, tumbling
    for (const pt of petals) {
      const travel = 1.06 - pt.y;
      const f = frac((t * pt.v) / travel + pt.phase);
      const a =
        0.7 *
        (0.6 + 0.4 * Math.sin(t * 4 + pt.phase * 20)) *
        smooth(0, 0.05, f);
      speck(
        pt.x +
          0.03 * Math.sin(t * 0.8 + pt.phase * 11) * f -
          scene.side * 0.12 * f,
        pt.y + f * travel,
        (k) => over(k, BLOSSOM[2], a),
      );
    }

    // rain over everything, in slanting lanes, lit by whatever is near
    if (time.rain) {
      const slant = time.lightning ? 0.22 : 0.08;
      for (let r = 0; r < rows; r++) {
        const y = Y[r];
        for (let c = 0; c < cols; c++) {
          const lane = Math.floor((X[c] + y * slant) / cw);
          const h = hash(lane, 31, S);
          if (h > time.rain) continue;
          const f = frac((y - t * (0.9 + h * 0.8)) / 0.4 + hash(lane, 32, S));
          if (f < 0.84) continue;
          const s = (f - 0.84) / 0.16;
          const k = r * cols + c;
          for (let i = 0; i < 3; i++)
            rgb[k * 3 + i] += (RAIN[i] * 0.16 + glow[k * 3 + i] * 0.8) * s;
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
        const kk = kind[k];
        const floor =
          kk === SKY ? 0.1 : kk === SEA ? 0.06 : kk === WATER ? 0.12 : 0.03;
        // How hard brightness maps to dot size: peak ** 0.75, which lifts the
        // mid-tones, from two square roots, since a power a cell is the
        // dearest thing in the frame.
        const root = Math.sqrt(Math.max(cr, cg, cb2, 1e-4));
        const level =
          clamp(floor + (1 - floor) * root * Math.sqrt(root)) * fade;
        const step = Math.max(
          0,
          Math.min(3, Math.round(level * 3 + BAYER[(r & 3) * 4 + (c & 3)])),
        );
        out[k * 4 + 3] = step;
        if (step) {
          // Each dot's colour is pushed away from its own grey, so a scene
          // reads vivid without whites and greys turning a hue.
          const grey = cr * 0.3 + cg * 0.55 + cb2 * 0.15;
          const vr = Math.max(0, grey + (cr - grey) * VIVID.chroma);
          const vg = Math.max(0, grey + (cg - grey) * VIVID.chroma);
          const vb = Math.max(0, grey + (cb2 - grey) * VIVID.chroma);
          // A small dot is drawn brighter and a large one dimmer, so a gradient
          // stays smooth across the dither's steps.
          const want = Math.min(1, (level + 0.06) / COVER[step]);
          const s =
            (VIVID.least + (1 - VIVID.least) * want) /
            Math.max(vr, vg, vb, 1e-4);
          // (a clamped array rounds and clamps on the way in)
          out[k * 4] = vr * s * 255;
          out[k * 4 + 1] = vg * s * 255;
          out[k * 4 + 2] = vb * s * 255;
        } else {
          out[k * 4] = out[k * 4 + 1] = out[k * 4 + 2] = 0;
        }
      }
    }
    return out;
  };
}
