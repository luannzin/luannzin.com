"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  JumpIcon,
  LaptopIcon,
  PlayIcon,
  ReplayIcon,
  ThrowIcon,
} from "@/components/icons";
import { well } from "@/components/lab/timeline";
import type { t } from "@/i18n/generated";
import {
  type Action,
  type Event,
  Game,
  H,
  type Point,
  W,
} from "@/lib/bug-hunt/game";
import { press } from "@/lib/classes";
import { cn } from "@/lib/utils";

type Labels = typeof t.app.lab.game;
type State = "loading" | "title" | "play" | "paused" | "over";

// WASD and the mouse; arrows, Space, J and K as the fallback
const KEYS: Record<string, Action> = {
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  KeyW: "jump",
  ArrowUp: "jump",
  Space: "jump",
  KeyS: "down",
  ArrowDown: "down",
  KeyJ: "throw",
  KeyK: "special",
};
// the left button throws, the right one is the special
const BUTTONS: Record<number, Action> = {
  0: "throw",
  2: "special",
};

const button = `${press} inline-flex h-9 items-center gap-2 rounded-[10px] bg-muted ps-3 pe-4 text-foreground inset-ring inset-ring-border outline-offset-2 hover:bg-foreground/7`;

// Bug hunt in its Well: the canvas, scaled by a whole number so every pixel
// stays square, the overlays between runs, then how to play it: the controls
// for a mouse and keyboard, or a joystick and buttons on a touch screen.
// Keys only reach the game while it has focus, so the page still scrolls.
export function BugHunt({ labels }: { labels: Labels }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const sheet = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<State>("loading");
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
    draw();
  }, [view.w, state]);

  useEffect(() => {
    if (state !== "play") return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      game.current?.update(Math.min(100, now - last) / 1000);
      const ctx = canvas.current?.getContext("2d");
      if (ctx) game.current?.draw(ctx);
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [state]);

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
      { threshold: 0.25 },
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
    frame.current?.focus({ preventScroll: true });
  };

  // where a mouse event sits in the view, in game px
  const point = (event: MouseEvent): Point | undefined => {
    const box = canvas.current?.getBoundingClientRect();
    if (!box) return undefined;
    return {
      x: ((event.clientX - box.left) / box.width) * view.w,
      y: ((event.clientY - box.top) / box.height) * H,
    };
  };

  const key = (event: KeyboardEvent<HTMLDivElement>, down: boolean) => {
    if (event.target !== frame.current) return;
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
    const action = KEYS[event.code];
    if (!action || state !== "play") return;
    event.preventDefault();
    if (down) game.current?.press(action);
    else game.current?.release(action);
  };

  // Mouse buttons by mouseDown and mouseUp rather than pointer events: a
  // second button held with the first fires no pointerdown of its own.
  const click = (event: MouseEvent, down: boolean) => {
    const action = BUTTONS[event.button];
    if (!action || state !== "play") return;
    event.preventDefault();
    frame.current?.focus({ preventScroll: true });
    if (down) game.current?.press(action, point(event));
    else game.current?.release(action);
  };

  const aim = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !game.current) return;
    game.current.pointer = state === "play" ? (point(event) ?? null) : null;
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
        <button type="button" onClick={play} className={cn(button, "mt-2")}>
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
        <button type="button" onClick={play} className={cn(button, "mt-3")}>
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
        {/* biome-ignore lint/a11y/noStaticElementInteractions: mouse play only; the same moves have keys and a touch pad */}
        <div
          className={cn("relative", state === "play" && "cursor-none")}
          style={{ width: view.width, height: view.height }}
          onMouseDown={(e) => click(e, true)}
          onMouseUp={(e) => click(e, false)}
          onContextMenu={(e) => e.preventDefault()}
          onPointerMove={aim}
          onPointerLeave={() => {
            if (game.current) game.current.pointer = null;
          }}
        >
          <canvas
            ref={canvas}
            width={view.w}
            height={H}
            aria-hidden
            className="block size-full [image-rendering:pixelated]"
          />
          {overlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/70 px-6 text-center">
              {overlay}
            </div>
          )}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {news}
      </p>

      <Pad
        labels={labels.pad}
        onPress={pressed}
        onSteer={(x, y) => game.current?.steer(x, y)}
      />
      <Keys labels={labels.keys} />
    </figure>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-[6px] bg-muted px-1.5 font-mono text-foreground text-sm inset-ring inset-ring-border">
      {children}
    </kbd>
  );
}

