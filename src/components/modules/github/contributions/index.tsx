import { t } from "@/i18n/generated";
import { GITHUB_USERNAME as username } from "@/lib/config/constants";

import { cn } from "@/lib/utils";
import type { ContributionDayType } from "@/types/github/contributions";
import { ContributionsHeatmap } from "./contributions-heatmap";
import { LEVEL_COLORS } from "./level-colors";

type ContributionsProps = {
  contributions: ContributionDayType[];
};

const Contributions = ({ contributions }: ContributionsProps) => {
  const total = contributions.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <span>
        {t.components.modules.github.contributions.title({
          total: total.toLocaleString(undefined, { useGrouping: true }),
        })}{" "}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          github.com/luannzin
        </a>
      </span>

      <ContributionsHeatmap contributions={contributions} />

      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-muted-foreground">
          {t.components.modules.github.contributions.less}
        </span>
        <div className="flex items-center gap-1">
          {Object.entries(LEVEL_COLORS).map(([level, color]) => (
            <div key={level} className={cn("size-2.5 rounded-[2px]", color)} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {t.components.modules.github.contributions.more}
        </span>
      </div>
    </div>
  );
};

export { Contributions };
