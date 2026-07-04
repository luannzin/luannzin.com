import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PATH_TO_BLOG } from "@/config/constants/blog";
import { getLocale } from "@/i18n/generated";
import type { Post } from "@/types/post";

const BLOG_PATH = path.join(process.cwd(), PATH_TO_BLOG);

export function getAllPosts(): Post[] {
  const locale = getLocale();
  const localePath = path.join(BLOG_PATH, locale);

  if (!fs.existsSync(localePath)) return [];

  const posts: Post[] = [];
  const entries = fs.readdirSync(localePath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(md|mdx)$/.test(entry.name)) continue;

    const postPath = path.join(localePath, entry.name);
    const raw = fs.readFileSync(postPath, "utf8");
    const { data } = matter(raw);

    posts.push({
      slug: path.parse(entry.name).name,
      locale,
      title: data.title ?? "",
      description: data.description ?? "",
      cover: data.cover ?? "",
      publishedAt: data.publishedAt ?? "",
      author: data.author ?? "",
      tags: data.tags ?? [],
      rating: data.rating,
    });
  }

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
