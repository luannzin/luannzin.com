import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

import { Providers } from "@/components/client/providers";
import { Header } from "./(routes)/_components/header";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "luannzin - a really good frontend developer",
  description: "luannzin is a really good frontend developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={figtree.className}>
      <body className="flex flex-col items-center min-h-screen overflow-x-hidden">
        <Providers>
          <Header /> <main className="w-full max-w-2xl py-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
