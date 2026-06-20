import Image from "next/image";
import { ContributionsHeatmap } from "@/components/modules/github/contributions/contributions-heatmap";
import { Projects } from "@/components/modules/homepage/projects";
import { GITHUB_USERNAME as username } from "@/lib/config/constants";
import { github } from "@/lib/data/github";

export default async function HomePage() {
  const contributions = await github.contributions();

  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-xl overflow-hidden border-2 border-border">
          <Image
            src={`https://github.com/${username}.png`}
            alt="Profile"
            className="size-full object-cover"
            width={56}
            height={56}
          />
        </div>
        <div className="flex flex-col gap-0">
          <p className="truncate text-xl font-semibold leading-tight">luan</p>
          <span className="text-sm text-muted-foreground">@{username}</span>
        </div>
      </div>
      <ContributionsHeatmap contributions={contributions} />
      <Projects />
    </main>
  );
}
