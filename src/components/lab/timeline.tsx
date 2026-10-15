"use client";

import {
  type CSSProperties,
  Fragment,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  NextFrameIcon,
  PauseIcon,
  PlayIcon,
  PreviousFrameIcon,
  ReplayIcon,
} from "@/components/icons";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import type { t } from "@/i18n/generated";
import { press } from "@/lib/classes";
import { cn } from "@/lib/utils";

type Controls = typeof t.app.lab.controls;

// One frame at 60fps: what a step moves by.
export const FRAME = 1000 / 60;
const SPEEDS = [1, 0.25, 0.1];

// A row on a timing sheet: when something runs, in ms, and its curve, the
// value it moves through as its run goes from 0 to 1.
export type Track = {
  label: string;
  start: number;
  end: number;
  curve: (x: number) => number;
};

// CSS's cubic-bezier(), to draw a curve the browser plays. x always rises, so
// halving finds the point on the curve for it.
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, k: number) =>
    ((1 - 3 * b + 3 * a) * k + (3 * b - 6 * a)) * k * k + 3 * a * k;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}

export type Timeline = ReturnType<typeof useTimeline>;

// A piece's clock, in ms. It rests on its last frame until played; `run`
// (optional) sets up a fresh run of the piece (a new throw, a new scene) and
// the clock plays it from the start. Playing, stepping and scrubbing only
// move the clock: each piece draws itself at whatever time it shows.
export function useTimeline(duration: number, run?: () => void) {
  const [time, setTime] = useState(duration);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [runs, setRuns] = useState(0);
  const now = useRef(duration);
  const go = (ms: number) => {
    now.current = Math.min(duration, Math.max(0, ms));
    setTime(now.current);
  };

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(at) {
      now.current = Math.min(duration, now.current + (at - last) * speed);
      last = at;
      setTime(now.current);
      if (now.current < duration) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, duration]);

  const start = () => {
    setRuns((n) => n + 1);
    go(0);
    setPlaying(true);
  };
  const replay = () => {
    run?.();
    start();
  };
  const seek = (ms: number) => {
    setPlaying(false);
    go(ms);
  };
  return {
    t: time,
    duration,
    playing,
    speed,
    setSpeed,
    runs,
    start,
    replay,
    // a piece never played yet has nothing to play back: it runs first
    play: () => {
      if (!runs) return replay();
      if (now.current >= duration) go(0);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    seek,
    step: (by: number) => seek((Math.round(now.current / FRAME) + by) * FRAME),
  };
}

// Holds every CSS animation under `host` at the sheet's time. Never quite at
// its end, so it doesn't finish and fire the events that tidy it away: the
// sheet can always scrub back through it.
export function useSeekCss(
  host: RefObject<HTMLElement | null>,
  { t, runs }: Timeline,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: a replay remounts the piece, maybe at the same time
  useLayoutEffect(() => {
    for (const animation of host.current?.getAnimations({ subtree: true }) ??
      []) {
      const end = Number(animation.effect?.getComputedTiming().endTime ?? 0);
      animation.pause();
      animation.currentTime = Math.min(t, end - 1);
    }
  }, [host, t, runs]);
}

// On the Well and the Tile Grey of its controls the page's muted grey falls
// under 4.5:1, so muted steps up toward the ink (`--muted-strong`, per theme
// in globals.css); Bug hunt's fullscreen keeps the same ink.
export const ink = "[--muted-foreground:var(--muted-strong)]";

// The Well a specimen sits in: full-bleed with hairlines on a phone, framed
// and hanging into the gutters from sm.
export const well = `specimen -mx-6 ${ink} overflow-hidden bg-foreground/2.5 max-sm:shadow-[inset_0_1px_var(--border),inset_0_-1px_var(--border)] sm:rounded-[14px] sm:inset-ring sm:inset-ring-border lg:-mx-16`;

