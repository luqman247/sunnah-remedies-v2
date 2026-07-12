import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Do not inline privileged secrets (AI admin tokens, preview secrets) into
  // the client/Studio bundle. Studio auth uses the editor's Sanity session
  // token, validated server-side. Site origin alone is safe to expose.
  env: {
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
