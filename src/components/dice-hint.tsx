"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// The hint arrow, in a 132 by 64 box: its line, its head, and the head's
// hatching, which draws stroke by stroke as one dash.
const LINE =
  "M5 23C8 12 18 4 25 8C32 12 27 24 26 32C25 41 33 46 44 44C53 42 64 36 67 27C70 18 61 14 56 19C50 25 52 37 62 43C72 49 92 51 106 50C113 49.5 118 49.5 122 50";
const HEAD =
  "M129 51C122 47 116 43 112 39C115 44 116 49 115 53C114 57 112 61 110 64C115 60 122 55 129 51Z";
const HATCH =
  "M108 40L118 62M111 40L121 62M114 40L124 62M117 40L127 62M120 40L130 62";

// A hand-drawn arrow to a figure's dice, drawn by `.dice-hint` in
// globals.css: a swoop, a loop, then a hatched head. It sits over the top-right
// corner of the positioned box around it, and `onDrawn` fires as it finishes.
export function DiceHint({
  gone,
  onDrawn,
  className,
}: {
  gone?: boolean;
  onDrawn?: () => void;
  className?: string;
}) {
  const clip = useId();
  return (
    <svg
      viewBox="0 0 132 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-gone={gone || undefined}
      className={cn(
        "dice-hint pointer-events-none absolute end-[51px] -top-[27px] h-16 w-[132px] text-muted-foreground",
        className,
      )}
    >
      <defs>
        <clipPath id={clip}>
          <path d={HEAD} />
        </clipPath>
      </defs>
      {/* a dark edge, so the part over the art still reads */}
      <g className="halo">
        <path className="draw" d={LINE} strokeWidth="5" pathLength={1} />
        <path
          className="draw head"
          d={HEAD}
          strokeWidth="4.5"
          fill="currentColor"
          pathLength={1}
        />
      </g>
      <path className="draw" d={LINE} strokeWidth="2" pathLength={1} />
      <path className="draw head" d={HEAD} strokeWidth="1.8" pathLength={1} />
      <path
        className="draw hatch"
        d={HATCH}
        strokeWidth="1"
        clipPath={`url(#${clip})`}
        pathLength={1}
        onAnimationEnd={onDrawn}
      />
    </svg>
  );
}
