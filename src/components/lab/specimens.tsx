"use client";

import Image from "next/image";
import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import avatar from "@/assets/avatar.jpg";
import { DiceHint } from "@/components/dice-hint";
import { Die } from "@/components/die";
import {
  bezier,
  FRAME,
  Specimen,
  type Track,
  useSeekCss,
  useTimeline,
} from "@/components/lab/timeline";
import { TextReveal } from "@/components/motion/text-reveal";
import { SceneArt } from "@/components/scene-art";
import type { t } from "@/i18n/generated";
import { enter, press } from "@/lib/classes";
import {
  angleAt,
  drawDie,
  faceOf,
  HOP,
  HOP_MS,
  settle,
  type Throw,
  TUMBLE_MS,
  throwTo,
} from "@/lib/die";
import { ease, MELT_MS, type MeltLayer, meltLayer } from "@/lib/melt";
import { createScene, seedFrom } from "@/lib/scene";

type Lab = typeof t.app.lab;
type Common = {
  // the id of the heading that names the piece
  name: string;
  controls: Lab["controls"];
  tracks: Lab["tracks"];
};

const random = () => Math.floor(Math.random() * 2 ** 32);
// A die at rest on the face for `seed`.
const rest = (seed: number) => [...faceOf(seed), ...faceOf(seed)] as Throw;

// The hop's height over its run, from its keyframes in `HOP`: up to the top
// at 36%, a small dip under the line at 80%, then still.
const rise = bezier(0.2, 0.7, 0.4, 1);
const fall = bezier(0.6, 0, 0.8, 0.5);
const hop = (x: number) =>
  x < 0.36
    ? rise(x / 0.36)
    : x < 0.8
      ? 1 - 1.11 * fall((x - 0.36) / 0.44)
      : -0.11 * (1 - (x - 0.8) / 0.2);
const throwTracks = (tracks: Lab["tracks"]): Track[] => [
  { label: tracks.hop, start: 0, end: HOP_MS, curve: hop },
  { label: tracks.tumble, start: 0, end: TUMBLE_MS, curve: settle },
];

