"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
} from "@/components/icons";
import { Speeds, Tool, well } from "@/components/lab/timeline";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import type { t } from "@/i18n/generated";
import { type Action, type Event, Game, H, W } from "@/lib/bug-hunt/game";
import { press } from "@/lib/classes";
import { cn } from "@/lib/utils";

type Labels = typeof t.app.lab.game;
type State = "loading" | "title" | "play" | "paused" | "over";

const KEYS: Record<string, Action> = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "jump",
  KeyW: "jump",
  Space: "jump",
  ArrowDown: "down",
  KeyS: "down",
  KeyJ: "punch",
  KeyZ: "punch",
  KeyK: "throw",
  KeyX: "throw",
  KeyL: "special",
  KeyC: "special",
};

const button = `${press} inline-flex h-9 items-center gap-2 rounded-[10px] bg-muted ps-3 pe-4 text-foreground inset-ring inset-ring-border outline-offset-2 hover:bg-foreground/7`;

// Bug hunt in its Well: the canvas, scaled by a whole number so every pixel
// stays square, the overlays between runs, then play, start over and speed.
// Keys only reach the game while it has focus, so the page still scrolls.
export function BugHunt({
  labels,
  speed: speedLabel,
}: {
  labels: Labels;
  speed: string;
}) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const sheet = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<State>("loading");
  const [speed, setSpeed] = useState(1);
  const [result, setResult] = useState({ level: 1, fixed: 0 });
  const [news, setNews] = useState("");
  // the view's width in game px, and its size on the page
  const [view, setView] = useState({ w: W, width: W, height: H });

  const onEvent = useEffectEvent((event: Event) => {
    if (event.type === "level") setNews(`${labels.level} ${event.level}`);
    if (event.type === "open") setNews(labels.open);
    if (event.type === "over") {
      setResult({ level: event.level, fixed: event.fixed });
      setNews(
        `${labels.over}. ${labels.level} ${event.level}, ${event.fixed} ${labels.fixed}.`,
      );
      setState("over");
    }
  });

  const draw = () => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx && game.current) game.current.draw(ctx);
  };

  const fresh = () => {
    if (!sheet.current) return;
    game.current = new Game(
      sheet.current,
      onEvent,
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    game.current.width = view.w;
    draw();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loads once
  useEffect(() => {
    // `load`, not `decode()`: a decode can wait on a tab that isn't drawing
    const image = new Image();
    image.onload = () => {
      sheet.current = image;
      fresh();
      setState("title");
    };
    image.src = "/lab/bug-hunt/atlas.png";
    return () => {
      image.onload = null;
    };
  }, []);

  // A whole number of device pixels per game pixel, as many as keep the view
  // at least 256px wide; the view then takes whatever width is left.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const room = Math.floor(el.clientWidth * dpr);
      const k = Math.max(1, Math.floor(room / 256));
      const w = Math.min(400, Math.floor(room / k));
      setView({ w, width: (w * k) / dpr, height: (H * k) / dpr });
    };
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw at the new width
  useEffect(() => {
    if (!game.current) return;
    game.current.width = view.w;
    const ctx = canvas.current?.getContext("2d");
    if (ctx) game.current.draw(ctx);
  }, [view.w, state]);

  useEffect(() => {
    if (state !== "play") return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      game.current?.update((Math.min(100, now - last) / 1000) * speed);
      const ctx = canvas.current?.getContext("2d");
      if (ctx) game.current?.draw(ctx);
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [state, speed]);

  const pause = () => {
    game.current?.releaseAll();
    setState((s) => (s === "play" ? "paused" : s));
  };

  // Out of sight, in another window or another tab: it waits.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const pause = () => {
      game.current?.releaseAll();
      setState((s) => (s === "play" ? "paused" : s));
    };
    const hidden = () => document.hidden && pause();
    const seen = new IntersectionObserver(
      ([e]) => !e.isIntersecting && pause(),
      {
        threshold: 0.25,
      },
    );
    seen.observe(el);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("blur", pause);
    return () => {
      seen.disconnect();
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("blur", pause);
    };
  }, []);

  const play = () => {
    if (state === "over") fresh();
    setState("play");
    frame.current?.focus();
  };

  const restart = () => {
    fresh();
    setState("play");
    frame.current?.focus();
  };

  const key = (event: KeyboardEvent<HTMLDivElement>, down: boolean) => {
    if (event.target !== frame.current) return;
    const action = KEYS[event.code];
    if (down && (event.code === "Escape" || event.code === "KeyP")) {
      if (state === "play") pause();
      else if (state === "paused") play();
      event.preventDefault();
      return;
    }
    if (
      down &&
      state !== "play" &&
      (event.code === "Enter" || event.code === "Space")
    ) {
      if (state !== "loading") play();
      event.preventDefault();
      return;
    }
    if (!action || state !== "play") return;
    event.preventDefault();
    if (down) game.current?.press(action);
    else game.current?.release(action);
  };

  const pressed = (action: Action, down: boolean) => {
    if (state !== "play") return;
    if (down) game.current?.press(action);
    else game.current?.release(action);
  };

  const overlay =
    state === "loading" ? (
      <p className="text-muted-foreground">{labels.loading}</p>
    ) : state === "title" ? (
      <button type="button" onClick={play} className={button}>
        <PlayIcon className="size-4" />
        {labels.play}
      </button>
    ) : state === "paused" ? (
      <>
        <p className="font-medium">{labels.paused}</p>
        <button type="button" onClick={play} className={button}>
          <PlayIcon className="size-4" />
          {labels.resume}
        </button>
      </>
    ) : state === "over" ? (
      <>
        <p className="font-medium">{labels.over}</p>
        <p className="text-muted-foreground tabular-nums">
          {labels.level} {result.level} · {result.fixed} {labels.fixed}
        </p>
        <button type="button" onClick={play} className={cn(button, "mt-2")}>
          <ReplayIcon className="size-4" />
          {labels.again}
        </button>
      </>
    ) : null;

  return (
    <figure ref={root} aria-label={labels.title} className={well}>
      <div
        ref={frame}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the game takes keys while focused
        tabIndex={0}
        role="application"
        aria-label={labels.canvas}
        onKeyDown={(e) => key(e, true)}
        onKeyUp={(e) => key(e, false)}
        // focus moving to its own controls keeps it running; anywhere else, it waits
        onBlur={(e) => {
          if (!root.current?.contains(e.relatedTarget)) pause();
        }}
        className="grid place-items-center outline-none focus-visible:[&>div]:outline-2 focus-visible:[&>div]:outline-ring focus-visible:[&>div]:-outline-offset-2"
      >
        <div
          className="relative"
          style={{ width: view.width, height: view.height }}
        >
          <canvas
            ref={canvas}
            width={view.w}
            height={H}
            aria-hidden
            className="block size-full [image-rendering:pixelated]"
          />
          {overlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/70 text-center">
              {overlay}
            </div>
          )}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {news}
      </p>

      <Pad labels={labels.pad} onPress={pressed} />

      <div className="border-border border-t px-6 pt-4 pb-5 lg:px-16">
        <fieldset
          aria-label={labels.title}
          className="flex flex-wrap items-center gap-2"
        >
          <Tool
            label={state === "play" ? labels.pause : labels.play}
            onClick={state === "play" ? pause : play}
          >
            <ActionSwapIcon value={state === "play" ? "pause" : "play"}>
              {state === "play" ? (
                <PauseIcon className="size-4" />
              ) : (
                <PlayIcon className="size-4" />
              )}
            </ActionSwapIcon>
          </Tool>
          <Tool label={labels.restart} onClick={restart}>
            <ReplayIcon className="size-4" />
          </Tool>
          <Speeds
            name="game"
            label={speedLabel}
            speed={speed}
            onChange={(value) => {
              setSpeed(value);
              if (state === "play") frame.current?.focus();
            }}
          />
        </fieldset>
        <Keys labels={labels.keys} />
      </div>
    </figure>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid min-w-6 place-items-center rounded-[6px] bg-muted px-1.5 font-mono text-foreground text-sm leading-6 inset-ring inset-ring-border">
      {children}
    </kbd>
  );
}

