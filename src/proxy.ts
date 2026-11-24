import { type NextRequest, NextResponse } from "next/server";

// Every page is also at /pt, in Portuguese, so search engines can index both
// languages (they send no locale cookie and read the pages in English). The
// path is served as the page without /pt, with the locale cookie set to pt on
// the request, so the page renders in it, and on the response, so the links
// out of it stay in Portuguese. The pages point at both addresses (hreflang,
// `languages` in @/lib/site).
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = url.pathname.slice(3) || "/";
  request.cookies.set("locale", "pt");
  const response = NextResponse.rewrite(url, {
    request: { headers: request.headers },
  });
  // better-intl's own cookie: same name, path and lifetime (updateLocale)
  response.cookies.set("locale", "pt", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = { matcher: ["/pt", "/pt/:path*"] };
