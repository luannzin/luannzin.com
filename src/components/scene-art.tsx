"use client";

import { useLayoutEffect, useRef } from "react";
import {
  colorString,
  createScene,
  type Frame,
  type Pointer,
  RADIUS,
  renderer,
  type Scene,
  START,
  type Tap,
  type View,
} from "@/lib/scene";
import { cn } from "@/lib/utils";

const FRAME = 1000 / 15;
// Target cell size in CSS pixels: finer on phones, where the frame is small.
const cellSize = (width: number) => (width < 500 ? 3.4 : 4.5);

function viewOf(scene: Scene, crop: boolean): View {
  // the tile is a close square round the landmark, so it still reads at 44px
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

// One post's scene on a canvas. The full scene is 2:1; `crop` shows a square
// around its landmark, for the home page tile. `stir` lets the pointer carry a
// small light and taps drop shooting stars or ripples; otherwise the scene only
// plays while the link or card around it is hovered or focused.
export function SceneArt({
  seed,
  crop = false,
  stir = false,
  className,
}: {
  seed: number;
  crop?: boolean;
  stir?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scene = createScene(seed);
  const view = viewOf(scene, crop);

  // A layout effect, so the first frame is on the canvas before the browser
  // paints, and before a view transition takes its snapshot.
  useLayoutEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const view = viewOf(scene, crop);
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fills = new Map<number, string>();
    const pointer: Pointer = { x: 0, y: 0, strength: 0 };
    const aim = { x: 0, y: 0, inside: false };
    const taps: Tap[] = [];

    let cols = 0;
    let rows = 0;
    let frame: (t: number, p?: Pointer, taps?: Tap[]) => Frame = () => ({
      step: new Uint8Array(),
      color: new Uint32Array(),
    });
    let xs = new Int32Array();
    let ys = new Int32Array();
    let shownStep = new Uint8Array();
    let shownColor = new Uint32Array();
    let clock = START;
    let last = 0;
    let raf = 0;
    let visible = false;
    let engaged = stir;

    const paint = (next: Frame, full: boolean) => {
      const groups = new Map<number, number[]>();
      ctx.fillStyle = scene.time.ground;
      if (full) ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let k = 0; k < next.step.length; k++) {
        const step = next.step[k];
        const color = next.color[k];
        if (!full && step === shownStep[k] && color === shownColor[k]) continue;
        shownStep[k] = step;
        shownColor[k] = color;
        const c = k % cols;
        const r = (k - c) / cols;
        // each cell owns a whole-pixel rectangle, so redrawing one never
        // touches its neighbours
        if (!full)
          ctx.fillRect(xs[c], ys[r], xs[c + 1] - xs[c], ys[r + 1] - ys[r]);
        if (!step) continue;
        const group = groups.get(color);
        if (group) group.push(k);
        else groups.set(color, [k]);
      }
      const size = Math.min(canvas.width / cols, canvas.height / rows);
      for (const [color, cells] of groups) {
        const fill = fills.get(color) ?? colorString(color);
        fills.set(color, fill);
        ctx.fillStyle = fill;
        ctx.beginPath();
        for (const k of cells) {
          const c = k % cols;
          const r = (k - c) / cols;
          const x = (xs[c] + xs[c + 1]) / 2;
          const y = (ys[r] + ys[r + 1]) / 2;
          const radius = RADIUS[shownStep[k]] * size;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const layout = () => {
      const width = canvas.clientWidth;
      if (!width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const height = (width * view.h) / view.w;
      const nextCols = crop
        ? 18
        : Math.max(64, Math.min(200, Math.round(width / cellSize(width))));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (nextCols !== cols) {
        cols = nextCols;
        rows = Math.round((cols * view.h) / view.w);
        frame = renderer(scene, cols, rows, view);
        shownStep = new Uint8Array(cols * rows);
        shownColor = new Uint32Array(cols * rows);
      }
      xs = Int32Array.from({ length: cols + 1 }, (_, c) =>
        Math.round((c * canvas.width) / cols),
      );
      ys = Int32Array.from({ length: rows + 1 }, (_, r) =>
        Math.round((r * canvas.height) / rows),
      );
      paint(frame(clock, pointer, taps), true);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME - 2) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      clock += dt;
      const ease = (rate: number) => 1 - Math.exp(-dt * rate);
      pointer.strength += ((aim.inside ? 1 : 0) - pointer.strength) * ease(5);
      pointer.x += (aim.x - pointer.x) * ease(10);
      pointer.y += (aim.y - pointer.y) * ease(10);
      while (taps.length && clock - taps[0].t > 2.5) taps.shift();
      paint(frame(clock, pointer, taps), false);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      if (!still && visible && engaged) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    layout();
    const resize = new ResizeObserver(layout);
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    seen.observe(canvas);

    const locate = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      aim.x = view.x + ((event.clientX - box.left) / box.width) * view.w;
      aim.y = view.y + ((event.clientY - box.top) / box.height) * view.h;
    };
    const move = (event: PointerEvent) => {
      locate(event);
      if (!aim.inside) {
        pointer.x = aim.x;
        pointer.y = aim.y;
      }
      aim.inside = event.pointerType === "mouse";
    };
    const leave = () => {
      aim.inside = false;
    };
    const tap = (event: PointerEvent) => {
      locate(event);
      taps.push({ x: aim.x, y: aim.y, t: clock });
      if (taps.length > 4) taps.shift();
    };
    // plays while its link, or a card marked to play on hover, is touched
    const link = canvas.closest<HTMLElement>("a, [data-hover-play]");
    const engage = (on: boolean) => () => {
      engaged = on;
      sync();
    };
    const listening = new AbortController();
    const { signal } = listening;

    if (stir && !still) {
      canvas.addEventListener("pointermove", move, { signal });
      canvas.addEventListener("pointerleave", leave, { signal });
      canvas.addEventListener("pointerdown", tap, { signal });
    } else if (link) {
      link.addEventListener("pointerenter", engage(true), { signal });
      link.addEventListener("pointerleave", engage(false), { signal });
      link.addEventListener("focus", engage(true), { signal });
      link.addEventListener("blur", engage(false), { signal });
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      listening.abort();
    };
  }, [scene, crop, stir]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("block w-full", className)}
      style={{
        aspectRatio: `${view.w} / ${view.h}`,
        backgroundColor: scene.time.ground,
      }}
    />
  );
}
