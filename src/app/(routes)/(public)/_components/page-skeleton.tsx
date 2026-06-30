import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BLOCK_STAGGER_MS = 90;
const HEATMAP_ROWS = 7;
const HEATMAP_COLS = 48;
const HEATMAP_CELL_STAGGER_MS = 16;

type BlockProps = ComponentProps<"div"> & {
  delay: number;
};

const Block = ({ delay, className, ...props }: BlockProps) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className={cn("opacity-0 animate-page-skeleton", className)}
    {...props}
  />
);

const PageSkeleton = () => {
  const heatmapBase = BLOCK_STAGGER_MS * 2;

  return (
    <div
      aria-hidden
      aria-busy
      className="flex flex-col gap-8 w-full select-none"
    >
      <div className="flex items-center gap-4">
        <Block delay={0}>
          <Skeleton className="size-14 rounded-xl" />
        </Block>
        <div className="flex flex-col gap-2">
          <Block delay={BLOCK_STAGGER_MS * 0.5}>
            <Skeleton className="h-5 w-24 rounded-sm" />
          </Block>
          <Block delay={BLOCK_STAGGER_MS}>
            <Skeleton className="h-3.5 w-16 rounded-sm" />
          </Block>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Block delay={heatmapBase - BLOCK_STAGGER_MS}>
          <Skeleton className="h-4 w-64 rounded-sm" />
        </Block>

        <div className="grid grid-flow-col grid-rows-7">
          {Array.from({ length: HEATMAP_ROWS * HEATMAP_COLS }).map((_, i) => {
            const row = i % HEATMAP_ROWS;
            const col = Math.floor(i / HEATMAP_ROWS);
            const delay = heatmapBase + (row + col) * HEATMAP_CELL_STAGGER_MS;

            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder grid
                key={i}
                style={{ animationDelay: `${delay}ms` }}
                className="size-2.5 rounded-[2px] m-0.5 bg-muted opacity-0 animate-page-skeleton"
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Block delay={heatmapBase + 320} className="h-2.5 w-8">
            <Skeleton className="size-full rounded-sm" />
          </Block>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder legend
                key={i}
                style={{ animationDelay: `${heatmapBase + 340 + i * 30}ms` }}
                className="size-2.5 rounded-[2px] bg-muted opacity-0 animate-page-skeleton"
              />
            ))}
          </div>
          <Block delay={heatmapBase + 500} className="h-2.5 w-8">
            <Skeleton className="size-full rounded-sm" />
          </Block>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Block delay={BLOCK_STAGGER_MS * 5}>
          <Skeleton className="h-4 w-28 rounded-sm" />
        </Block>
        <Block
          delay={BLOCK_STAGGER_MS * 6}
          className="border border-border p-4"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded-sm" />
            <Skeleton className="h-3.5 w-3/4 rounded-sm" />
          </div>
        </Block>
      </div>

      <div className="flex flex-col gap-4">
        <Block delay={BLOCK_STAGGER_MS * 7}>
          <Skeleton className="h-4 w-20 rounded-sm" />
        </Block>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
            key={i}
            className="flex items-center gap-2 justify-between"
          >
            <Block delay={BLOCK_STAGGER_MS * (7.5 + i * 0.5)}>
              <div className="flex items-center gap-2">
                <div className="bg-foreground/40 size-1" />
                <Skeleton className="h-4 w-40 rounded-sm" />
              </div>
            </Block>
            <Block delay={BLOCK_STAGGER_MS * (7.7 + i * 0.5)}>
              <Skeleton className="h-3 w-16 rounded-sm" />
            </Block>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Block delay={BLOCK_STAGGER_MS * 9}>
          <Skeleton className="h-4 w-28 rounded-sm" />
        </Block>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
            key={i}
            className="flex flex-col gap-2"
          >
            <Block delay={BLOCK_STAGGER_MS * (9.5 + i * 0.6)}>
              <Skeleton className="h-4 w-56 rounded-sm" />
            </Block>
            <Block delay={BLOCK_STAGGER_MS * (9.8 + i * 0.6)}>
              <Skeleton className="h-3.5 w-44 rounded-sm" />
            </Block>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PageSkeleton };
