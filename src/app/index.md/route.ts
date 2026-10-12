import { translations } from "@/i18n/generated";
import { site } from "@/lib/site";
import { formatDate, getPosts } from "@/lib/writing";

// The home page as plain markdown, for agents (also served at /llms.txt).
// The bio and projects repeat the home page's; keep the two in step.
export function GET() {
  const lab = translations.en.app.lab;
  const text = `# Luan Fabri

> Luan Fabri (luannzin), front-end engineer at Loopscape, and the author of the open source tools echo and better-intl.

I'm a front-end engineer at [Loopscape](https://loopscape.com.br), where since 2023 I've been building ERPs and multi-tenant platforms with React and Next.js. It's software people spend their whole workday in, so I pay a lot of attention to the details that make it fast and clear to use.

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

## Lab

- [${lab.row}](${site}/lab.md) — ${lab.rowDescription}

## Links

- Website: ${site}
- GitHub: https://github.com/luannzin
- X: https://x.com/__luannzin
- LinkedIn: https://linkedin.com/in/luannzin
`;
  // the home page is the copy to index; this one is for reading
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${site}/>; rel="canonical"`,
    },
  });
}
