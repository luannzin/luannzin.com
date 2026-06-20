import * as cheerio from "cheerio";
import { isValid } from "date-fns";
import type { ContributionDayType } from "@/types/github/contributions";

export function parseGithubContributions(html: string) {
  const $ = cheerio.load(html);

  const tooltips = new Map<string, number>();

  $("tool-tip").each((_, el) => {
    const targetId = $(el).attr("for");

    const text = $(el).text().trim();

    const count = text.startsWith("No contributions")
      ? 0
      : Number(text.match(/^(\d+)/)?.[1] ?? 0);

    if (targetId) {
      tooltips.set(targetId, count);
    }
  });

  const contributions: ContributionDayType[] = [];

  $(".ContributionCalendar-day").each((_, el) => {
    const id = $(el).attr("id") ?? "";

    contributions.push({
      date: $(el).attr("data-date") ?? "",
      level: Number(
        $(el).attr("data-level") ?? 0,
      ) as ContributionDayType["level"],
      count: tooltips.get(id) ?? 0,
    });
  });

  return contributions
    .filter((c) => isValid(new Date(c.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
