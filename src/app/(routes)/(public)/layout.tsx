import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/client/providers";
import { cn } from "@/lib/utils";
import { PublicHeader } from "./_components/public-header";
import { PublicSidebar } from "./_components/public-sidebar";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        interHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col items-center">
        <Providers>
          <div className="max-w-5xl w-full flex flex-col gap-8">
            <PublicHeader />
            <div className="flex justify-between gap-4">
              <PublicSidebar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
