"use client";

import { useLayoutEffect, useRef } from "react";
import { type Dots, dots } from "@/lib/dots";
import {
  createScene,
  type Frame,
  type Pointer,
  renderer,
  START,
  type Tap,
  viewOf,
} from "@/lib/scene";
import { cn } from "@/lib/utils";

const FRAME = 1000 / 15;
// A cell, in CSS pixels. When the GPU draws the dots, three, or on a denser
// screen four and a half device pixels: any finer and a dot stops reading as
// round. On a 2D canvas, larger, and finer on phones, where the frame is small.
const cellSize = (width: number, dpr: number, fine: boolean) =>
  fine ? Math.min(3, 4.5 / dpr) : width < 500 ? 3.4 : 4.5;
// A frame that takes longer than this, eight in a row, and cells grow.
const SLOW = 30;

// One post's scene on a canvas. The full scene is 2:1; `crop` shows a square
// around its landmark, for the home page tile. `stir` lets the pointer carry a
// small light and taps drop shooting stars or ripples; otherwise the scene only
// plays while the link or card around it is hovered or focused. `cell` pins a
// cell's size in CSS pixels, for the dot size on Seeded scenes.
export function SceneArt({
  seed,
  crop = false,
  stir = false,
  cell,
  className,
}: {
  seed: number;
  crop?: boolean;
  stir?: boolean;
  cell?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // A new cell size lays the frame out again in place, so the scene plays on
  // from where it was instead of starting over.
  const pinned = useRef(cell);
  const relayout = useRef<() => void>(undefined);
  const scene = createScene(seed);
  const view = viewOf(scene, crop);

  // A layout effect, so a canvas already on screen has its first frame before
  // the browser paints, and before a view transition takes its snapshot. One
  // further down takes its GPU context and shades only once it comes near,
  // so an article's scenes below the fold cost nothing at load.
  useLayoutEffect(() => {
    const canvas = ref.current;
    const view = viewOf(scene, crop);
    if (!canvas) return;
    let painter: Dots | null = null;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: Pointer = { x: 0, y: 0, strength: 0 };
    const aim = { x: 0, y: 0, inside: false };
    const taps: Tap[] = [];

    let cols = 0;
    let rows = 0;
    let frame: (t: number, p?: Pointer, taps?: Tap[]) => Frame = () =>
      new Uint8ClampedArray();
    let coarse = 1; // how much cells have had to grow on a slow device
    let slow = 0;
    let clock = START;
    let last = 0;
    let raf = 0;
    let visible = false;
    // plays while its link, or a card marked to play on hover, is touched; a
    // canvas mounted by that touch (the home page tile) starts out playing
    const link = canvas.closest<HTMLElement>("a, [data-hover-play]");
    let engaged = stir || !!link?.matches(":hover, :focus-visible");

    const paint = () =>
      painter?.draw(frame(clock, pointer, taps), cols, rows, scene.time.ground);

    const layout = () => {
      const width = canvas.clientWidth;
      if (!width || !painter) return;
      // a GPU canvas takes every device pixel there is; a 2D one stops at two
      const dpr = Math.min(painter.fine ? 3 : 2, window.devicePixelRatio || 1);
      const height = (width * view.h) / view.w;
      // past this many columns (51k cells), cells grow rather than multiply
      const most = painter.fine ? 320 : 200;
      const nextCols = crop
        ? 18
        : pinned.current
          ? Math.round(Math.min(most, width / pinned.current))
          : Math.round(
              Math.max(
                64,
                Math.min(
                  most,
                  width / (cellSize(width, dpr, painter.fine) * coarse),
                ),
              ),
            );
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (nextCols !== cols) {
        cols = nextCols;
        rows = Math.round((cols * view.h) / view.w);
        frame = renderer(scene, cols, rows, view);
      }
      paint();
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
      const started = performance.now();
      paint();
      // a device that cannot keep up gets fewer, larger dots
      slow = performance.now() - started > SLOW ? slow + 1 : 0;
      if (slow >= 8 && coarse < 2 && !crop && !pinned.current) {
        coarse *= 1.4;
        slow = 0;
        layout();
      }
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      if (!still && visible && engaged) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (painter) return;
      painter = dots(canvas);
      layout();
    };
    const box = canvas.getBoundingClientRect();
    if (box.bottom > 0 && box.top < window.innerHeight) wake();
    const resize = new ResizeObserver(layout);
    resize.observe(canvas);
    relayout.current = layout;
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        sync();
      },
      { rootMargin: "200px 0px" },
    );
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
      relayout.current = undefined;
    };
  }, [scene, crop, stir]);

  useLayoutEffect(() => {
    pinned.current = cell;
    relayout.current?.();
  }, [cell]);

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
