import type { Metadata } from "next";
import { intlConfig, translations } from "@/i18n/generated";
import { localeOf } from "@/lib/lang";
import { openGraph } from "@/lib/site";

// Every page is prerendered once per language. The address never shows which:
// src/proxy.ts rewrites each request to the visitor's language.
export function generateStaticParams() {
  return intlConfig.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { meta } = translations[await localeOf(params)].app;
  return {
    description: meta.description,
    openGraph: {
      ...openGraph,
      locale: meta.ogLocale,
      type: "website",
      url: "/",
      title: "Luan Fabri",
      description: meta.description,
    },
  };
}

// Only the segment: the root layout above it holds the page chrome, so a
// language switch swaps what is under here and nothing else.
export default async function LanguageLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  await localeOf(params);
  return children;
}
