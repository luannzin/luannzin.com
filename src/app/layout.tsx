import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { description, openGraph, site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Mono only sets code and the footer's index.md link, never above the fold,
// so it loads when used instead of competing with Inter for the first paint.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

// Canonicals and the markdown alternates are set by each page: a child's
// `alternates` replaces the layout's whole, and the 404 page must have none.
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Luan Fabri", template: "%s · Luan Fabri" },
  description,
  openGraph: {
    ...openGraph,
    type: "website",
    url: "/",
    title: "Luan Fabri",
    description,
  },
  twitter: { card: "summary_large_image", creator: "@__luannzin" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased font-sans ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
