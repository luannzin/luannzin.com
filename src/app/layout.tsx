import { GeistSans as Geist } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "luannzin - mid-level frontend developer",
  description:
    "Mid-Level Front-end Developer (React & Next.js) | Strong JS/TS, Tailwind CSS, Node.js Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${Geist.className} antialiased flex items-center justify-center w-screen h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
