"use client";
// Adapted from beui.dev/components/motion/action-swap (MIT): the icon slot
// only, without the button chrome, on better-ui's contextual icon values.

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const hidden = { opacity: 0, scale: 0.25, filter: "blur(4px)" };

// An icon that shrinks out as the next one grows in, in the same spot.
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
        "relative inline-grid shrink-0 place-items-center",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          aria-hidden
          initial={reduce ? false : hidden}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduce ? undefined : hidden}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="col-start-1 row-start-1 inline-flex"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
