"use client";

import type { ComponentType } from "react";
import {
  DefaultTooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GITHUB_USERNAME as username } from "@/lib/config/constants";
import { formatToLocalDate } from "@/lib/helpers/formatters/format-to-local-date";
import { cn } from "@/lib/utils";
import type { ContributionDayType } from "@/types/github/contributions";
import { LEVEL_COLORS } from "./level-colors";

type ContributionsHeatmapProps = {
  contributions: ContributionDayType[];
};

const tooltipHandle = TooltipCreateHandle<ComponentType>();

const HEATMAP_ROWS = 7;
const HEATMAP_STAGGER_MS = 14;

const ContributionsHeatmap = ({ contributions }: ContributionsHeatmapProps) => {
  const total = contributions.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <span>
        {total.toLocaleString(undefined, { useGrouping: true })} contributions
        in the last year to{" "}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          github.com/luannzin
        </a>
      </span>

      <div className="grid grid-flow-col grid-rows-7">
        {contributions.map((c, index) => {
          const row = index % HEATMAP_ROWS;
          const col = Math.floor(index / HEATMAP_ROWS);
          const delay = (row + col) * HEATMAP_STAGGER_MS;

          const date = formatToLocalDate(c.date);

          return (
            <TooltipTrigger
              key={c.date}
              handle={tooltipHandle}
              payload={() => (
                <span>
                  {c.count} contributions on{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    month: "long",
                    day: "numeric",
                  }).format(date)}
                </span>
              )}
              render={
                <a
                  href={`https://github.com/${username}?tab=overview&from=${c.date}&to=${c.date}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    title={`${c.count} contributions`}
                    style={{
                      animationDelay: `${delay}ms`,
                    }}
                    className={cn(
                      "size-2.5 rounded-[2px] m-0.5 opacity-0 animate-contribution-fade-in",
                      LEVEL_COLORS[c.level],
                    )}
                  />
                </a>
              }
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex items-center gap-1">
          {Object.entries(LEVEL_COLORS).map(([level, color]) => (
            <div key={level} className={cn("size-2.5 rounded-[2px]", color)} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>

      <DefaultTooltip handle={tooltipHandle}>
        {({ payload: Payload }) => (
          <TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
        )}
      </DefaultTooltip>
    </div>
  );
};

export { ContributionsHeatmap };
