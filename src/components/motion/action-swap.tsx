"use client";
// Adapted from beui.dev/components/motion/action-swap (MIT): the icon slot
// only, without the button chrome, on better-ui's contextual icon values. The
// motion is CSS (`.swap-in` and `.swap-out` in globals.css), so the page ships
// no animation library for it.

import { type AnimationEvent, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type Shown = { value: string; icon: ReactNode };

// An icon that shrinks out as the next one grows in, in the same spot. The old
// icon stays mounted only until its exit animation ends.
export function ActionSwapIcon({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const [shown, setShown] = useState<Shown>({ value, icon: children });
  const [gone, setGone] = useState<Shown | null>(null);
  if (value !== shown.value) {
    setGone(shown);
    setShown({ value, icon: children });
  }

  const slot = "col-start-1 row-start-1 inline-flex";
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        className,
      )}
    >
      {gone && (
        <span
          key={gone.value}
          aria-hidden
          className={`${slot} swap-out`}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget) setGone(null);
          }}
        >
          {gone.icon}
        </span>
      )}
      {/* the first icon is simply there; later ones grow in */}
      <span key={value} aria-hidden className={cn(slot, gone && "swap-in")}>
        {children}
      </span>
    </span>
  );
}
