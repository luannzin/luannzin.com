import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Every crawler is welcome, AI ones included: the markdown twins and
// llms.txt exist for them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site}/sitemap.xml`,
  };
}
