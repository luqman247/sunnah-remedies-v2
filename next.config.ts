import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/the-academy/hijama",
        destination: "/the-academy/hijama-diploma",
        permanent: true,
      },
      {
        source: "/the-academy/student-handbook",
        destination: "/the-academy/course-handbook",
        permanent: true,
      },
      {
        source: "/knowledge-library/dhikr",
        destination: "/knowledge-library/dua-dhikr",
        permanent: true,
      },
      // English is unprefixed (as-needed). Collapse accidental /en URLs.
      { source: "/en", destination: "/", permanent: false },
      { source: "/en/:path*", destination: "/:path*", permanent: false },
    ];
  },
  /**
   * Locale routing fallback for Next.js 16 when middleware/proxy is not
   * invoked for unprefixed paths. Mirrors next-intl `as-needed` + `/dk` prefix:
   * English lives at `/…`; Danish at `/dk/…`; internal segments remain `/en` and `/da`.
   *
   * English catch-all uses `afterFiles` so files under `public/` (brand,
   * photography, etc.) are served from disk and never rewritten to `/en/…`.
   * Danish and dhikr locale bridges stay in `beforeFiles` (no public-file collision).
   */
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/dk", destination: "/da" },
        { source: "/dk/:path*", destination: "/da/:path*" },
        // Locale-bound dhikr routes live under [locale]/knowledge/dhikr/*
        // while entity pages remain at /knowledge/[type]/[slug] (no locale).
        { source: "/knowledge/dhikr", destination: "/en/knowledge/dhikr" },
        {
          source: "/knowledge/dhikr/:path*",
          destination: "/en/knowledge/dhikr/:path*",
        },
      ],
      afterFiles: [
        {
          // Unprefixed English → internal /en/… (as-needed). Exclude:
          // - platform/api/assets
          // - explicit locale prefixes
          // - non-locale app trees (knowledge entities, staff, feeds)
          // Public static files are already resolved before afterFiles.
          source:
            "/:path((?!api|_next|_vercel|studio|en|da|dk|knowledge/|feeds|sitemaps|handbook|ops|intelligence|dhikr-review|dhikr-mdr-review|sign-in|llms\\.txt|llms-full\\.txt|robots\\.txt|sitemap\\.xml).*)",
          destination: "/en/:path",
        },
        {
          source: "/",
          destination: "/en",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
