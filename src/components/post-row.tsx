import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { LiveTile } from "@/components/live-tile";
import { bezel, underline } from "@/lib/classes";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/writing";

// A post as a row: its scene's tile, which grows into the post's figure when
// opened, then its title over its description. Home's Writing list and
// Seeded scenes.
export function PostRow({
  post: { slug, title, description, seed },
  className,
}: {
  post: Pick<Post, "slug" | "title" | "description" | "seed">;
  className?: string;
}) {
  return (
    <Link
      href={`/writing/${slug}`}
      prefetch
      className={cn(
        "group flex items-center gap-4 rounded-[14px] outline-offset-4",
        className,
      )}
    >
      <span className={bezel}>
        <ViewTransition name={`art-${slug}`} share="morph" default="none">
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
        <span className="block text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}
