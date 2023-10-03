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
  title: "luannzin, a web engineer",
  description:
    "Luan Fabri é um desenvolvedor web que se dedica a entregar eficiência, usabilidade e velocidade em suas aplicações.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" lang="pt-BR">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="luannzin, desenvolvedor web, web developer, reactjs, typescript, nextjs, Luan Fabri, luan, Fabri, desenvolvedor, front-end, front end"
        />
        <title>luannzin, a web developer</title>
        <meta name="subject" content="luannzin - desenvolvedor web." />
        <meta name="copyright" content="Luan Fabri" />
        <meta name="language" content="PT" />
        <meta name="robots" content="index, follow, nocache" />
        <meta
          name="googlebot"
          content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
        />
        <meta name="revised" content="Segunda-feira, 2 de Outubro de 2023" />
        <meta
          name="abstract"
          content="Luan Fabri é um desenvolvedor web que se dedica a entregar eficiência, usabilidade e velocidade em suas aplicações."
        />
        <meta name="topic" content="luannzin, a web developer" />
        <meta
          name="summary"
          content="Luan Fabri é um desenvolvedor web que se dedica a entregar eficiência, usabilidade e velocidade em suas aplicações."
        />

        <meta name="classification" content="Developer" />

        <meta name="author" content="Luan Fabri, luandaniel966@gmail.com" />

        <meta name="reply-to" content="luandaniel966@gmail.com" />

        <meta name="owner" content="Luan Fabri" />

        <meta name="url" content="http://www.luannzin.com.br" />

        <meta name="identifier-URL" content="https://luannzin.vercel.app/" />

        <meta name="directory" content="Developer, Web Developer" />

        <meta name="category" content="Developer, Web Developer" />

        <meta name="coverage" content="Brasil" />

        <meta name="distribution" content="Nacional" />

        <meta name="rating" content="Livre" />

        <meta name="revisit-after" content="7 dias" />

        <meta httpEquiv="Expires" content="0" />

        <meta httpEquiv="Pragma" content="no-cache" />

        <meta httpEquiv="Cache-Control" content="no-cache" />

        <meta content="yes" name="apple-mobile-web-app-capable" />

        <meta name="theme-color" content="#000009" />

        <meta name="theme-color" content="#000009" />

        <meta name="msapplication-navbutton-color" content="#000009" />

        <meta name="msapplication-TileColor" content="#000009" />

        <meta name="apple-mobile-web-app-status-bar-style" content="#000009" />

        <meta name="color-scheme" content="light" />

        <meta
          name="theme-color"
          content="#000009"
          media="(prefers-color-scheme: light)"
        />

        <meta
          name="theme-color"
          content="#FAFAFA"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={`${roboto.className} bg-white dark:bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
