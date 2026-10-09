"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCopy } from "@/components/copy-link";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { SceneArt } from "@/components/scene-art";

type Island =
  | { kind: "copy"; el: HTMLElement; code: HTMLElement }
  | { kind: "scene"; el: HTMLElement; seed: number };

// The article is static HTML from markdown. The few parts that need React,
// copy buttons and live scenes, mount into placeholders the HTML leaves.
export function ArticleIslands({ root }: { root: string }) {
  const [islands, setIslands] = useState<Island[]>([]);

  useEffect(() => {
    const found: Island[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(
      `#${root} [data-island]`,
    )) {
      if (el.dataset.island === "scene") {
        found.push({ kind: "scene", el, seed: Number(el.dataset.seed) });
        continue;
      }
      const code = el.closest("figure")?.querySelector("code");
      if (code) found.push({ kind: "copy", el, code });
    }
    setIslands(found);
  }, [root]);

  return islands.map((island, i) =>
    createPortal(
      island.kind === "scene" ? (
        <SceneArt seed={island.seed} />
      ) : (
        <CopyCode code={island.code} />
      ),
      island.el,
      i,
    ),
  );
}

function CopyCode({ code }: { code: HTMLElement }) {
  const [state, copy] = useCopy();
  const copied = state === "copied";

  return (
    <>
      <button
        type="button"
        onClick={() => copy(code.textContent ?? "")}
        aria-label={copied ? "Copied" : "Copy code"}
        className="-m-1.5 grid size-7 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 hover:text-foreground active:scale-[0.96]"
      >
        <ActionSwapIcon value={copied ? "check" : "copy"}>
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </ActionSwapIcon>
      </button>
      <output className="sr-only">
        {state === "idle" ? "" : copied ? "Copied" : "Copy failed"}
      </output>
    </>
  );
}
