// Adapted from beui.dev/components/motion/text-animation: word mode only, in
// CSS (`.text-reveal` in globals.css) rather than motion, so it renders on the
// server and the words ship in the HTML visible to crawlers and readers.

import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/utils";

export function TextReveal({
  text,
  as: Comp = "span",
  id,
  className,
  stagger = 0.05,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <Comp id={id} className={cn("block", className)}>
      {text.match(/\S+\s*/g)?.map((word, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
          key={i}
          className="text-reveal"
          style={
            {
              "--delay": `${Math.round((delay + i * stagger) * 1000)}ms`,
            } as CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </Comp>
  );
}
