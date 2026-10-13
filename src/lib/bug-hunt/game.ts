// Bug hunt: the simulation and the drawing, on one canvas 192px tall. The page
// owns the loop, the input devices and the overlays; this owns everything
// inside the frame. Every sprite comes from the atlas
// `scripts/bug-hunt-art.py` draws.
import atlas from "./atlas.json";
import {
  type Kind,
  type Level,
  makeLevel,
  PIT,
  ROWS,
  TILE,
  type Trap,
} from "./level";

// The view's width in px changes with the space the page gives it (the page
// keeps the scale a whole number); its height never does.
export const W = 320;
export const H = ROWS * TILE;

type Anim = {
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  ax?: number;
  ay?: number;
};
const ANIMS: Record<string, Anim> = atlas.anims;
const C = atlas.colours;

export type Action = "left" | "right" | "jump" | "down" | "throw" | "special";

// A point in the view, in game px: where the mouse is.
export type Point = { x: number; y: number };

export type Event =
  | { type: "level"; level: number }
  | { type: "open" }
  | { type: "over"; level: number; fixed: number };

// Feel, in px and seconds. A jump peaks a little over 60px up (3.7 tiles)
// and carries about 4.5 tiles across at a run.
const GRAVITY = 900;
const JUMP = 330;
const CUT = 120;
// around the top of a held jump gravity eases off, so the arc rounds over
// instead of turning on a point
const APEX = 50;
const HANG = 0.55;
const RUN = 105;
const ACCEL = 1100;
// pushing against his own speed: a quick skid into the turn
const TURN = 2400;
const AIR = 700;
const FRICTION = 1500;
const FALL = 420;
const COYOTE = 0.09;
const BUFFER = 0.12;
// px of ground his feet cover per frame of the run
const STRIDE = 8;
const HEARTS = 5;
// kills it takes to fill the laptop
const METER = 6;
const SAFE = 1.2;
// his box: standing, then crouched
const TALL = 30;
const LOW = 20;
// a throw: how long his arm is out, when the thing leaves his hand, its
// speed and how long it flies, the trail it leaves, how many fly at once
const THROW = 0.22;
const RELEASE = 0.05;
const SHOT = 330;
const RANGE = 0.8;
const TRAIL = 56;
const SHOTS = 3;
// the special: typing, charging, then the beam
const CODE = 0.9;
const CHARGE = 0.45;
const FIRE = 0.7;
// the longest step the simulation takes; a frame is cut into steps this long
// or shorter, so motion keeps the display's own pace
const STEP = 1 / 120;
const ITEMS = ["mouse", "keyboard", "headphones"] as const;
// a laser's cycle: off, a warning, then firing for ON seconds
const CYCLE = 2.6;
const WARN = 0.5;
const ON = 1.1;
// a saw's speed along its track, and its radius
const SAW = 48;
const BLADE = 6;

type Body = {
  x: number;
  // feet, or the bottom of the box
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  ground: boolean;
};

type Hero = Body & {
  dir: 1 | -1;
  coyote: number;
  buffer: number;
  hearts: number;
  safe: number;
  action: "" | "throw" | "special" | "hurt" | "out";
  at: number;
  // a throw pressed while his arm is still out, thrown the moment it can be
  cue: number;
  crouch: boolean;
  aim: Point;
  item: number;
  meter: number;
  drop: number;
  t: number;
  // how far his feet have run, which picks the run's frame
  stride: number;
  home: { x: number; y: number };
};

type Bug = Body & {
  kind: Kind;
  dir: 1 | -1;
  hp: number;
  flash: number;
  stun: number;
  t: number;
  homeX: number;
  homeY: number;
};

type Shot = {
  item: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  // where it left his hand, so the trail never reaches behind it
  x0: number;
  y0: number;
};
type Fx = { name: string; x: number; y: number; t: number; fps: number };
// a pixel of a burst: it flies, falls and thins out in dither as it dies
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  life: number;
  colour: string;
};
// a damage number rising off a bug
type Hit = { x: number; y: number; t: number; value: number };
type Drop = { x: number; y: number; speed: number; length: number };
type Box = { l: number; r: number; t: number; b: number };

// the 4x4 Bayer matrix, row by row: ordered dither for everything that fades
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const patterns = new Map<number, CanvasPattern>();

const overlap = (a: Box, b: Box) =>
  a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
const boxOf = (b: Body): Box => ({
  l: b.x - b.w / 2,
  r: b.x + b.w / 2,
  t: b.y - b.h,
  b: b.y,
});

export class Game {
  level!: Level;
  hero!: Hero;
  bugs: Bug[] = [];
  shots: Shot[] = [];
  fx: Fx[] = [];
  sparks: Spark[] = [];
  hits: Hit[] = [];
  rain: Drop[] = [];
  fixed = 0;
  width = W;
  time = 0;
  cam = 0;
  open = false;
  // a level's first moments: its number on screen
  intro = 0;
  // the wipe between levels, 0 to 1 and back
  wipe = 0;
  leaving = 0;
  over = 0;
  shake = 0;
  // the mouse over the view, for the crosshair; null when it isn't there
  pointer: Point | null = null;
  // how far from the view's left edge he stands; it eases across when he
  // turns, and the camera holds him there to the pixel
  private look = W / 2 - 28;
  private seed: number;
  private decks = new Set<number>();
  private held = new Set<Action>();
  private tapped = new Set<Action>();
  // where the press that's waiting to be handled pointed, if it did
  private target: Point | null = null;
  // the joystick's lean, -1 to 1 on each axis
  private stick: Point = { x: 0, y: 0 };

