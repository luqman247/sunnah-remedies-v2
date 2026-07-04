/**
 * Video Sitemap — video entities with structured metadata.
 *
 * Emits video:thumbnail_loc, video:title, video:description,
 * video:content_loc/player_loc, video:duration, video:publication_date.
 */

import { NextResponse } from "next/server";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-static";
export const revalidate = 86400;

interface VideoEntry {
  pageUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  playerUrl?: string;
  duration?: number;
  publicationDate?: string;
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

  const videos = await client
    .fetch<VideoEntry[]>(
      `*[_type == "videoAsset" && defined(url)] {
        "pageUrl": "/videos/" + slug.current,
        "title": title,
        "description": coalesce(description, title),
        "thumbnailUrl": coalesce(thumbnail.asset->url, poster.asset->url, ""),
        "contentUrl": url,
        "playerUrl": embedUrl,
        "duration": duration,
        "publicationDate": publishedAt
      }`
    )
    .catch(() => []);

  if (videos.length === 0) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`,
      { headers: { "Content-Type": "application/xml; charset=utf-8" } }
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos
  .map(
    (v) => `  <url>
    <loc>${site}${v.pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(v.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
${v.contentUrl ? `      <video:content_loc>${escapeXml(v.contentUrl)}</video:content_loc>` : ""}
${v.playerUrl ? `      <video:player_loc>${escapeXml(v.playerUrl)}</video:player_loc>` : ""}
${v.duration ? `      <video:duration>${v.duration}</video:duration>` : ""}
${v.publicationDate ? `      <video:publication_date>${v.publicationDate}</video:publication_date>` : ""}
    </video:video>
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
