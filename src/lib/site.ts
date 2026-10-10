// The canonical origin, for links that leave the site (share intents, AI
// prompts), so they point at production even from a dev server. www is the
// host Vercel serves; the bare domain redirects to it, and some agents won't
// follow a redirect to another host.
export const site = "https://www.luannzin.com";
