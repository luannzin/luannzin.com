import { profiles, site } from "@/lib/site";
import type { Post } from "@/lib/writing";

// Structured data: one Person, given an @id on the home page and pointed at
// from every post, so search engines and AI tools read the site, the profiles
// and the writing as one author's.

const person = { "@id": `${site}/#person` };
const website = { "@id": `${site}/#website` };

export const home = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      ...website,
      url: site,
      name: "Luan Fabri",
      inLanguage: "en",
      publisher: person,
    },
    {
      "@type": "ProfilePage",
      "@id": `${site}/#profile`,
      url: site,
      name: "Luan Fabri · Front-end engineer",
      isPartOf: website,
      mainEntity: {
        "@type": "Person",
        ...person,
        name: "Luan Fabri",
        alternateName: "luannzin",
        url: site,
        image: `${site}/avatar.jpg`,
        jobTitle: "Front-end engineer",
        worksFor: {
          "@type": "Organization",
          name: "Loopscape",
          url: "https://loopscape.com.br",
        },
        knowsAbout: ["React", "Next.js", "TypeScript", "Front-end engineering"],
        sameAs: Object.values(profiles),
      },
    },
  ],
};

export function article(post: Post) {
  const url = `${site}/writing/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.metaDescription ?? post.description,
        image: `${url}/opengraph-image`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "en",
        author: { ...person, "@type": "Person", name: "Luan Fabri", url: site },
        publisher: person,
        isPartOf: website,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Writing",
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