// The controls for a mouse and keyboard; a touch screen gets the pad instead.
function Keys({ labels }: { labels: Labels["keys"] }) {
  type Row = [ReactNode, string];
  const moving: Row[] = [
    [
      <>
        <Kbd>A</Kbd>
        <Kbd>D</Kbd>
      </>,
      labels.move,
    ],
    [<Kbd key="w">W</Kbd>, labels.jump],
    [<Kbd key="s">S</Kbd>, labels.crouch],
    [
      <>
        <Kbd>S</Kbd>+<Kbd>W</Kbd>
      </>,
      labels.drop,
    ],
  ];
  const fighting: Row[] = [
    [<Kbd key="click">{labels.click}</Kbd>, labels.throw],
    [<Kbd key="right">{labels.rightClick}</Kbd>, labels.special],
    [<Kbd key="esc">Esc</Kbd>, labels.pause],
  ];
  // two groups, moving and fighting, each a column of key and what it does
  const group = (rows: Row[]) => (
    <dl className="grid grid-cols-[auto_1fr] content-start items-center gap-x-3 gap-y-2">
      {rows.map(([keys, label]) => (
        <div key={label} className="contents">
          <dt className="flex items-center gap-1">{keys}</dt>
          <dd>{label}</dd>
        </div>
      ))}
    </dl>
  );
  return (
    <section
      aria-label={labels.label}
      className="border-border border-t px-6 pt-4 pb-5 text-muted-foreground text-sm pointer-coarse:hidden lg:px-16"
    >
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {group(moving)}
        {group(fighting)}
      </div>
      <p className="mt-4">{labels.fallback}</p>
    </section>
  );
}

// A touch screen's controls: a joystick on the leading side, the three moves
// on the trailing side where the other thumb rests, jump lowest and nearest.
function Pad({
  labels,
  onPress,
  onSteer,
}: {
  labels: Labels["pad"];
  onPress: (action: Action, down: boolean) => void;
  onSteer: (x: number, y: number) => void;
}) {
  const knob = useRef<HTMLSpanElement>(null);
  // which directions the stick is holding down, to send only the changes
  const leaning = useRef(new Set<Action>());

  const steer = (x: number, y: number) => {
    onSteer(x, y);
    const now = new Set<Action>();
    if (x < -0.35) now.add("left");
    if (x > 0.35) now.add("right");
    if (y > 0.55) now.add("down");
    for (const a of leaning.current) if (!now.has(a)) onPress(a, false);
    for (const a of now) if (!leaning.current.has(a)) onPress(a, true);
    leaning.current = now;
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const travel = box.width / 2 - 20;
    let dx = event.clientX - (box.left + box.width / 2);
    let dy = event.clientY - (box.top + box.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > travel) {
      dx *= travel / d;
      dy *= travel / d;
    }
    if (knob.current) knob.current.style.translate = `${dx}px ${dy}px`;
    steer(dx / travel, dy / travel);
  };

  const center = () => {
    if (knob.current) knob.current.style.translate = "0 0";
    steer(0, 0);
  };

  const action = (
    name: Action,
    label: string,
    icon: ReactNode,
    area: string,
  ) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onPress(name, true);
      }}
      onPointerUp={() => onPress(name, false)}
      onPointerCancel={() => onPress(name, false)}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "grid size-14 touch-none select-none place-items-center rounded-full bg-muted text-foreground inset-ring inset-ring-border transition-[background-color,scale] duration-100 active:scale-95 active:bg-foreground/12",
        area,
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="hidden items-center justify-between gap-4 border-border border-t px-6 py-5 pointer-coarse:flex">
      <div
        role="img"
        aria-label={labels.stick}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e);
        }}
        onPointerUp={center}
        onPointerCancel={center}
        onContextMenu={(e) => e.preventDefault()}
        className="relative grid size-32 shrink-0 touch-none select-none place-items-center rounded-full bg-muted inset-ring inset-ring-border"
      >
        <span
          ref={knob}
          className="size-12 rounded-full bg-foreground/12 inset-ring inset-ring-foreground/15"
        />
      </div>
      {/* an arc round the thumb: special on top, throw out at the edge */}
      <div className="grid grid-cols-2 grid-rows-3 gap-1">
        {action(
          "special",
          labels.special,
          <LaptopIcon className="size-5" />,
          "col-start-1 row-start-1",
        )}
        {action(
          "throw",
          labels.throw,
          <ThrowIcon className="size-5" />,
          "col-start-2 row-start-2",
        )}
        {action(
          "jump",
          labels.jump,
          <JumpIcon className="size-5" />,
          "col-start-1 row-start-3",
        )}
      </div>
    </div>
  );
}
