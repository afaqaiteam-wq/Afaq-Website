import { NextResponse, type NextRequest } from "next/server";

/**
 * English is the default and has no prefix: `/contact` is served from the
 * `[lang]=en` routes by rewrite. `/en/...` redirects to the unprefixed URL so
 * each page has exactly one address. `/ar/...` passes straight through.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, generated social images and any file with an
  // extension (icons, robots.txt, sitemap.xml, images).
  matcher: ["/((?!api|_next|.*opengraph-image|.*\\..*).*)"],
};