  constructor(
    private sheet: HTMLImageElement,
    private emit: (event: Event) => void,
    // no screen shake when the visitor asked for less motion
    private calm: boolean,
  ) {
    this.seed = Math.floor(Math.random() * 2 ** 32);
    // data rain in the room behind: dotted streaks, slower than the world
    for (let i = 0; i < 34; i++) {
      this.rain.push({
        x: Math.random() * 640,
        y: Math.random() * H,
        speed: 30 + Math.random() * 60,
        length: 4 + Math.floor(Math.random() * 10),
      });
    }
    this.load(1);
  }

  // A press, and for a mouse click the point in the view it was aimed at.
  press(action: Action, at?: Point) {
    if (!this.held.has(action)) this.tapped.add(action);
    this.held.add(action);
    if (at) this.target = at;
  }

  release(action: Action) {
    this.held.delete(action);
  }

  releaseAll() {
    this.held.clear();
    this.tapped.clear();
    this.stick = { x: 0, y: 0 };
  }

  steer(x: number, y: number) {
    this.stick = { x, y };
  }

  private load(number: number) {
    const hearts = this.hero ? Math.min(HEARTS, this.hero.hearts + 1) : HEARTS;
    const meter = this.hero?.meter ?? 0;
    this.level = makeLevel(number, this.seed);
    this.decks = new Set(
      this.level.decks.flatMap((d) =>
        Array.from({ length: d.w }, (_, i) => d.row * 1000 + d.col + i),
      ),
    );
    const x = 3 * TILE + 8;
    const y = this.level.surface[3] * TILE;
    this.hero = {
      x,
      y,
      vx: 0,
      vy: 0,
      w: 10,
      h: TALL,
      ground: true,
      dir: 1,
      coyote: 0,
      buffer: 0,
      hearts,
      safe: 0,
      action: "",
      at: 0,
      cue: 0,
      crouch: false,
      aim: { x: 1, y: 0 },
      item: 0,
      meter,
      drop: 0,
      t: 0,
      stride: 0,
      home: { x, y },
    };
    this.bugs = this.level.bugs.map((s, i) => ({
      x: s.x,
      y: s.y,
      vx: 0,
      vy: 0,
      w: s.kind === "crawler" ? 14 : 10,
      h: s.kind === "crawler" ? 9 : 10,
      ground: false,
      kind: s.kind,
      dir: i % 2 ? 1 : -1,
      hp: s.kind === "crawler" ? 2 : 1,
      flash: 0,
      stun: 0,
      t: i * 0.37,
      homeX: s.x,
      homeY: s.y,
    }));
    this.shots = [];
    this.fx = [];
    this.sparks = [];
    this.hits = [];
    this.open = false;
    this.leaving = 0;
    this.cam = 0;
    this.look = this.width / 2 - 28;
    this.intro = 1.6;
    this.emit({ type: "level", level: number });
  }

  // --- the world -----------------------------------------------------------

  private solid(col: number, row: number) {
    if (col < 0 || col >= this.level.cols) return true;
    if (row < 0 || row >= ROWS) return false;
    return row >= this.level.surface[col];
  }

  private deck(col: number, row: number) {
    return this.decks.has(row * 1000 + col);
  }

  private surfaceAt(x: number) {
    const col = Math.max(
      0,
      Math.min(this.level.cols - 1, Math.floor(x / TILE)),
    );
    return this.level.surface[col];
  }

  // Moves a body a step, axis by axis, against the floor and the decks.
  // Returns whether it ran into a wall.
  private move(b: Body, dt: number, decks: boolean) {
    let wall = false;
    b.x += b.vx * dt;
    const rows = [
      Math.floor((b.y - b.h) / TILE),
      Math.floor((b.y - 0.01) / TILE),
    ];
    if (b.vx !== 0) {
      const edge = b.x + (b.vx > 0 ? b.w / 2 : -b.w / 2);
      const col = Math.floor(edge / TILE);
      for (let row = rows[0]; row <= rows[1]; row++) {
        if (!this.solid(col, row)) continue;
        b.x =
          b.vx > 0
            ? col * TILE - b.w / 2 - 0.01
            : (col + 1) * TILE + b.w / 2 + 0.01;
        b.vx = 0;
        wall = true;
        break;
      }
    }
    const before = b.y;
    b.y += b.vy * dt;
    b.ground = false;
    const cols = [
      Math.floor((b.x - b.w / 2) / TILE),
      Math.floor((b.x + b.w / 2 - 0.01) / TILE),
    ];
    if (b.vy >= 0) {
      const row = Math.floor(b.y / TILE);
      for (let col = cols[0]; col <= cols[1]; col++) {
        const top = row * TILE;
        const deck = decks && this.deck(col, row) && before <= top + 0.01;
        if (this.solid(col, row) || deck) {
          b.y = top;
          b.vy = 0;
          b.ground = true;
          break;
        }
      }
    } else {
      const row = Math.floor((b.y - b.h) / TILE);
      for (let col = cols[0]; col <= cols[1]; col++) {
        if (!this.solid(col, row)) continue;
        b.y = (row + 1) * TILE + b.h;
        b.vy = 0;
        break;
      }
    }
    return wall;
  }

  // --- one frame -----------------------------------------------------------

