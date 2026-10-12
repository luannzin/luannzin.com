import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AuthorFooter } from "@/components/author-footer";
import { DownloadIcon } from "@/components/icons";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb, Contents } from "@/components/page-nav";
import { PrintButton } from "@/components/print-button";
import { Share } from "@/components/share";
import { type Locale, setLocale, translations } from "@/i18n/generated";
import { enter, press, underline } from "@/lib/classes";
import { cvPdf, email, openGraph, profiles, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const cv = t.app.cv;
  return {
    title: cv.title,
    description: cv.meta.description,
    alternates: {
      canonical: "/cv",
      types: { "text/markdown": "/cv.md", "application/pdf": cvPdf[locale] },
    },
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "profile",
      url: "/cv",
      title: `${cv.title} · Luan Fabri`,
      description: cv.meta.description,
    },
  };
}

// A month as [year, month]; a role still going has no end.
type Month = [number, number];
const roles = [
  { id: "mid", from: [2025, 2] as Month, to: null },
  { id: "junior", from: [2023, 6] as Month, to: [2025, 2] as Month },
  { id: "intern", from: [2023, 3] as Month, to: [2023, 6] as Month },
] as const;
const study = { from: [2022, 2] as Month, to: [2024, 12] as Month };
const projects = ["comms", "church", "academic"] as const;
const COMPANY = "Loopvet / Loopscape";

// "Feb 2025" / "Fev 2025", as the CV has always written it.
function month(locale: Locale, [year, m]: Month) {
  const name = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    timeZone: "UTC",
  })
    .format(Date.UTC(year, m - 1, 1))
    .replace(".", "");
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

// The bullets of one entry, b1 onward, in order.
const bullets = (copy: Record<string, unknown>) =>
  Object.entries(copy)
    .filter(([key]) => /^b\d+$/.test(key))
    .map(([, text]) => text as string);

const tool =
  "inline-flex min-h-8 items-center gap-1.5 rounded-[8px] bg-muted ps-2.5 pe-3 text-muted-foreground inset-ring inset-ring-border outline-offset-2 hover:text-foreground";

