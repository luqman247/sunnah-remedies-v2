import type { Metadata } from "next";
import { LOCALES, localeById, DEFAULT_LOCALE } from "@/i18n/locales";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sunnahremedies.com";

export function localeUrl(locale: string, path: string) {
  const prefix = localeById(locale).prefix;
  const clean = path.startsWith("/") ? path : `/${path}`;
  const suffix = clean === "/" ? "" : clean;
  return `${SITE}${prefix}${suffix}` || SITE;
}

export function buildMetadata(opts: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
  ogImage?: { asset?: { url?: string } } | string;
  noIndex?: boolean;
  alternates?: { lang: string; slug: string }[];
}): Metadata {
  const { locale, path, title, description, ogImage, noIndex, alternates } = opts;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const alt = alternates?.find((a) => a.lang === l.id);
    const p = alt ? path.replace(/[^/]+$/, alt.slug) : path;
    languages[l.htmlLang] = localeUrl(l.id, p);
  }
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path);

  const ogUrl = typeof ogImage === "string" ? ogImage : ogImage?.asset?.url;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, path),
      languages,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      url: localeUrl(locale, path),
      siteName: "Sunnah Remedies",
      locale: localeById(locale).intl.replace("-", "_"),
      alternateLocale: LOCALES.filter((l) => l.id !== locale).map((l) =>
        l.intl.replace("-", "_"),
      ),
      images: ogUrl ? [{ url: ogUrl }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || undefined,
      description: description || undefined,
      images: ogUrl ? [ogUrl] : undefined,
    },
  };
}
