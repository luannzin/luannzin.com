import type { Metadata } from "next";
import { AuthorFooter } from "@/components/author-footer";
import { ScenesSpecimen } from "@/components/lab/specimens";
import { TextReveal } from "@/components/motion/text-reveal";
import { Breadcrumb } from "@/components/page-nav";
import { PostRow } from "@/components/post-row";
import { SceneArt } from "@/components/scene-art";
import { DotScene, PlaceScene } from "@/components/scene-playground";
import { Share } from "@/components/share";
import { setLocale, translations } from "@/i18n/generated";
import { enter } from "@/lib/classes";
import { createScene } from "@/lib/scene";
import { openGraph, site } from "@/lib/site";
import { getPost } from "@/lib/writing";
import { seeds } from "./seeds";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await setLocale();
  const t = translations[locale];
  const copy = t.app.projects.scenes;
  return {
    title: copy.title,
    description: copy.meta.description,
    alternates: {
      canonical: "/projects/seeded-scenes",
      types: { "text/markdown": "/projects/seeded-scenes.md" },
    },
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: "/projects/seeded-scenes",
      title: `${copy.title} · Luan Fabri`,
      description: copy.meta.description,
    },
  };
}

// The post with the code, linked at the end.
const ART = "art-from-a-seed";

export default async function SeededScenes() {
  const locale = await setLocale();
  const t = translations[locale];
  const lab = t.app.lab;
  const copy = t.app.projects.scenes;
  const scene = t.components.scene;
  const art = getPost(ART, locale);

  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-6 pb-24 leading-relaxed sm:pt-10">
      <Breadcrumb
        label={t.app.writing.breadcrumb}
        href="/#projects"
        parent={t.app.home.projects}
        current={copy.title}
      />

      <header className="mt-16 leading-snug sm:mt-20">
        <TextReveal
          as="h1"
          id="seeded-scenes"
          text={copy.title}
          delay={0.1}
          className="font-medium"
        />
        <p className={`${enter} text-muted-foreground delay-300`}>
          {copy.subtitle}
        </p>
      </header>
      {/* the engine first, as Bug hunt's game: it's what the page is for */}
      <div className={`${enter} mt-10 delay-300`}>
        <ScenesSpecimen
          name="seeded-scenes"
          controls={lab.controls}
          tracks={lab.tracks}
          seed={lab.seed}
          scene={scene}
        />
      </div>
      <div
        className={`${enter} mt-8 space-y-4 text-pretty text-foreground/70 delay-400`}
      >
        <p>{copy.intro}</p>
        <p>{copy.melt}</p>
      </div>

      <div className={`${enter} prose lab mt-20 delay-500`}>
        <section aria-labelledby="examples">
          <h2 id="examples">
            <a href="#examples">{copy.examples.title}</a>
          </h2>
          {/* the seed shows here, as in the field above, so one can be typed in */}
          <div className="scenes">
            {seeds.examples.map((seed) => {
              const { name, time } = createScene(seed);
              return (
                <figure key={seed} className="scene-card" data-hover-play>
                  <div
                    className="scene-slot"
                    role="img"
                    aria-label={`${scene.label} ${name}`}
                    style={{ background: time.ground }}
                  >
                    <SceneArt seed={seed} />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate first-letter:uppercase">
                      {name}
                    </span>
                    <span className="font-mono text-sm tabular-nums">
                      {seed}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <p>{copy.examples.p}</p>
        </section>

        <section aria-labelledby="places">
          <h2 id="places">
            <a href="#places">{copy.places.title}</a>
          </h2>
          <PlaceScene
            name="places"
            seed={seeds.place}
            labels={copy.places}
            places={copy.place}
            scene={scene}
          />
          <p>{copy.places.p}</p>
        </section>

        <section aria-labelledby="dots">
          <h2 id="dots">
            <a href="#dots">{copy.dots.title}</a>
          </h2>
          <DotScene
            name="dots"
            seed={seeds.dots}
            label={copy.dots.size}
            scene={scene}
          />
          <p>{copy.dots.p}</p>
        </section>
      </div>

      {art && (
        <section aria-labelledby="story" className={`${enter} mt-20 delay-600`}>
          <h2 id="story" className="font-medium">
            {copy.story.title}
          </h2>
          <p className="mt-3 text-pretty text-foreground/70">{copy.story.p}</p>
          <PostRow post={art} className="mt-6" />
        </section>
      )}

      <AuthorFooter role={t.app.home.role}>
        <Share
          title={copy.title}
          url={`${site}/projects/seeded-scenes`}
          labels={t.components.share}
          copy={t.components.copy}
        />
      </AuthorFooter>
    </main>
  );
}
