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
  // text/plain, not text/markdown: some agents' fetchers (ChatGPT's) refuse
  // text/markdown, and every one of them reads plain text.
  // the page is the copy to index; this one is for reading
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${site}/writing/${slug}>; rel="canonical"`,
    },
  });
}
