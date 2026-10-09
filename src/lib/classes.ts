// Shared motion and link treatments; DESIGN.md names both.

export const enter =
  "motion-safe:animate-in fade-in blur-in-4 slide-in-from-bottom-3 fill-mode-both duration-500 ease-[cubic-bezier(0.2,0,0,1)]";

// Frame around a 10px list tile: 4px gap, so 14px corners (Concentric Corner Rule).
export const bezel =
  "shrink-0 rounded-[14px] bg-foreground/2.5 p-1 inset-ring inset-ring-border transition-[box-shadow] duration-150 group-hover:inset-ring-foreground/10";

export const underline =
  "underline decoration-foreground/25 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150 group-hover:decoration-foreground/60";
