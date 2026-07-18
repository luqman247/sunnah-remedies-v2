import { getTranslations } from "next-intl/server";
import { buildStaticMetadata, type SeoOverrides } from "@/lib/seo/metadata";
import type { Metadata } from "next";

/**
 * Build locale-aware metadata for static pages from the `pages.{key}` namespace.
 */
export async function pageMetadata(
  key: string,
  path: string,
  overrides?: SeoOverrides,
): Promise<Metadata> {
  const t = await getTranslations(`pages.${key}` as "pages.home");
  const description = t.has("description") ? t("description") : undefined;
  return buildStaticMetadata(path, t("title"), description, overrides);
}
