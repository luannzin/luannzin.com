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
  const company = "Loopvet / Loopscape";
  const text = `# Luan Fabri

> ${home.role}. ${cv.place}. ${email} · ${profiles.linkedin} · ${profiles.github}. PDF: ${site}${cvPdf.en}

${cv.summary}

## ${cv.sections.experience}

### ${cv.roles.mid.title}

${company} · Feb 2025 – ${cv.present}

${list(cv.roles.mid)}

### ${cv.roles.junior.title}

${company} · Jun 2023 – Feb 2025

${list(cv.roles.junior)}

### ${cv.roles.intern.title}

${company} · Mar 2023 – Jun 2023

${list(cv.roles.intern)}

## ${cv.sections.projects}

${(["comms", "church", "academic"] as const)
  .map((id) => `### ${cv.projects[id].title}\n\n${list(cv.projects[id])}`)
  .join("\n\n")}

## ${cv.sections.openSource}

- [echo](https://useecho.dev): ${home.echo}
- [better-intl](https://github.com/luannzin/better-intl): ${home.betterIntl}

## ${cv.sections.skills}

- ${cv.skills.front}: ${cv.skills.frontList}
- ${cv.skills.back}: ${cv.skills.backList}
- ${cv.skills.architecture}: ${cv.skills.architectureList}
- ${cv.skills.tools}: ${cv.skills.toolsList}

## ${cv.sections.education}

${cv.education.title}, ${cv.education.school} · Feb 2022 – Dec 2024

## ${cv.sections.languages}

${cv.languages}
`;
  return markdownTwin(text, "/cv");
}
