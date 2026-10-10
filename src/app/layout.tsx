import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Html } from "@/components/html";
import { LocaleToggle } from "@/components/locale-toggle";
import { intlConfig, type Locale, translations } from "@/i18n/generated";
import { revealScript } from "@/lib/locale-switch";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Mono only sets code and the footer's index.md link, never above the fold,
// so it loads when used instead of competing with Inter for the first paint.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

// Every page is built once per language and served from the CDN; the proxy
// only picks which copy. This keeps it so: the build fails if a page ever
// starts rendering per request.
export const ensureStatic = "navigation";

// The language-free part: [lang]/layout.tsx adds the description and Open
// Graph. Canonicals and the markdown alternates are set by each page: a
// child's `alternates` replaces the layout's whole, and the 404 page must have
// none.
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Luan Fabri", template: "%s · Luan Fabri" },
  twitter: { card: "summary_large_image", creator: "@__luannzin" },
};

// This layout sits above the language, so the picker gets its label in each.
const labels = Object.fromEntries(
  intlConfig.locales.map((locale) => [
    locale,
    translations[locale].app.language,
  ]),
) as Record<Locale, string>;

// The language lives in the [lang] segment below, so this layout and its
// HTML are the same in both. The reveal script marks <html> on a page a
// language switch loaded, hence suppressHydrationWarning.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Html
      className={`dark h-full antialiased font-sans ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a constant script from src/lib/locale-switch.ts */}
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <LocaleToggle labels={labels} />
        <Analytics />
      </body>
    </Html>
  );
}
