// The canonical origin, for links that leave the site (share intents, AI
// prompts), so they point at production even from a dev server. www is the
// host Vercel serves; the bare domain redirects to it, and some agents won't
// follow a redirect to another host.
export const site = "https://www.luannzin.com";

export const description =
  "Front-end engineer at Loopscape. Building ERPs and multi-tenant platforms with React and Next.js, plus open source tools like echo and better-intl.";

// The author's other profiles, for rel="me" links and structured data.
export const profiles = {
  github: "https://github.com/luannzin",
  x: "https://x.com/__luannzin",
  linkedin: "https://linkedin.com/in/luannzin",
};

// Shared by every page's Open Graph tags: a page that sets its own replaces
// the layout's whole object, so it spreads this back in.
export const openGraph = { siteName: "Luan Fabri", locale: "en_US" };
