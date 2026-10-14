import { sceneTile } from "@/lib/scene-tile";
import { getPost, getPosts } from "@/lib/writing";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

// A post's home page tile: the first frame of its scene, cropped round the
// landmark.
export async function GET(
  _: Request,
  { params }: RouteContext<"/writing/[slug]/tile.png">,
) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return sceneTile(post.seed);
}
