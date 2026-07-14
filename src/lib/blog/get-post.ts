import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PATH_TO_BLOG } from "@/config/constants/blog";
import { setLocale } from "@/i18n/generated";
import type { Post } from "@/types/post";

export async function getPost(slug: string) {
  const locale = await setLocale();
  const localePath = path.join(PATH_TO_BLOG, locale);

  const file = fs.readFileSync(path.join(localePath, `${slug}.md`), "utf8");

  const { content, data } = matter(file);

  return {
    content,
    frontmatter: data as Post,
  };
}
