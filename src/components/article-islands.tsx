"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon, CopyIcon, DiceIcon } from "@/components/icons";
import type { PieceName } from "@/components/lab/specimens";
import type { LinePieceName } from "@/components/line-pieces";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { SceneArt } from "@/components/scene-art";
import { announce, useCopy } from "@/components/share";
import type { t } from "@/i18n/generated";
import { press } from "@/lib/classes";
import { createScene } from "@/lib/scene";

type SceneLabels = typeof t.components.scene;
type CopyLabels = typeof t.components.copy;
type LabLabels = Pick<typeof t.app.lab, "controls" | "tracks" | "seed">;
type LineLabels = typeof t.components.lines;

// The Lab's pieces, and the lines', load only in a post that shows one.
const Piece = lazy(() =>
  import("@/components/lab/specimens").then((m) => ({ default: m.Piece })),
);
const LinePiece = lazy(() =>
  import("@/components/line-pieces").then((m) => ({ default: m.LinePiece })),
);

type Island =
  | { kind: "copy"; el: HTMLElement; code: HTMLElement }
  | { kind: "scene"; el: HTMLElement; seed: number }
  | { kind: "roll"; el: HTMLElement; seed: number }
  | { kind: "lab"; el: HTMLElement; piece: PieceName; name: string }
  | { kind: "line"; el: HTMLElement; piece: LinePieceName; name: string };

// The article is static HTML from markdown. The few parts that need React,
// copy buttons, live scenes and pieces of the Lab and the lines, mount into
// placeholders the HTML leaves.
export function ArticleIslands({
  root,
  scene,
  copy,
  lab,
  lines,
  role,
}: {
  root: string;
  scene: SceneLabels;
  copy: CopyLabels;
  lab: LabLabels;
  lines: LineLabels;
  role: string;
}) {
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
      if (el.dataset.island === "lab") {
        found.push({
          kind: "lab",
          el,
          piece: el.dataset.piece as PieceName,
          name: el.dataset.name ?? "",
        });
        continue;
      }
      if (el.dataset.island === "line") {
        found.push({
          kind: "line",
          el,
          piece: el.dataset.piece as LinePieceName,
          name: el.dataset.name ?? "",
        });
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
        <RollScene seed={island.seed} labels={scene} />
      ) : island.kind === "lab" ? (
        <Suspense>
          <Piece
            piece={island.piece}
            name={island.name}
            {...lab}
            scene={scene}
            role={role}
          />
        </Suspense>
      ) : island.kind === "line" ? (
        <Suspense>
          <LinePiece piece={island.piece} name={island.name} labels={lines} />
        </Suspense>
      ) : (
        <CopyCode code={island.code} labels={copy} />
      ),
      island.el,
      i,
    ),
  );
}

// A live scene, and a button that draws another from a fresh seed. Only the
// name is shown, never the seed.
function RollScene({
  seed: first,
  labels,
}: {
  seed: number;
  labels: SceneLabels;
}) {
  const [seed, setSeed] = useState(first);
  const { name, time } = createScene(seed);

  return (
    <>
      <div
        className="scene-slot"
        role="img"
        aria-label={`${labels.label} ${name}`}
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
          {labels.another}
          <DiceIcon className="size-4" />
        </button>
      </figcaption>
    </>
  );
}

function CopyCode({ code, labels }: { code: HTMLElement; labels: CopyLabels }) {
  const [state, copy] = useCopy();
  const copied = state === "copied";

  return (
    <>
      <button
        type="button"
        onClick={() => copy(code.textContent ?? "")}
        aria-label={copied ? labels.copied : labels.code}
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
      <output className="sr-only">{announce(state, labels)}</output>
    </>
  );
}
