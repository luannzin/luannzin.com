"use client";

import { useTheme } from "next-themes";
import {
  addTransitionType,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  startTransition,
  useEffect,
  useId,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { Orb } from "@/components/orb";
import type { Locale } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { changeLocale } from "@/lib/locale";
import { type Theme, themes } from "@/lib/theme";

// Flags drawn for a circle: each fills a 24 square, and its frame crops it.
function USFlag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="block size-full">
      <rect width="24" height="24" fill="#b22234" />
      <path
        fill="#fff"
        d="M0 1.846h24v1.846H0zM0 5.538h24v1.846H0zM0 9.231h24v1.846H0zM0 12.923h24v1.846H0zM0 16.615h24v1.846H0zM0 20.308h24v1.846H0z"
      />
      <rect width="12" height="12.923" fill="#3c3b6e" />
      <g fill="#fff">
        {[2.2, 4.3, 6.4, 8.5, 10.6].flatMap((cy, i) =>
          (i % 2 ? [4, 8] : [2, 6, 10]).map((cx) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.7" />
          )),
        )}
      </g>
    </svg>
  );
}

function BRFlag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="block size-full">
      <rect width="24" height="24" fill="#009c3b" />
      <path d="M12 3.5 22 12l-10 8.5L2 12z" fill="#ffdf00" />
      <circle cx="12" cy="12" r="5" fill="#002776" />
      <path
        d="M7.1 11.2a10 10 0 0 1 9.7 2.1"
        fill="none"
        stroke="#fff"
        strokeWidth="1"
      />
      <g fill="#fff">
        <circle cx="9.6" cy="13.7" r="0.35" />
        <circle cx="11.1" cy="15.3" r="0.35" />
        <circle cx="12.8" cy="14.3" r="0.35" />
        <circle cx="14.5" cy="15.6" r="0.35" />
        <circle cx="12" cy="16.6" r="0.35" />
      </g>
    </svg>
  );
}

const locales: Record<Locale, { name: string; flag: ReactNode }> = {
  en: { name: "English", flag: <USFlag /> },
  pt: { name: "Português", flag: <BRFlag /> },
};

const codes = Object.keys(locales) as Locale[];

// The list, top to bottom: the languages, a hairline, the themes. Each sits
// in a 40px slot, a 32px orb with 4px round it, so the pill is 40px wide and
// its ends are concentric with the orbs.
const SLOT = 40;
const RULE = 12;
const entries = [
  ...codes.map((code) => ({ kind: "locale" as const, code })),
  ...themes.map((id) => ({ kind: "theme" as const, id })),
];
const top = (i: number) => i * SLOT + (i >= codes.length ? RULE : 0);
const HEIGHT = top(entries.length - 1) + SLOT;
const EDGE = 16; // the open list keeps this far from the screen's edges

// The new theme grows out of the orb that was picked as a blurred circle
// (`circle-reveal` in globals.css). A second pick mid-wipe takes over the
// first, so the marker comes off only when the last one ends.
let reveals = 0;
function reveal(update: () => void, from: HTMLElement) {
  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return update();
  const html = document.documentElement;
  const box = from.getBoundingClientRect();
  html.style.setProperty(
    "--reveal-origin",
    `${box.left + box.width / 2}px ${box.top + box.height / 2}px`,
  );
  html.dataset.reveal = "";
  reveals++;
  const transition = document.startViewTransition(update);
  // skipped when another pick or a hidden tab cuts it short: not an error
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    if (--reveals === 0) delete html.dataset.reveal;
  });
}

type DockLabels = {
  dock: string;
  theme: string;
  language: string;
  themes: Record<Theme, string>;
};

