import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { Suspense } from "react";
import { Providers } from "@/components/client/providers";
import { setLocale } from "@/i18n/generated";
import { cn } from "@/lib/utils";
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

const Localized = async ({ children }: { children: React.ReactNode }) => {
  await setLocale();
  return children;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full", "antialiased tracking-tight", geist.className)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col items-center">
        <Providers>
          <div className="max-w-5xl w-full flex flex-col gap-8">
            <PublicHeader />
            <div className="flex gap-12">
              <PublicSidebar />
              <Suspense fallback={null}>
                <Localized>{children}</Localized>
              </Suspense>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
