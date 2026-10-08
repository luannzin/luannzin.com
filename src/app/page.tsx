import Image from "next/image";
import type { ComponentType, ReactNode, SVGProps } from "react";
import echoLogo from "@/assets/echo.png";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
} from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const projects = [
  {
    name: "echo",
    description: "The note taker that learns with you",
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
    description: "Typed, file-based i18n for Next.js",
    href: "https://github.com/luannzin/better-intl",
    mark: <GlobeIcon className="size-5" />,
  },
];

// One staged entrance: the name word by word (80ms), then each block 100ms apart.
const enter =
  "motion-safe:animate-in fade-in blur-in-4 slide-in-from-bottom-3 fill-mode-both duration-500 ease-[cubic-bezier(0.2,0,0,1)]";

const underline =
  "underline decoration-foreground/25 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150 group-hover:decoration-foreground/60";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28">
      <header className="flex items-center gap-3">
        <Image
          src="https://github.com/luannzin.png"
          alt=""
          width={40}
          height={40}
          preload
          className={`${enter} size-10 rounded-full outline -outline-offset-1 outline-white/10`}
        />
        <div className="leading-snug">
          <h1 className="font-medium">
            <span className={`${enter} inline-block`}>Luan</span>{" "}
            <span className={`${enter} inline-block delay-80`}>Fabri</span>
          </h1>
          <p className={`${enter} text-muted-foreground delay-180`}>
            Front-end engineer at Loopscape
          </p>
        </div>
      </header>

      <section
        aria-label="About"
        className={`${enter} mt-8 space-y-4 text-pretty text-foreground/70 delay-280`}
      >
        <p>
          I’m a front-end engineer from Jaú, Brazil. At{" "}
          <InlineLink href="https://loopscape.com.br">Loopscape</InlineLink>, I
          build ERPs and multi-tenant platforms with React and Next.js: software
          people spend their whole workday in. I care about the details that
          make it fast and clear to use.
        </p>
        <p>
          On the side, I build open source tools for problems I keep running
          into. You can see my code on{" "}
          <InlineLink href="https://github.com/luannzin" icon={GitHubIcon}>
            GitHub
          </InlineLink>
          , follow along on{" "}
          <InlineLink href="https://x.com/__luannzin">X</InlineLink>, or find me
          on{" "}
          <InlineLink
            href="https://linkedin.com/in/luannzin"
            icon={LinkedInIcon}
          >
            LinkedIn
          </InlineLink>
          .
        </p>
      </section>

      <section
        aria-labelledby="projects"
        className={`${enter} mt-20 delay-380`}
      >
        <h2 id="projects" className="font-medium">
          Projects
        </h2>
        <ul className="mt-4 grid gap-6">
          {projects.map(({ name, description, href, mark }) => (
            <li key={name}>
              <a
                href={href}
                className="group flex items-center gap-4 rounded-[14px] outline-offset-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-muted text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 group-hover:text-foreground">
                  {mark}
                </span>
                <span className="leading-snug">
                  <span className="flex items-center gap-1 text-foreground">
                    <span className={underline}>{name}</span>
                    <ArrowUpRightIcon className="size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </span>
                  <span className="block text-muted-foreground">
                    {description}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function InlineLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon?: Icon;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group whitespace-nowrap rounded-sm text-foreground outline-offset-2"
    >
      {Icon && (
        <Icon className="me-1 inline-block size-[1em] align-[-0.125em]" />
      )}
      <span className={underline}>{children}</span>
    </a>
  );
}
