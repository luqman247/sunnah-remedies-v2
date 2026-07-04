/**
 * Image Sitemap — all content images with metadata from Sanity.
 *
 * Emits image:loc (Cloudinary URL), image:title, image:caption
 * drawn from Sanity alt/caption fields.
 */

import { NextResponse } from "next/server";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

interface ImageEntry {
  pageUrl: string;
  imageUrl: string;
  title?: string;
  caption?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const site = seoConfig.siteUrl;

  const images = await client
    .fetch<ImageEntry[]>(
      `*[defined(mainImage.asset) || defined(image.asset)] {
        "pageUrl": select(
          _type == "product" => "/the-apothecary/" + slug.current,
          _type == "article" => "/knowledge-library/" + slug.current,
          _type == "programme" => "/the-academy/" + slug.current,
          _type == "journey" => "/sacred-journeys/" + slug.current,
          _type == "ingredient" => "/knowledge/ingredient/" + slug.current,
          "/" + slug.current
        ),
        "imageUrl": coalesce(mainImage.asset->url, image.asset->url),
        "title": coalesce(mainImage.alt, image.alt, title, name),
        "caption": coalesce(mainImage.caption, image.caption)
      }[defined(imageUrl)]`
    )
    .catch(() => []);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images
  .map(
    (img) => `  <url>
    <loc>${site}${img.pageUrl}</loc>
    <image:image>
      <image:loc>${escapeXml(img.imageUrl)}</image:loc>
${img.title ? `      <image:title>${escapeXml(img.title)}</image:title>` : ""}
${img.caption ? `      <image:caption>${escapeXml(img.caption)}</image:caption>` : ""}
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
