import { ImageResponse } from "next/og";
import { createScene, RADIUS, renderer, START, viewOf } from "@/lib/scene";
import { getPost, getPosts } from "@/lib/writing";

// 18 dots across, like the live tile; drawn at 3x its 44px
const COLS = 18;
const PX = 132;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

// A post's home page tile as a still picture, built with the site: the first
// frame of its scene, cropped round the landmark, one round dot a cell as the
// GPU draws it. The live scene only loads on hover or focus.
export async function GET(
  _: Request,
  { params }: RouteContext<"/writing/[slug]/tile.png">,
) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  const scene = createScene(post.seed);
  const frame = renderer(scene, COLS, COLS, viewOf(scene, true))(START);
  const dots = [];
  for (let k = 0; k < COLS * COLS; k++) {
    const step = frame[k * 4 + 3];
    if (!step) continue;
    dots.push(
      <circle
        key={k}
        cx={(k % COLS) + 0.5}
        cy={Math.floor(k / COLS) + 0.5}
        r={RADIUS[step]}
        fill={`rgb(${frame[k * 4]},${frame[k * 4 + 1]},${frame[k * 4 + 2]})`}
      />,
    );
  }
  return new ImageResponse(
    // biome-ignore lint/a11y/noSvgWithoutTitle: drawn into a PNG by next/og, never served as markup
    <svg
      viewBox={`0 0 ${COLS} ${COLS}`}
      width={PX}
      height={PX}
      style={{ background: scene.time.ground }}
    >
      {dots}
    </svg>,
    { width: PX, height: PX },
  );
}
