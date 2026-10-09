import { plainMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";
import { formatDate, getPost, getPosts } from "@/lib/writing";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

// A post as plain markdown, for agents; served at /writing/[slug].md by a
// rewrite in next.config.ts.
export async function GET(
  _: Request,
  { params }: RouteContext<"/writing/[slug]/md">,
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const text = `# ${post.title}

> ${post.description}
>
> By Luan Fabri, ${formatDate(post.date)}. Source: ${site}/writing/${slug}. The live scenes are only on the page.

${plainMarkdown(post.body).trim()}
`;
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
