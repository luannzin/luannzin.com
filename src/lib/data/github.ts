import { cacheLife, cacheTag } from "next/cache";
import { GITHUB_USERNAME as username } from "../config/constants";
import { parseGithubContributions } from "../github/contributions/parse-html";

export const github = {
  contributions: async () => {
    "use cache";
    cacheTag(username, "contributions");
    cacheLife("days");

    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    const contributions = parseGithubContributions(html);

    return contributions;
  },
};
