import { POOL } from "@/lib/scene-image";

// A moving scene picked at random from the pool drawn before the build
// (`scripts/scene-loops.ts`): the picture on top of Luan's GitHub profile.
// Same caching as /random-scene.png: the CDN keeps one for a minute and then
// serves it while it fetches the next.
export async function GET(request: Request) {
  const n = Math.floor(Math.random() * POOL);
  const scene = await fetch(new URL(`/scene-loop/${n}.webp`, request.url));
  return new Response(scene.body, {
    status: scene.status,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control":
        "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
