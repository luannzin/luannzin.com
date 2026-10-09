import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { highlight } from "sugar-high";
import { lang } from "sugar-high/lang";
import { createScene } from "@/lib/scene";
import { site } from "@/lib/site";

export type Heading = { id: string; text: string; depth: 2 | 3 };

function slugify(text: string) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

const escapeHtml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// --- code ----------------------------------------------------------------

// The fence itself when it is short ("ts", "tsx", "css"); a name otherwise.
const BADGE: Record<string, string> = {
  typescript: "TS",
  javascript: "JS",
  shell: "SH",
  markdown: "MD",
};
const LANGUAGE: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "JSON",
  css: "CSS",
  html: "HTML",
  shell: "Shell",
  markdown: "Markdown",
  plaintext: "Text",
};

// "{1,4-6}" to the set of line numbers it names
function ranges(spec?: string) {
  const lines = new Set<number>();
  for (const part of spec?.split(",") ?? []) {
    const [a, b = a] = part.split("-").map((n) => Number(n.trim()));
    for (let n = a; n <= b; n++) if (n > 0) lines.add(n);
  }
  return lines;
}

// ```ts title="src/lib/scene.ts" {3-5}: a file name, marked lines, a copy
// button (mounted on the client into its placeholder) and line numbers.
function codeBlock(text: string, info: string) {
  const [fence = "", ...rest] = info.trim().split(/\s+/);
  const meta = rest.join(" ");
  const name = lang(fence) ?? "plaintext";
  const title =
    meta.match(/title="([^"]+)"/)?.[1] ??
    (rest[0] && !/[={]/.test(rest[0]) ? rest[0] : undefined);
  const marked = ranges(meta.match(/\{([\d,\s-]+)\}/)?.[1]);
  let line = 0;
  const html = highlight(text, { lang: name }).replace(
    /<span class="sh__line">/g,
    () =>
      marked.has(++line)
        ? '<span class="sh__line" data-mark>'
        : '<span class="sh__line">',
  );
  const badge =
    fence && fence.length <= 4 ? fence.toUpperCase() : (BADGE[name] ?? "TXT");
  return `<figure class="code"${line > 1 ? " data-lines" : ""}><figcaption><span class="code-badge" aria-hidden="true">${escapeHtml(badge)}</span><span class="code-title">${escapeHtml(title ?? LANGUAGE[name] ?? fence)}</span><span data-island="copy"></span></figcaption><pre><code>${html}</code></pre></figure>`;
}

// --- flow diagrams -------------------------------------------------------

// Central-style strokes, 24 grid, 1.5px, drawn as markup for the static HTML.
const ICONS: Record<string, string> = {
  hash: '<path d="M9.75 4.75L8.25 19.25M15.75 4.75L14.25 19.25M5.75 9.25H19.25M4.75 14.75H18.25"/>',
  layers:
    '<path d="M12 4.75L19.25 8.5L12 12.25L4.75 8.5L12 4.75Z"/><path d="M4.75 12L12 15.75L19.25 12"/><path d="M4.75 15.5L12 19.25L19.25 15.5"/>',
  grid: '<rect x="4.75" y="4.75" width="5.5" height="5.5" rx="1.5"/><rect x="13.75" y="4.75" width="5.5" height="5.5" rx="1.5"/><rect x="4.75" y="13.75" width="5.5" height="5.5" rx="1.5"/><rect x="13.75" y="13.75" width="5.5" height="5.5" rx="1.5"/>',
  image:
    '<rect x="4.75" y="4.75" width="14.5" height="14.5" rx="2"/><path d="M4.75 15.25L8.75 11.25L13.25 15.75"/><path d="M12.25 14.75L14.75 12.25L19.25 16.75"/><circle cx="15" cy="8.75" r="1.25"/>',
  file: '<path d="M13.25 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9.75L13.25 4.75Z"/><path d="M13.25 4.75V9.75H18.25"/>',
};

const icon = (name = "") =>
  `<span class="flow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ICONS.file}</svg></span>`;

type Node = {
  title: string;
  note: string;
  icon: string;
  lit: boolean;
  label?: string;
};

// ```flow: one node a line, "title | note | icon | lit"; a line without a
// pipe labels the arrow after the node above it.
function flowNodes(text: string) {
  const nodes: Node[] = [];
  let label: string | undefined;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (!line.includes("|")) {
      label = line;
      continue;
    }
    const [title = "", note = "", name = "", flag = ""] = line
      .split("|")
      .map((s) => s.trim());
    nodes.push({ title, note, icon: name, lit: flag === "lit", label });
    label = undefined;
  }
  return nodes;
}

