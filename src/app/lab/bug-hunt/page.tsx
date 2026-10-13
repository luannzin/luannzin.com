import type { Metadata } from "next";
import { AuthorFooter } from "@/components/author-footer";
import { BugHunt } from "@/components/lab/bug-hunt";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb } from "@/components/page-nav";
import { Share } from "@/components/share";
import { setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { openGraph, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const game = t.app.lab.game;
  return {
    title: game.title,
    description: game.meta.description,
    alternates: {
      canonical: "/lab/bug-hunt",
      types: { "text/markdown": "/lab/bug-hunt.md" },
    },
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: "/lab/bug-hunt",
      title: `${game.title} · Luan Fabri`,
      description: game.meta.description,
    },
  };
}

export default async function BugHuntPage() {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  const game = lab.game;

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <Breadcrumb
        label={t.app.writing.breadcrumb}
        href="/lab"
        parent={lab.title}
        current={game.title}
      />

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text={game.title}
          delay={0.1}
          className="font-medium"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          {game.subtitle}
        </p>
      </header>
      <p className={`${enter} mt-8 text-pretty text-foreground/70 delay-400`}>
        {game.intro}
      </p>

      <div className={`${enter} mt-12 delay-500`}>
        <BugHunt labels={game} speed={lab.controls.speed} />
      </div>

      <section
        aria-labelledby="made"
        className={`${enter} prose mt-20 delay-600`}
      >
        <h2 id="made">
          <a href="#made">{game.made.title}</a>
        </h2>
        <p>{game.made.p1}</p>
        <p>{game.made.p2}</p>
        <p>{game.made.p3}</p>
      </section>

      <AuthorFooter role={t.app.home.role}>
        <Share
          title={game.title}
          url={`${site}/lab/bug-hunt`}
          labels={t.components.share}
          copy={t.components.copy}
        />
      </AuthorFooter>
    </main>
  );
}
