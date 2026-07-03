// import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { Blog } from "@/components/modules/blog";
import { Experience } from "@/components/modules/experience";
import { Contributions } from "@/components/modules/github/contributions";
import { Projects } from "@/components/modules/projects";
import { GITHUB_USERNAME as username } from "@/lib/config/constants";
import { github } from "@/lib/data/github";

export default async function HomePage() {
  // "use cache";
  // cacheTag("homepage");
  // cacheLife("days");

  const contributions = await github.contributions();

  return (
    <div className="flex flex-col gap-8 w-full">
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
      <Contributions contributions={contributions} />
      <Projects />
      <Blog />
      <Experience />
    </div>
  );
}
