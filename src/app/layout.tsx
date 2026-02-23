import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "./(routes)/_components/header";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    <html lang="pt-BR" suppressHydrationWarning className={outfit.className}>
      <body className="flex justify-center min-h-screen overflow-x-hidden">
        <main className="w-full max-w-2xl py-24">
          <Header />
          <ThemeProvider storageKey="@luannzin/theme" defaultTheme="system">
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
