"use server";

import { intlConfig, type Locale, updateLocale } from "@/i18n/generated";

// Set from a Server Action, the cookie re-renders the page in the same round
// trip, and every route the client cached in the old language is dropped.
export async function changeLocale(locale: Locale) {
  if (intlConfig.locales.includes(locale)) await updateLocale(locale);
}
