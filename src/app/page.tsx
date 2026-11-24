import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { seeds } from "@/app/projects/seeded-scenes/seeds";
import avatar from "@/assets/avatar.jpg";
import echoLogo from "@/assets/echo.png";
import desklineMark from "@/assets/lines/deskline.png";
import sightlineMark from "@/assets/lines/sightline.png";
import { AskAI } from "@/components/ask-ai";
import { DitherStrip, Signature } from "@/components/footer-art";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  LoopscapeIcon,
} from "@/components/icons";
import { LabRows } from "@/components/lab/rows";
import { LiveTile } from "@/components/live-tile";
import { TextReveal } from "@/components/motion/text-reveal";
import { NightField } from "@/components/night-field";
import { PixelName } from "@/components/pixel-name";
import { PostRow } from "@/components/post-row";
import { setLocale, translations } from "@/i18n/generated";
import { bezel, enter, underline } from "@/lib/classes";
import { home, JsonLd } from "@/lib/json-ld";
import { alternates, profiles, site } from "@/lib/site";
import { getPosts } from "@/lib/writing";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  return {
    title: { absolute: t.app.meta.title },
    alternates: alternates("/", locale, {
      "text/markdown": "/index.md",
      "application/rss+xml": "/feed.xml",
    }),
  };
}

export default async function Home() {
  const locale = await setLocale();
  const t = translations[locale];
  const copy = t.app.home;
  const { scenes } = t.app.projects;
  // the apps that only need a code or a link, each at its own subdomain
  const lines = [
    {
      name: "Deskline",
      host: "deskline.luannzin.com",
      mark: desklineMark,
      blurb: copy.deskline,
    },
    {
      name: "Sightline",
      host: "sightline.luannzin.com",
      mark: sightlineMark,
      blurb: copy.sightline,
    },
  ];
  const projects = [
    {
      name: "echo",
      blurb: copy.echo,
      href: "https://useecho.dev",
      mark: (
        <Image
          src={echoLogo}
          alt=""
          width={44}
          height={44}
          className="rounded-[10px] outline -outline-offset-1 outline-black/10 dark:outline-white/10"
        />
      ),
    },
    {
      name: "better-intl",
      blurb: copy.betterIntl,
      href: "https://github.com/luannzin/better-intl",
      mark: <GlobeIcon className="size-5" />,
    },
    {
      name: scenes.title,
      blurb: scenes.rowDescription,
      href: "/projects/seeded-scenes",
      // its own scene, still until hovered, like a post's tile
      mark: (
        <span className="relative size-11 overflow-hidden rounded-[10px] outline -outline-offset-1 outline-black/10 dark:outline-white/10">
          <Image
            src="/projects/seeded-scenes/tile.png"
            alt=""
            width={44}
            height={44}
            unoptimized
            className="block size-full"
          />
          <LiveTile seed={seeds.tile} />
        </span>
      ),
    },
  ];
  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28">
      <JsonLd data={home(locale)} />
      <header className="flex items-center gap-3">
        <Image
          src={avatar}
          alt=""
          width={40}
          height={40}
          quality={95}
          preload
          className={`${enter} size-10 rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10`}
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

      <section aria-labelledby="lines" className={`${enter} mt-20 delay-500`}>
        <h2 id="lines" className="scroll-mt-12 font-medium">
          {copy.lines}
        </h2>
        <p className="text-pretty text-muted-foreground leading-snug">
          {copy.linesLead}
        </p>
        <ul className="mt-4 grid gap-6 sm:grid-cols-2">
          {lines.map(({ name, host, mark, blurb }, i) => (
            <li key={host}>
              <a
                href={`https://${host}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[14px] outline-offset-4"
              >
                {/* the line's night, art in every theme */}
                <span className="relative grid aspect-[2/1] place-items-center overflow-hidden rounded-[10px] bg-[#110d24] outline -outline-offset-1 outline-black/10 dark:outline-white/10">
                  {/* the dots develop once the section has faded in (500ms + 500ms) */}
                  <NightField delay={1000 + i * 150} />
                  <span className="relative flex flex-col items-center gap-3">
                    <Image
                      data-glow
                      src={mark}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 [image-rendering:pixelated] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
                    />
                    <span data-calm className="text-[#f5f5f5] text-sm">
                      <PixelName name={name} />
                    </span>
                  </span>
                </span>
                <span className="mt-3 block leading-snug">
                  <span className="sr-only">{name}, </span>
                  <span className="flex items-center gap-1 text-foreground">
                    <span className={underline}>{host}</span>
                    <ArrowUpRightIcon className="size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" />
                  </span>
                  <span className="block text-pretty text-muted-foreground">
                    {blurb}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="projects"
        className={`${enter} mt-20 delay-600`}
      >
        <h2 id="projects" className="scroll-mt-12 font-medium">
          {copy.projects}
        </h2>
        <ul className="mt-4 grid gap-6">
          {projects.map(({ name, blurb, href, mark }) => {
            const external = href.startsWith("https://");
            return (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={!external}
                  className="group flex items-center gap-4 rounded-[14px] outline-offset-4"
                  {...(external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  <span className={bezel}>
                    <span className="grid size-11 place-items-center rounded-[10px] bg-muted text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[color] duration-150 group-hover:text-foreground">
                      {mark}
                    </span>
                  </span>
                  <span className="leading-snug">
                    <span className="flex items-center gap-1 text-foreground">
                      <span className={underline}>{name}</span>
                      {external ? (
                        <ArrowUpRightIcon className="size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                      ) : (
                        <ArrowRightIcon className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                      )}
                    </span>
                    <span className="block text-muted-foreground">{blurb}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="writing" className={`${enter} mt-20 delay-700`}>
        <h2 id="writing" className="scroll-mt-12 font-medium">
          {t.app.writing.title}
        </h2>
        <ul className="mt-4 grid gap-6">
          {getPosts(locale).map((post) => (
            <li key={post.slug}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lab" className={`${enter} mt-20 delay-800`}>
        <h2 id="lab" className="font-medium">
          {t.app.lab.title}
        </h2>
        <LabRows labels={t.app.lab} className="mt-4" />
      </section>

      <AskAI
        label={copy.askLabel}
        prompt={copy.askPrompt({ site })}
        className={`${enter} mt-20 delay-900`}
      />

      <footer className={`${enter} mt-20 delay-1000`}>
        <DitherStrip />
        <div className="mt-16 flex items-end justify-between">
          <div className="flex gap-4">
            <a
              href="/index.md"
              className="group rounded-sm font-mono text-muted-foreground text-sm outline-offset-2 transition-[color] duration-150 hover:text-foreground"
            >
              <span className={underline}>index.md</span>
            </a>
            <Link
              href="/cv"
              className="group rounded-sm font-mono text-muted-foreground text-sm outline-offset-2 transition-[color] duration-150 hover:text-foreground"
            >
              <span className={underline}>cv</span>
            </Link>
          </div>
          <Signature />
        </div>
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
