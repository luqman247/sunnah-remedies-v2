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

  // ── URL Normalisation (§3.3) ────────────────────────────────────
  // Lowercase paths
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    shouldRedirect = true;
  }

  // Strip trailing slash (except root)
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    shouldRedirect = true;
  }

  // Strip tracking parameters
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

  // ── Auth-protected routes (+ /sign-in itself) ───────────────────
  // /sign-in must be routed through authMiddleware too, not because it
  // requires auth, but so it never falls through to intlMiddleware below:
  // /sign-in is a (staff) route, outside the [locale] tree, and
  // intlMiddleware would otherwise rewrite it to a non-existent
  // /en/sign-in (404). withAuth's own pages.signIn exemption (it checks
  // `pathname === options.pages.signIn` and passes the request through
  // untouched) already handles this correctly once routed here.
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
  // Exclude Next.js file-based OG/Twitter image routes — they have no file
  // extension, so the generic `.*\\..*` exclusion does not cover them.
  // Without this, next-intl rewrites /opengraph-image → /en/opengraph-image (404).
  matcher: [
    "/((?!api|_next|_vercel|studio|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
