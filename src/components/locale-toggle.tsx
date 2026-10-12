"use client";

import { Menu } from "@base-ui/react/menu";
import {
  addTransitionType,
  type ComponentType,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { CheckIcon } from "@/components/icons";
import type { Locale } from "@/i18n/generated";
import { enter, press } from "@/lib/classes";
import { changeLocale } from "@/lib/locale";

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

const locales: Record<Locale, { name: string; Flag: ComponentType }> = {
  en: { name: "English", Flag: USFlag },
  pt: { name: "Português", Flag: BRFlag },
};

const codes = Object.keys(locales) as Locale[];

// The current language as a flag in a small circle, bottom center (bottom
// right on a phone). It opens upward into the languages; choosing one closes
// it, and the page cross-fades into the new language (the "locale" transition
// on the layout's ViewTransition), where the new flag develops in the circle.
export function LocaleToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  // the language just chosen, shown on the flag before the page catches up
  const [shown, setShown] = useOptimistic(locale);
  // the flag only plays once someone switches, not on every page load
  const [switched, setSwitched] = useState(false);
  // the row the hover background sits on: the last one highlighted, kept
  // through the instant between rows when none is
  const [row, setRow] = useState(codes.length - 1);
  const { name, Flag } = locales[shown];

  // The cookie is set by a Server Action, which sends the page back in the
  // new language in the same round trip; the transition type cross-fades it.
  const choose = (next: Locale) => {
    if (next === shown) return;
    setSwitched(true);
    startTransition(async () => {
      addTransitionType("locale");
      setShown(next);
      await changeLocale(next);
    });
  };

  return (
    <Menu.Root onOpenChange={(open) => open && setRow(codes.length - 1)}>
      <Menu.Trigger
        aria-label={`${label}: ${name}`}
        className={`fixed end-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 size-8 rounded-full bg-background p-0.5 shadow-lg/20 inset-ring inset-ring-border outline-offset-2 [view-transition-name:locale-menu] pointer-coarse:after:absolute pointer-coarse:after:-inset-1.5 hover:inset-ring-foreground/20 data-popup-open:inset-ring-foreground/20 sm:end-auto sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:left-1/2 sm:-translate-x-1/2 ${enter} delay-700 ${press}`}
      >
        <span
          key={shown}
          data-flash={switched || undefined}
          className="relative block size-full overflow-hidden rounded-full outline -outline-offset-1 outline-white/10"
        >
          <Flag />
          {switched && <span aria-hidden className="flag-flash" />}
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        {/* Centered over the circle; at the screen's edge on a phone, it
            shifts in to stay on screen. */}
        <Menu.Positioner
          side="top"
          sideOffset={8}
          collisionPadding={16}
          className="z-50"
        >
          <Menu.Popup
            className={`min-w-44 origin-(--transform-origin) rounded-[12px] bg-popover p-1 shadow-lg/20 inset-ring inset-ring-border outline-none transition-[opacity,scale,translate,filter] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] data-starting-style:scale-[0.96] data-starting-style:opacity-0 data-starting-style:blur-xs data-ending-style:translate-y-1 data-ending-style:opacity-0 data-ending-style:blur-xs data-ending-style:duration-150 motion-reduce:transition-[opacity]`}
          >
            <Menu.RadioGroup
              value={shown}
              onValueChange={(value) => choose(value as Locale)}
              className="group relative"
            >
              {/* One background for the whole list, sliding to whichever row
                  is highlighted and fading where it is when none is. Each
                  open, it waits on the last row, where the pointer comes in
                  from the circle below, so it appears there without a slide. */}
              <span
                aria-hidden
                style={{ translate: `0 ${row * 100}%` }}
                className="pointer-events-none absolute inset-x-0 top-0 h-9 rounded-[8px] bg-accent opacity-0 [transition:opacity_150ms_ease-out,translate_200ms_cubic-bezier(0.23,1,0.32,1)] group-has-[[data-highlighted]]:opacity-100"
              />
              {codes.map((code, i) => {
                const { name, Flag } = locales[code];
                return (
                  <Menu.RadioItem
                    key={code}
                    value={code}
                    closeOnClick
                    // highlighting moves focus, by pointer or by keyboard
                    onFocus={() => setRow(i)}
                    className="relative flex h-9 cursor-default select-none items-center gap-2.5 rounded-[8px] px-2 text-base text-muted-foreground outline-none transition-[color] duration-150 data-checked:text-foreground data-highlighted:text-foreground sm:text-sm"
                  >
                    <span className="size-5 shrink-0 overflow-hidden rounded-full outline -outline-offset-1 outline-white/10">
                      <Flag />
                    </span>
                    <span lang={code}>{name}</span>
                    <Menu.RadioItemIndicator className="ms-auto">
                      <CheckIcon className="size-4" />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                );
              })}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
