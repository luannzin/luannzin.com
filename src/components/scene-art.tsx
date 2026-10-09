"use client";

import { useLayoutEffect, useRef } from "react";
import { dots } from "@/lib/dots";
import {
  createScene,
  type Frame,
  type Pointer,
  renderer,
  type Scene,
  START,
  type Tap,
  type View,
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
    const view = viewOf(scene, crop);
    if (!canvas) return;
    const painter = dots(canvas);
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
    let engaged = stir;

    const paint = () =>
      painter.draw(frame(clock, pointer, taps), cols, rows, scene.time.ground);

    const layout = () => {
      const width = canvas.clientWidth;
      if (!width) return;
      // a GPU canvas takes every device pixel there is; a 2D one stops at two
      const dpr = Math.min(painter.fine ? 3 : 2, window.devicePixelRatio || 1);
      const height = (width * view.h) / view.w;
      // past this many columns (51k cells), cells grow rather than multiply
      const most = painter.fine ? 320 : 200;
      const nextCols = crop
        ? 18
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
      if (slow >= 8 && coarse < 2 && !crop) {
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