// The die as `Die` draws it, but held at `t` ms into a throw, so the sheet
// can play, step and scrub it. With `trail`, the frames it just passed stay
// behind as faint outlines.
function ThrownDie({
  turn,
  t,
  trail = false,
  className,
}: {
  turn: Throw;
  t: number;
  trail?: boolean;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const lift = useRef<{ turn: Throw; animation: Animation } | null>(null);
  const { edges, pips } = drawDie(...angleAt(turn, t));
  const ghosts = trail
    ? [2, 4, 6, 8].filter((k) => t - k * FRAME > 0)
    : ([] as number[]);

  // the site's own hop, made once per throw and held at the sheet's time
  useLayoutEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (lift.current?.turn !== turn) {
      lift.current?.animation.cancel();
      const animation = el.animate(HOP, { duration: HOP_MS, fill: "both" });
      animation.pause();
      lift.current = { turn, animation };
    }
    lift.current.animation.currentTime = Math.min(t, HOP_MS);
  }, [t, turn]);
  useEffect(() => () => lift.current?.animation.cancel(), []);

  return (
    <svg
      ref={svg}
      viewBox="-2.05 -2.05 4.1 4.1"
      aria-hidden="true"
      className={className}
    >
      {ghosts.map((k, i) => (
        <path
          key={k}
          d={drawDie(...angleAt(turn, t - k * FRAME)).edges}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.3 - i * 0.07}
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={edges}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path d={pips} fill="currentColor" />
    </svg>
  );
}

// Seeds: the scene shown before the piece first performs, and the one it
// rolls to then, the cover of "Art from a seed".
const FIRST = 109;
const TARGET = 16;

// A number is a seed as it is; any other text is hashed into one.
const seedOf = (text: string) => {
  const value = text.trim();
  if (!value) return null;
  return seedFrom(/^\d+$/.test(value) ? Number(value) : value);
};

// A still copy of a canvas, to melt from as many times as it's replayed.
const snapshot = (from: HTMLCanvasElement) => {
  const copy = document.createElement("canvas");
  copy.width = from.width;
  copy.height = from.height;
  copy.getContext("2d")?.drawImage(from, 0, 0);
  return copy;
};

export function ScenesSpecimen({
  name,
  controls,
  tracks,
  seed: labels,
  scene: sceneLabels,
}: Common & { seed: Lab["seed"]; scene: typeof t.components.scene }) {
  const [text, setText] = useState(String(FIRST));
  const [seed, setSeed] = useState(FIRST);
  const [turn, setTurn] = useState(() => rest(FIRST));
  const art = useRef<HTMLDivElement>(null);
  const from = useRef<HTMLCanvasElement | null>(null);
  const layer = useRef<MeltLayer | null>(null);
  const field = useId();
  const scene = createScene(seed);

  // A new change of scene, from whatever is on screen now: the old scene, or
  // the melt where it has got to.
  const begin = (next: number) => {
    const live = art.current?.querySelector("canvas");
    if (!live) return;
    layer.current?.draw(ease(timeline.t / MELT_MS));
    from.current = snapshot(layer.current?.canvas ?? live);
    layer.current?.remove();
    layer.current = null;
    setTurn(throwTo(angleAt(turn, timeline.t), next));
    setSeed(next);
  };
  const timeline = useTimeline(MELT_MS, () => {
    // after the first change, a replay melts from the same snapshot again
    if (from.current) {
      layer.current?.remove();
      layer.current = null;
      return;
    }
    setText(String(TARGET));
    begin(TARGET);
  });
  const roll = (next: number) => {
    begin(next);
    timeline.start();
  };

  // Typing settles for a moment before the scene follows it.
  const follow = useEffectEvent((next: number) => roll(next));
  useEffect(() => {
    const next = seedOf(text);
    if (next === null || next === seed) return;
    const wait = setTimeout(() => follow(next), 400);
    return () => clearTimeout(wait);
  }, [text, seed]);

  // The melt, drawn at the sheet's time over the live scene; gone at the end
  // so the scene plays on uncovered.
  const { t } = timeline;
  useLayoutEffect(() => {
    const host = art.current;
    const live = host?.querySelector("canvas");
    if (!host || !live || !from.current) return;
    if (t >= MELT_MS) {
      layer.current?.remove();
      layer.current = null;
      return;
    }
    layer.current ??= meltLayer(
      host,
      from.current,
      live,
      seed,
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    layer.current?.draw(ease(t / MELT_MS));
  }, [t, seed]);
  useEffect(() => () => layer.current?.remove(), []);

  return (
    <Specimen
      timeline={timeline}
      tracks={[
        { label: tracks.melt, start: 0, end: MELT_MS, curve: ease },
        ...throwTracks(tracks),
      ]}
      labels={controls}
      name={name}
    >
      <div
        ref={art}
        role="img"
        aria-label={`${sceneLabels.label} ${scene.name}`}
        className="relative overflow-hidden sm:rounded-t-[14px] sm:outline sm:-outline-offset-1 sm:outline-black/10 sm:dark:outline-white/10"
        style={{ background: scene.time.ground }}
      >
        <SceneArt seed={seed} stir />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 lg:px-16">
        <p
          aria-live="polite"
          className="min-w-0 text-muted-foreground first-letter:uppercase"
        >
          {scene.name}
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor={field} className="text-muted-foreground">
            {labels.label}
          </label>
          <div className="flex h-8 items-center rounded-[8px] bg-muted inset-ring inset-ring-border has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring">
            <input
              id={field}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                const next = seedOf(text);
                if (event.key === "Enter" && next !== null && next !== seed)
                  roll(next);
              }}
              placeholder={labels.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="h-full w-40 min-w-0 bg-transparent ps-2.5 text-foreground tabular-nums outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label={labels.random}
              title={labels.random}
              onClick={() => {
                const next = random();
                setText(String(next));
                roll(next);
              }}
              className={`${press} grid size-8 shrink-0 place-items-center rounded-[8px] text-foreground/80 outline-offset-2 hover:text-foreground`}
            >
              <ThrownDie
                turn={turn}
                t={t}
                className="size-[22px] overflow-visible"
              />
            </button>
          </div>
        </div>
      </div>
    </Specimen>
  );
}

export function DieSpecimen({ name, controls, tracks }: Common) {
  const [seed, setSeed] = useState(3);
  const [turn, setTurn] = useState(() => rest(3));
  const timeline = useTimeline(TUMBLE_MS, () => {
    // always a new face, so every throw has somewhere to go
    let next = random();
    while (next % 6 === seed % 6) next = random();
    setTurn(throwTo(angleAt(turn, timeline.t), next));
    setSeed(next);
  });
  const { t } = timeline;

  return (
    <Specimen
      timeline={timeline}
      tracks={throwTracks(tracks)}
      labels={controls}
      name={name}
    >
      <div className="grid place-items-center py-14">
        <ThrownDie
          turn={turn}
          t={t}
          trail={!timeline.playing && t > 0 && t < TUMBLE_MS}
          className="size-40 overflow-visible text-foreground"
        />
      </div>
    </Specimen>
  );
}

// The hint's strokes, from `.dice-hint` in globals.css.
const HINT_MS = 2260;
const drawn = bezier(0.45, 0, 0.25, 1);
const HINT_SEED = 46;

export function HintSpecimen({ name, controls, tracks }: Common) {
  const stage = useRef<HTMLDivElement>(null);
  const timeline = useTimeline(HINT_MS);
  useSeekCss(stage, timeline);

  return (
    <Specimen
      timeline={timeline}
      tracks={[
        { label: tracks.line, start: 900, end: 1800, curve: drawn },
        { label: tracks.head, start: 1780, end: 2040, curve: drawn },
        { label: tracks.hatch, start: 2000, end: HINT_MS, curve: (x) => x },
      ]}
      labels={controls}
      name={name}
    >
      {/* a post's cover corner, twice its size: its 14px corners hold the
          dice's 6px ones 8px in, as on the cover */}
      <div
        ref={stage}
        aria-hidden="true"
        className="flex justify-center px-6 pt-16 pb-12"
      >
        <div className="relative [zoom:1.3] sm:[zoom:2]">
          <div
            className="h-[100px] w-[200px] overflow-hidden rounded-[14px] outline -outline-offset-1 outline-black/10 dark:outline-white/10"
            style={{ background: createScene(HINT_SEED).time.ground }}
          >
            <SceneArt seed={HINT_SEED} />
          </div>
          <span className="absolute end-2 top-2 grid size-8 place-items-center rounded-[6px] bg-black/40 text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] backdrop-blur-sm">
            <Die seed={HINT_SEED} className="size-[22px] overflow-visible" />
          </span>
          <DiceHint key={timeline.runs} />
        </div>
      </div>
    </Specimen>
  );
}

// `TextReveal` and `enter`: each word 800ms, 50ms apart, the role 150ms
// behind the name; the avatar fades up over 500ms.
const rises = bezier(0.16, 1, 0.3, 1);
const fades = bezier(0.2, 0, 0, 1);
const NAME = "Luan Fabri";

export function RevealSpecimen({
  name,
  controls,
  tracks,
  role,
}: Common & { role: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const words = [
    ...NAME.split(" ").map((word, i) => [word, i * 50] as const),
    ...role.split(" ").map((word, i) => [word, 150 + i * 50] as const),
  ];
  const duration = (words.at(-1)?.[1] ?? 0) + 800;
  const timeline = useTimeline(duration);
  useSeekCss(stage, timeline);

  return (
    <Specimen
      timeline={timeline}
      tracks={[
        { label: tracks.avatar, start: 0, end: 500, curve: fades },
        ...words.map(([word, at]) => ({
          label: word,
          start: at,
          end: at + 800,
          curve: rises,
        })),
      ]}
      labels={controls}
      name={name}
    >
      <div
        ref={stage}
        aria-hidden="true"
        className="flex justify-center px-6 py-14"
      >
        <div key={timeline.runs} className="flex items-center gap-3">
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className={`${enter} size-10 rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10`}
          />
          <div className="leading-snug">
            <TextReveal as="p" text={NAME} className="font-medium" />
            <TextReveal
              as="p"
              text={role}
              delay={0.15}
              className="text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </Specimen>
  );
}

// A piece of the Lab by name, for a post's `lab` fence.
export type PieceName = "scenes" | "die" | "reveal";
export function Piece({
  piece,
  seed,
  scene,
  role,
  ...common
}: Common & {
  piece: PieceName;
  seed: Lab["seed"];
  scene: typeof t.components.scene;
  role: string;
}) {
  if (piece === "scenes")
    return <ScenesSpecimen {...common} seed={seed} scene={scene} />;
  if (piece === "die") return <DieSpecimen {...common} />;
  return <RevealSpecimen {...common} role={role} />;
}
