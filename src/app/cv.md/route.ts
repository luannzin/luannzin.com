import { translations } from "@/i18n/generated";
import { cvPdf, email, markdownTwin, profiles, site } from "@/lib/site";

// The CV as plain markdown, for agents; the page and the PDF say the same.
export function GET() {
  const { cv, home } = translations.en.app;
  const list = (copy: Record<string, unknown>) =>
    Object.entries(copy)
      .filter(([key]) => /^b\d+$/.test(key))
      .map(([, text]) => `- ${text}`)
      .join("\n");
  const groups = (["tools", "product", "church"] as const)
    .map((id) => `#### ${cv.groups[id].title}\n\n${list(cv.groups[id])}`)
    .join("\n\n");
  const text = `# Luan Fabri

> ${home.role}. ${cv.place}. ${email} · ${profiles.linkedin} · ${profiles.github}. PDF: ${site}${cvPdf.en}

${cv.summary}

${cv.summaryMore}

## ${cv.sections.experience}

### Loopscape

${cv.products}

- ${cv.roles.mid.title} · Feb 2025 – ${cv.present}
- ${cv.roles.junior.title} · Jun 2023 – Feb 2025
- ${cv.roles.intern.title} · Mar 2023 – Jun 2023

${groups}

## ${cv.sections.openSource}

- [Deskline](https://deskline.luannzin.com): ${cv.open.deskline}
- [Sightline](https://sightline.luannzin.com): ${cv.open.sightline}
- [Hostline](https://hostline.luannzin.com): ${cv.open.hostline}
- [PartyLine](https://github.com/luannzin/partyline): ${cv.open.partyline}
- [echo](https://useecho.dev): ${cv.open.echo}
- [better-intl](https://github.com/luannzin/better-intl): ${cv.open.betterIntl}

## ${cv.sections.projects}

- ${cv.projects.comms.title}: ${cv.projects.comms.text}
- ${cv.projects.academic.title}: ${cv.projects.academic.text}

## ${cv.sections.skills}

${(["languages", "front", "back", "data", "native", "ai", "other"] as const)
  .map((id) => `- ${cv.skills[id]}: ${cv.skills[`${id}List`]}`)
  .join("\n")}

## ${cv.sections.education}

${cv.education.title}, ${cv.education.school} · Feb 2022 – Dec 2024

## ${cv.sections.languages}

${cv.languages}
`;
  return markdownTwin(text, "/cv");
}
