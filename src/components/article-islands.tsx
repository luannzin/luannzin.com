"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCopy } from "@/components/share";
import { CheckIcon, CopyIcon, DiceIcon } from "@/components/icons";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { SceneArt } from "@/components/scene-art";
import { press } from "@/lib/classes";
import { createScene } from "@/lib/scene";

type Island =
  | { kind: "copy"; el: HTMLElement; code: HTMLElement }
  | { kind: "scene"; el: HTMLElement; seed: number }
  | { kind: "roll"; el: HTMLElement; seed: number };

// The article is static HTML from markdown. The few parts that need React,
// copy buttons and live scenes, mount into placeholders the HTML leaves.
export function ArticleIslands({ root }: { root: string }) {
  const [islands, setIslands] = useState<Island[]>([]);

  useEffect(() => {
    const found: Island[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(
      `#${root} [data-island]`,
    )) {
      const seed = Number(el.dataset.seed);
      if (el.dataset.island === "scene") {
        found.push({ kind: "scene", el, seed });
        continue;
      }
      if (el.dataset.island === "roll") {
        // its static stand-in gives way to the live one
        el.replaceChildren();
        found.push({ kind: "roll", el, seed });
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
      ) : island.kind === "roll" ? (
        <RollScene seed={island.seed} />
      ) : (
        <CopyCode code={island.code} />
      ),
      island.el,
      i,
    ),
  );
}

// A live scene, and a button that draws another from a fresh seed. Only the
// name is shown, never the seed.
function RollScene({ seed: first }: { seed: number }) {
  const [seed, setSeed] = useState(first);
  const { name, time } = createScene(seed);

  return (
    <>
      <div
        className="scene-slot"
        role="img"
        aria-label={`An animated scene drawn in dots: ${name}`}
        style={{ background: time.ground }}
      >
        <SceneArt seed={seed} stir />
      </div>
      <figcaption>
        <span aria-live="polite">{name}</span>
        <button
          type="button"
          onClick={() => setSeed(Math.floor(Math.random() * 2 ** 32))}
          className={`-my-1 -me-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 text-muted-foreground hover:text-foreground ${press}`}
        >
          Another scene
          <DiceIcon className="size-4" />
        </button>
      </figcaption>
    </>
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
        className={`${press} -m-1.5 grid size-7 place-items-center rounded-md text-muted-foreground hover:text-foreground`}
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
