import { withInternationalization } from "better-intl/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,

  typedRoutes: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },

  partialPrefetching: true,
  experimental: {
    turbopackRustReactCompiler: true, // use the Rust version, instead of the OG Babel one
  },
};

export default withInternationalization(nextConfig);
