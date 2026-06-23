import type { Route } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/config/blog";
import { formatToLocalDate } from "@/lib/helpers/formatters/format-to-local-date";

const Blog = () => {
  return (
    <div className="flex flex-col gap-4">
      <span>Writing</span>
      {BLOG_POSTS.map((post) => {
        const date = formatToLocalDate(post.date);

        return (
          <div
            key={post.slug}
            className="flex items-center gap-2 justify-between"
          >
            <Link
              href={`/blog/${post.slug}` as Route}
              className="underline block w-fit"
            >
              <div className="flex items-center gap-2">
                <div className="bg-foreground size-1" />
                <span className="font-medium">{post.title}</span>
              </div>
            </Link>
            <span className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat(undefined, {
                month: "long",
                day: "numeric",
              }).format(date)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export { Blog };
