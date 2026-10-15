// The site's themes, in the dock's order: next-themes sets the one in use as
// a class on <html> (the system's light or dark until someone picks one, then
// whatever they picked, from localStorage).
export const themes = ["dark", "light", "dawn"] as const;

export type Theme = (typeof themes)[number];
