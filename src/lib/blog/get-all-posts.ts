import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PATH_TO_BLOG } from "@/config/constants/blog";
import type { Post } from "@/types/post";

const BLOG_PATH = path.join(process.cwd(), PATH_TO_BLOG);

export function getAllPosts(): Post[] {
  const locales = fs
    .readdirSync(BLOG_PATH, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const posts: Post[] = [];

  for (const localeDir of locales) {
    const localePath = path.join(BLOG_PATH, localeDir.name);

    const entries = fs.readdirSync(localePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(md|mdx)$/.test(entry.name)) continue;

      const postPath = path.join(localePath, entry.name);
      const raw = fs.readFileSync(postPath, "utf8");
      const { data } = matter(raw);

      posts.push({
        slug: path.parse(entry.name).name,
        locale: localeDir.name,
        title: data.title ?? "",
        description: data.description ?? "",
        cover: data.cover ?? "",
        publishedAt: data.publishedAt ?? "",
        author: data.author ?? "",
        tags: data.tags ?? [],
        rating: data.rating,
      });
    }
  }

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
