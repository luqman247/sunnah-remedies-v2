import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth({
  pages: { signIn: "/sign-in" },
});

/** Tracking parameters to strip from canonicals */
const STRIP_PARAMS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "fbclid", "ref", "mc_cid", "mc_eid",
]);

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = req.nextUrl.clone();
  let shouldRedirect = false;

  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    shouldRedirect = true;
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    shouldRedirect = true;
  }

  if (search) {
    let paramsChanged = false;
    for (const key of [...url.searchParams.keys()]) {
      if (STRIP_PARAMS.has(key)) {
        url.searchParams.delete(key);
        paramsChanged = true;
      }
    }
    if (paramsChanged) shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, 301);
  }

  if (
    pathname.startsWith("/handbook") ||
    pathname.startsWith("/ops") ||
    pathname.startsWith("/intelligence") ||
    pathname.startsWith("/dhikr-review") ||
    pathname.startsWith("/dhikr-mdr-review") ||
    pathname.startsWith("/sign-in")
  ) {
    return (authMiddleware as (req: NextRequest) => NextResponse)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next|_vercel|studio|.*\\..*).*)",
  ],
};