// The theme as a turning halftone orb, with the language as a flag moon at
// its side, in the bottom corner on a phone and on the right edge from lg.
// A click, a tap or the keyboard unfolds the list around the orb (never a
// hover, so passing the edge opens nothing), which stays where it
// is: it takes the place of its own theme in the list, and the moon flies to
// its language. Picking a theme wipes the page into it from that orb, and the
// orb glides into the new theme's place; picking a language closes the list
// and cross-fades the page, as before.
export function Dock({
  locale,
  labels,
}: {
  locale: Locale;
  labels: DockLabels;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  // The server can't know the theme (it lives in the visitor's storage), so
  // the first render says dark and the real one follows on mount, long
  // before the dock's entrance at 700ms.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme = ((mounted && resolvedTheme) || "dark") as Theme;
  // the language just chosen, shown before the page catches up
  const [shown, setShown] = useOptimistic(locale);
  // the flag only plays once someone switches, not on every page load
  const [switched, setSwitched] = useState(false);
  const [open, setOpen] = useState(false);
  // where the list hangs while open: from the theme it opened on, nudged to
  // stay on screen
  const [hang, setHang] = useState(0);
  // the row the pointer or focus is on
  const [near, setNear] = useState<number | null>(null);
  // a mouse over the dock wakes the orb without opening anything
  const [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const current = codes.length + themes.indexOf(theme);
  const language = codes.indexOf(shown);

  const show = (focus?: number) => {
    if (!open && root.current) {
      const box = root.current.getBoundingClientRect();
      // in the phone's corner the list opens upward only, clear of the
      // home indicator; on the right edge it may hang both ways
      const side = matchMedia("(min-width: 64rem)").matches;
      const floor = side ? innerHeight - EDGE : box.bottom;
      const from = box.top - top(current);
      let shift = Math.min(0, floor - (from + HEIGHT));
      shift = Math.max(shift, EDGE - from);
      setHang(shift - top(current));
      setOpen(true);
    }
    // after the commit that lifts `inert`
    if (focus !== undefined)
      requestAnimationFrame(() => items.current[focus]?.focus());
  };

  const hide = (refocus = false) => {
    setOpen(false);
    setNear(null);
    if (refocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (root.current?.contains(e.target as Node)) return;
      setOpen(false);
      setNear(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // The current theme's row lies over the orb, so a second press on the orb
  // lands here and closes the list.
  const pick = (next: Theme, from: HTMLElement) => {
    if (next === theme) return hide(true);
    reveal(() => {
      const html = document.documentElement;
      // Every hover colour, underline and ring would otherwise fade into the
      // new theme under the wipe, a smear on top of it. The dock keeps its
      // own, so the orb still glides to its new row.
      const still = document.createElement("style");
      still.textContent =
        ":not(.dock, .dock *), :not(.dock, .dock *)::before, :not(.dock, .dock *)::after { transition: none !important }";
      document.head.append(still);
      requestAnimationFrame(() => requestAnimationFrame(() => still.remove()));
      // next-themes swaps the class in an effect, which a sync render runs
      // before returning; the transition snapshots the page after this
      flushSync(() => setTheme(next));
      // commit the new colours while transitions are still off
      void html.offsetHeight;
    }, from);
  };

  // The cookie is set by a Server Action, which sends the page back in the
  // new language in the same round trip; the transition type cross-fades it.
  const speak = (next: Locale) => {
    hide(true);
    if (next === shown) return;
    setSwitched(true);
    startTransition(async () => {
      addTransitionType("locale");
      setShown(next);
      await changeLocale(next);
    });
  };

  const onMenuKey = (e: KeyboardEvent) => {
    const at = items.current.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const go = (i: number) => {
      e.preventDefault();
      items.current[(i + entries.length) % entries.length]?.focus();
    };
    if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(entries.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      hide(true);
    } else if (e.key === "Tab") hide();
  };

  const named = (i: number) => {
    const entry = entries[i];
    return entry.kind === "theme"
      ? { name: labels.themes[entry.id], lang: undefined }
      : { name: locales[entry.code].name, lang: entry.code };
  };
  const label = named(near ?? current);

  const row = (i: number) => {
    const entry = entries[i];
    const checked =
      entry.kind === "theme" ? entry.id === theme : entry.code === shown;
    const { name, lang } = named(i);
    // the row under the pointer swells, its neighbours a little, as on a dock
    const swell = near === null ? 1 : ([1.14, 1.05][Math.abs(i - near)] ?? 1);
    return (
      <button
        key={entry.kind === "theme" ? entry.id : entry.code}
        ref={(el) => {
          items.current[i] = el;
        }}
        type="button"
        role="menuitemradio"
        aria-checked={checked}
        tabIndex={-1}
        onClick={(e) =>
          entry.kind === "theme"
            ? pick(entry.id, e.currentTarget)
            : speak(entry.code)
        }
        onPointerEnter={() => setNear(i)}
        onFocus={() => setNear(i)}
        className="dock-item absolute start-0 grid size-10 place-items-center rounded-full outline-offset-0"
        style={
          {
            top: top(i),
            "--d": `${Math.abs(i - current) * 28}ms`,
            "--swell": swell,
          } as CSSProperties
        }
      >
        <span
          data-here={checked || undefined}
          className="dock-face block size-8 overflow-hidden rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10"
        >
          {entry.kind === "theme" ? (
            <Orb
              theme={entry.id}
              awake={near === i}
              live={open}
              className="block size-full"
            />
          ) : (
            locales[entry.code].flag
          )}
        </span>
        <span className="sr-only" lang={lang}>
          {name}
        </span>
      </button>
    );
  };

  return (
    <div
      ref={root}
      data-open={open || undefined}
      onPointerEnter={(e) => setHovered(e.pointerType === "mouse")}
      onPointerLeave={() => setHovered(false)}
      className={`dock group fixed end-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 size-10 lg:end-6 lg:top-1/2 lg:bottom-auto lg:-mt-5 ${enter} delay-700`}
    >
      <div
        className="dock-body absolute inset-x-0 top-0"
        style={{ translate: `0 ${open ? hang : -top(current)}px` }}
      >
        <div
          aria-hidden
          className="dock-pill absolute inset-x-0 rounded-[20px] bg-popover shadow-lg/20 inset-ring inset-ring-border group-hover:inset-ring-foreground/20"
          style={
            open
              ? { top: 0, height: HEIGHT }
              : { top: top(current), height: SLOT }
          }
        />
        {/* Before the menu, so Tab from a row moves on past the dock; it
            still paints over the rows (z-1), the current one under it, and
            under the moon (z-2). */}
        <button
          ref={trigger}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={id}
          aria-label={`${labels.dock}: ${labels.themes[theme]}, ${locales[shown].name}`}
          onClick={(e) =>
            open ? hide() : show(e.detail ? undefined : current)
          }
          onKeyDown={(e) => {
            if (e.key === "Escape" && open) {
              e.preventDefault();
              hide();
            }
            if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
            e.preventDefault();
            show(current);
          }}
          className="dock-sphere absolute start-0 top-0 z-1 grid size-10 place-items-center rounded-full outline-offset-2 pointer-coarse:after:absolute pointer-coarse:after:-inset-1"
          style={{ translate: `0 ${top(current)}px` }}
        >
          <Orb
            theme={theme}
            awake={open || hovered}
            className="block size-8 rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10"
          />
        </button>
        <div
          id={id}
          role="menu"
          aria-label={labels.dock}
          inert={!open}
          onKeyDown={onMenuKey}
          onPointerLeave={() => setNear(null)}
        >
          <fieldset aria-label={labels.language}>
            {codes.map((_, i) => row(i))}
          </fieldset>
          <hr
            className="dock-rule absolute inset-x-3 h-px border-0 bg-border"
            style={{ top: top(codes.length) - RULE / 2 }}
          />
          <fieldset aria-label={labels.theme}>
            {themes.map((_, i) => row(codes.length + i))}
          </fieldset>
        </div>
        {/* The language, a flag moon at the orb's side that flies to its
            own row while the list is open. */}
        <span
          aria-hidden
          className="dock-moon pointer-events-none absolute start-1 top-0 z-2 size-8 rounded-full shadow-[0_0_0_4px_var(--popover)]"
          style={
            open
              ? { translate: `0 ${top(language) + 4}px`, scale: 1 }
              : { translate: `-12px ${top(current) + 16}px`, scale: 0.4375 }
          }
        >
          <span
            key={shown}
            data-flash={switched || undefined}
            className="relative block size-full overflow-hidden rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10"
          >
            {locales[shown].flag}
            {switched && <span aria-hidden className="flag-flash" />}
          </span>
        </span>
        {/* Running dots, as on a dock: the theme and the language in use. */}
        {[current, language].map((i) => (
          <span
            key={i < codes.length ? "language" : "theme"}
            aria-hidden
            className="dock-dot pointer-events-none absolute -end-2 top-0 size-1 rounded-full bg-foreground"
            style={{ translate: `0 ${top(i) + 18}px`, opacity: open ? 1 : 0 }}
          />
        ))}
        <span
          aria-hidden
          className="dock-label pointer-events-none absolute end-full top-0 me-2 flex h-7 items-center whitespace-nowrap rounded-[8px] bg-popover px-2.5 text-base text-foreground shadow-lg/20 inset-ring inset-ring-border sm:text-sm"
          style={{ translate: `0 ${top(near ?? current) + 6}px` }}
        >
          <span key={label.name} lang={label.lang} className="dock-label-text">
            {label.name}
          </span>
        </span>
      </div>
    </div>
  );
}
