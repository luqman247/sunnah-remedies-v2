import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://sunnahremedies.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
