import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/locales";
import { localeUrl } from "@/lib/seo/metadata";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/the-apothecary",
    "/the-apothecary/catalogue",
    "/the-apothecary/monographs",
    "/the-apothecary/ingredients",
    "/the-apothecary/quality-standards",
    "/the-apothecary/laboratory-verification",
    "/the-apothecary/faqs",
    "/the-academy",
    "/the-academy/curriculum",
    "/the-academy/faculty",
    "/the-academy/enrolment",
    "/the-academy/foundations",
    "/sacred-journeys",
    "/knowledge-library",
    "/consultations",
    "/charter",
    "/correspondence",
    "/institute",
    "/calendar",
    "/exhibitions",
    "/research",
    "/press",
  ];

  const [products, programmes, journeys, articles] = await Promise.all([
    client.fetch<{ slug: string; language: string }[]>(
      `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, language }`,
    ).catch(() => []),
    client.fetch<{ slug: string; language: string }[]>(
      `*[_type == "programme" && defined(slug.current)]{ "slug": slug.current, language }`,
    ).catch(() => []),
    client.fetch<{ slug: string; language: string }[]>(
      `*[_type == "journey" && defined(slug.current)]{ "slug": slug.current, language }`,
    ).catch(() => []),
    client.fetch<{ slug: string; language: string }[]>(
      `*[_type == "article" && defined(slug.current)]{ "slug": slug.current, language }`,
    ).catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: localeUrl("en", path),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l.htmlLang, localeUrl(l.id, path)]),
        ),
      },
    });
  }

  for (const p of products) {
    entries.push({
      url: localeUrl(p.language || "en", `/the-apothecary/${p.slug}`),
      lastModified: new Date(),
    });
  }

  for (const p of programmes) {
    entries.push({
      url: localeUrl(p.language || "en", `/the-academy/${p.slug}`),
      lastModified: new Date(),
    });
  }

  for (const j of journeys) {
    entries.push({
      url: localeUrl(j.language || "en", `/sacred-journeys/${j.slug}`),
      lastModified: new Date(),
    });
  }

  for (const a of articles) {
    entries.push({
      url: localeUrl(a.language || "en", `/knowledge-library/${a.slug}`),
      lastModified: new Date(),
    });
  }

  return entries;
}
