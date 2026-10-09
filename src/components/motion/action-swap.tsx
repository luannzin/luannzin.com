"use client";
// Adapted from beui.dev/components/motion/action-swap (MIT): the cascade text
// and roll icon slots only, without the button chrome.

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;
const BLUR = "blur(3px)";
// Exits run at half the enter stagger, so the old label's tail lingers.
const STAGGER = 0.025;

const letter = {
  initial: { opacity: 0, y: "105%", filter: BLUR },
  animate: (delay: number) => ({
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: { ...SPRING_SWAP, delay },
  }),
  exit: (delay: number) => ({
    opacity: 0,
    y: "-105%",
    filter: BLUR,
    transition: { duration: 0.16, ease: EASE_OUT, delay: delay * 0.5 },
  }),
};

// A label that rolls letter by letter when `value` changes. The leaving and
// landing strings are separate layers, so proportional widths never jitter.
export function ActionSwapText({
  value,
  children,
  className,
}: {
  value: string;
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span
      className={cn(
        "relative -my-[0.08em] inline-block whitespace-nowrap py-[0.08em] align-bottom",
        className,
      )}
      style={{ clipPath: "inset(0 -999px)" }}
    >
      <span aria-hidden className="invisible whitespace-pre">
        {children}
      </span>
      <span className="sr-only">{children}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          aria-hidden
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute start-0 top-[0.08em] whitespace-pre"
        >
          {reduce
            ? children
            : children.split("").map((char, i) => (
                <motion.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: the position is the slot that rolls
                  key={i}
                  custom={i * STAGGER}
                  variants={letter}
                  className="inline-block whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// An icon that rolls up and out as the next one rolls in from below.
export function ActionSwapIcon({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          aria-hidden
          initial={reduce ? false : { opacity: 0, y: 12, filter: BLUR }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={
            reduce
              ? undefined
              : {
                  opacity: 0,
                  y: -12,
                  filter: BLUR,
                  transition: { duration: 0.14, ease: EASE_OUT },
                }
          }
          transition={SPRING_SWAP}
          className="col-start-1 row-start-1 inline-flex"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
