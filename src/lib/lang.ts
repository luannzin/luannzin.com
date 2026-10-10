import { notFound } from "next/navigation";
import { type Locale, translations } from "@/i18n/generated";

// The [lang] segment's value as a locale. The proxy skips paths with a dot, so
// a request like /favicon.ico reaches the segment as its "language": a 404.
export async function localeOf(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!Object.hasOwn(translations, lang)) notFound();
  return lang as Locale;
}