// One piece of the Lab: the piece itself, then its transport and timing
// sheet. It performs once as it comes into view, unless the visitor asked for
// less motion.
export function Specimen({
  timeline,
  tracks,
  labels,
  name,
  children,
}: {
  timeline: Timeline;
  tracks: Track[];
  labels: Controls;
  // the id of the heading that names it
  name: string;
  children: ReactNode;
}) {
  const figure = useRef<HTMLElement>(null);
  const perform = useEffectEvent(() => timeline.replay());

  useEffect(() => {
    const el = figure.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        perform();
      },
      { threshold: 0.6 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <figure ref={figure} aria-labelledby={name} className={well}>
      {children}
      <div className="border-border border-t px-6 pt-4 pb-5 lg:px-16">
        <Transport timeline={timeline} labels={labels} name={name} />
        <Sheet timeline={timeline} tracks={tracks} labels={labels} />
      </div>
    </figure>
  );
}

function Transport({
  timeline,
  labels,
  name,
}: {
  timeline: Timeline;
  labels: Controls;
  name: string;
}) {
  const { playing } = timeline;
  return (
    <fieldset
      aria-labelledby={name}
      className="flex flex-wrap items-center gap-2"
    >
      <Tool label={labels.replay} onClick={timeline.replay}>
        <ReplayIcon className="size-4" />
      </Tool>
      <Tool
        label={playing ? labels.pause : labels.play}
        onClick={playing ? timeline.pause : timeline.play}
      >
        <ActionSwapIcon value={playing ? "pause" : "play"}>
          {playing ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </ActionSwapIcon>
      </Tool>
      <Tool label={labels.previous} onClick={() => timeline.step(-1)}>
        <PreviousFrameIcon className="size-4" />
      </Tool>
      <Tool label={labels.next} onClick={() => timeline.step(1)}>
        <NextFrameIcon className="size-4" />
      </Tool>
      <Segmented
        name={`${name}-speed`}
        label={labels.speed}
        options={SPEEDS}
        unit="×"
        value={timeline.speed}
        onChange={timeline.setSpeed}
        className="ms-auto"
      />
    </fieldset>
  );
}

// Numbers as a segmented control: the sheet's 1x, 0.25x and 0.1x, or the dot
// sizes on Seeded scenes.
export function Segmented({
  name,
  label,
  options,
  unit,
  value,
  onChange,
  className,
}: {
  name: string;
  label: string;
  options: number[];
  unit: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <fieldset
      className={cn(
        "flex h-8 rounded-[8px] bg-muted p-0.5 inset-ring inset-ring-border",
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label
          key={option}
          className="relative grid min-w-10 cursor-pointer place-items-center rounded-[6px] px-2 font-mono text-muted-foreground text-sm tabular-nums transition-[color,background-color,box-shadow] duration-150 hover:text-foreground has-checked:bg-foreground/7 has-checked:text-foreground has-checked:inset-ring has-checked:inset-ring-foreground/10 has-focus-visible:outline-2 has-focus-visible:outline-ring has-focus-visible:outline-offset-2"
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option}
          {unit}
        </label>
      ))}
    </fieldset>
  );
}

function Tool({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`${press} grid size-8 place-items-center rounded-[8px] bg-muted text-muted-foreground inset-ring inset-ring-border outline-offset-2 hover:text-foreground`}
    >
      {children}
    </button>
  );
}

// A track's curve across its bar, in a unit box: 0 low, 1 high, with room
// for a hop's small dip under the line.
const pathOf = (curve: (x: number) => number) =>
  Array.from({ length: 49 }, (_, i) => {
    const x = i / 48;
    return `${i ? "L" : "M"}${x} ${(0.82 - curve(x) * 0.64).toFixed(3)}`;
  }).join("");

const KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -10,
  PageUp: 10,
};

