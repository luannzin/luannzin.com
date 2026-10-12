import { translations } from "@/i18n/generated";
import { site } from "@/lib/site";
import { getPost } from "@/lib/writing";

// The Lab as plain markdown, for agents: what each piece is and how it works.
// The pieces themselves only run on the page.
export function GET() {
  const lab = translations.en.app.lab;
  const art = getPost("art-from-a-seed");
  const pieces = (["scenes", "die", "hint", "reveal"] as const)
    .map((id) => {
      const { title, p1, p2 } = lab[id];
      const more =
        id === "scenes" && art
          ? `[${art.title}](${site}/writing/${art.slug}.md).`
          : "";
      return `## ${title}\n\n${p1}\n\n${p2}${more}`;
    })
    .join("\n\n");
  const text = `# ${lab.title}

> ${lab.subtitle}. The pieces run live, each with a timing sheet, at ${site}/lab

${pieces}
`;
  // the page is the copy to index; this one is for reading
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${site}/lab>; rel="canonical"`,
    },
  });
}
