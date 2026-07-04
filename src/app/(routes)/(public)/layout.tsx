import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";

import { Providers } from "@/components/client/providers";
import { setLocale } from "@/i18n/generated";
import { cn } from "@/lib/utils";
import { PublicFooter } from "./_components/public-footer";
import { PublicHeader } from "./_components/public-header";
import { PublicSidebar } from "./_components/public-sidebar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "@luannzin - frontend developer crafting calm, intuitive interfaces.",
  description: "frontend developer crafting calm, intuitive interfaces.",

  icons: {
    icon: "https://github.com/luannzin.png",
  },
};

export const instant = false;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await setLocale();

  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased tracking-tight", geist.className)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col items-center">
        <Providers>
          <div className="max-w-5xl w-full flex flex-col gap-8 h-screen">
            <PublicHeader />
            <div className="flex gap-12 flex-1">
              <PublicSidebar />
              {children}
            </div>
            <PublicFooter locale={locale} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
