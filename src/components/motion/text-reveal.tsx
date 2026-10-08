"use client";
// Adapted from beui.dev/components/motion/text-animation: word mode only.

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = {
  type: "spring",
  stiffness: 140,
  damping: 26,
  mass: 1.2,
} as const;

export function TextReveal({
  text,
  as: Comp = "span",
  className,
  stagger = 0.05,
  delay = 0,
  blur = 6,
  yOffset = "20%",
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  blur?: number;
  yOffset?: string | number;
}) {
  const reduce = useReducedMotion();

  return (
    <Comp className={cn("block", className)}>
      {text.match(/\S+\s*/g)?.map((word, i) => {
        const d = delay + i * stagger;
        return (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
            key={i}
            // `initial` must not depend on `reduce`: the server can't read the
            // media query, so a mismatch on hydration would leave words blurred.
            // Reduced motion snaps y and blur while invisible, then only fades.
            initial={{ y: yOffset, opacity: 0, filter: `blur(${blur}px)` }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={
              reduce
                ? {
                    y: { duration: 0 },
                    filter: { duration: 0 },
                    opacity: { duration: 0.25, ease: EASE_OUT, delay: d * 0.3 },
                  }
                : {
                    y: { ...SPRING, delay: d },
                    opacity: { duration: 0.7, ease: EASE_OUT, delay: d },
                    filter: { duration: 0.9, ease: EASE_OUT, delay: d },
                  }
            }
            // `whitespace-pre` keeps each word's trailing space, which an
            // inline-block would otherwise collapse.
            className="inline-block whitespace-pre will-change-transform"
          >
            {word}
          </motion.span>
        );
      })}
    </Comp>
  );
}
