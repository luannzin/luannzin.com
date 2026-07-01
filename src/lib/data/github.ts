import { GITHUB_USERNAME as username } from "../config/constants";
import { parseGithubContributions } from "../github/contributions/parse-html";

export const github = {
  contributions: async () => {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        next: {
          revalidate: 60 * 60 * 24, // 1 day
          tags: [username, "contributions"],
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
