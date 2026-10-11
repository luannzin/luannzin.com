import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleIslands } from "@/components/article-islands";
import { AskAI } from "@/components/ask-ai";
import { CoverArt } from "@/components/cover-art";
import { ChevronRightIcon } from "@/components/icons";
import { TextReveal } from "@/components/motion/text-reveal";
import { Share } from "@/components/share";
import { Toc } from "@/components/toc";
import { type Locale, setLocale, translations } from "@/i18n/generated";
import { enter, underline } from "@/lib/classes";
import { article, JsonLd } from "@/lib/json-ld";
import { renderMarkdown } from "@/lib/markdown";
import { openGraph, site } from "@/lib/site";
import { formatDate, getPost, getPosts } from "@/lib/writing";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await setLocale();
  const t = translations[locale];
  const post = getPost(slug, locale);
  if (!post) return {};
  const url = `/writing/${post.slug}`;
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.description;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "text/markdown": `${url}.md` },
    },
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "article",
      url,
      title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site],
    },
  };
}

// The article's HTML, cached per body and language: rendering reads image
// sizes from disk, and the post itself doesn't change between requests.
async function render(body: string, locale: Locale) {
  "use cache";
  return renderMarkdown(body, locale);
}

// The page awaits `params` and the language outside any Suspense boundary, so
// its HTML carries the article visible, not in a hidden boundary waiting on a
// script to reveal it. So navigating here may block on the page, which is
// fine: every link to it prefetches it in full.
export const instant = false;

export default async function Page({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const locale = await setLocale();
  const t = translations[locale];
  const post = getPost(slug, locale);
  if (!post) notFound();

  const writing = t.app.writing;
  const { html, toc } = await render(post.body, locale);
  const url = `${site}/writing/${slug}`;

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <JsonLd data={article(post, locale)} />
      <nav aria-label={writing.breadcrumb} className={enter}>
        <ol className="flex min-w-0 items-center gap-1.5">
          <li className="shrink-0">
            <Link
              href="/#writing"
              className="rounded-sm text-muted-foreground outline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              {writing.title}
            </Link>
          </li>
          <li aria-hidden className="shrink-0 text-muted-foreground">
            <ChevronRightIcon className="size-4" />
          </li>
          <li className="min-w-0 truncate" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text={post.title}
          delay={0.1}
          className="font-medium text-balance"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          <a
            href="/"
            rel="author"
            className="rounded-sm outline-offset-2 transition-colors duration-150 hover:text-foreground"
          >
            Luan Fabri
          </a>
          <span aria-hidden> · </span>
          {/* each part holds together; the line breaks at a separator */}
          <time dateTime={post.date} className="whitespace-nowrap">
            {formatDate(post.date, locale)}
          </time>
          <span aria-hidden> · </span>
          <span className="whitespace-nowrap">
            {writing.minutes({ minutes: String(post.minutes) })}
          </span>
        </p>
        <AskAI
          label={writing.summarizeLabel}
          prompt={writing.summarizePrompt({ url })}
          className={`${enter} mt-4 delay-400`}
        />
      </header>

      <CoverArt seed={post.seed} slug={slug} labels={t.components.scene} />

      <div className="relative mt-12">
        {toc.length > 0 && (
          <>
            <aside
              className={`${enter} absolute inset-y-0 end-full me-16 hidden w-60 delay-500 xl:block`}
            >
              <nav aria-label={writing.onThisPage} className="sticky top-12">
                <p className="font-medium">{writing.onThisPage}</p>
                <Toc headings={toc} className="mt-4" />
              </nav>
            </aside>
            <details
              className={`${enter} disclosure group mb-10 rounded-[14px] shadow-[inset_0_0_0_1px_var(--border)] delay-500 xl:hidden`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-[14px] px-4 py-3 font-medium outline-offset-2 [&::-webkit-details-marker]:hidden">
                {writing.onThisPage}
                <ChevronRightIcon className="size-4 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-90" />
              </summary>
              <Toc headings={toc} className="px-4 pb-4" />
            </details>
          </>
        )}
        <article
          id="article"
          className={`${enter} prose delay-400`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: posts are markdown files in this repo, rendered at build time
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {/* A language switch replaces the article's HTML, and with it the
            placeholders the islands mounted into: they mount again. */}
        <ArticleIslands
          key={locale}
          root="article"
          scene={t.components.scene}
          copy={t.components.copy}
        />
      </div>

      <footer className="mt-20">
        <div
          aria-hidden
          className="relative h-px bg-border before:absolute before:top-1/2 before:left-1/2 before:size-1.5 before:-translate-1/2 before:rotate-45 before:bg-muted-foreground before:shadow-[0_0_0_4px_var(--background)]"
        />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-[14px] leading-snug outline-offset-4"
          >
            <Image
              src="/avatar.jpg"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full outline -outline-offset-1 outline-white/10"
            />
            <span>
              <span className={`${underline} font-medium`}>Luan Fabri</span>
              <span className="block text-muted-foreground">
                {t.app.home.role}
              </span>
            </span>
          </Link>
          <Share
            title={post.title}
            url={url}
            labels={t.components.share}
            copy={t.components.copy}
          />
        </div>
      </footer>
    </main>
  );
}
