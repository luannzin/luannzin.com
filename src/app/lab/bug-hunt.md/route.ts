import { translations } from "@/i18n/generated";
import { markdownTwin, site } from "@/lib/site";

// Bug hunt as plain markdown, for agents: what the game is and how it's made.
// The game itself only runs on the page.
export function GET() {
  const game = translations.en.app.lab.game;
  const { keys, made } = game;
  const text = `# ${game.title}

> ${game.subtitle}. Playable at ${site}/lab/bug-hunt

${game.intro}

Keys: arrows to ${keys.move}, up to ${keys.jump}, down and up to ${keys.drop}, J to ${keys.punch}, K to ${keys.throw}, L for the ${keys.special}. Touch screens get buttons.

## ${made.title}

${made.p1}

${made.p2}

${made.p3}
`;
  return markdownTwin(text, "/lab/bug-hunt");
}
