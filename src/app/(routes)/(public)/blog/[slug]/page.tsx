import type { Params } from "next/dist/server/request/params";
import Link from "next/link";
import { SafeHtml } from "@/components/client/md/safe-html";

// import { t } from "@/i18n/generated";
import { getPost } from "@/lib/blog/get-post";
import { markdownToHtml } from "@/lib/blog/md/markdown-to-html";

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
  const { frontmatter, content } = await getPost(slug as string);

  const html = await markdownToHtml(content);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground no-underline w-fit"
      >
        {/* {t.components.modules.blog.back} */}
        Back to blog
      </Link>

      <div className="flex flex-col prose dark:prose-invert w-full max-w-full">
        <h1>{frontmatter?.title}</h1>
        {/* <div className="w-full aspect-video bg-muted rounded-md" /> */}
        <SafeHtml html={html} />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px w-full bg-linear-to-l from-transparent via-border to-border" />
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          {frontmatter?.author}
        </p>
        <div className="h-px w-full bg-linear-to-l from-border via-border to-transparent" />
      </div>
    </div>
  );
}
