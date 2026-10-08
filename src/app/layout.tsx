import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Luan Fabri",
  description:
    "Front-end engineer at Loopscape. Building ERPs and multi-tenant platforms with React and Next.js, plus open source tools like echo and better-intl.",
  icons: { icon: "https://github.com/luannzin.png?size=64" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased font-sans ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
