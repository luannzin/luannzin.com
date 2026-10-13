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

Controls: A and D to ${keys.move}, W to ${keys.jump}, S to ${keys.crouch}, click to ${keys.punch}, S and click to ${keys.kick}, right click to ${keys.throw}, scroll click for the ${keys.special}, Esc to ${keys.pause}. ${keys.fallback} Touch screens get a joystick and buttons.

## ${made.title}

${made.p1}

${made.p2}
`;
  return markdownTwin(text, "/lab/bug-hunt");
}
