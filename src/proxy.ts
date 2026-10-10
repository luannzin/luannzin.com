import { matchLocale } from "better-intl/runtime";
import { type NextRequest, NextResponse } from "next/server";
import intl from "../intl.config";

// Every page is prerendered once per language, under a [lang] segment the
// address never shows. This sends each request to the visitor's language: the
// one they picked (the cookie), else their browser's, else the default. The
// pages stay static: only the choice of copy happens per request.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // already in a language: a post's Open Graph image, or a direct link
  if (
    intl.locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )
  ) {
    return;
  }

  // Not better-intl's detectLocale: it also tries `navigator.language`, which
  // on the server (Node 21+) is the machine's own language, not the visitor's.
  const candidates = [
    request.cookies.get(intl.storage.key)?.value ?? "",
    ...(request.headers.get("accept-language") ?? "")
      .split(",")
      .map((tag) => tag.split(";")[0].trim()),
  ];
  const locale =
    candidates.map((tag) => matchLocale(tag, intl.locales)).find(Boolean) ??
    intl.defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

// Pages only: not Next's own paths (they start with _), nothing with an
// extension (images, the .md twins, sitemap.xml, robots.txt), and not the home
// page's Open Graph image, which sits above the language.
export const config = {
  matcher: ["/((?!_|opengraph-image|.*\\.).*)"],
};
