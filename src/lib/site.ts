// The canonical origin, for links that leave the site (share intents, AI
// prompts), so they point at production even from a dev server. www is the
// host Vercel serves; the bare domain redirects to it, and some agents won't
// follow a redirect to another host.
export const site = "https://www.luannzin.com";

// The author's other profiles, for rel="me" links and structured data.
export const profiles = {
  github: "https://github.com/luannzin",
  x: "https://x.com/__luannzin",
  linkedin: "https://linkedin.com/in/luannzin",
};

// Public contact, on the CV only (user decision: email yes, phone never).
export const email = "luandaniel966@gmail.com";

// The CV as PDFs, printed from /cv by scripts/cv-pdf.mjs into public/.
export const cvPdf = {
  en: "/cv/luan-fabri-cv.pdf",
  pt: "/cv/luan-fabri-curriculo.pdf",
};

// Shared by every page's Open Graph tags: a page that sets its own replaces
// the layout's whole object, so it spreads this back in (and adds the locale).
export const openGraph = { siteName: "Luan Fabri" };

// A markdown twin for agents: text/plain, since some fetchers (ChatGPT's)
// refuse text/markdown, pointing at its page as the copy to index.
export const markdownTwin = (text: string, page: string) =>
  new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${site}${page}>; rel="canonical"`,
    },
  });
