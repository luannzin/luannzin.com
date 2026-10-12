// The die's geometry, shared by `Die` and the Lab: a cube projected by hand,
// and the throws between its faces. Pure, so it runs anywhere.

type V = [number, number, number];

// A cube projected by hand into one path of edges and one of pips, so every
// line stays a crisp 1px vector however it turns.
//
// Each face: its outward normal, the axes across and down it (in CSS's frame,
// y down, z toward us), and the turn (x, y) that brings it round to the
// front. Opposite faces add to seven.
const FACES: { n: V; u: V; v: V; turn: [number, number] }[] = [
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], turn: [0, 0] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], turn: [-90, 0] },
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0], turn: [0, -90] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0], turn: [0, 90] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1], turn: [90, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0], turn: [0, 180] },
];
// Pips for one to six: cells of a 3 by 3 grid (0 top left, 8 bottom right),
// across and down a face two units wide.
const A = 0.48;
const PIPS = ["4", "08", "048", "0268", "02468", "023568"].map((cells) =>
  [...cells].map((k) => [((+k % 3) - 1) * A, (Math.floor(+k / 3) - 1) * A]),
);
const PIP = 0.15; // a pip's radius
const VIEW = 6; // how far we stand from the die, in half-edges
const TILT: [number, number] = [-24, -36]; // at rest it shows three faces

const rad = Math.PI / 180;
// CSS's rotateX(x) rotateY(y): turn about y first, then about x.
const turn = ([px, py, pz]: V, x: number, y: number): V => {
  const cy = Math.cos(y * rad);
  const sy = Math.sin(y * rad);
  const qx = px * cy + pz * sy;
  const qz = -px * sy + pz * cy;
  const cx = Math.cos(x * rad);
  const sx = Math.sin(x * rad);
  return [qx, py * cx - qz * sx, py * sx + qz * cx];
};
const project = ([x, y, z]: V) => {
  const k = VIEW / (VIEW - z);
  return `${(x * k).toFixed(2)} ${(y * k).toFixed(2)}`;
};

// The die turned by (x, y) and tilted to the viewer: the faces turned toward
// us, outlined, and their pips as small foreshortened discs.
export function drawDie(x: number, y: number) {
  const place = (p: V) => turn(turn(p, x, y), TILT[0], TILT[1]);
  let edges = "";
  let pips = "";
  FACES.forEach((face, i) => {
    const n = place(face.n);
    const u = place(face.u);
    const v = place(face.v);
    // seen from in front of the face, not merely facing our way
    const facing = n[2] - 1 / VIEW;
    if (facing <= 0) return;
    const at = (a: number, b: number): V => [
      n[0] + a * u[0] + b * v[0],
      n[1] + a * u[1] + b * v[1],
      n[2] + a * u[2] + b * v[2],
    ];
    edges += `M${project(at(-1, -1))}L${project(at(1, -1))}L${project(at(1, 1))}L${project(at(-1, 1))}Z`;
    // pips only once a face is turned enough to read
    if (facing < 0.12) return;
    for (const [a, b] of PIPS[i]) {
      for (let s = 0; s < 12; s++) {
        const t = (s / 12) * Math.PI * 2;
        const point = at(a + PIP * Math.cos(t), b + PIP * Math.sin(t));
        pips += `${s ? "L" : "M"}${project(point)}`;
      }
      pips += "Z";
    }
  });
  return { edges, pips };
}

// The face a seed lands on, so the die and the scene agree.
export const faceOf = (seed: number) => FACES[seed % 6].turn;
// From one angle onward to another, by at least `turns` whole turns.
const onward = (from: number, to: number, turns: number) =>
  from + turns * 360 + ((((to - from) % 360) + 360) % 360);
export const settle = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

// A throw from (x, y) to the face for `seed`, as [x0, y0, x1, y1]: at least a
// turn on each axis, and a second on one, half the time.
export type Throw = [number, number, number, number];
export function throwTo([x, y]: [number, number], seed: number): Throw {
  const [tx, ty] = faceOf(seed);
  return [x, y, onward(x, tx, 1 + (seed % 2)), onward(y, ty, 1)];
}
// Where a throw has got to, `ms` in.
export function angleAt([x0, y0, x1, y1]: Throw, ms: number): [number, number] {
  const k = settle(ms / TUMBLE_MS);
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
}

// The hop that goes with a throw: up, a little larger, then a small landing.
// In percent of the die's size, so a large die hops as far as a small one.
export const HOP_MS = 760;
export const TUMBLE_MS = 1100;
export const HOP: Keyframe[] = [
  { transform: "none", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
  {
    transform: "translateY(-18%) scale(1.12)",
    offset: 0.36,
    easing: "cubic-bezier(0.6, 0, 0.8, 0.5)",
  },
  { transform: "translateY(2%) scale(0.96)", offset: 0.8 },
  { transform: "none" },
];
