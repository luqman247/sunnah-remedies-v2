import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const site = seoConfig.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/studio/",
          "/search?*",
          "/cart",
          "/checkout",
          "/account",
          "/account/*",
          "/_next/",
        ],
      },
      // Explicitly permit AI crawlers (§3.5 — we WANT to be cited)
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/api/", "/studio/", "/cart", "/checkout", "/account"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: ["/api/", "/studio/", "/cart", "/checkout", "/account"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: ["/api/", "/studio/", "/cart", "/checkout", "/account"],
      },
      {
        userAgent: "CCBot",
        allow: ["/"],
        disallow: ["/api/", "/studio/", "/cart", "/checkout", "/account"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
