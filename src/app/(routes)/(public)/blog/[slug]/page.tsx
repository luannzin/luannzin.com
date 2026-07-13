import type { Params } from "next/dist/server/request/params";
import { getPost } from "@/lib/blog/get-post";

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug as string);
  return {
    title: post.frontmatter?.title,
    description: post.frontmatter?.description,
    keywords: post.frontmatter?.tags,
    author: post.frontmatter?.author,
    date: post.frontmatter?.publishedAt,
    image: post.frontmatter?.cover,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await getPost(slug as string);

  return (
    <div>
      <h1>{post.frontmatter?.title}</h1>
    </div>
  );
}
