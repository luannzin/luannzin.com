import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { seedFrom } from "@/lib/scene";

const dir = path.join(process.cwd(), "src/content/writing");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  // optional: when the post last changed, and a title and description for
  // search results and shares when the post's own are too short to say what
  // it is about there
  updated?: string;
  metaTitle?: string;
  metaDescription?: string;
  // the origin of the line the post is about (https://deskline.luannzin.com),
  // for structured data
  about?: string;
  seed: number;
  body: string;
  minutes: number;
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
  const body = source.slice(match?.[0].length ?? 0);
  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: data.date,
    updated: data.updated,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    about: data.about,
    seed: seedFrom(data.seed ? Number(data.seed) || data.seed : slug),
    body,
    // reading time, at 220 words a minute
    minutes: Math.max(
      1,
      Math.round(body.split(/\s+/).filter(Boolean).length / 220),
    ),
  };
}

// English posts sit in the folder; a translation sits in the subfolder named
// for its locale (`pt/<slug>.md`), and a post without one is read in English.
export function getPosts(locale = "en"): Post[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const translated = path.join(dir, locale, file);
      const source = existsSync(translated) ? translated : path.join(dir, file);
      return parse(file.slice(0, -3), readFileSync(source, "utf8"));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Whether a post has its own translation (else that language reads English).
export const isTranslated = (slug: string, locale: string) =>
  existsSync(path.join(dir, locale, `${slug}.md`));

export function getPost(slug: string, locale?: string): Post | undefined {
  return getPosts(locale).find((post) => post.slug === slug);
}

export function formatDate(date: string, locale = "en-US") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
