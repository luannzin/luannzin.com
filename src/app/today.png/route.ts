import { connection } from "next/server";
import { seedFrom } from "@/lib/scene";
import { sceneWide } from "@/lib/scene-png";

const DAY = 86400;
// São Paulo is UTC-3 all year (no daylight saving since 2019).
const OFFSET = -3 * 3600;

// Today's scene, grown from today's date in São Paulo: the picture on top of
// Luan's GitHub profile. It changes at midnight, so it's cached until then.
export async function GET() {
  await connection();
  const now = Math.floor(Date.now() / 1000) + OFFSET;
  const today = new Date(now * 1000).toISOString().slice(0, 10);
  const left = DAY - (now % DAY);
  return new Response(sceneWide(seedFrom(today)), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": `public, max-age=${left}, s-maxage=${left}, stale-while-revalidate=${DAY}`,
    },
  });
}
