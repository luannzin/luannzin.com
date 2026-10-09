import { Marked } from "marked";
import { highlight } from "sugar-high";
import { lang } from "sugar-high/lang";

export type Heading = { id: string; text: string; depth: 2 | 3 };

function slugify(text: string) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
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
      code({ text, lang: fence }) {
        const name = lang(fence?.split(/\s/)[0] ?? "") ?? "plaintext";
        return `<pre><code>${highlight(text, { lang: name })}</code></pre>`;
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