export default async function CV() {
  const locale = await setLocale();
  const t = translations[locale];
  const cv = t.app.cv;
  const home = t.app.home;
  const today = new Date();
  const now: Month = [today.getUTCFullYear(), today.getUTCMonth() + 1];
  const period = (from: Month, to: Month | null) =>
    `${month(locale, from)} – ${to ? month(locale, to) : cv.present}`;

  type Section = keyof typeof cv.sections;
  const headings = (Object.keys(cv.sections) as Section[]).map((id) => ({
    id,
    text: cv.sections[id],
    depth: 2 as const,
  }));
  const heading = (id: Section) => (
    <h2 id={id}>
      <a href={`#${id}`}>{cv.sections[id]}</a>
    </h2>
  );

  return (
    <main className="cv mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <div data-screen>
        <Breadcrumb
          label={t.app.writing.breadcrumb}
          href="/"
          parent="Luan Fabri"
          current={cv.title}
        />
      </div>

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          text="Luan Fabri"
          delay={0.1}
          className="font-medium"
        />
        <TextReveal
          as="p"
          text={home.role}
          delay={0.25}
          className="text-muted-foreground"
        />
        {/* one line on screen, each link by name; paper spells out the
            addresses and adds the dots back */}
        <ul
          className={`${enter} contact mt-4 flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-4 text-muted-foreground delay-300`}
        >
          <li>{cv.place}</li>
          <li>
            <Contact href={`mailto:${email}`} paper={email}>
              {cv.email}
            </Contact>
          </li>
          <li>
            <Contact href={profiles.linkedin} paper="linkedin.com/in/luannzin">
              LinkedIn
            </Contact>
          </li>
          <li>
            <Contact href={profiles.github} paper="github.com/luannzin">
              GitHub
            </Contact>
          </li>
        </ul>
      </header>

      <div
        data-screen
        className={`${enter} mt-6 flex flex-wrap gap-2 delay-400`}
      >
        <a
          href={cvPdf[locale]}
          download={cv.file}
          className={`${press} ${tool}`}
        >
          <DownloadIcon className="size-4" />
          {cv.download}
        </a>
        <PrintButton label={cv.print} className={tool} />
      </div>

      <p
        className={`${enter} summary mt-8 text-pretty text-foreground/70 delay-500`}
      >
        {cv.summary}
      </p>

      <div className="relative mt-12">
        <div data-screen>
          <Contents label={t.app.writing.onThisPage} headings={headings} />
        </div>

        <div className={`${enter} prose delay-600`}>
          {heading("experience")}
          <Timeline
            label={cv.timeline}
            readout={month(locale, now)}
            now={now}
            rows={[
              {
                id: "education",
                track: cv.education.track,
                name: `${cv.education.title}, ${period(study.from, study.to)}`,
                from: study.from,
                to: study.to,
              },
              ...[...roles].reverse().map(({ id, from, to }) => ({
                id,
                track: cv.roles[id].track,
                name: `${cv.roles[id].title}, ${period(from, to)}`,
                from,
                to,
              })),
            ]}
          />
          {roles.map(({ id, from, to }) => (
            <Entry
              key={id}
              id={id}
              title={cv.roles[id].title}
              where={COMPANY}
              when={period(from, to)}
              items={bullets(cv.roles[id])}
            />
          ))}

          {heading("projects")}
          {projects.map((id) => (
            <Entry
              key={id}
              title={cv.projects[id].title}
              items={bullets(cv.projects[id])}
            />
          ))}

          {heading("openSource")}
          <ul>
            <li>
              <a
                href="https://useecho.dev"
                target="_blank"
                rel="noopener noreferrer"
                data-paper-url="useecho.dev"
              >
                echo
              </a>
              : {home.echo}
            </li>
            <li>
              <a
                href="https://github.com/luannzin/better-intl"
                target="_blank"
                rel="noopener noreferrer"
                data-paper-url="github.com/luannzin/better-intl"
              >
                better-intl
              </a>
              : {home.betterIntl}
            </li>
          </ul>

          {heading("skills")}
          <dl className="space-y-2">
            {(["front", "back", "architecture", "tools"] as const).map((id) => (
              <div key={id}>
                <dt className="inline font-medium text-foreground">
                  {cv.skills[id]}:{" "}
                </dt>
                <dd className="inline">{cv.skills[`${id}List`]}</dd>
              </div>
            ))}
          </dl>

          {heading("education")}
          <Entry
            title={cv.education.title}
            where={cv.education.school}
            when={period(study.from, study.to)}
          />

          {heading("languages")}
          <p>{cv.languages}</p>

          {/* for the machines that read a printed CV */}
          <p data-paper className="hidden">
            {cv.keywords}
          </p>
        </div>
      </div>

      <div data-screen>
        <AuthorFooter role={home.role}>
          <Share
            title={`${cv.title} · Luan Fabri`}
            url={`${site}/cv`}
            labels={t.components.share}
            copy={t.components.copy}
          />
        </AuthorFooter>
      </div>
    </main>
  );
}

// `paper` is what prints in place of the link's name, where a link can't be
// followed.
function Contact({
  href,
  paper,
  children,
}: {
  href: string;
  paper?: string;
  children: string;
}) {
  // profiles open in a new tab, so the CV stays where it was
  const away = href.startsWith("http");
  return (
    <a
      href={href}
      target={away ? "_blank" : undefined}
      rel={away ? "me noopener noreferrer" : undefined}
      className="group whitespace-nowrap rounded-sm text-foreground outline-offset-2"
    >
      <span className={underline} data-screen={paper ? "" : undefined}>
        {children}
      </span>
      {paper && (
        <span data-paper className="hidden">
          {paper}
        </span>
      )}
    </a>
  );
}

