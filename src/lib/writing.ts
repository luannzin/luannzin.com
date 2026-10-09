import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { seedFrom } from "@/lib/scene";

const dir = path.join(process.cwd(), "src/content/writing");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  seed: number;
  body: string;
};

// ponytail: flat `key: value` frontmatter only; swap in a YAML parser if a
// post ever needs lists or nesting.
function parse(slug: string, source: string): Post {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data: Record<string, string> = {};
  for (const line of match?.[1].split(/\r?\n/) ?? []) {
    const at = line.indexOf(":");
    if (at > 0) {
      data[line.slice(0, at).trim()] = line
        .slice(at + 1)
        .trim()
        .replace(/^(["'])(.*)\1$/, "$2");
    }
  }
  if (!data.title || !data.date) {
    throw new Error(`${slug}.md needs a title and a date in its frontmatter`);
  }
  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: data.date,
    seed: seedFrom(data.seed ? Number(data.seed) || data.seed : slug),
    body: source.slice(match?.[0].length ?? 0),
  };
}

// Read synchronously at build time: posts are part of the static shell.
export function getPosts(): Post[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) =>
      parse(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8")),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
