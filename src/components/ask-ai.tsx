import type { ComponentType, SVGProps } from "react";
import {
  ChatGPTIcon,
  ClaudeIcon,
  GrokIcon,
  PerplexityIcon,
} from "@/components/icons";

const assistants: [string, string, ComponentType<SVGProps<SVGSVGElement>>][] =
  [
    ["ChatGPT", "https://chatgpt.com/", ChatGPTIcon],
    ["Claude", "https://claude.ai/new", ClaudeIcon],
    ["Perplexity", "https://www.perplexity.ai/search", PerplexityIcon],
    ["Grok", "https://grok.com/", GrokIcon],
  ];

// Opens `prompt` in each assistant; all four read it from `?q=`. The visible
// label is folded into each link's name, so screen readers hear it once per
// link instead of as a stray line.
export function AskAI({
  label,
  prompt,
  className = "",
}: {
  label: string;
  prompt: string;
  className?: string;
}) {
  const query = new URLSearchParams({ q: prompt });

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      <p aria-hidden className="text-muted-foreground">
        {label}
      </p>
      <ul className="flex gap-2">
        {assistants.map(([name, url, Icon]) => (
          <li key={name}>
            <a
              href={`${url}?${query}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} ${name}`}
              title={name}
              className="grid size-8 place-items-center rounded-[8px] bg-muted text-muted-foreground inset-ring inset-ring-border outline-offset-2 transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96]"
            >
              <Icon className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
