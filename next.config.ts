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
