import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { PATH_TO_BLOG } from "@/config/constants/blog";
import type { Post } from "@/types/post";

const BLOG_PATH = path.join(process.cwd(), PATH_TO_BLOG);

export function getAllPosts(): Post[] {
  const entries = fs
    .readdirSync(BLOG_PATH, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

  const posts: Post[] = entries.map((entry) => {
    const filePath = path.join(BLOG_PATH, entry.name);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    return {
      slug: entry.name.replace(/\.md$/, ""),
      title: data.title ?? "",
      description: data.description ?? "",
      cover: data.cover ?? "",
      publishedAt: data.publishedAt ?? "",
      author: data.author ?? "",
      tags: data.tags ?? [],
      rating: data.rating,
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
