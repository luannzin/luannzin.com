import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { LocaleToggle } from "@/components/locale-toggle";
import { setLocale, t } from "@/i18n/generated";
import { openGraph, site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Mono only sets code and the footer's index.md link, never above the fold,
// so it loads when used instead of competing with Inter for the first paint.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

// The language comes from the request (the `locale` cookie, else
// Accept-Language), so every page renders per request: there is no static
// shell to validate.
export const instant = false;

// Canonicals and the markdown alternates are set by each page: a child's
// `alternates` replaces the layout's whole, and the 404 page must have none.
export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  const description = t.app.meta.description;
  return {
    metadataBase: new URL(site),
    title: { default: "Luan Fabri", template: "%s · Luan Fabri" },
    description,
    openGraph: {
      ...openGraph,
      locale: t.app.meta.ogLocale,
      type: "website",
      url: "/",
      title: "Luan Fabri",
      description,
    },
    twitter: { card: "summary_large_image", creator: "@__luannzin" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await setLocale();

  return (
    <html
      lang={locale}
      className={`dark h-full antialiased font-sans ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {/* A language switch cross-fades the page; navigations don't. */}
        <ViewTransition
          update={{ locale: "auto", default: "none" }}
          default="none"
        >
          {children}
        </ViewTransition>
        <LocaleToggle locale={locale} label={t.app.language} />
        <Analytics />
      </body>
    </html>
  );
}