// A role, project or school: its title with the dates trailing it, where,
// then what was done.
function Entry({
  id,
  title,
  where,
  when,
  items = [],
}: {
  id?: string;
  title: string;
  where?: string;
  when?: string;
  items?: string[];
}) {
  return (
    <div className="entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 id={id}>{title}</h3>
        {when && (
          <p className="whitespace-nowrap text-muted-foreground tabular-nums">
            {when}
          </p>
        )}
      </div>
      {where && <p className="text-muted-foreground">{where}</p>}
      {items.length > 0 && (
        <ul className="mt-2">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// The work as a timing sheet, like the Lab's: a ruler of years, a bar per
// role or school, and the playhead on today. Each row links to its entry.
function Timeline({
  label,
  readout,
  now,
  rows,
}: {
  label: string;
  readout: string;
  now: Month;
  rows: {
    id: string;
    track: string;
    name: string;
    from: Month;
    to: Month | null;
  }[];
}) {
  const first = 2022;
  const months = (now[0] + 1 - first) * 12;
  // a month's start along the ruler; an end runs to the end of its month
  const x = ([year, m]: Month, end = false) =>
    ((year - first) * 12 + m - 1 + (end ? 1 : 0)) / months;
  const today = x(now) + 0.5 / months;
  const pct = (k: number) => `${k * 100}%`;
  const quarters = Array.from({ length: months / 3 + 1 }, (_, i) => i * 3);

  return (
    <figure
      data-screen
      aria-label={label}
      className="relative font-mono text-sm leading-5"
    >
      <div className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5">
        <span className="text-foreground tabular-nums">{readout}</span>
        <div aria-hidden className="relative h-[26px]">
          {quarters.map((q) => {
            const year = q % 12 === 0;
            return (
              <span key={q}>
                {/* each past year from its first tick, every other one on a narrow
                    phone; the readout names the current one */}
                {year && first + q / 12 < now[0] && (
                  <span
                    className={`absolute top-0 ps-1 text-muted-foreground tabular-nums ${(q / 12) % 2 ? "max-[380px]:hidden" : ""}`}
                    style={{ insetInlineStart: pct(q / months) }}
                  >
                    {first + q / 12}
                  </span>
                )}
                <span
                  className={`absolute bottom-0 w-px ${year ? "h-1.5 bg-foreground/30" : "h-[3px] bg-foreground/15"}`}
                  style={{ insetInlineStart: pct(q / months) }}
                />
              </span>
            );
          })}
        </div>
        {rows.map((row, i) => {
          const from = x(row.from);
          const to = row.to ? x(row.to, true) : today;
          const current = !row.to;
          return (
            <a
              key={row.id}
              href={`#${row.id}`}
              aria-label={`${row.track}: ${row.name}`}
              className="group col-span-2 grid grid-cols-subgrid items-center rounded-sm no-underline outline-offset-4"
            >
              <span
                className={`truncate transition-[color] duration-150 group-hover:text-foreground ${current ? "text-foreground" : "text-muted-foreground"}`}
              >
                {row.track}
              </span>
              <span className="relative h-5">
                <span
                  className={`cv-bar absolute inset-y-0 rounded-[6px] inset-ring transition-[box-shadow] duration-150 group-hover:inset-ring-foreground/25 ${current ? "bg-foreground/7 inset-ring-foreground/18" : "bg-muted inset-ring-border"}`}
                  style={
                    {
                      insetInlineStart: pct(from),
                      width: pct(to - from),
                      "--delay": `${700 + i * 80}ms`,
                    } as CSSProperties
                  }
                />
              </span>
            </a>
          );
        })}
      </div>
      {/* the playhead, on today: it draws down once the bars have grown */}
      <div
        aria-hidden
        className="cv-playhead pointer-events-none absolute inset-y-0 start-[6.25rem] end-0"
        style={{ "--delay": `${700 + rows.length * 80}ms` } as CSSProperties}
      >
        <div
          className="absolute inset-y-0 w-px bg-foreground"
          style={{ insetInlineStart: pct(today) }}
        >
          <span className="absolute -top-px left-1/2 size-[7px] -translate-x-1/2 rounded-full bg-foreground" />
        </div>
      </div>
    </figure>
  );
}
