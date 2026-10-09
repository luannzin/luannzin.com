import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Markdown twins for agents: /index.md is the home page, also at the
  // llms.txt convention's path; each post sits beside its page as .md.
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/index.md" },
      { source: "/writing/:slug\\.md", destination: "/writing/:slug/md" },
    ];
  },
  images: {
    remotePatterns: [new URL("https://github.com/luannzin.png")],
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

export default nextConfig;
