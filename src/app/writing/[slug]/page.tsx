import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleIslands } from "@/components/article-islands";
import { AskAI } from "@/components/ask-ai";
import { AuthorFooter } from "@/components/author-footer";
import { CoverArt } from "@/components/cover-art";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb, Contents } from "@/components/page-nav";
import { Share } from "@/components/share";
import { type Locale, setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
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
      locale: translations[locale].app.meta.ogLocale,
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
      <Breadcrumb
        label={writing.breadcrumb}
        href="/#writing"
        parent={writing.title}
        current={post.title}
      />

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
          <Contents label={writing.onThisPage} headings={toc} />
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

      <AuthorFooter role={t.app.home.role}>
        <Share
          title={post.title}
          url={url}
          labels={t.components.share}
          copy={t.components.copy}
        />
      </AuthorFooter>
    </main>
  );
}
