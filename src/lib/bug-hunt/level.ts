// Bug hunt's levels, grown from a seed: the same seed and number always give
// the same floor, platforms and bugs. Pure, so `scripts/bug-hunt-check.ts`
// can grow a few thousand and check every one can be finished.

export const TILE = 16;
export const ROWS = 12;
// A column's surface row when it has no floor at all.
export const PIT = ROWS;

// The flat run he starts on and the one the exit stands on, in columns.
export const START = 8;
export const END = 9;
// How far the floor may step, in rows. A jump clears about 3.7 tiles up and
// 4.5 across, so these leave room for a jump that isn't perfect.
export const STEP = 2;
export const GAP = 3;
// Surface rows the floor stays between: 2 to 6 tiles of ground.
const HIGH = 6;
const LOW = 10;

export type Kind = "crawler" | "flyer";
export type Deck = { col: number; row: number; w: number };
export type Spawn = { kind: Kind; x: number; y: number };
// Spikes cover `w` columns of floor; a laser stands in one column and fires
// up on a cycle; a saw rolls back and forth over `w` columns.
export type Trap = {
  kind: "spikes" | "laser" | "saw";
  col: number;
  w: number;
  // the surface row it stands on
  row: number;
};
export type Level = {
  number: number;
  cols: number;
  // each column's top solid row, or PIT
  surface: number[];
  // one-way platforms
  decks: Deck[];
  traps: Trap[];
  bugs: Spawn[];
  exit: number;
};

// mulberry32: small, fast and the same everywhere
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeLevel(number: number, seed: number): Level {
  const rnd = random(seed ^ Math.imul(number, 0x9e3779b1));
  const int = (lo: number, hi: number) =>
    lo + Math.floor(rnd() * (hi - lo + 1));
  const cols = Math.min(112, 48 + number * 8);
  const surface: number[] = [];
  const runs: { from: number; to: number; row: number }[] = [];
  const push = (n: number, row: number) => {
    const from = surface.length;
    for (let i = 0; i < n; i++) surface.push(row);
    if (row !== PIT) runs.push({ from, to: surface.length - 1, row });
  };

  let row = 9;
  push(START, row);
  while (surface.length < cols - END) {
    const pit = rnd() < Math.min(0.34, 0.12 + number * 0.03);
    if (pit) push(int(2, GAP), PIT);
    // after a pit the far side is at most a row up
    const climb = pit ? int(-STEP, 1) : int(-STEP, STEP);
    row = Math.min(LOW, Math.max(HIGH, row - climb));
    const n = Math.min(int(3, 7), cols - END - surface.length);
    if (n < 3) break;
    push(n, row);
  }
  push(cols - surface.length, row);
  const exit = cols - 5;

  // Platforms over the longer runs, three rows up: one jump from the floor,
  // with two rows to walk under.
  const decks: Deck[] = [];
  for (const run of runs) {
    const len = run.to - run.from + 1;
    if (run.from < START || run.to >= cols - END || len < 5 || rnd() < 0.4) {
      continue;
    }
    const w = int(3, Math.min(5, len - 1));
    const col = run.from + int(0, len - w);
    const deck = { col, row: run.row - 3, w };
    const clear = [col - 1, col + w].every((c) => surface[c] >= deck.row + 2);
    if (clear) decks.push(deck);
  }

  // Traps, one to a run between the start and the exit: spikes from the
  // first level, lasers from the second, saws from the third. Each keeps a
  // tile of plain floor at both ends of its run, to land on and take off
  // from, and spikes are never wider than two tiles, a short hop.
  const kinds = (["spikes", "laser", "saw"] as const).slice(0, number);
  const traps: Trap[] = [];
  const most = Math.min(1 + number, 8);
  for (const run of runs) {
    const len = run.to - run.from + 1;
    if (traps.length >= most || run.from < START + 2 || run.to > exit - 4) {
      continue;
    }
    if (len < 4 || rnd() < 0.35) continue;
    const kind = kinds[int(0, kinds.length - 1)];
    if (kind === "spikes") {
      const w = int(1, 2);
      const col = run.from + int(1, len - 1 - w);
      traps.push({ kind, col, w, row: run.row });
    } else if (kind === "laser") {
      traps.push({ kind, col: run.from + int(1, len - 2), w: 1, row: run.row });
    } else if (len >= 5) {
      traps.push({ kind, col: run.from + 1, w: len - 2, row: run.row });
    }
  }

  // Bugs: crawlers walk a run or a deck, flyers hang over the floor. None
  // near the start, so a level never opens with a hit.
  const count = Math.min(4 + number * 2, 18);
  const flyers = number === 1 ? 1 : Math.floor(count / 3);
  const perches = [
    ...runs
      .filter((r) => r.from >= START + 2 && r.to - r.from >= 3)
      .map((r) => ({ col: r.from, w: r.to - r.from + 1, row: r.row })),
    ...decks,
  ];
  const taken = new Set<string>();
  const bugs: Spawn[] = [];
  for (
    let i = 0;
    i < (count - flyers) * 4 && bugs.length < count - flyers;
    i++
  ) {
    const at = perches[int(0, perches.length - 1)];
    if (!at) break;
    const col = at.col + int(0, at.w - 1);
    const key = `${col}:${at.row}`;
    if (taken.has(key) || col >= exit - 2) continue;
    taken.add(key);
    bugs.push({ kind: "crawler", x: col * TILE + 8, y: at.row * TILE });
  }
  for (let i = 0; i < flyers; i++) {
    const col = int(START + 4, cols - END - 2);
    const floor = surface[col] === PIT ? LOW : surface[col];
    bugs.push({
      kind: "flyer",
      x: col * TILE + 8,
      y: Math.max(40, floor * TILE - int(44, 72)),
    });
  }
  return { number, cols, surface, decks, traps, bugs, exit };
}
