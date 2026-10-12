"use client";

import { useEffect, useRef } from "react";

// Four blocks of the dusk sky, top to horizon, each denser than the last:
// Bayer-dithered dots that the pointer pushes aside and that spring back.
const BLOCKS = [
  { color: "#3a2a6b", fill: 0.25 },
  { color: "#7a3361", fill: 0.5 },
  { color: "#e0703f", fill: 0.75 },
  { color: "#ffd180", fill: 1 },
];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const STEP = 3; // px between dots
const DOT = 2;
const HEIGHT = 32;
// room above and below the dots, more than PUSH, so pushed dots never clip
const PAD = 16;
const REACH = 28; // px the pointer pushes within
const PUSH = 14;

export function DitherStrip() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // per dot: home x, home y, offset x, offset y, block
    let dots = new Float32Array(0);
    let width = 0;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let last = 0;

    const build = () => {
      width = canvas.clientWidth;
      const dpr = devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = (HEIGHT + PAD * 2) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const list: number[] = [];
      const cols = Math.floor((width - DOT) / STEP) + 1;
      // centre the grid so both ends meet the column's edges
      const left = (width - (cols - 1) * STEP - DOT) / 2;
      for (let c = 0; c < cols; c++) {
        const b = Math.min(3, Math.floor((c * STEP * 4) / width));
        for (let r = 0; r < HEIGHT / STEP; r++) {
          if (BAYER[(r % 4) * 4 + (c % 4)] / 16 < BLOCKS[b].fill)
            list.push(left + c * STEP, PAD + r * STEP, 0, 0, b);
        }
      }
      dots = Float32Array.from(list);
    };

    const draw = (now: number) => {
      // ease toward the target at the same speed whatever the refresh rate
      const k = 1 - 0.8 ** (Math.min(now - last, 64) / 16.7 || 1);
      last = now;
      ctx.clearRect(0, 0, width, HEIGHT + PAD * 2);
      let moving = false;
      // dots are stored column by column, so blocks come in order
      let b = -1;
      for (let i = 0; i < dots.length; i += 5) {
        if (dots[i + 4] !== b) {
          b = dots[i + 4];
          ctx.fillStyle = BLOCKS[b].color;
        }
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const dx = dots[i] - pointer.x;
          const dy = dots[i + 1] - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 0) {
            const f = (1 - d / REACH) * PUSH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        dots[i + 2] += (tx - dots[i + 2]) * k;
        dots[i + 3] += (ty - dots[i + 3]) * k;
        if (Math.abs(dots[i + 2] - tx) + Math.abs(dots[i + 3] - ty) > 0.05)
          moving = true;
        ctx.fillRect(
          dots[i] + dots[i + 2],
          dots[i + 1] + dots[i + 3],
          DOT,
          DOT,
        );
      }
      frame = moving ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const move = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
      wake();
    };
    const leave = () => {
      pointer = null;
      wake();
    };

    const resize = new ResizeObserver(() => {
      // one loop at a time: the draw below starts its own if dots still move
      cancelAnimationFrame(frame);
      build();
      draw(last);
    });
    resize.observe(canvas);
    if (!still) {
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", leave);
    }
    return () => {
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} className="-my-4 block h-16 w-full touch-pan-y" />;
}

// "Luan" in one cursive stroke, drawn once when it scrolls into view.
const NAME =
  "M20 6C16 16 11 30 8 40C7 44 10 45 16 42C22 39 26 36 29 33C27 38 27 42 30 42C33 42 36 38 38 32C37 38 37 42 40 42C43 42 45 38 47 35C45 32 41 32 40 36C39 40 42 42 45 39C47 36 48 33 48 32C47 37 47 42 50 42C53 42 55 38 57 35C58 33 58 37 57 42C59 37 62 32 65 32C68 32 67 37 67 40C67 43 70 43 76 39";
const FLOURISH = "M6 49C30 46 58 46 88 43";

export function Signature() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // in view at load: wait out the footer's entrance (900ms + 500ms)
        const wait = Math.max(0, 1400 - performance.now());
        svg.style.setProperty("--wait", `${wait}ms`);
        svg.dataset.drawn = "";
        seen.disconnect();
      },
      { threshold: 1 },
    );
    seen.observe(svg);
    return () => seen.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 92 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="signature h-[52px] w-[92px] text-muted-foreground"
    >
      <path d={NAME} pathLength={1} />
      <path className="flourish" d={FLOURISH} pathLength={1} />
    </svg>
  );
}
