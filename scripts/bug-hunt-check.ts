// Grows a few thousand Bug hunt levels and checks each can be finished:
// every step and gap is jumpable, decks leave room under them, crawlers stand
// on something and the exit sits on flat floor. Run: bun scripts/bug-hunt-check.ts
import {
  END,
  GAP,
  makeLevel,
  PIT,
  START,
  STEP,
  TILE,
} from "../src/lib/bug-hunt/level";

let levels = 0;
for (let seed = 0; seed < 300; seed++) {
  for (let number = 1; number <= 12; number++) {
    const level = makeLevel(number, seed);
    const { surface, cols, decks, bugs, exit } = level;
    const where = `seed ${seed}, level ${number}`;
    const fail = (why: string) => {
      throw new Error(`${where}: ${why}`);
    };
    if (surface.length !== cols) fail("surface is not one row per column");
    for (let c = 0; c < START; c++) {
      if (surface[c] !== surface[0] || surface[c] === PIT)
        fail("start not flat");
    }
    for (let c = exit - 2; c < cols; c++) {
      if (surface[c] === PIT || surface[c] !== surface[cols - 1]) {
        fail("exit not on flat floor");
      }
    }
    let last = surface[0];
    let gap = 0;
    for (let c = 1; c < cols; c++) {
      if (surface[c] === PIT) {
        if (++gap > GAP) fail(`gap wider than ${GAP} at ${c}`);
        continue;
      }
      const climb = last - surface[c];
      if (climb > (gap ? 1 : STEP)) fail(`climb of ${climb} at ${c}`);
      last = surface[c];
      gap = 0;
    }
    for (const deck of decks) {
      for (let c = deck.col - 1; c <= deck.col + deck.w; c++) {
        if (surface[c] < deck.row + 2) fail(`no room under the deck at ${c}`);
      }
    }
    if (bugs.length < 4) fail(`only ${bugs.length} bugs`);
    for (const bug of bugs) {
      if (bug.kind === "flyer") continue;
      const c = Math.floor(bug.x / TILE);
      const row = bug.y / TILE;
      const deck = decks.some(
        (d) => d.row === row && c >= d.col && c < d.col + d.w,
      );
      if (surface[c] !== row && !deck) fail(`crawler in the air at ${c}`);
      if (c < START) fail("crawler at the start");
    }
    if (exit >= cols - 2 || exit < cols - END) fail("exit out of place");
    levels++;
  }
}
console.log(`${levels} levels grown, all finishable`);
