"use client";

import type { ComponentType } from "react";
import {
  DefaultTooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { t } from "@/i18n/generated";
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
  return (
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
                {t.components.modules.github.contributions.tooltip({
                  count: c.count.toLocaleString(undefined, {
                    useGrouping: true,
                  }),
                  date: new Intl.DateTimeFormat(undefined, {
                    month: "long",
                    day: "numeric",
                  }).format(date),
                })}
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

      <DefaultTooltip handle={tooltipHandle}>
        {({ payload: Payload }) => (
          <TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
        )}
      </DefaultTooltip>
    </div>
  );
};

export { ContributionsHeatmap };
