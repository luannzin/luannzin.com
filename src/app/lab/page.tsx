import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthorFooter } from "@/components/author-footer";
import { ChevronRightIcon } from "@/components/icons";
import {
  DieSpecimen,
  HintSpecimen,
  RevealSpecimen,
  ScenesSpecimen,
  SwapSpecimen,
} from "@/components/lab/specimens";
import { TextReveal } from "@/components/motion/text-reveal";
import { Share } from "@/components/share";
import { Toc } from "@/components/toc";
import { setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { openGraph, site } from "@/lib/site";
import { getPost } from "@/lib/writing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  return {
    title: lab.title,
    description: lab.meta.description,
    alternates: {
      canonical: "/lab",
      types: { "text/markdown": "/lab.md" },
    },
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: "/lab",
      title: `${lab.title} · Luan Fabri`,
      description: lab.meta.description,
    },
  };
}

// The post the scenes come from, for the link under them.
const ART = "art-from-a-seed";

export default async function Lab() {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  const common = { controls: lab.controls, tracks: lab.tracks };
  const art = getPost(ART, locale);

  // Each piece: its live specimen, then how it works.
  const pieces: { id: string; specimen: ReactNode; more?: ReactNode }[] = [
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
    { id: "swap", specimen: <SwapSpecimen name="swap" {...common} /> },
    {
      id: "reveal",
      specimen: (
        <RevealSpecimen name="reveal" {...common} role={t.app.home.role} />
      ),
    },
  ];
  const copy = (id: string) => lab[id as "scenes"];
  const headings = pieces.map(({ id }) => ({
    id,
    text: copy(id).title,
    depth: 2 as const,
  }));

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <nav aria-label={t.app.writing.breadcrumb} className={enter}>
        <ol className="flex min-w-0 items-center gap-1.5">
          <li className="shrink-0">
            <Link
              href="/"
              className="rounded-sm text-muted-foreground outline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              Luan Fabri
            </Link>
          </li>
          <li aria-hidden className="shrink-0 text-muted-foreground">
            <ChevronRightIcon className="size-4" />
          </li>
          <li className="min-w-0 truncate" aria-current="page">
            {lab.title}
          </li>
        </ol>
      </nav>

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

      <div className="relative mt-12">
        <aside
          className={`${enter} absolute inset-y-0 end-full me-16 hidden w-60 delay-500 xl:block`}
        >
          <nav aria-label={t.app.writing.onThisPage} className="sticky top-12">
            <p className="font-medium">{t.app.writing.onThisPage}</p>
            <Toc headings={headings} className="mt-4" />
          </nav>
        </aside>
        <details
          className={`${enter} disclosure group mb-10 rounded-[14px] shadow-[inset_0_0_0_1px_var(--border)] delay-500 xl:hidden`}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[14px] px-4 py-3 font-medium outline-offset-2 [&::-webkit-details-marker]:hidden">
            {t.app.writing.onThisPage}
            <ChevronRightIcon className="size-4 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-90" />
          </summary>
          <Toc headings={headings} className="px-4 pb-4" />
        </details>

        <div className={`${enter} prose lab delay-500`}>
          {pieces.map(({ id, specimen, more }) => (
            <section key={id} aria-labelledby={id}>
              <h2 id={id}>
                <a href={`#${id}`}>{copy(id).title}</a>
              </h2>
              {specimen}
              <p>{copy(id).p1}</p>
              <p>
                {copy(id).p2}
                {more}
              </p>
            </section>
          ))}
        </div>
      </div>

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
