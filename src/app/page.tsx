import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  type ComponentType,
  type ReactNode,
  type SVGProps,
  ViewTransition,
} from "react";
import echoLogo from "@/assets/echo.png";
import { AskAI } from "@/components/ask-ai";
import { Die } from "@/components/die";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  LoopscapeIcon,
} from "@/components/icons";
import { LiveTile } from "@/components/live-tile";
import { TextReveal } from "@/components/motion/text-reveal";
import { setLocale, translations } from "@/i18n/generated";
import { bezel, enter, underline } from "@/lib/classes";
import { home, JsonLd } from "@/lib/json-ld";
import { profiles, site } from "@/lib/site";
import { getPosts } from "@/lib/writing";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export async function generateMetadata(): Promise<Metadata> {
  const t = translations[await setLocale()];
  return {
    title: { absolute: t.app.meta.title },
    alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
  };
}

const projects = [
  {
    name: "echo",
    blurb: "echo",
    href: "https://useecho.dev",
    mark: (
      <Image
        src={echoLogo}
        alt=""
        width={44}
        height={44}
        className="rounded-[10px] outline -outline-offset-1 outline-white/10"
      />
    ),
  },
  {
    name: "better-intl",
    blurb: "betterIntl",
    href: "https://github.com/luannzin/better-intl",
    mark: <GlobeIcon className="size-5" />,
  },
] as const;

export default async function Home() {
  const locale = await setLocale();
  const t = translations[locale];
  const copy = t.app.home;
  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28">
      <JsonLd data={home} />
      <header className="flex items-center gap-3">
        <Image
          src="/avatar.jpg"
          alt=""
          width={40}
          height={40}
          preload
          className={`${enter} size-10 rounded-full outline -outline-offset-1 outline-white/10`}
        />
        <div className="leading-snug">
          <TextReveal as="h1" text="Luan Fabri" className="font-medium" />
          <TextReveal
            as="p"
            text={copy.role}
            delay={0.15}
            className="text-muted-foreground"
          />
        </div>
      </header>

      <section
        aria-label={copy.about}
        className={`${enter} mt-8 space-y-4 text-pretty text-foreground/70 delay-400`}
      >
        <p>
          {copy.work}
          <InlineLink href="https://loopscape.com.br" icon={LoopscapeIcon}>
            Loopscape
          </InlineLink>
          {copy.workRest}
        </p>
        <p>
          {copy.side}
          <InlineLink href={profiles.github} icon={GitHubIcon} me>
            GitHub
          </InlineLink>
          {copy.followOn}
          <InlineLink href={profiles.x} me>
            X
          </InlineLink>
          {copy.findMeOn}
          <InlineLink href={profiles.linkedin} icon={LinkedInIcon} me>
            LinkedIn
          </InlineLink>
          .
        </p>
      </section>

      <section
        aria-labelledby="projects"
        className={`${enter} mt-20 delay-500`}
      >
        <h2 id="projects" className="font-medium">
          {copy.projects}
        </h2>
        <ul className="mt-4 grid gap-6">
          {projects.map(({ name, blurb, href, mark }) => (
            <li key={name}>
              <a
                href={href}
                className="group flex items-center gap-4 rounded-[14px] outline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={bezel}>
                  <span className="grid size-11 place-items-center rounded-[10px] bg-muted text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 group-hover:text-foreground">
                    {mark}
                  </span>
                </span>
                <span className="leading-snug">
                  <span className="flex items-center gap-1 text-foreground">
                    <span className={underline}>{name}</span>
                    <ArrowUpRightIcon className="size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </span>
                  <span className="block text-muted-foreground">
                    {copy[blurb]}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="writing" className={`${enter} mt-20 delay-600`}>
        <h2 id="writing" className="scroll-mt-12 font-medium">
          {t.app.writing.title}
        </h2>
        <ul className="mt-4 grid gap-6">
          {getPosts(locale).map(({ slug, title, description, seed }) => (
            <li key={slug}>
              <Link
                href={`/writing/${slug}`}
                prefetch
                className="group flex items-center gap-4 rounded-[14px] outline-offset-4"
              >
                <span className={bezel}>
                  <ViewTransition
                    name={`art-${slug}`}
                    share="morph"
                    default="none"
                  >
                    <span className="relative block size-11 overflow-hidden rounded-[10px] outline -outline-offset-1 outline-white/10">
                      <Image
                        src={`/writing/${slug}/tile.png`}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        className="block size-full"
                      />
                      <LiveTile seed={seed} />
                    </span>
                  </ViewTransition>
                </span>
                <span className="leading-snug">
                  <span className="flex items-center gap-1 text-foreground">
                    <span className={underline}>{title}</span>
                    <ArrowRightIcon className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  <span className="block text-muted-foreground">
                    {description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lab" className={`${enter} mt-20 delay-700`}>
        <h2 id="lab" className="font-medium">
          {t.app.lab.title}
        </h2>
        <Link
          href="/lab"
          prefetch
          className="group mt-4 flex items-center gap-4 rounded-[14px] outline-offset-4"
        >
          <span className={bezel}>
            <span className="grid size-11 place-items-center rounded-[10px] bg-muted text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 group-hover:text-foreground">
              <Die seed={4} className="size-6 overflow-visible" />
            </span>
          </span>
          <span className="leading-snug">
            <span className="flex items-center gap-1 text-foreground">
              <span className={underline}>{t.app.lab.row}</span>
              <ArrowRightIcon className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
            <span className="block text-muted-foreground">
              {t.app.lab.rowDescription}
            </span>
          </span>
        </Link>
      </section>

      <AskAI
        label={copy.askLabel}
        prompt={copy.askPrompt({ site })}
        className={`${enter} mt-20 delay-800`}
      />

      <footer className={`${enter} mt-20 delay-900`}>
        <a
          href="/index.md"
          className="group rounded-sm font-mono text-muted-foreground text-sm outline-offset-2 transition-[color] duration-150 hover:text-foreground"
        >
          <span className={underline}>index.md</span>
        </a>
      </footer>
    </main>
  );
}

// `me` marks a profile that is also the author's, for rel="me".
function InlineLink({
  href,
  icon: Icon,
  me,
  children,
}: {
  href: string;
  icon?: Icon;
  me?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      rel={me ? "me" : undefined}
      className="group whitespace-nowrap rounded-sm text-foreground outline-offset-2"
    >
      {Icon && (
        <Icon className="me-1 inline-block size-[1em] align-[-0.125em]" />
      )}
      <span className={underline}>{children}</span>
    </a>
  );
}
