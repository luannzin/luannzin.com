"use client";

import { useState } from "react";
import { DiceIcon } from "@/components/icons";
import { Segmented, well } from "@/components/lab/timeline";
import { SceneArt } from "@/components/scene-art";
import type { t } from "@/i18n/generated";
import { press } from "@/lib/classes";
import { createScene, type Place } from "@/lib/scene";

type Copy = typeof t.app.projects.scenes;
type SceneLabels = typeof t.components.scene;

const random = () => Math.floor(Math.random() * 2 ** 32);

// The first seed from `from` on whose scene is set in `place`. The rarest
// place comes up about one seed in fifteen, so the search is short.
function seedIn(place: Place, from: number) {
  let seed = from;
  while (createScene(seed).place !== place) seed = (seed + 1) >>> 0;
  return seed;
}

// A live scene across the top of a Well, like the Lab's seeded scenes.
function Slot({
  seed,
  cell,
  label,
}: {
  seed: number;
  cell?: number;
  label: string;
}) {
  const { name, time } = createScene(seed);
  return (
    <div
      role="img"
      aria-label={`${label} ${name}`}
      className="relative overflow-hidden sm:rounded-t-[14px] sm:outline sm:-outline-offset-1 sm:outline-white/10"
      style={{ background: time.ground }}
    >
      <SceneArt seed={seed} cell={cell} stir />
    </div>
  );
}

// Pick a place and a seed that lands there is drawn, with what the place
// allows under it.
export function PlaceScene({
  name,
  seed: first,
  labels,
  places,
  scene: sceneLabels,
}: {
  // the id of the heading that names it
  name: string;
  seed: number;
  labels: Copy["places"];
  places: Copy["place"];
  scene: SceneLabels;
}) {
  const [seed, setSeed] = useState(first);
  const scene = createScene(seed);
  const here = places[scene.place];

  return (
    <figure aria-labelledby={name} className={well}>
      <Slot seed={seed} label={sceneLabels.label} />
      <div className="flex items-center justify-between gap-6 px-6 py-4 lg:px-16">
        <p
          aria-live="polite"
          className="min-w-0 text-muted-foreground first-letter:uppercase"
        >
          {scene.name}
        </p>
        <button
          type="button"
          onClick={() => setSeed(seedIn(scene.place, random()))}
          className={`-my-1 -me-1.5 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm py-1 ps-2 pe-1.5 text-muted-foreground hover:text-foreground ${press}`}
        >
          {sceneLabels.another}
          <DiceIcon className="size-4" />
        </button>
      </div>
      <div className="@container border-border border-t px-6 pt-4 pb-5 lg:px-16">
        <fieldset>
          <legend className="sr-only">{labels.label}</legend>
          {/* nine in even rows, so none is left over on a line of its own */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(Object.keys(places) as Place[]).map((place) => (
              <label
                key={place}
                className="grid min-h-8 cursor-pointer place-items-center rounded-[8px] bg-muted px-2 py-1 text-center text-muted-foreground leading-snug inset-ring inset-ring-border transition-[color,background-color,box-shadow,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground active:scale-[0.96] has-checked:bg-foreground/7 has-checked:text-foreground has-checked:inset-ring-foreground/18 has-focus-visible:outline-2 has-focus-visible:outline-ring has-focus-visible:outline-offset-2"
              >
                <input
                  type="radio"
                  name={`${name}-place`}
                  checked={place === scene.place}
                  onChange={() => setSeed(seedIn(place, random()))}
                  className="sr-only"
                />
                {places[place].name}
              </label>
            ))}
          </div>
        </fieldset>
        {/* side by side once there's room for both columns; stacked, each
            label stays with its value and pairs sit further apart */}
        <dl className="mt-4 grid gap-y-1 leading-snug @xs:grid-cols-[auto_1fr] @xs:gap-x-4 [&>dd+dt]:mt-2 @xs:[&>dd+dt]:mt-0">
          <dt className="text-muted-foreground">{labels.drawnAt}</dt>
          <dd>{here.times}</dd>
          <dt className="text-muted-foreground">{labels.stands}</dt>
          <dd>{here.stands}</dd>
        </dl>
      </div>
    </figure>
  );
}

// Cell sizes, in CSS pixels: the scene's own, then up until each dot reads
// on its own.
const SIZES = [3, 6, 12, 24];

// One scene, its dots as large as you like.
export function DotScene({
  name,
  seed,
  label,
  scene: sceneLabels,
}: {
  // the id of the heading that names it
  name: string;
  seed: number;
  label: string;
  scene: SceneLabels;
}) {
  const [cell, setCell] = useState(SIZES[0]);

  return (
    <figure aria-labelledby={name} className={well}>
      <Slot seed={seed} cell={cell} label={sceneLabels.label} />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 lg:px-16">
        <p className="min-w-0 text-muted-foreground first-letter:uppercase">
          {createScene(seed).name}
        </p>
        {/* the label goes over the sizes when a narrow phone can't fit both */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden className="text-muted-foreground">
            {label}
          </span>
          <Segmented
            name={`${name}-size`}
            label={label}
            options={SIZES}
            unit="px"
            value={cell}
            onChange={setCell}
          />
        </div>
      </div>
    </figure>
  );
}
