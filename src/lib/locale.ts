"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { intlConfig, type Locale, updateLocale } from "@/i18n/generated";

// Set from a Server Action, the cookie re-renders the page in the same round
// trip, and every route the client cached in the old language is dropped.
// A /pt address is always Portuguese (src/proxy.ts), so leaving Portuguese
// there also leaves the address: the page it came from, without /pt.
export async function changeLocale(locale: Locale) {
  if (!intlConfig.locales.includes(locale)) return;
  await updateLocale(locale);
  const from = (await headers()).get("referer");
  const path = from ? new URL(from).pathname : "";
  if (locale !== "pt" && (path === "/pt" || path.startsWith("/pt/"))) {
    redirect(path.slice(3) || "/");
  }
}