// The keys, for a keyboard; a touch screen gets the pad instead.
function Keys({ labels }: { labels: Labels["keys"] }) {
  const rows: [ReactNode, string][] = [
    [
      <>
        <Kbd>←</Kbd> <Kbd>→</Kbd>
      </>,
      labels.move,
    ],
    [<Kbd key="up">↑</Kbd>, labels.jump],
    [
      <>
        <Kbd>↓</Kbd> + <Kbd>↑</Kbd>
      </>,
      labels.drop,
    ],
    [<Kbd key="j">J</Kbd>, labels.punch],
    [<Kbd key="k">K</Kbd>, labels.throw],
    [<Kbd key="l">L</Kbd>, labels.special],
  ];
  return (
    <dl
      aria-label={labels.label}
      className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground text-sm pointer-coarse:hidden"
    >
      {rows.map(([keys, label]) => (
        <div key={label} className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1">{keys}</dt>
          <dd>{label}</dd>
        </div>
      ))}
    </dl>
  );
}

// On a touch screen: hold to move, tap to act. Each pad button reports its
// press and release, so a held thumb runs and a lifted one stops.
function Pad({
  labels,
  onPress,
}: {
  labels: Labels["pad"];
  onPress: (action: Action, down: boolean) => void;
}) {
  const pad = (
    action: Action,
    label: string,
    children: ReactNode,
    wide = false,
  ) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onPress(action, true);
      }}
      onPointerUp={() => onPress(action, false)}
      onPointerCancel={() => onPress(action, false)}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "grid h-12 touch-none select-none place-items-center rounded-[10px] bg-muted text-foreground inset-ring inset-ring-border active:bg-foreground/10",
        wide ? "px-3 text-sm" : "w-12",
      )}
    >
      {children}
    </button>
  );
  return (
    <div className="hidden justify-between gap-2 border-border border-t px-6 py-4 pointer-coarse:flex">
      <div className="flex gap-2">
        {pad(
          "left",
          labels.left,
          <ChevronRightIcon className="size-5 rotate-180" />,
        )}
        {pad(
          "down",
          labels.down,
          <ChevronRightIcon className="size-5 rotate-90" />,
        )}
        {pad("right", labels.right, <ChevronRightIcon className="size-5" />)}
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {pad("special", labels.special, labels.special, true)}
        {pad("throw", labels.throw, labels.throw, true)}
        {pad("punch", labels.punch, labels.punch, true)}
        {pad("jump", labels.jump, labels.jump, true)}
      </div>
    </div>
  );
}
