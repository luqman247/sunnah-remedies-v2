import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { buildStaticMetadata, localeUrl } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/locales";
import type { Metadata } from "next";

/**
 * Build locale-aware metadata for static pages from the `pages.{key}` namespace.
 * Canonical and hreflang use public prefixes (`/` and `/dk`), never internal `/da`.
 */
export async function pageMetadata(
  key: string,
  path: string,
  locale?: AppLocale,
): Promise<Metadata> {
  if (locale) setRequestLocale(locale);
  const resolvedLocale = (locale ?? (await getLocale())) as AppLocale;
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: `pages.${key}` as "pages.home",
  });
  const description = t.has("description") ? t("description") : undefined;
  const base = buildStaticMetadata(path, t("title"), description);
  const canonical = localeUrl(resolvedLocale, path);

  return {
    ...base,
    alternates: {
      canonical,
      languages: {
        en: localeUrl("en", path),
        da: localeUrl("da", path),
        "x-default": localeUrl("en", path),
      },
    },
    openGraph: {
      ...base.openGraph,
      url: canonical,
      locale: resolvedLocale === "da" ? "da_DK" : "en_GB",
    },
  };
}
