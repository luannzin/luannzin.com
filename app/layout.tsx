import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "luannzin · Software Engineer and UX Designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" lang="pt-BR">
      <head>
        <meta
          name="title"
          content={"luannzin · Software Engineer and UX Designer"}
          key="title"
        />
        <meta
          property="og:title"
          content={"luannzin · Software Engineer and UX Designer"}
          key="og:title"
        />
        <meta
          property="twitter:title"
          content={"luannzin · Software Engineer and UX Designer"}
          key="twitter:title"
        />
        <meta
          name="description"
          content={"Software Engineer and UX Designer"}
          key="description"
        />
        <meta
          property="og:description"
          content={"Software Engineer and UX Designer"}
          key="og:description"
        />
        <meta
          property="twitter:description"
          content={"Software Engineer and UX Designer"}
          key="twitter:description"
        />
        <link rel="canonical" href={"https://luannzin.com/"} key="canonical" />
        <meta
          property="og:url"
          content={"https://luannzin.com/"}
          key="og:url"
        />
        <meta
          property="twitter:url"
          content={"https://luannzin.com/"}
          key="twitter:url"
        />
        <meta property="article:author" content={"luannzin"} />
        <meta property="article:section" content="tecnologia" />
        <meta
          property="article:published_time"
          content={new Date().toISOString()}
        />
        <meta
          property="article:modified_time"
          content={new Date().toISOString()}
        />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="luannzin, desenvolvedor web, web developer, software engineer, typescript, nextjs, reactjs, Luan Fabri, desenvolvedor, front-end, front end"
        />
        <meta
          name="subject"
          content="luannzin · Software Engineer and UX Designer"
        />
        <meta name="copyright" content="Luan Fabri" />
        <meta name="language" content="PT" />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
        />
        <meta name="revised" content="Sábado, 7 de Outubro de 2023" />
        <meta name="abstract" content="Software Engineer and UX Designer" />
        <meta
          name="topic"
          content="luannzin · Software Engineer and UX Designer"
        />
        <meta name="summary" content="Software Engineer and UX Designer" />

        <meta name="classification" content="Developer" />

        <meta name="author" content="luannzin" />

        <meta name="reply-to" content="luandaniel966@gmail.com" />

        <meta name="owner" content="luannzin" />

        <meta name="url" content="http://www.luannzin.com" />

        <meta name="identifier-URL" content="https://luannzin.com/" />

        <meta name="directory" content="Software, Software Engineer" />

        <meta name="category" content="Software, Software Engineer" />

        <meta name="coverage" content="Brasil" />

        <meta name="distribution" content="Nacional" />

        <meta name="rating" content="Livre" />

        <meta name="revisit-after" content="7 dias" />

        <meta httpEquiv="Expires" content="0" />

        <meta httpEquiv="Pragma" content="no-cache" />

        <meta httpEquiv="Cache-Control" content="no-cache" />

        <meta content="yes" name="apple-mobile-web-app-capable" />

        <meta name="theme-color" content="#121214" />

        <meta name="theme-color" content="#121214" />

        <meta name="msapplication-navbutton-color" content="#121214" />

        <meta name="msapplication-TileColor" content="#121214" />

        <meta name="apple-mobile-web-app-status-bar-style" content="#121214" />

        <meta name="color-scheme" content="light" />

        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />

        <meta
          name="theme-color"
          content="#FAFAFA"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`${roboto.className} bg-gradient-to-b from-white-300 to-white-500 dark:from-black-400 dark:to-black-500`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
