"use client";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

// const metadata: Metadata = {
//   title: "luannzin • a software engineer",
//   description: "luannzin • a software engineer",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <title>luannzin • a software engineer</title>
        <meta name="description" content={"luannzin • a software engineer"} />
      </head>
      <body className={`${roboto.className} bg-white dark:bg-black`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
