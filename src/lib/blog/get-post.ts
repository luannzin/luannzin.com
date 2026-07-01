import fs from "node:fs";
import matter from "gray-matter";

export function getPost(path: string) {
  const rootPath = `${process.cwd()}/`;

  const file = fs.readFileSync(rootPath + path, "utf8");

  const { content, data } = matter(file);

  return {
    content,
    frontmatter: data,
  };
}