// The ruled sheet: a ruler, a bar per track with its curve, the part already
// played lit, and a playhead. The bars' column is one slider: drag or tap it
// to scrub, or step it with the arrow keys.
function Sheet({
  timeline,
  tracks,
  labels,
}: {
  timeline: Timeline;
  tracks: Track[];
  labels: Controls;
}) {
  const { t, duration } = timeline;
  const scrub = useRef<HTMLDivElement>(null);
  const at = (ms: number) => `${(ms / duration) * 100}%`;
  // about five numbers along the ruler, five ticks between each
  const every =
    [50, 100, 250, 500, 1000].find((s) => duration / s <= 5) ?? 1000;
  const ticks = Array.from(
    { length: Math.floor(duration / (every / 5)) + 1 },
    (_, i) => (i * every) / 5,
  );
  const frame = Math.round(t / FRAME);
  const frames = Math.round(duration / FRAME);

  const timeAt = (x: number) => {
    const box = scrub.current?.getBoundingClientRect();
    return box ? ((x - box.left) / box.width) * duration : 0;
  };
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      timeline.seek(timeAt(event.clientX));
    }
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key in KEYS) timeline.step(KEYS[event.key]);
    else if (event.key === "Home") timeline.seek(0);
    else if (event.key === "End") timeline.seek(duration);
    else if (event.key === " " && timeline.playing) timeline.pause();
    else if (event.key === " ") timeline.play();
    else return;
    event.preventDefault();
  };

  return (
    <div className="relative mt-5">
      <div className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 font-mono text-sm leading-5">
        {/* the slider says the time to assistive tech, once per move */}
        <span aria-hidden className="text-foreground tabular-nums">
          {Math.round(t)} ms
        </span>
        <div aria-hidden className="relative h-[26px]">
          {ticks.map((ms) => {
            const major = ms % every === 0;
            return (
              <Fragment key={ms}>
                {major && ms / duration <= 0.92 && (
                  <span
                    className={cn(
                      "absolute top-0 text-muted-foreground tabular-nums",
                      ms > 0 && "-translate-x-1/2",
                      // every other number on a narrow phone, so none touch
                      (ms / every) % 2 === 1 && "max-[380px]:hidden",
                      // and none so near the end it meets the playhead
                      ms / duration > 0.85 && "max-sm:hidden",
                    )}
                    style={{ left: at(ms) }}
                  >
                    {ms}
                  </span>
                )}
                <span
                  className={cn(
                    "absolute bottom-0 w-px",
                    major
                      ? "h-1.5 bg-foreground/30"
                      : "h-[3px] bg-foreground/15",
                  )}
                  style={{ left: at(ms) }}
                />
              </Fragment>
            );
          })}
        </div>
        {tracks.map((track, i) => {
          const span = track.end - track.start;
          const done = Math.min(1, Math.max(0, (t - track.start) / span));
          const live = t >= track.start && t < track.end;
          const path = pathOf(track.curve);
          return (
            <Fragment key={`${track.label}-${i}`}>
              <span
                className={cn(
                  "truncate transition-[color] duration-150",
                  live ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {track.label}
              </span>
              <div aria-hidden className="relative h-5">
                <div
                  className={cn(
                    "absolute inset-y-0 overflow-hidden rounded-[6px] bg-muted inset-ring transition-[box-shadow] duration-150",
                    live ? "inset-ring-foreground/18" : "inset-ring-border",
                  )}
                  style={{ left: at(track.start), width: at(span) }}
                >
                  <div
                    className="absolute inset-y-0 start-0 bg-foreground/7"
                    style={{ width: `${done * 100}%` }}
                  />
                  <Curve path={path} className="text-foreground/40" />
                  <Curve
                    path={path}
                    className="text-foreground"
                    style={{ clipPath: `inset(0 ${100 - done * 100}% 0 0)` }}
                  />
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      {/* over the bars' column, from the ruler down */}
      <div
        ref={scrub}
        role="slider"
        tabIndex={0}
        aria-label={labels.playhead}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={Math.round(t)}
        aria-valuetext={`${Math.round(t)} ms, ${labels.frame} ${frame} ${labels.of} ${frames}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          timeline.seek(timeAt(event.clientX));
        }}
        onPointerMove={drag}
        onKeyDown={key}
        className="absolute inset-y-0 start-[6.25rem] end-0 cursor-ew-resize touch-pan-y rounded-sm outline-offset-4"
      >
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-foreground"
          style={{ left: at(t) }}
        >
          <span className="absolute -top-px left-1/2 size-[7px] -translate-x-1/2 rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  );
}

function Curve({
  path,
  className,
  style,
}: {
  path: string;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("absolute inset-0 size-full overflow-visible", className)}
      style={style}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
