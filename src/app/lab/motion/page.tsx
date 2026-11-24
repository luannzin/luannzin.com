import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthorFooter } from "@/components/author-footer";
import {
  DieSpecimen,
  HintSpecimen,
  RevealSpecimen,
  ScenesSpecimen,
} from "@/components/lab/specimens";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb, Contents } from "@/components/page-nav";
import { Share } from "@/components/share";
import { setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { alternates, localized, openGraph, site } from "@/lib/site";
import { getPost } from "@/lib/writing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const motion = t.app.lab.motion;
  return {
    title: motion.title,
    description: motion.meta.description,
    alternates: alternates("/lab/motion", locale, {
      "text/markdown": "/lab/motion.md",
    }),
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: localized("/lab/motion", locale),
      title: `${motion.title} · Luan Fabri`,
      description: motion.meta.description,
    },
  };
}

// The post the scenes come from, for the link under them.
const ART = "art-from-a-seed";

export default async function Motion() {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  const { motion } = lab;
  const common = { controls: lab.controls, tracks: lab.tracks };
  const art = getPost(ART, locale);

  // Each piece: its live specimen, then how it works.
  const pieces: {
    id: "scenes" | "die" | "hint" | "reveal";
    specimen: ReactNode;
    more?: ReactNode;
  }[] = [
    {
      id: "scenes",
      specimen: (
        <ScenesSpecimen
          name="scenes"
          {...common}
          seed={lab.seed}
          scene={t.components.scene}
        />
      ),
      more: art && (
        <>
          <Link href={`/writing/${ART}`}>{art.title}</Link>.
        </>
      ),
    },
    { id: "die", specimen: <DieSpecimen name="die" {...common} /> },
    { id: "hint", specimen: <HintSpecimen name="hint" {...common} /> },
    {
      id: "reveal",
      specimen: (
        <RevealSpecimen name="reveal" {...common} role={t.app.home.role} />
      ),
    },
  ];
  const headings = pieces.map(({ id }) => ({
    id,
    text: lab[id].title,
    depth: 2 as const,
  }));

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <Breadcrumb
        label={t.app.writing.breadcrumb}
        href="/lab"
        parent={lab.title}
        current={motion.title}
      />

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text={motion.title}
          delay={0.1}
          className="font-medium"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          {motion.subtitle}
        </p>
      </header>
      <p className={`${enter} mt-8 text-pretty text-foreground/70 delay-400`}>
        {motion.intro}
      </p>

      <div className="relative mt-12">
        <Contents label={t.app.writing.onThisPage} headings={headings} />

        <div className={`${enter} prose lab delay-500`}>
          {pieces.map(({ id, specimen, more }) => (
            <section key={id} aria-labelledby={id}>
              <h2 id={id}>
                <a href={`#${id}`}>{lab[id].title}</a>
              </h2>
              {specimen}
              <p>{lab[id].p1}</p>
              <p>
                {lab[id].p2}
                {more}
              </p>
            </section>
          ))}
        </div>
      </div>

      <AuthorFooter role={t.app.home.role}>
        <Share
          title={motion.title}
          url={`${site}/lab/motion`}
          labels={t.components.share}
          copy={t.components.copy}
        />
      </AuthorFooter>
    </main>
  );
}
