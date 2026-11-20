import { translations } from "@/i18n/generated";
import { markdownTwin, site } from "@/lib/site";

// The Lab's index as plain markdown, for agents: its pieces and their twins.
export function GET() {
  const lab = translations.en.app.lab;
  const text = `# ${lab.title}

> ${lab.subtitle}. ${site}/lab

${lab.intro}

- [${lab.motion.title}](${site}/lab/motion.md) — ${lab.motion.rowDescription}
`;
  return markdownTwin(text, "/lab");
}
