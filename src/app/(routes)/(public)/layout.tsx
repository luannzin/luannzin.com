import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/client/providers";
import { cn } from "@/lib/utils";
import { PublicHeader } from "./_components/public-header";
import { PublicSidebar } from "./_components/public-sidebar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "@luannzin - a really good frontend developer",
  description: "luannzin is a really good frontend developer",

  icons: {
    icon: "https://github.com/luannzin.png",
  },
};

export default function RootLayout({
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
            <div className="flex justify-between gap-8">
              <PublicSidebar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
