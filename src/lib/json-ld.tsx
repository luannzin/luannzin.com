import avatar from "@/assets/avatar.jpg";
import { type Locale, translations } from "@/i18n/generated";
import { localized, profiles, site } from "@/lib/site";
import type { Post } from "@/lib/writing";

// Structured data: one Person, given an @id on the home page and pointed at
// from every post and from each line's own site (luannzin/lines), so search
// engines and AI tools read the site, the profiles, the apps and the writing
// as one author's.

const person = { "@id": `${site}/#person` };
const website = { "@id": `${site}/#website` };

// A line's app node on its own site has the @id `<origin>/#app`; here it's
// named and tied to its author, and a post about it points at the same @id.
const line = (origin: string, name: string, description: string) => ({
  "@type": "SoftwareApplication",
  "@id": `${origin}/#app`,
  name,
  url: origin,
  description,
  author: person,
});

export function home(locale: Locale) {
  const t = translations[locale].app.home;
  const url = `${site}${localized("/", locale)}`.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        ...website,
        url: site,
        name: "Luan Fabri",
        inLanguage: ["en", "pt-BR"],
        publisher: person,
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: translations[locale].app.meta.title,
        inLanguage: locale,
        isPartOf: website,
        mainEntity: {
          "@type": "Person",
          ...person,
          name: "Luan Fabri",
          alternateName: "luannzin",
          url: site,
          // hashed by content, so a new avatar is a new URL
          image: `${site}${avatar.src}`,
          jobTitle: "Front-end engineer",
          worksFor: {
            "@type": "Organization",
            name: "Loopscape",
            url: "https://loopscape.com.br",
          },
          knowsAbout: [
            "React",
            "Next.js",
            "TypeScript",
            "Front-end engineering",
            "Rust",
            "WebRTC",
            "Peer-to-peer networking",
          ],
          sameAs: Object.values(profiles),
        },
      },
      line("https://deskline.luannzin.com", "Deskline", t.deskline),
      line("https://sightline.luannzin.com", "Sightline", t.sightline),
      {
        "@type": "SoftwareApplication",
        name: "echo",
        url: "https://useecho.dev",
        author: person,
      },
      {
        "@type": "SoftwareSourceCode",
        name: "better-intl",
        codeRepository: "https://github.com/luannzin/better-intl",
        programmingLanguage: "TypeScript",
        author: person,
      },
    ],
  };
}

export function article(post: Post, locale: Locale, translated: boolean) {
  const path = `/writing/${post.slug}`;
  const url = `${site}${localized(path, translated ? locale : "en")}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        // one article in both languages: the English address names it
        "@id": `${site}${path}#article`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.metaDescription ?? post.description,
        image: `${site}${path}/opengraph-image`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: translated ? locale : "en",
        author: { ...person, "@type": "Person", name: "Luan Fabri", url: site },
        publisher: person,
        isPartOf: website,
        // the line the post is about, by its app's @id on the line's site
        about: post.about ? { "@id": `${post.about}/#app` } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: translations[locale].app.writing.title,
            item: `${site}/#writing`,
          },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ],
  };
}

// `<` is escaped so a string in the data can never close the script tag.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialised data, with "<" escaped
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
