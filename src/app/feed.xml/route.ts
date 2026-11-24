import { site } from "@/lib/site";
import { getPosts } from "@/lib/writing";

// The writing as RSS, for feed readers and for sites that import a feed
// (dev.to can import one and keep each post's address here as its
// canonical). English, like the markdown twins: a feed reader sends no locale.
const xml = (text: string) =>
  text.replace(
    /[<>&"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] ?? c,
  );

export function GET() {
  const items = getPosts()
    .map((post) => {
      const url = `${site}/writing/${post.slug}`;
      return `<item>
<title>${xml(post.title)}</title>
<link>${url}</link>
<guid>${url}</guid>
<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${xml(post.metaDescription ?? post.description)}</description>
</item>`;
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Luan Fabri</title>
<link>${site}</link>
<description>Writing by Luan Fabri, front-end engineer</description>
<language>en</language>
<atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
