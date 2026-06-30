import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const HEATMAP_ROWS = 7;
const HEATMAP_COLS = 53;
const HEATMAP_CELL_STAGGER_MS = 7;
const HEATMAP_CELL_BASE_MS = 220;

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

type LineProps = {
  delay: number;
  /** wrapper height = real text line-height (prevents layout shift on swap) */
  line: string;
  /** visible bar width/height, centered within the line box */
  bar: string;
};

/** A single animated text line: bar height matches glyph, box height matches line-height. */
const Line = ({ delay, line, bar }: LineProps) => (
  <Block delay={delay} className={cn("flex items-center", line)}>
    <Skeleton className={cn("rounded-sm", bar)} />
  </Block>
);

const PageSkeleton = () => {
  return (
    <div
      aria-hidden
      aria-busy
      className="flex flex-col gap-8 w-full select-none"
    >
      {/* Profile — flex items-center gap-4 */}
      <div className="flex items-center gap-4">
        <Block delay={0}>
          {/* size-14 rounded-xl border-2 avatar */}
          <Skeleton className="size-14 rounded-xl" />
        </Block>
        <div className="flex flex-col gap-0">
          {/* name: text-xl font-semibold leading-tight ("luan") */}
          <Line delay={60} line="h-[25px]" bar="h-[18px] w-11" />
          {/* username: text-sm text-muted-foreground ("@luannzin") */}
          <Line delay={110} line="h-5" bar="h-3.5 w-16" />
        </div>
      </div>

      {/* Contributions — flex flex-col gap-2 */}
      <div className="flex flex-col gap-2">
        {/* title span: text-base + inline link */}
        <Line delay={170} line="h-6" bar="h-4 w-96" />

        {/* grid grid-flow-col grid-rows-7, cells size-2.5 rounded-[2px] m-0.5 */}
        <div className="grid grid-flow-col grid-rows-7">
          {Array.from({ length: HEATMAP_ROWS * HEATMAP_COLS }).map((_, i) => {
            const row = i % HEATMAP_ROWS;
            const col = Math.floor(i / HEATMAP_ROWS);
            const delay =
              HEATMAP_CELL_BASE_MS + (row + col) * HEATMAP_CELL_STAGGER_MS;

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

        {/* legend — flex items-center gap-2 justify-end */}
        <div className="flex items-center gap-2 justify-end">
          {/* "less" text-xs */}
          <Line delay={300} line="h-4" bar="h-3 w-7" />
          {/* 5 level swatches: size-2.5 rounded-[2px], gap-1 */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder legend
                key={i}
                style={{ animationDelay: `${320 + i * 18}ms` }}
                className="size-2.5 rounded-[2px] bg-muted opacity-0 animate-page-skeleton"
              />
            ))}
          </div>
          {/* "more" text-xs */}
          <Line delay={410} line="h-4" bar="h-3 w-8" />
        </div>
      </div>

      {/* Projects — flex flex-col gap-4 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          {/* title text-base */}
          <Line delay={470} line="h-6" bar="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* ProjectCard: border border-border p-4, inner flex flex-col gap-2 */}
          <Block delay={540} className="border border-border p-4">
            <div className="flex flex-col gap-2">
              {/* name text-base */}
              <div className="flex items-center h-6">
                <Skeleton className="h-4 w-40 rounded-sm" />
              </div>
              {/* description text-sm text-muted-foreground (single line) */}
              <div className="flex items-center h-5">
                <Skeleton className="h-3.5 w-2/3 rounded-sm" />
              </div>
            </div>
          </Block>
        </div>
      </div>

      {/* Blog — flex flex-col gap-4, 1 post */}
      <div className="flex flex-col gap-4">
        {/* "Writing" text-base */}
        <Line delay={620} line="h-6" bar="h-4 w-16" />
        <div className="flex items-center gap-2 justify-between">
          {/* link: flex items-center gap-2 (dot size-1 + title font-medium) */}
          <Block delay={680} className="flex items-center gap-2 h-6">
            <div className="bg-muted-foreground/30 size-1" />
            <Skeleton className="h-4 w-72 rounded-sm" />
          </Block>
          {/* date text-xs text-muted-foreground */}
          <Line delay={720} line="h-4" bar="h-3 w-16" />
        </div>
      </div>

      {/* Experience — flex flex-col gap-4, 1 company */}
      <div className="flex flex-col gap-4">
        {/* "Professional" text-base */}
        <Line delay={800} line="h-6" bar="h-4 w-28" />
        {/* item: flex flex-col (gap-0) */}
        <div className="flex flex-col">
          {/* row: flex items-center gap-2 — date • company */}
          <div className="flex items-center gap-2">
            <Line delay={860} line="h-6" bar="h-4 w-36" />
            <div className="size-1 rounded-full bg-muted-foreground/30" />
            <Line delay={910} line="h-6" bar="h-4 w-40" />
          </div>
          {/* "from <role> to <role>" text-sm text-muted-foreground */}
          <Line delay={970} line="h-5" bar="h-3.5 w-96" />
        </div>
      </div>
    </div>
  );
};

export { PageSkeleton };
