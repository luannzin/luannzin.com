import type { Metadata } from "next";
import { AuthorFooter } from "@/components/author-footer";
import { LabRows } from "@/components/lab/rows";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb } from "@/components/page-nav";
import { Share } from "@/components/share";
import { setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { alternates, localized, openGraph, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  return {
    title: lab.title,
    description: lab.meta.description,
    alternates: alternates("/lab", locale, { "text/markdown": "/lab.md" }),
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: localized("/lab", locale),
      title: `${lab.title} · Luan Fabri`,
      description: lab.meta.description,
    },
  };
}

// The Lab's index: its pieces, listed like the posts on the home page.
export default async function Lab() {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <Breadcrumb
        label={t.app.writing.breadcrumb}
        href="/"
        parent="Luan Fabri"
        current={lab.title}
      />

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text={lab.title}
          delay={0.1}
          className="font-medium"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          {lab.subtitle}
        </p>
      </header>
      <p className={`${enter} mt-8 text-pretty text-foreground/70 delay-400`}>
        {lab.intro}
      </p>

      <LabRows labels={lab} className={`${enter} mt-12 delay-500`} />

      <AuthorFooter role={t.app.home.role}>
        <Share
          title={lab.title}
          url={`${site}/lab`}
          labels={t.components.share}
          copy={t.components.copy}
        />
      </AuthorFooter>
    </main>
  );
}
