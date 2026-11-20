// Draws the pool of looping scenes that /random-scene.webp picks from, then
// copies it into public/scene-loop/<n>.webp (gitignored). Runs before
// `next build`. Drawing all of them takes about two minutes, so they're kept
// in .next/cache, which Vercel restores between builds: only a missing loop
// is drawn. Bump the folder's version when the loops' look changes.
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { seedFrom } from "@/lib/scene";
import { POOL, sceneLoop } from "@/lib/scene-image";

const cache = ".next/cache/scene-loop-v1";
mkdirSync(cache, { recursive: true });
for (let n = 0; n < POOL; n++) {
  const file = `${cache}/${n}.webp`;
  if (existsSync(file)) continue;
  writeFileSync(file, await sceneLoop(seedFrom(`loop-${n}`)));
}
cpSync(cache, "public/scene-loop", { recursive: true });
