"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";
import { DiceHint } from "@/components/dice-hint";
import { Die } from "@/components/die";
import { SceneArt } from "@/components/scene-art";
import type { t } from "@/i18n/generated";
import { enter, press } from "@/lib/classes";
import { type Melt, melt } from "@/lib/melt";
import { createScene } from "@/lib/scene";

const SEEN = "cover-dice-hint";
const remember = () => {
  try {
    localStorage.setItem(SEEN, "1");
  } catch {
    // storage is blocked: the arrow shows again next time
  }
};

// A post's cover: its scene, with a dice that draws another for this visit
// only (a reload brings the post's own back). The dice waits out the morph
// from the home tile; the first cover anyone sees draws an arrow to it first,
// and the dice arrives as the arrow is finished. The arrow goes once rolled.
export function CoverArt({
  seed: own,
  slug,
  labels,
}: {
  seed: number;
  slug: string;
  labels: typeof t.components.scene;
}) {
  const [seed, setSeed] = useState(own);
  const [rolls, setRolls] = useState(0);
  const [hint, setHint] = useState(false);
  const [ready, setReady] = useState(false);
  const art = useRef<HTMLDivElement>(null);
  const melting = useRef<Melt | null>(null);
  const { name } = createScene(seed);

  // Only reads, so running twice changes nothing; the arrow is remembered as
  // seen once it has been drawn in full.
  useEffect(() => {
    let first = false;
    try {
      first = !localStorage.getItem(SEEN);
    } catch {
      // storage is blocked: no hint, nothing else lost
    }
    if (first) setHint(true);
    // the dice comes now, unless an arrow is about to be drawn to it
    if (!first || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      remember();
    }
  }, []);

  useEffect(() => () => melting.current?.stop(), []);

  // The old scene melts into the new one while the die tumbles; a throw
  // mid-melt melts onward from wherever the picture has got to.
  const roll = () => {
    const next = Math.floor(Math.random() * 2 ** 32);
    const host = art.current;
    const canvas = host?.querySelector("canvas");
    if (host && canvas) {
      const prev = melting.current;
      melting.current = melt(
        host,
        prev?.running ? prev.capture() : canvas,
        canvas,
        next,
        matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
      prev?.stop();
    }
    setSeed(next);
    setRolls((n) => n + 1);
  };

  return (
    <figure className="relative -mx-6 mt-8 sm:mx-0 lg:-mx-16">
      <ViewTransition name={`art-${slug}`} share="morph" default="none">
        <div
          ref={art}
          role="img"
          aria-label={`${labels.label} ${name}`}
          className="relative overflow-hidden sm:rounded-[14px] sm:outline sm:-outline-offset-1 sm:outline-white/10"
        >
          <SceneArt seed={seed} stir />
        </div>
      </ViewTransition>
      <button
        type="button"
        onClick={roll}
        aria-label={labels.draw}
        data-ready={ready ? (hint ? "now" : "late") : undefined}
        className={`cover-dice absolute end-2 top-2 grid size-8 place-items-center rounded-[6px] bg-black/40 text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] backdrop-blur-sm hover:text-white ${press}`}
      >
        <Die seed={seed} className="size-[22px] overflow-visible" />
      </button>
      {hint && (
        <DiceHint
          gone={rolls > 0}
          onDrawn={() => {
            setReady(true);
            remember();
          }}
        />
      )}
      <figcaption
        aria-live="polite"
        className={`${enter} mt-3 text-muted-foreground first-letter:uppercase delay-400 max-sm:px-6 lg:px-16`}
      >
        {name}
      </figcaption>
    </figure>
  );
}
