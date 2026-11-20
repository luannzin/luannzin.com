"use client";

import { useEffect, useRef } from "react";
import { BAYER, DUSK } from "./footer-art";

// A line's night, the lines' own banner made small: 2px dusk dots on a 3px
// grid (whole device pixels), Bayer-dithered from the night toward a glow
// around the element marked `data-glow` in the same tile (the line's mark),
// and plain night under the one marked `data-calm` (its pixel name), so the
// name reads. The dots develop once, in Bayer order behind a front crossing
// left to right, when the tile first comes into view. Hovering or focusing
// the link around it blooms the glow, the dusk spreading out dot by dot; the
// pointer pushes the dots aside and they spring back, like the footer's
// strip. Under reduced motion the field is simply there, nothing is pushed,
// and the glow changes in place.

const REST = 0.8; // how far up the ramp the glow reaches at rest
const AWAKE = 1.9; // and while the link is hovered or focused
const DEVELOP = 1400; // ms
const REACH = 28; // css px the pointer pushes within
const PUSH = 10;

/** `delay`: ms after page load before the dots may develop. */
export function NightField({ delay }: { delay: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const tile = canvas?.parentElement;
    if (!canvas || !ctx || !tile) return;
    const link = tile.closest("a") ?? tile;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // per cell: x, y, glow (0..1), calm (0..1), bayer, develop turn, offset x, offset y
    let cells = new Float32Array(0);
    let shade = new Uint8Array(0);
    let dot = 2;
    let step = 3;
    let dpr = 1;
    let glow = REST;
    let target = REST;
    let progress = still ? 1 : 0;
    let developing = 0; // the develop's start time, while it runs
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let last = 0;

    const build = () => {
      dpr = devicePixelRatio || 1;
      const box = tile.getBoundingClientRect();
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      step = Math.max(2, Math.round(3 * dpr));
      dot = Math.max(1, Math.round(2 * dpr));
      const inside = (el: Element | null) => {
        const r = el?.getBoundingClientRect();
        return (
          r && {
            left: (r.left - box.left) * dpr,
            right: (r.right - box.left) * dpr,
            top: (r.top - box.top) * dpr,
            bottom: (r.bottom - box.top) * dpr,
          }
        );
      };
      const mark = inside(tile.querySelector("[data-glow]"));
      const name = inside(tile.querySelector("[data-calm]"));
      const gx = mark ? (mark.left + mark.right) / 2 : canvas.width / 2;
      const gy = mark ? (mark.top + mark.bottom) / 2 : canvas.height / 2;
      const reach = canvas.width * 0.6;
      const cols = Math.ceil(canvas.width / step);
      const rows = Math.ceil(canvas.height / step);
      cells = new Float32Array(cols * rows * 8);
      shade = new Uint8Array(cols * rows);
      let n = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * step;
          const y = r * step;
          const near = Math.max(
            0,
            1 - Math.hypot(x - gx, (y - gy) * 1.4) / reach,
          );
          // plain night under the name and 4px around it, the field back to
          // full strength 52px out, so the calm has no edge
          const calm = name
            ? Math.min(
                1,
                Math.max(
                  0,
                  Math.hypot(
                    Math.max(name.left - x, 0, x - name.right),
                    Math.max(name.top - y, 0, y - name.bottom),
                  ) -
                    4 * dpr,
                ) /
                  (48 * dpr),
              )
            : 1;
          const b = BAYER[(r & 3) * 4 + (c & 3)] / 16;
          cells.set(
            [
              x,
              y,
              near ** 1.5 * calm,
              calm,
              b,
              (x / canvas.width) * 0.6 + b * 0.4,
              0,
              0,
            ],
            n * 8,
          );
          n++;
        }
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 64) / 16.7 || 1;
      last = now;
      if (developing) {
        // cubic ease-out, so the front is seen crossing rather than flashing in
        const k = Math.min(1, (now - developing) / DEVELOP);
        progress = 1 - (1 - k) ** 3;
        if (k === 1) developing = 0;
      }
      glow = still ? target : glow + (target - glow) * (1 - 0.88 ** dt);
      const spring = 1 - 0.8 ** dt;
      const reach = REACH * dpr;
      let moving = Math.abs(target - glow) > 0.002;
      for (let i = 0; i < shade.length; i++) {
        const o = i * 8;
        const b = cells[o + 4];
        // the dusk colour this cell takes, 0 for none: a 4x4 Bayer dither
        // of the glow along the ramp night, violet, plum, ember, gold
        let s = Math.max(
          0,
          Math.min(4, Math.round(cells[o + 2] * glow * 4 + b - 0.5)),
        );
        // away from the glow the night keeps one violet dot in sixteen,
        // thinning out toward the name, so the calm has no edge
        if (
          s === 0 &&
          b > 0.9 &&
          ((i * 2654435761) >>> 22) / 1024 < cells[o + 3]
        )
          s = 1;
        shade[i] = cells[o + 5] <= progress ? s : 0;
        if (!shade[i] || still) continue;
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const dx = cells[o] - pointer.x;
          const dy = cells[o + 1] - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0) {
            const f = (1 - d / reach) * PUSH * dpr;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        cells[o + 6] += (tx - cells[o + 6]) * spring;
        cells[o + 7] += (ty - cells[o + 7]) * spring;
        if (Math.abs(cells[o + 6] - tx) + Math.abs(cells[o + 7] - ty) > 0.05)
          moving = true;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let s = 1; s <= 4; s++) {
        ctx.fillStyle = DUSK[s - 1];
        for (let i = 0; i < shade.length; i++) {
          if (shade[i] !== s) continue;
          const o = i * 8;
          ctx.fillRect(
            Math.round(cells[o] + cells[o + 6]),
            Math.round(cells[o + 1] + cells[o + 7]),
            dot,
            dot,
          );
        }
      }
      frame = developing || moving ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const awake = { hover: false, focus: false };
    const set = (key: keyof typeof awake, on: boolean) => {
      awake[key] = on;
      target = awake.hover || awake.focus ? AWAKE : REST;
      wake();
    };
    const enter = () => set("hover", true);
    const leave = () => {
      pointer = null;
      set("hover", false);
    };
    const move = (e: PointerEvent) => {
      if (still) return;
      const box = canvas.getBoundingClientRect();
      pointer = {
        x: (e.clientX - box.left) * dpr,
        y: (e.clientY - box.top) * dpr,
      };
      wake();
    };
    const focus = () => set("focus", link.matches(":focus-visible"));
    const blur = () => set("focus", false);

    let timer = 0;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        if (still) return;
        // in view at load: wait out the section's entrance
        timer = window.setTimeout(
          () => {
            developing = performance.now();
            wake();
          },
          Math.max(0, delay - performance.now()),
        );
      },
      { threshold: 0.25 },
    );
    seen.observe(canvas);

    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = 0;
      build();
      wake();
    });
    resize.observe(tile);
    link.addEventListener("pointerenter", enter);
    link.addEventListener("pointerleave", leave);
    link.addEventListener("pointermove", move);
    link.addEventListener("focus", focus);
    link.addEventListener("blur", blur);
    return () => {
      seen.disconnect();
      resize.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      link.removeEventListener("pointerenter", enter);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("pointermove", move);
      link.removeEventListener("focus", focus);
      link.removeEventListener("blur", blur);
    };
  }, [delay]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas isn't focusable; this one is art
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
