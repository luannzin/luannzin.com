"use client";

import { useEffect, useState } from "react";
import { CheckIcon, LinkIcon } from "@/components/icons";
import {
  ActionSwapIcon,
  ActionSwapText,
} from "@/components/motion/action-swap";

type State = "idle" | "copied" | "failed";

// Copies text and reports how it went for two seconds, then settles.
export function useCopy() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = (text: string) =>
    navigator.clipboard.writeText(text).then(
      () => setState("copied"),
      () => setState("failed"),
    );
  return [state, copy] as const;
}

const label: Record<State, string> = {
  idle: "Copy link",
  copied: "Copied",
  failed: "Copy failed",
};

export function CopyLink() {
  const [state, copy] = useCopy();

  return (
    <>
      <button
        type="button"
        onClick={() => copy(window.location.origin + window.location.pathname)}
        className="-my-1 -me-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 text-muted-foreground transition-[color,scale] duration-150 hover:text-foreground active:scale-[0.96]"
      >
        <ActionSwapText value={state}>{label[state]}</ActionSwapText>
        <ActionSwapIcon value={state === "copied" ? "check" : "link"}>
          {state === "copied" ? (
            <CheckIcon className="size-4" />
          ) : (
            <LinkIcon className="size-4" />
          )}
        </ActionSwapIcon>
      </button>
      <output className="sr-only">
        {state === "idle" ? "" : label[state]}
      </output>
    </>
  );
}
