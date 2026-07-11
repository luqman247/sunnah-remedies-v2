import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Inline Studio-only preview vars into the client bundle so document
  // actions (Preview Draft) can build /api/draft URLs. Same pattern as
  // sanity.config.ts presentationTool — editors with Studio access only.
  env: {
    SANITY_STUDIO_PREVIEW_SECRET:
      process.env.SANITY_STUDIO_PREVIEW_SECRET ||
      process.env.SANITY_PREVIEW_SECRET ||
      "",
    SANITY_STUDIO_SITE_URL:
      process.env.SANITY_STUDIO_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "",
  },
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
    ];
  },
};

export default withNextIntl(nextConfig);
