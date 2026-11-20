import { connection } from "next/server";
import { sceneWide } from "@/lib/scene-image";

// A still scene from a random seed: what Luan's GitHub profile shows instead
// of the moving one (/random-scene.webp) when the viewer asks for less motion.
// GitHub's image proxy follows these headers. The CDN keeps one for a minute
// and, past that, serves it instantly while it draws the next, so the proxy
// never waits on a render and the picture changes about once a minute.
export async function GET() {
  await connection();
  return new Response(sceneWide(Math.floor(Math.random() * 2 ** 32)), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control":
        "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
