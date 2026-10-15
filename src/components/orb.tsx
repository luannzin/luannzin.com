"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";

// A theme as a little halftone world: its ground as a disc, its ink as dots
// shaded like a lit sphere, turning. Dot size carries the tone, as in print,
// so each orb is a picture of the palette in the site's own dot language.
// Light grounds print ink (dots grow into the shadow); dark grounds print
// light (dots grow into the light). Stops run from faint to strong.
const looks: Record<Theme, { ground: string; dots: string[]; ink?: true }> = {
  dark: { ground: "#161616", dots: ["#3d3d3d", "#858585", "#f5f5f5"] },
  light: {
    ground: "#fafaf9",
    dots: ["#d9d9d6", "#7a7a7a", "#1f1f1f"],
    ink: true,
  },
  // dawn's rose, through mauve, to the indigo at the top of its sky
  dawn: {
    ground: "#fff3f4",
    dots: ["#f2b0bb", "#a07fb0", "#3d4278", "#272a4b"],
    ink: true,
  },
};

const LEVELS = 24; // tones, so dots batch into a few fills per frame
const STEP = 2.75; // css px between dot centres: about 12 across a 32px orb
const TILT = 0.4; // the axis leans toward the viewer, so the poles show
const IDLE = 0.3; // rad/s at rest
const AWAKE = 1.4; // rad/s while the dock is open

const hex = (s: string) =>
  [1, 3, 5].map((i) => Number.parseInt(s.slice(i, i + 2), 16));

// `stops` sampled into LEVELS fills
function ramp(stops: string[]) {
  const rgb = stops.map(hex);
  return Array.from({ length: LEVELS }, (_, i) => {
    const at = (i / (LEVELS - 1)) * (rgb.length - 1);
    const k = Math.min(rgb.length - 2, Math.floor(at));
    const f = at - k;
    const c = rgb[k].map((v, j) => Math.round(v + (rgb[k + 1][j] - v) * f));
    return `rgb(${c.join(",")})`;
  });
}

// One clock for every orb, and one pointer they all turn their light
// toward. It runs only while an orb is live.
const live = new Set<(now: number) => void>();
let pointer: { x: number; y: number } | null = null;
let running = false;

function loop(now: number) {
  running = live.size > 0;
  if (!running) return;
  requestAnimationFrame(loop);
  for (const draw of live) draw(now);
}

const track = (e: PointerEvent) => {
  pointer = e.pointerType === "mouse" ? { x: e.clientX, y: e.clientY } : null;
};

export function Orb({
  theme,
  awake = false,
  live: playing = true,
  className,
}: {
  theme: Theme;
  // spins faster and follows the pointer
  awake?: boolean;
  // drawn every frame; otherwise once, as it stands
  live?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    phase: 0,
    rate: IDLE,
    light: [-0.5, -0.62, 0.6],
    awake,
  });
  state.current.awake = awake;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const look = looks[theme];
    const fills = ramp(look.dots);
    const size = canvas.clientWidth;
    const dpr = Math.min(3, devicePixelRatio || 1);
    canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = size / 2;
    const s = state.current;
    // each theme starts its world at its own longitude
    s.phase ||= theme.length * 1.7;

    // the dot grid, centred, as unit-sphere normals
    const cells: number[] = [];
    const n = Math.floor(size / STEP);
    const off = (size - (n - 1) * STEP) / 2;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const x = off + i * STEP;
        const y = off + j * STEP;
        const nx = (x - r) / (r - 0.6);
        const ny = (y - r) / (r - 0.6);
        const d = nx * nx + ny * ny;
        if (d < 1) cells.push(x, y, nx, ny, Math.sqrt(1 - d));
      }
    let then = 0;

    const draw = (now: number) => {
      // at rest it turns at the scenes' 15fps; awake, at 30
      if (now - then < 1000 / (s.awake ? 31 : 16)) return;
      const dt = Math.min(0.1, (now - then) / 1000);
      then = now;
      if (!still) {
        // spin up and down rather than snapping between speeds
        s.rate += ((s.awake ? AWAKE : IDLE) - s.rate) * (1 - Math.exp(-dt * 3));
        s.phase += s.rate * dt;
        // the light leans toward the pointer while awake, and drifts back
        let target = [-0.5, -0.62, 0.6];
        if (s.awake && pointer) {
          const box = canvas.getBoundingClientRect();
          const dx = pointer.x - (box.left + r);
          const dy = pointer.y - (box.top + r);
          const len = Math.hypot(dx, dy) || 1;
          target = [(dx / len) * 0.8, (dy / len) * 0.8, 0.55];
        }
        const k = 1 - Math.exp(-dt * 6);
        s.light = s.light.map((v, i) => v + (target[i] - v) * k);
      }
      const [lx, ly, lz] = s.light;
      const ll = Math.hypot(lx, ly, lz);
      const cp = Math.cos(s.phase);
      const sp = Math.sin(s.phase);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const max = STEP * 0.62;

      const level = Array.from({ length: LEVELS }, () => new Path2D());
      for (let c = 0; c < cells.length; c += 5) {
        const nx = cells[c + 2];
        const ny = cells[c + 3];
        const nz = cells[c + 4];
        // into the world's own frame: tilt, then turn
        const ty = ny * ct - nz * st;
        const tz = ny * st + nz * ct;
        const wx = nx * cp + tz * sp;
        const wz = tz * cp - nx * sp;
        const lon = Math.atan2(wx, wz);
        const lat = Math.asin(Math.max(-1, Math.min(1, ty)));
        // swirled bands, like weather on a small planet
        const land =
          0.5 +
          0.5 * Math.sin(3 * lon + 2.6 * Math.sin(2.2 * lat + Math.sin(lon)));
        const lit = Math.max(0, (nx * lx + ny * ly + nz * lz) / ll);
        const rim = (1 - nz) ** 3 * 0.5;
        // the bands carry most of the tone, so the turning reads at 32px
        let tone = Math.min(
          1,
          // the night side keeps fine dots, so the disc reads as a globe
          0.14 + lit * (0.2 + 0.8 * land * land) + rim * lit,
        );
        if (look.ink) tone = 1 - tone * 0.92;
        const radius = max * Math.sqrt(tone);
        if (radius < 0.18) continue;
        const x = cells[c];
        const y = cells[c + 1];
        const p = level[Math.round(tone * (LEVELS - 1))];
        p.moveTo(x + radius, y);
        p.arc(x, y, radius, 0, Math.PI * 2);
      }

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = look.ground;
      ctx.fillRect(0, 0, size, size);
      level.forEach((p, i) => {
        ctx.fillStyle = fills[i];
        ctx.fill(p);
      });
      ctx.restore();
    };

    draw(performance.now());
    if (still || !playing) return;
    if (!live.size) addEventListener("pointermove", track, { passive: true });
    live.add(draw);
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
    return () => {
      live.delete(draw);
      if (!live.size) removeEventListener("pointermove", track);
    };
  }, [theme, playing]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
