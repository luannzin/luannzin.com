import type { MetadataRoute } from "next";
import { localized, site } from "@/lib/site";
import { getPosts, isTranslated } from "@/lib/writing";

// The pages only: the markdown twins point at these as their canonical. Each
// page is listed in English and at its /pt address, both naming the other
// (hreflang), except a post with no translation.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const pages: [string, string | undefined, boolean][] = [
    ["/", posts[0]?.updated ?? posts[0]?.date, true],
    ["/projects/seeded-scenes", undefined, true],
    ["/lab", undefined, true],
    ["/lab/motion", undefined, true],
    ["/cv", undefined, true],
    ...posts.map((post): [string, string, boolean] => [
      `/writing/${post.slug}`,
      post.updated ?? post.date,
      isTranslated(post.slug, "pt"),
    ]),
  ];
  return pages.flatMap(([path, lastModified, translated]) => {
    const url = (locale: string) =>
      `${site}${localized(path, locale)}`.replace(/\/$/, "");
    if (!translated) return [{ url: url("en"), lastModified }];
    const alternates = { languages: { en: url("en"), pt: url("pt") } };
    return ["en", "pt"].map((locale) => ({
      url: url(locale),
      lastModified,
      alternates,
    }));
  });
}
