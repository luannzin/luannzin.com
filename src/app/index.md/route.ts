import { site } from "@/lib/site";
import { formatDate, getPosts } from "@/lib/writing";

// The home page as plain markdown, for agents (also served at /llms.txt).
// The bio and projects repeat the home page's; keep the two in step.
export function GET() {
  const text = `# Luan Fabri

> Front-end engineer at Loopscape

I'm a front-end engineer at [Loopscape](https://loopscape.com.br), I build ERPs and multi-tenant platforms with React and Next.js: software people spend their whole workday in. I care about the details that make it fast and clear to use.

On the side, I build open source tools for problems I keep running into. You can see my code on [GitHub](https://github.com/luannzin), follow along on [X](https://x.com/__luannzin), or find me on [LinkedIn](https://linkedin.com/in/luannzin).

## Projects

- [echo](https://useecho.dev) — The note taker that learns with you
- [better-intl](https://github.com/luannzin/better-intl) — Typed, file-based i18n for Next.js

## Writing

${getPosts()
  .map(
    (p) =>
      `- [${p.title}](${site}/writing/${p.slug}.md) — ${p.description} (${formatDate(p.date)})`,
  )
  .join("\n")}

## Links

- Website: ${site}
- GitHub: https://github.com/luannzin
- X: https://x.com/__luannzin
- LinkedIn: https://linkedin.com/in/luannzin
`;
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
