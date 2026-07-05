import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SearchInterface } from "@/components/search/SearchInterface";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("search", "/search");
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.search" });

  return (
    <div className="leaf" style={{ minHeight: "60vh" }}>
      <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
        <h1 className="type-display-l" style={{ marginBottom: "var(--s5)" }}>
          {t("heading")}
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          {t("description")}
        </p>

        <Suspense fallback={<div style={{ height: "200px" }} />}>
          <SearchInterface />
        </Suspense>

        <div style={{ marginTop: "var(--s8)" }}>
          <h2 className="type-eyebrow" style={{ marginBottom: "var(--s4)" }}>
            {t("popularHeading")}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)" }}>
            {(t.raw("popularTerms") as string[]).map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="quiet-link"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
