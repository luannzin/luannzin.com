import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPosts } from "@/lib/writing";

// The pages only: the markdown twins point at these as their canonical.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().map((post) => ({
    url: `${site}/writing/${post.slug}`,
    lastModified: post.updated ?? post.date,
  }));
  return [
    { url: site, lastModified: posts[0]?.lastModified },
    { url: `${site}/lab` },
    { url: `${site}/lab/motion` },
    { url: `${site}/lab/bug-hunt` },
    { url: `${site}/cv` },
    ...posts,
  ];
}
