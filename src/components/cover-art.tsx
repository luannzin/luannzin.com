"use client";

import { useEffect, useState, ViewTransition } from "react";
import { DiceIcon } from "@/components/icons";
import { SceneArt } from "@/components/scene-art";
import { enter } from "@/lib/classes";
import { createScene } from "@/lib/scene";

const SEEN = "cover-dice-hint";
// The hint arrow, in a 132 by 64 box: its line, its head, and the head's
// hatching, which draws stroke by stroke as one dash.
const LINE =
  "M5 23C8 12 18 4 25 8C32 12 27 24 26 32C25 41 33 46 44 44C53 42 64 36 67 27C70 18 61 14 56 19C50 25 52 37 62 43C72 49 92 51 106 50C113 49.5 118 49.5 122 50";
const HEAD =
  "M129 51C122 47 116 43 112 39C115 44 116 49 115 53C114 57 112 61 110 64C115 60 122 55 129 51Z";
const HATCH =
  "M108 40L118 62M111 40L121 62M114 40L124 62M117 40L127 62M120 40L130 62";

// A post's cover: its scene, with a dice that draws another for this visit
// only (a reload brings the post's own back). The first cover anyone sees
// draws an arrow to the dice, which goes once the dice is rolled.
export function CoverArt({ seed: own, slug }: { seed: number; slug: string }) {
  const [seed, setSeed] = useState(own);
  const [rolls, setRolls] = useState(0);
  const [hint, setHint] = useState(false);
  const { name } = createScene(seed);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN)) return;
      localStorage.setItem(SEEN, "1");
      setHint(true);
    } catch {
      // storage is blocked: no hint, nothing else lost
    }
  }, []);

  const roll = () => {
    setSeed(Math.floor(Math.random() * 2 ** 32));
    setRolls((n) => n + 1);
  };

  return (
    <figure className="relative -mx-6 mt-8 sm:mx-0 lg:-mx-16">
      <ViewTransition name={`art-${slug}`} share="morph" default="none">
        <div
          role="img"
          aria-label={`An animated scene drawn in dots: ${name}`}
          className="overflow-hidden sm:rounded-[14px] sm:outline sm:-outline-offset-1 sm:outline-white/10"
        >
          <SceneArt seed={seed} stir />
        </div>
      </ViewTransition>
      <button
        type="button"
        onClick={roll}
        aria-label="Draw another scene"
        className="absolute end-2 top-2 grid size-8 place-items-center rounded-md bg-black/40 text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] backdrop-blur-sm transition-[color,scale] duration-150 hover:text-white active:scale-[0.96]"
      >
        <DiceIcon
          className="size-[18px] transition-[rotate] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
          style={{ rotate: `${rolls * 90}deg` }}
        />
      </button>
      {hint && (
        // a hand-drawn arrow: a swoop, a loop, then a hatched head at the dice
        <svg
          viewBox="0 0 132 64"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-gone={rolls > 0 || undefined}
          className="dice-hint pointer-events-none absolute end-[42px] -top-[27px] h-16 w-[132px] text-muted-foreground"
        >
          <defs>
            <clipPath id="dice-hint-head">
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
          <path
            className="draw head"
            d={HEAD}
            strokeWidth="1.8"
            pathLength={1}
          />
          <path
            className="draw hatch"
            d={HATCH}
            strokeWidth="1"
            clipPath="url(#dice-hint-head)"
            pathLength={1}
          />
        </svg>
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
