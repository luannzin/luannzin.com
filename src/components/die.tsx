"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  angleAt,
  drawDie,
  faceOf,
  HOP,
  HOP_MS,
  TUMBLE_MS,
  throwTo,
} from "@/lib/die";

// Shows the face for `seed`. When the seed changes, the die is thrown: it hops,
// tumbles and comes to rest on the new face. A new throw picks up from
// wherever it is.
export function Die({ seed, className }: { seed: number; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const edges = useRef<SVGPathElement>(null);
  const pips = useRef<SVGPathElement>(null);
  const angle = useRef(faceOf(seed));
  const shown = useRef(seed);
  const [first] = useState(() => drawDie(...faceOf(seed)));

  useLayoutEffect(() => {
    if (shown.current === seed) return;
    shown.current = seed;
    const turn = throwTo(angle.current, seed);
    const paint = ([x, y]: [number, number]) => {
      angle.current = [x, y];
      const next = drawDie(x, y);
      edges.current?.setAttribute("d", next.edges);
      pips.current?.setAttribute("d", next.pips);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(angleAt(turn, TUMBLE_MS));
      return;
    }
    svg.current?.animate(HOP, { duration: HOP_MS });
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      paint(angleAt(turn, now - start));
      if (now - start < TUMBLE_MS) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [seed]);

  return (
    <svg
      ref={svg}
      viewBox="-2.05 -2.05 4.1 4.1"
      aria-hidden="true"
      className={className}
    >
      <path
        ref={edges}
        d={first.edges}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path ref={pips} d={first.pips} fill="currentColor" />
    </svg>
  );
}