// Nodes run two a row, and the arrow turns down to the next row, like reading.
function flowBlock(text: string) {
  const nodes = flowNodes(text);
  const node = (n: Node) =>
    `<div class="flow-node"${n.lit ? " data-lit" : ""}>${icon(n.icon)}<span class="flow-text"><span class="flow-title">${escapeHtml(n.title)}</span>${n.note ? `<span class="flow-note">${escapeHtml(n.note)}</span>` : ""}</span></div>`;
  const marks = '<i class="flow-dot"></i><i class="flow-head"></i>';
  const arrow = (text?: string) =>
    `<span class="flow-arrow" aria-hidden="true">${marks}${text ? `<span class="flow-label">${escapeHtml(text)}</span>` : ""}</span>`;
  let html = "";
  for (let i = 0; i < nodes.length; i += 2) {
    if (i > 0)
      html += `<div class="flow-turn" aria-hidden="true">${marks}${nodes[i].label ? `<span class="flow-label">${escapeHtml(nodes[i].label as string)}</span>` : ""}</div>`;
    const pair = nodes.slice(i, i + 2);
    html += `<div class="flow-row">${node(pair[0])}${pair[1] ? arrow(pair[1].label) + node(pair[1]) : ""}</div>`;
  }
  const summary = nodes.map((n) => n.title).join(", then ");
  return `<figure class="flow" role="img" aria-label="${escapeHtml(`Diagram: ${summary}`)}">${html}</figure>`;
}

const seedsOf = (text: string) =>
  text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite);

// ```scenes: seeds, mounted as live scenes on the client.
function scenesBlock(text: string) {
  const cards = seedsOf(text)
    .map((seed) => {
      const { name, time } = createScene(seed);
      return `<figure class="scene-card" data-hover-play><div class="scene-slot" data-island="scene" data-seed="${seed}" role="img" aria-label="${escapeHtml(`An animated scene drawn in dots: ${name}`)}" style="background:${time.ground}"></div><figcaption>${escapeHtml(name)}</figcaption></figure>`;
    })
    .join("");
  return `<div class="scenes">${cards}</div>`;
}

// ```roll: one seed, drawn live on the client with a button that draws
// another. Until then, its ground and its name hold the place.
function rollBlock(text: string) {
  const seed = Number(text.trim()) >>> 0;
  const { name, time } = createScene(seed);
  return `<figure class="scene-roll" data-island="roll" data-seed="${seed}"><div class="scene-slot" role="img" aria-label="${escapeHtml(`An animated scene drawn in dots: ${name}`)}" style="background:${time.ground}"></div><figcaption><span>${escapeHtml(name)}</span></figcaption></figure>`;
}

// --- images --------------------------------------------------------------

// Width and height of a PNG in public/, so the frame reserves its space.
function pngSize(href: string) {
  if (!href.startsWith("/") || !href.endsWith(".png")) return "";
  try {
    const head = readFileSync(
      path.join(process.cwd(), "public", href),
    ).subarray(16, 24);
    return ` width="${head.readUInt32BE(0) / 2}" height="${head.readUInt32BE(4) / 2}"`;
  } catch {
    return "";
  }
}

// Markdown to HTML at build time. Posts live in the repo, so their HTML is
// trusted. h2 and h3 get ids and a "#" link, and become the table of contents.
export function renderMarkdown(source: string) {
  const toc: Heading[] = [];
  const used = new Map<string, number>();

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const html = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${html}</h${depth}>`;
        const base = slugify(text) || "section";
        const count = used.get(base) ?? 0;
        used.set(base, count + 1);
        const id = count ? `${base}-${count}` : base;
        toc.push({
          id,
          text: this.parser.parseInline(tokens, this.parser.textRenderer),
          depth,
        });
        return `<h${depth} id="${id}"><a href="#${id}">${html}</a></h${depth}>`;
      },
      code({ text, lang: info = "" }) {
        const fence = info.trim().split(/\s+/)[0];
        if (fence === "flow") return flowBlock(text);
        if (fence === "scenes") return scenesBlock(text);
        if (fence === "roll") return rollBlock(text);
        return codeBlock(text, info);
      },
      // An image alone in its paragraph becomes a framed figure; its title is
      // the caption. Images are drawn at 2x, so their size is halved.
      paragraph({ tokens }) {
        const [only] = tokens;
        if (tokens.length !== 1 || only.type !== "image") return false;
        const { href, text, title } = only as Tokens.Image;
        return `<figure class="frame"><div class="frame-media"><img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${pngSize(href)} loading="lazy" decoding="async"></div>${title ? `<figcaption>${escapeHtml(title)}</figcaption>` : ""}</figure>`;
      },
      link({ href, tokens }) {
        const external = /^https?:\/\//.test(href);
        const attrs = external
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return `<a href="${href}"${attrs}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });

  const html = marked.parse(source, { async: false });
  const words = source.split(/\s+/).filter(Boolean).length;
  return { html, toc, minutes: Math.max(1, Math.round(words / 220)) };
}

// The post as plain markdown for agents (`/writing/[slug].md`): the blocks
// only the page can draw become text, and links into the site go absolute.
export function plainMarkdown(source: string) {
  return source
    .replace(
      /^```(flow|scenes|roll)[^\n]*\n([\s\S]*?)^```[ \t\r]*$/gm,
      (_, fence: string, text: string) => {
        if (fence === "flow") {
          return flowNodes(text)
            .map(
              (n, i) =>
                `${i + 1}. ${n.title}${n.label ? `, via ${n.label}` : ""}${n.note ? `: ${n.note}` : ""}`,
            )
            .join("\n");
        }
        const names = seedsOf(text).map((seed) => createScene(seed).name);
        return fence === "roll"
          ? `*A live scene, with a button that draws another: ${names[0]}.*`
          : `*Live scenes: ${names.join(", ")}.*`;
      },
    )
    .replace(/\]\(\//g, `](${site}/`);
}
