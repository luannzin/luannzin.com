import { withInternationalization } from "better-intl/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  poweredByHeader: false,
  partialPrefetching: true,
  reactCompiler: true,
  // 95 for the avatar only: at 40px (96 on a 2x screen) the default 75 blurs
  // his illustrated portrait's lines.
  images: { qualities: [75, 95] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
  // There is no writing or projects index yet; the home page's lists are
  // them. Temporary, so a real index can take the address later.
  async redirects() {
    return [
      { source: "/writing", destination: "/#writing", permanent: false },
      { source: "/projects", destination: "/#projects", permanent: false },
      // Bug hunt, the Lab's platformer, is gone; its old links land on the Lab.
      { source: "/lab/bug-hunt", destination: "/lab", permanent: true },
      { source: "/lab/bug-hunt.md", destination: "/lab.md", permanent: true },
      // Deskline's post was first published as "A code nobody types".
      {
        source: "/writing/a-code-nobody-types",
        destination: "/writing/no-server-to-run",
        permanent: true,
      },
      {
        source: "/writing/a-code-nobody-types.md",
        destination: "/writing/no-server-to-run.md",
        permanent: true,
      },
      // Sightline's, as "Everything after the #".
      {
        source: "/writing/everything-after-the-hash",
        destination: "/writing/your-screen-as-a-link",
        permanent: true,
      },
      {
        source: "/writing/everything-after-the-hash.md",
        destination: "/writing/your-screen-as-a-link.md",
        permanent: true,
      },
    ];
  },
  // Markdown twins for agents: /index.md is the home page, also at the
  // llms.txt convention's path; each post sits beside its page as .md.
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/index.md" },
      { source: "/writing/:slug\\.md", destination: "/writing/:slug/md" },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Generates src/i18n/generated.ts from the t.ts files (intl.config.ts), and
// watches them in dev.
export default withInternationalization(nextConfig);
