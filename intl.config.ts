import { locales } from "@/config/locales";
import type { I18nUserConfig } from "better-intl";

export default {
  // Directory scanned for colocated `t.ts` files.
  root: "./src",

  // Where the generated module is written.
  out: "./src/i18n/generated.ts",

  // Canonical locale + ultimate fallback.
  defaultLocale: locales[0].code,
  locales: locales.map((locale) => locale.code),

  // "error" | "warn" | "silent" — behaviour when a key misses a locale.
  onMissing: "warn",

  // Where the active locale preference is persisted (cookie is the only store).
  storage: { type: "cookie", key: "locale" },
} satisfies I18nUserConfig;