  // Advances the game by `seconds` of play, in steps of at most STEP. Each
  // frame is played out in full, never rounded to whole steps, so a 144Hz
  // screen moves him as evenly as a 60Hz one.
  update(seconds: number) {
    let left = Math.min(seconds, 0.1);
    while (left > 1e-6) {
      const dt = Math.min(STEP, left);
      this.step(dt);
      left -= dt;
    }
  }

  private step(dt: number) {
    this.time += dt;
    this.shake = Math.max(0, this.shake - dt);
    this.intro = Math.max(0, this.intro - dt);
    if (this.wipe > 0 && this.leaving === 0) {
      this.wipe = Math.max(0, this.wipe - dt * 2.5);
    }
    if (this.leaving > 0) {
      this.leaving += dt;
      this.wipe = Math.min(1, this.leaving * 2.5);
      if (this.leaving > 0.7) this.load(this.level.number + 1);
      return;
    }
    this.stepHero(dt);
    // a press is handled once, by the first step that sees it
    this.tapped.clear();
    this.target = null;
    for (const bug of this.bugs) this.stepBug(bug, dt);
    this.stepShots(dt);
    for (const f of this.fx) f.t += dt;
    for (const p of this.sparks) {
      p.t += dt;
      p.vy += 200 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.sparks = this.sparks.filter((p) => p.t < p.life);
    for (const n of this.hits) n.t += dt;
    this.hits = this.hits.filter((n) => n.t < 0.7);
    for (const d of this.rain) {
      d.y += d.speed * dt;
      if (d.y > H + d.length) d.y = -d.length;
    }
    this.fx = this.fx.filter((f) => f.t < (ANIMS[f.name]?.n ?? 1) / f.fps);
    if (!this.open && this.bugs.length === 0) {
      this.open = true;
      this.emit({ type: "open" });
    }
    // He stands `look` px into the view, a little behind the middle so more
    // of what's ahead shows, and that eases across when he turns. The camera
    // itself follows him exactly: chasing him with a lag, the two would round
    // to different pixels and he'd shimmer against the floor.
    const goal = this.width / 2 - this.hero.dir * 28;
    this.look += (goal - this.look) * Math.min(1, dt * 3);
    if (Math.abs(goal - this.look) < 0.25) this.look = goal;
    const max = this.level.cols * TILE - this.width;
    this.cam = Math.max(0, Math.min(max, this.hero.x - this.look));
  }

  // The direction a throw goes: at the mouse when it was clicked, along the
  // joystick when it leans, straight ahead otherwise.
  private aim(h: Hero): Point {
    const from = { x: h.x + h.dir * 6, y: h.y - 22 };
    let x = h.dir as number;
    let y = 0;
    if (this.target) {
      x = this.target.x + this.cam - from.x;
      y = this.target.y - from.y;
    } else if (Math.hypot(this.stick.x, this.stick.y) > 0.5) {
      x = this.stick.x;
      y = this.stick.y;
    }
    const d = Math.hypot(x, y) || 1;
    return { x: x / d, y: y / d };
  }

  private stepHero(dt: number) {
    const h = this.hero;
    const held = (a: Action) => this.held.has(a);
    const tap = (a: Action) => this.tapped.has(a);
    h.t += dt;
    h.at += dt;
    h.safe = Math.max(0, h.safe - dt);
    h.drop = Math.max(0, h.drop - dt);

    if (h.action === "out") {
      h.vx = 0;
      h.vy = Math.min(FALL, h.vy + GRAVITY * dt);
      this.move(h, dt, true);
      this.over += dt;
      if (this.over > 1.2 && this.over - dt <= 1.2) {
        this.emit({
          type: "over",
          level: this.level.number,
          fixed: this.fixed,
        });
      }
      return;
    }

    // the special: frozen in place, untouchable, until the beam is spent
    if (h.action === "special") {
      h.vx = 0;
      if (h.at > CODE + CHARGE) this.beam();
      if (h.at > CODE + CHARGE + FIRE) h.action = "";
      return;
    }

    if (h.action === "throw" && h.at >= THROW) h.action = "";
    if (h.action === "hurt" && h.at >= 0.35) h.action = "";

    // A throw leaves his legs free: he runs and jumps through it, still
    // facing what he threw at. A hit takes them for a moment.
    const hurt = h.action === "hurt";
    h.crouch = !h.action && h.ground && held("down");
    h.h = h.crouch ? LOW : TALL;
    let want = (held("right") ? 1 : 0) - (held("left") ? 1 : 0);
    if (want !== 0 && !h.action) h.dir = want > 0 ? 1 : -1;
    if (h.crouch || hurt) want = 0;
    const goal = want * RUN;
    let accel = AIR;
    if (h.ground && !want) accel = FRICTION;
    else if (h.ground) accel = goal * h.vx < 0 ? TURN : ACCEL;
    h.vx +=
      Math.sign(goal - h.vx) * Math.min(Math.abs(goal - h.vx), accel * dt);

    h.coyote = h.ground ? COYOTE : Math.max(0, h.coyote - dt);
    h.buffer = tap("jump") ? BUFFER : Math.max(0, h.buffer - dt);
    if (h.buffer > 0 && h.coyote > 0 && !hurt) {
      if (held("down") && this.onDeck(h)) {
        h.drop = 0.25;
        h.y += 1;
      } else {
        h.vy = -JUMP;
        this.puff(h.x, h.y);
      }
      h.buffer = 0;
      h.coyote = 0;
    }
    if (!held("jump") && h.vy < -CUT) h.vy = -CUT;
    const hang = held("jump") && Math.abs(h.vy) < APEX ? HANG : 1;
    h.vy = Math.min(FALL, h.vy + GRAVITY * hang * dt);

    const air = !h.ground;
    this.move(h, dt, h.drop === 0);
    if (h.ground) h.stride += Math.abs(h.vx) * dt;
    if (air && h.ground && h.vy === 0) this.puff(h.x, h.y);
    if (h.ground && !this.onDeck(h) && this.firm(h) && !this.trapNear(h.x)) {
      h.home = { x: h.x, y: h.y };
    }

    // the laptop, once it's charged; it cuts a throw short
    if (tap("special") && h.meter >= METER && !hurt) {
      h.action = "special";
      h.at = 0;
      h.meter = 0;
      h.vx = 0;
      return;
    }

    // A throw is aimed when it's pressed, and a press while his arm is still
    // out waits for it, so quick clicks all land.
    if (tap("throw")) {
      h.cue = BUFFER;
      h.aim = this.aim(h);
    } else {
      h.cue = Math.max(0, h.cue - dt);
    }
    if (h.cue > 0 && !h.action && this.shots.length < SHOTS) {
      h.cue = 0;
      if (Math.abs(h.aim.x) > 0.1) h.dir = h.aim.x > 0 ? 1 : -1;
      h.action = "throw";
      h.at = 0;
    }
    if (h.action === "throw" && h.at >= RELEASE && h.at - dt < RELEASE) {
      const x = h.x + h.dir * 8;
      const y = h.y - 22;
      this.shots.push({
        item: h.item,
        x,
        y,
        vx: h.aim.x * SHOT,
        vy: h.aim.y * SHOT,
        t: 0,
        x0: x,
        y0: y,
      });
      h.item = (h.item + 1) % ITEMS.length;
    }

    if (h.y > H + 40) this.fall();

    if (h.safe === 0) {
      const me = boxOf(h);
      for (const bug of this.bugs) {
        if (bug.stun > 0.15 || !overlap(me, boxOf(bug))) continue;
        this.hurt(bug.x < h.x ? 1 : -1);
        break;
      }
    }
    if (h.safe === 0) this.trapped(h);

    const door = this.level.exit * TILE + 8;
    if (this.open && h.ground && Math.abs(h.x - door) < 6) {
      this.leaving = 0.001;
      h.action = "";
    }
  }

  private onDeck(b: Body) {
    const row = Math.floor(b.y / TILE);
    const col = Math.floor(b.x / TILE);
    return b.ground && this.deck(col, row) && !this.solid(col, row);
  }

  // both edges of the feet over floor, so a respawn never starts at a lip
  private firm(b: Body) {
    const row = Math.floor(b.y / TILE);
    return (
      this.solid(Math.floor((b.x - 8) / TILE), row) &&
      this.solid(Math.floor((b.x + 8) / TILE), row)
    );
  }

  // A trap he's touching: spikes send him back to the last firm floor, like
  // a pit; a firing laser and a saw knock him away.
  private trapped(h: Hero) {
    const me = boxOf(h);
    for (const trap of this.level.traps) {
      let from = 0;
      if (trap.kind === "spikes") {
        // the points, 5px over the floor
        const bed = {
          l: trap.col * TILE + 1,
          r: (trap.col + trap.w) * TILE - 1,
          t: trap.row * TILE - 5,
          b: trap.row * TILE,
        };
        if (!overlap(me, bed)) continue;
      } else if (trap.kind === "laser") {
        const x = (trap.col + 0.5) * TILE;
        const beam = { l: x - 3, r: x + 3, t: 0, b: trap.row * TILE - 6 };
        if (this.laser(trap) !== "on" || !overlap(me, beam)) continue;
        from = h.x < x ? -1 : 1;
      } else {
        const saw = this.saw(trap);
        const nx = Math.max(me.l, Math.min(me.r, saw.x));
        const ny = Math.max(me.t, Math.min(me.b, saw.y));
        if (Math.hypot(saw.x - nx, saw.y - ny) >= BLADE) continue;
        from = h.x < saw.x ? -1 : 1;
      }
      this.burst(h.x, h.y - 12, 16, [C.red, C.ink], 150);
      if (trap.kind === "spikes") this.fall();
      else this.hurt(from);
      return;
    }
  }

  // within reach of a trap, so no place to come back to after a fall
  private trapNear(x: number) {
    return this.level.traps.some(
      (t) => x > t.col * TILE - 12 && x < (t.col + t.w) * TILE + 12,
    );
  }

  // Where a laser is in its cycle. Each runs on its own clock, offset by its
  // column, so the lasers in a room don't all fire together.
  private laser(t: Trap): "off" | "warn" | "on" {
    const at = (this.time + t.col * 0.37) % CYCLE;
    if (at >= CYCLE - ON) return "on";
    return at >= CYCLE - ON - WARN ? "warn" : "off";
  }

  // a saw's middle, rolling back and forth along its track, and its heading
  private saw(t: Trap) {
    const from = t.col * TILE + BLADE + 1;
    const span = t.w * TILE - 2 * (BLADE + 1);
    const at = ((this.time * SAW) / span + t.col * 0.31) % 2;
    return {
      x: from + span * (at < 1 ? at : 2 - at),
      y: t.row * TILE - BLADE + 1,
      dir: at < 1 ? 1 : -1,
    };
  }

  // a pit or spikes: a heart, then back to the last firm floor
  private fall() {
    const h = this.hero;
    this.hurt(0);
    h.x = h.home.x;
    h.y = h.home.y;
    h.vx = 0;
    h.vy = 0;
  }

  private hurt(from: number) {
    const h = this.hero;
    h.hearts--;
    h.safe = SAFE;
    h.action = "hurt";
    h.at = 0;
    h.crouch = false;
    h.h = TALL;
    h.vx = from * 140;
    h.vy = -180;
    if (!this.calm) this.shake = 0.2;
    if (h.hearts <= 0) {
      h.action = "out";
      this.over = 0;
    }
  }

  private puff(x: number, y: number) {
    this.fx.push({ name: "dust", x, y, t: 0, fps: 14 });
  }

  // `n` pixels thrown out of a point, in the colours given
  private burst(
    x: number,
    y: number,
    n: number,
    colours: string[],
    speed: number,
    up = 60,
  ) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      this.sparks.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - up,
        t: 0,
        life: 0.5 + Math.random() * 0.9,
        colour: colours[i % colours.length],
      });
    }
  }

  private beam() {
    const h = this.hero;
    const { y, from, to } = this.beamSpan();
    const span: Box = {
      l: Math.min(from, to),
      r: Math.max(from, to),
      t: y - 10,
      b: y + 10,
    };
    for (const bug of this.bugs) {
      if (overlap(span, boxOf(bug))) this.damage(bug, 99, h.dir, false);
    }
    // sparks peel off its edges
    const side = Math.random() < 0.5 ? -1 : 1;
    this.sparks.push({
      x: from + (to - from) * Math.random(),
      y: y + side * 8,
      vx: h.dir * (20 + Math.random() * 60),
      vy: side * (20 + Math.random() * 50) - 30,
      t: 0,
      life: 0.3 + Math.random() * 0.4,
      colour: C.rose[Math.floor(Math.random() * 3)],
    });
    if (!this.calm) this.shake = Math.max(this.shake, 0.05);
  }

  // the beam leaves his hands and grows to the edge of the view
  private beamSpan() {
    const h = this.hero;
    const from = h.x + h.dir * 13;
    const grow = Math.min(1, (h.at - CODE - CHARGE) / 0.15);
    const edge = h.dir > 0 ? this.cam + this.width + 16 : this.cam - 16;
    return { y: h.y - 17, from, to: from + (edge - from) * grow };
  }

  private damage(bug: Bug, amount: number, dir: number, counts: boolean) {
    bug.hp -= amount;
    bug.flash = 0.12;
    if (amount < 99) {
      this.hits.push({ x: bug.x, y: bug.y - bug.h - 2, t: 0, value: amount });
    }
    if (bug.hp > 0) {
      bug.stun = 0.35;
      bug.vx = dir * (bug.kind === "crawler" ? 110 : 143);
      bug.vy = bug.kind === "crawler" ? -80 : -32;
      return;
    }
    this.bugs = this.bugs.filter((b) => b !== bug);
    this.fixed++;
    if (counts) this.hero.meter = Math.min(METER, this.hero.meter + 1);
    const mid = bug.y - bug.h / 2;
    const own = bug.kind === "crawler" ? C.green : C.cyan;
    this.burst(bug.x, mid, 44, [...own, own[1], C.magenta, C.ink], 220);
    this.fx.push({ name: "impact", x: bug.x, y: mid, t: 0, fps: 18 });
    this.fx.push({ name: "check", x: bug.x, y: mid - 10, t: 0, fps: 1.4 });
  }

  private stepBug(bug: Bug, dt: number) {
    const n = this.level.number;
    bug.t += dt;
    bug.flash = Math.max(0, bug.flash - dt);
    bug.stun = Math.max(0, bug.stun - dt);
    if (bug.kind === "crawler") {
      const speed = Math.min(52, 26 + n * 3);
      if (bug.stun > 0) {
        bug.vx -= Math.sign(bug.vx) * Math.min(Math.abs(bug.vx), 400 * dt);
      } else if (bug.ground) {
        const row = Math.floor(bug.y / TILE);
        const ahead = Math.floor((bug.x + bug.dir * (bug.w / 2 + 2)) / TILE);
        const floor = this.solid(ahead, row) || this.deck(ahead, row);
        if (!floor || this.solid(ahead, row - 1)) bug.dir = -bug.dir as 1 | -1;
        bug.vx = bug.dir * speed;
      }
      bug.vy = Math.min(FALL, bug.vy + GRAVITY * dt);
      if (this.move(bug, dt, true)) bug.dir = -bug.dir as 1 | -1;
      if (bug.y > H + 40) bug.hp = 0;
    } else {
      const speed = Math.min(60, 30 + n * 3);
      const h = this.hero;
      const near = Math.abs(h.x - bug.x) < 140 && h.action !== "out";
      if (bug.stun > 0) {
        bug.vx *= 1 - Math.min(1, dt * 4);
        bug.vy *= 1 - Math.min(1, dt * 4);
      } else if (near) {
        const dx = h.x - bug.x;
        const dy = h.y - 16 - bug.y;
        const d = Math.hypot(dx, dy) || 1;
        bug.vx = (dx / d) * speed;
        bug.vy = (dy / d) * speed + Math.sin(bug.t * 4) * 20;
        bug.dir = dx > 0 ? 1 : -1;
      } else {
        if (Math.abs(bug.x - bug.homeX) > 40) {
          bug.dir = bug.x > bug.homeX ? -1 : 1;
        }
        bug.vx = bug.dir * speed * 0.6;
        bug.vy = (bug.homeY + Math.sin(bug.t * 3) * 8 - bug.y) * 3;
      }
      bug.x += bug.vx * dt;
      bug.y += bug.vy * dt;
      const floor = this.surfaceAt(bug.x);
      if (floor !== PIT) bug.y = Math.min(bug.y, floor * TILE - 4);
      bug.y = Math.max(24, bug.y);
      bug.x = Math.max(8, Math.min(this.level.cols * TILE - 8, bug.x));
    }
    if (bug.hp <= 0) this.bugs = this.bugs.filter((b) => b !== bug);
  }

  // Throws fly straight, at one speed, until they hit a bug or a wall or run
  // out of range.
  private stepShots(dt: number) {
    for (const shot of this.shots) {
      shot.t += dt;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      let spent =
        shot.t > RANGE ||
        this.solid(Math.floor(shot.x / TILE), Math.floor(shot.y / TILE));
      const box: Box = {
        l: shot.x - 5,
        r: shot.x + 5,
        t: shot.y - 5,
        b: shot.y + 5,
      };
      for (const bug of this.bugs) {
        if (spent || !overlap(box, boxOf(bug))) continue;
        const dir = Math.sign(shot.vx) || this.hero.dir;
        this.damage(bug, shot.item === 1 ? 2 : 1, dir, true);
        spent = true;
      }
      if (spent) {
        this.fx.push({ name: "impact", x: shot.x, y: shot.y, t: 0, fps: 20 });
        this.burst(shot.x, shot.y, 6, [C.ink, C.grey], 90);
        shot.t = -1;
      }
    }
    this.shots = this.shots.filter(
      (s) => s.t >= 0 && s.y < H + 32 && s.y > -32,
    );
  }

  // --- drawing -------------------------------------------------------------

  private sprite(
    ctx: CanvasRenderingContext2D,
    name: string,
    frame: number,
    x: number,
    y: number,
  ) {
    const a = ANIMS[name];
    const i = ((frame % a.n) + a.n) % a.n;
    ctx.drawImage(
      this.sheet,
      a.x + i * a.w,
      a.y,
      a.w,
      a.h,
      Math.round(x),
      Math.round(y),
      a.w,
      a.h,
    );
  }

  // drawn by its anchor, or its middle when it has none
  private put(
    ctx: CanvasRenderingContext2D,
    name: string,
    frame: number,
    x: number,
    y: number,
  ) {
    const a = ANIMS[name];
    this.sprite(
      ctx,
      name,
      frame,
      x - (a.ax ?? a.w >> 1),
      y - (a.ay ?? a.h >> 1),
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { level, hero: h } = this;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = C.sky;
    ctx.fillRect(0, 0, this.width, H);
    const jolt = this.shake > 0 ? Math.round(Math.sin(this.time * 90) * 2) : 0;
    const cam = Math.round(this.cam) - jolt;

    // the room behind, a quarter of the world's speed, and its rain
    const back = ANIMS.backdrop;
    const blink = Math.floor(this.time / 0.7) % 2;
    for (let x = -((cam * 0.25) % back.w); x < this.width; x += back.w) {
      this.sprite(ctx, "backdrop", blink, x, 0);
    }
    ctx.fillStyle = C.rain;
    for (const d of this.rain) {
      const x = Math.floor((((d.x - cam * 0.4) % 640) + 640) % 640);
      if (x >= this.width) continue;
      for (let k = 0; k < d.length; k += 2) {
        ctx.fillRect(x, Math.floor(d.y) - k, 1, 1);
      }
    }

    ctx.save();
    ctx.translate(-cam, 0);
    this.put(
      ctx,
      "door",
      this.open ? 1 : 0,
      level.exit * TILE + 8,
      level.surface[level.exit] * TILE,
    );

    // the floor: bricks fade out in dither the deeper under it they are
    const first = Math.max(0, Math.floor(cam / TILE));
    const last = Math.min(
      level.cols - 1,
      Math.floor((cam + this.width) / TILE),
    );
    for (let col = first; col <= last; col++) {
      const top = level.surface[col];
      for (let row = top; row < ROWS; row++) {
        const up = row === top ? 4 : 0;
        const left = this.solid(col - 1, row) ? 0 : 2;
        const right = this.solid(col + 1, row) ? 0 : 1;
        const depth = Math.min(3, row - top);
        const cell = depth * 8 + (up | left | right);
        this.sprite(ctx, "ground", cell, col * TILE, row * TILE);
      }
    }
    for (const d of level.decks) {
      for (let i = 0; i < d.w; i++) {
        const k = d.w === 1 ? 3 : i === 0 ? 0 : i === d.w - 1 ? 2 : 1;
        this.sprite(ctx, "catwalk", k, (d.col + i) * TILE, d.row * TILE);
      }
    }
    this.drawTraps(ctx);

    for (const bug of this.bugs) {
      const side = bug.dir > 0 ? "r" : "l";
      const y = bug.kind === "crawler" ? bug.y : bug.y - 2;
      if (bug.flash > 0) {
        this.put(ctx, `${bug.kind}-hit-${side}`, 0, bug.x, y);
      } else {
        const frame = Math.floor(bug.t * (bug.kind === "crawler" ? 10 : 14));
        this.put(ctx, `${bug.kind}-${side}`, frame, bug.x, y);
      }
    }

    for (const shot of this.shots) {
      this.trail(ctx, shot);
      const turn = Math.floor(shot.t * 16) * (shot.vx < 0 ? -1 : 1);
      this.put(ctx, ITEMS[shot.item], turn, shot.x, shot.y);
    }

    const blinking = h.safe > 0 && Math.floor(h.safe * 12) % 2 === 1;
    if (this.leaving === 0 && !blinking) {
      const [name, frame] = this.pose();
      const side = h.dir > 0 ? "r" : "l";
      // the frame a hit lands on is his silhouette, solid
      const struck = h.action === "hurt" && h.at < 0.08 ? "-hit" : "";
      this.put(ctx, `hero-${name}${struck}-${side}`, frame, h.x, h.y);
    }

    if (h.action === "special" && h.at > CODE) {
      const charge = h.at - CODE;
      if (charge < CHARGE) {
        const grow = Math.min(2, Math.floor((charge / CHARGE) * 3));
        this.put(ctx, "orb", grow, h.x - h.dir * 2, h.y - 12);
      } else {
        this.drawBeam(ctx);
      }
    }

    for (const f of this.fx) {
      if (f.name === "check") {
        // rises, then blinks out
        if (f.t > 0.5 && Math.floor(f.t * 16) % 2) continue;
        this.put(ctx, "check", 0, f.x, f.y - f.t * 16);
        continue;
      }
      this.put(ctx, f.name, Math.floor(f.t * f.fps), f.x, f.y);
    }

    // sparks: a pixel with a short trail, thinning out in dither as they die
    for (const p of this.sparks) {
      const left = 1 - p.t / p.life;
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      if (BAYER[(y & 3) * 4 + (x & 3)] >= left * 16) continue;
      ctx.fillStyle = p.colour;
      ctx.fillRect(x, y, 1, 1);
      // its trail: the last two frames' pixels, while it's still young
      for (let k = 1; k <= 2 && left > 0.4 * k; k++) {
        ctx.fillRect(
          Math.round(p.x - (p.vx * k) / 60),
          Math.round(p.y - (p.vy * k) / 60),
          1,
          1,
        );
      }
    }
    for (const n of this.hits) {
      if (n.t > 0.5 && Math.floor(n.t * 16) % 2) continue;
      this.number(ctx, n.value, n.x - 2, n.y - n.t * 20, "digits-red");
    }
    ctx.restore();

    this.hud(ctx, cam);
    if (this.pointer && h.action !== "out") this.crosshair(ctx, this.pointer);
    if (this.wipe > 0) this.dither(ctx, this.wipe);
  }

  private drawTraps(ctx: CanvasRenderingContext2D) {
    for (const t of this.level.traps) {
      const floor = t.row * TILE;
      if (t.kind === "spikes") {
        for (let i = 0; i < t.w; i++) {
          this.put(ctx, "spikes", 0, (t.col + i) * TILE + 8, floor);
        }
      } else if (t.kind === "laser") {
        const x = (t.col + 0.5) * TILE;
        const state = this.laser(t);
        const top = floor - ANIMS.emitter.h;
        if (state === "on") {
          const beam = ANIMS.laser;
          const frame = Math.floor(this.time * 20);
          for (let y = top - beam.h; y > -beam.h; y -= beam.h) {
            this.sprite(ctx, "laser", frame, x - (beam.w >> 1), y);
          }
        } else if (state === "warn") {
          // the warning: a dotted line where it's about to fire, climbing
          ctx.fillStyle = C.red;
          const rise = Math.floor(this.time * 48) % 4;
          for (let y = top - 2 - rise; y > 0; y -= 4) ctx.fillRect(x, y, 1, 2);
        }
        const lens = state === "on" ? 2 : state === "warn" ? 1 : 0;
        this.put(ctx, "emitter", lens, x, floor);
      } else {
        // its track: a groove cut along the floor's top line
        ctx.fillStyle = C.sky;
        ctx.fillRect(t.col * TILE + 2, floor, t.w * TILE - 4, 1);
        const saw = this.saw(t);
        const turn = Math.floor(this.time * 24) * saw.dir;
        this.put(ctx, "saw", turn, saw.x, saw.y);
      }
    }
  }

  // A thrown thing's wake: a white line back to where it left his hand,
  // solid at the front and thinning out in dither toward the tail.
  private trail(ctx: CanvasRenderingContext2D, shot: Shot) {
    const length = Math.min(
      TRAIL,
      Math.hypot(shot.x - shot.x0, shot.y - shot.y0),
    );
    const speed = Math.hypot(shot.vx, shot.vy) || 1;
    const ux = shot.vx / speed;
    const uy = shot.vy / speed;
    ctx.fillStyle = C.ink;
    for (let d = 4; d < length; d++) {
      const x = Math.round(shot.x - ux * d);
      const y = Math.round(shot.y - uy * d);
      if (BAYER[(y & 3) * 4 + (x & 3)] >= (1 - d / length) * 16) continue;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  private crosshair(ctx: CanvasRenderingContext2D, at: Point) {
    const x = Math.round(at.x);
    const y = Math.round(at.y);
    ctx.fillStyle = C.ink;
    for (const d of [2, 3, 4]) {
      ctx.fillRect(x + d, y, 1, 1);
      ctx.fillRect(x - d, y, 1, 1);
      ctx.fillRect(x, y + d, 1, 1);
      ctx.fillRect(x, y - d, 1, 1);
    }
    ctx.fillStyle = C.rose[1];
    ctx.fillRect(x, y, 1, 1);
  }

  // His frame. The run steps with the ground his feet cover, so they never
  // skate; a throw on the run or in the air keeps the legs of either.
  private pose(): [string, number] {
    const h = this.hero;
    const at = h.at;
    const run = Math.abs(h.vx) > 12;
    const legs = h.ground ? (run ? "run" : "") : h.vy < 0 ? "jump" : "fall";
    const step = Math.floor(h.stride / STRIDE);
    switch (h.action) {
      case "special":
        if (at < CODE) return ["code", Math.floor(at * 8)];
        return [at < CODE + CHARGE ? "charge" : "fire", 0];
      case "throw":
        if (legs) return [`${legs}-throw`, step];
        return ["throw", at < RELEASE ? 0 : 1];
      case "hurt":
      case "out":
        return ["hurt", 0];
    }
    if (h.crouch) return ["crouch", 0];
    if (legs === "run") return ["run", step];
    if (legs) return [legs, 0];
    return ["idle", Math.floor(h.t * 2)];
  }

  private drawBeam(ctx: CanvasRenderingContext2D) {
    const h = this.hero;
    const { y, from, to } = this.beamSpan();
    const frame = Math.floor(this.time * 20);
    const length = Math.abs(to - from);
    const top = y - (ANIMS["beam-body"].h >> 1);
    ctx.save();
    ctx.translate(Math.round(from), 0);
    ctx.scale(h.dir, 1);
    const start = ANIMS["beam-start"].w;
    for (let x = start; x < length; x += ANIMS["beam-body"].w) {
      this.sprite(ctx, "beam-body", frame, x, top);
    }
    if (length < this.width) this.sprite(ctx, "beam-end", frame, length, top);
    this.sprite(ctx, "beam-start", frame, 0, top);
    ctx.restore();
  }

  private hud(ctx: CanvasRenderingContext2D, cam: number) {
    const h = this.hero;
    for (let i = 0; i < HEARTS; i++) {
      this.sprite(ctx, "heart", i < h.hearts ? 0 : 1, 6 + i * 9, 6);
    }
    // the laptop's charge, a cell per kill, its frame flashing once it's full
    this.sprite(ctx, "icon-laptop", 0, 5, 15);
    const ready = h.meter >= METER && Math.floor(this.time * 4) % 2 === 0;
    const w = METER * 5 + 3;
    ctx.fillStyle = ready ? C.rose[2] : C.ink;
    ctx.fillRect(17, 16, w, 1);
    ctx.fillRect(17, 24, w, 1);
    ctx.fillRect(17, 17, 1, 7);
    ctx.fillRect(17 + w - 1, 17, 1, 7);
    for (let i = 0; i < h.meter; i++) {
      ctx.fillStyle = C.rose[1];
      ctx.fillRect(19 + i * 5, 18, 4, 5);
      ctx.fillStyle = C.rose[2];
      ctx.fillRect(19 + i * 5, 18, 4, 1);
    }

    this.sprite(ctx, "icon-bug", 0, this.width - 31, 5);
    this.number(ctx, this.bugs.length, this.width - 19, 7);
    this.sprite(ctx, "icon-exit", 0, this.width - 32, 14);
    this.number(ctx, this.level.number, this.width - 19, 16);

    // the last few bugs, or the open door, off screen: an arrow at the edge
    const marks: number[] = [];
    if (this.bugs.length <= 3) {
      for (const b of this.bugs) marks.push(b.x, b.y - b.h / 2);
    }
    if (this.open) {
      marks.push(
        this.level.exit * TILE + 8,
        this.level.surface[this.level.exit] * TILE - 20,
      );
    }
    for (let i = 0; i < marks.length; i += 2) {
      const sx = marks[i] - cam;
      if (sx >= 0 && sx <= this.width) continue;
      if (Math.floor(this.time * 3) % 3 === 0) continue;
      const y = Math.max(30, Math.min(H - 12, marks[i + 1])) - 3;
      const right = sx > this.width;
      const x = right ? this.width - 6 : 2;
      this.sprite(ctx, right ? "pointer-r" : "pointer-l", 0, x, y);
    }

    // a level's number, big, as it starts
    if (this.intro > 0 && this.intro < 1.5) {
      const text = String(this.level.number);
      const width = 11 + 3 + text.length * 4;
      const x = Math.round(this.width / 4 - width / 2);
      ctx.save();
      ctx.scale(2, 2);
      this.sprite(ctx, "icon-exit", 0, x, 30);
      this.number(ctx, this.level.number, x + 14, 32);
      ctx.restore();
    }
  }

  private number(
    ctx: CanvasRenderingContext2D,
    value: number,
    x: number,
    y: number,
    font = "digits",
  ) {
    const text = String(value);
    for (let i = 0; i < text.length; i++) {
      this.sprite(ctx, font, Number(text[i]), x + i * 4, y);
    }
  }

  // Black over the whole view in ordered dither, `k` of the way to solid:
  // the wipe between levels.
  private dither(ctx: CanvasRenderingContext2D, k: number) {
    const level = Math.round(Math.min(1, k) * 16);
    if (level >= 16) {
      ctx.fillStyle = C.sky;
      ctx.fillRect(0, 0, this.width, H);
      return;
    }
    let pattern = patterns.get(level);
    if (!pattern) {
      const tile = document.createElement("canvas");
      tile.width = 4;
      tile.height = 4;
      const t = tile.getContext("2d");
      if (!t) return;
      t.fillStyle = C.sky;
      for (let i = 0; i < 16; i++) {
        if (BAYER[i] < level) t.fillRect(i % 4, i >> 2, 1, 1);
      }
      const made = ctx.createPattern(tile, "repeat");
      if (!made) return;
      pattern = made;
      patterns.set(level, pattern);
    }
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, this.width, H);
  }
}
