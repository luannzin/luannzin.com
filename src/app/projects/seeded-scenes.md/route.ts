import { translations } from "@/i18n/generated";
import { markdownTwin, site } from "@/lib/site";
import { getPost } from "@/lib/writing";

// Seeded scenes as plain markdown, for agents: what the engine does and what
// the page lets you try. The scenes themselves only run on the page.
export function GET() {
  const copy = translations.en.app.projects.scenes;
  const art = getPost("art-from-a-seed");
  const places = Object.values(copy.place)
    .map(({ name, times, stands }) => `| ${name} | ${times} | ${stands} |`)
    .join("\n");
  const text = `# ${copy.title}

> ${copy.subtitle}, to play with: live scenes, a timing sheet and the post with the code. ${site}/projects/seeded-scenes

${copy.intro}

${copy.melt}

## ${copy.examples.title}

${copy.examples.p}

## ${copy.places.title}

${copy.places.p}

| ${copy.places.label} | ${copy.places.drawnAt} | ${copy.places.stands} |
| --- | --- | --- |
${places}

## ${copy.dots.title}

${copy.dots.p}

## ${copy.story.title}

${copy.story.p}${art ? ` [${art.title}](${site}/writing/${art.slug}.md)` : ""}
`;
  return markdownTwin(text, "/projects/seeded-scenes");
}
