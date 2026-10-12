"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";
import { cn } from "@/lib/utils";

// The section being read is the last heading that has passed this line.
const LINE = 120;

export function Toc({
  headings,
  className,
}: {
  headings: Heading[];
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el) => el !== null);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= LINE) current = el.id;
      }
      setActive(atEnd ? (targets.at(-1)?.id ?? current) : current);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  return (
    <ol className={cn("grid gap-2 leading-snug", className)}>
      {headings.map(({ id, text, depth }) => (
        <li key={id} className={depth === 3 ? "ps-4" : undefined}>
          <a
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            className="block rounded-sm text-pretty text-muted-foreground outline-offset-2 transition-[color] duration-150 hover:text-foreground aria-[current]:text-foreground"
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
}
