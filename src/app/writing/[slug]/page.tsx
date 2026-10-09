import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { CopyLink } from "@/components/copy-link";
import { ChevronRightIcon } from "@/components/icons";
import { TextReveal } from "@/components/motion/text-reveal";
import { SceneArt } from "@/components/scene-art";
import { Toc } from "@/components/toc";
import { enter, underline } from "@/lib/classes";
import { renderMarkdown } from "@/lib/markdown";
import { createScene } from "@/lib/scene";
import { formatDate, getPost, getPosts } from "@/lib/writing";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.description } : {};
}

// `params` is URL data, so the article streams inside Suspense; links to it
// prefetch with `prefetch={true}`, which resolves it before the click.
export default function Page({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({
  params,
}: {
  params: PageProps<"/writing/[slug]">["params"];
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, toc, minutes } = renderMarkdown(post.body);
  const { name } = createScene(post.seed);

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <nav
        aria-label="Breadcrumb"
        className={`${enter} flex items-center justify-between gap-6`}
      >
        <ol className="flex min-w-0 items-center gap-1.5">
          <li className="shrink-0">
            <Link
              href="/#writing"
              className="rounded-sm text-muted-foreground outline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              Writing
            </Link>
          </li>
          <li aria-hidden className="shrink-0 text-muted-foreground">
            <ChevronRightIcon className="size-4" />
          </li>
          <li className="min-w-0 truncate" aria-current="page">
            {post.title}
          </li>
        </ol>
        <CopyLink />
      </nav>

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text={post.title}
          delay={0.1}
          className="font-medium text-balance"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden> · </span>
          {minutes} min read
        </p>
      </header>

      <figure className="-mx-6 mt-8 sm:mx-0 lg:-mx-16">
        <ViewTransition name={`art-${slug}`} share="morph" default="none">
          <div
            role="img"
            aria-label={`An animated scene drawn in dots: ${name}`}
            className="overflow-hidden sm:rounded-[14px] sm:outline sm:-outline-offset-1 sm:outline-white/10"
          >
            <SceneArt seed={post.seed} stir />
          </div>
        </ViewTransition>
        <figcaption
          className={`${enter} mt-3 text-muted-foreground first-letter:uppercase delay-400 max-sm:px-6 lg:px-16`}
        >
          {name}
        </figcaption>
      </figure>

      <div className="relative mt-12">
        {toc.length > 0 && (
          <>
            <aside
              className={`${enter} absolute inset-y-0 end-full me-16 hidden w-60 delay-500 xl:block`}
            >
              <nav aria-label="On this page" className="sticky top-12">
                <p className="font-medium">On this page</p>
                <Toc headings={toc} className="mt-4" />
              </nav>
            </aside>
            <details
              className={`${enter} disclosure group mb-10 rounded-[14px] shadow-[inset_0_0_0_1px_var(--border)] delay-500 xl:hidden`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-[14px] px-4 py-3 font-medium outline-offset-2 [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronRightIcon className="size-4 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-90" />
              </summary>
              <Toc headings={toc} className="px-4 pb-4" />
            </details>
          </>
        )}
        <article
          className={`${enter} prose delay-400`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: posts are markdown files in this repo, rendered at build time
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <footer className="mt-20">
        <Link
          href="/"
          className="group flex w-fit items-center gap-3 rounded-[14px] leading-snug outline-offset-4"
        >
          <Image
            src="https://github.com/luannzin.png"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full outline -outline-offset-1 outline-white/10"
          />
          <span>
            <span className={`${underline} font-medium`}>Luan Fabri</span>
            <span className="block text-muted-foreground">
              Front-end engineer at Loopscape
            </span>
          </span>
        </Link>
      </footer>
    </main>
  );
}
