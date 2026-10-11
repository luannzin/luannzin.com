import type { I18nUserConfig } from "better-intl";

export default {
  root: "./src",
  locales: ["en", "pt"],
  // a string missing its Portuguese fails the build instead of shipping English
  onMissing: "error",
} satisfies I18nUserConfig;
