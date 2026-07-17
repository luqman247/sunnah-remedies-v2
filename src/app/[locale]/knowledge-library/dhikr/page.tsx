import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { DhikrTimeNavigation } from "@/components/dhikr/DhikrTimeNavigation";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import {
  getDhikrItemsPublic,
  getDhikrCategoriesPublic,
} from "@/sanity/lib/dhikr-public-fetch";

/**
 * Daily Dhikr — public Knowledge Library landing page.
 *
 * Data comes exclusively from src/sanity/lib/dhikr-public-fetch.ts, which
 * consumes the canonical eligibility gate (src/sanity/lib/dhikr-publication-
 * gate.ts) inside its query filter. This page never imports the staff-only
 * src/sanity/lib/dhikr-fetch.ts and never references
 * DHIKR_V1_PLACEHOLDER_REGISTER — nothing rendered here can be an
 * unreviewed, unapproved, or placeholder record.
 *
 * No category or item-detail route exists yet (see
 * docs/dhikr/21-decision-log.md, ADR-015). While zero eligible items exist,
 * any grouped-by-category content below is unreachable dead code exercised
 * only once Stage 4 (category route) ships — until then it renders nothing
 * and the approved empty state is shown instead.
 *
 * @see docs/dhikr/19-implementation-roadmap.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("dhikr", "/knowledge-library/dhikr");
}

export default async function DhikrLandingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dhikr");
  const tNav = await getTranslations("nav");

  const [items, categories] = await Promise.all([
    getDhikrItemsPublic(),
    getDhikrCategoriesPublic(),
  ]);

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="ii"
      currentHref="/knowledge-library/dhikr"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: t("breadcrumb") },
      ]}
      intro={<DhikrTimeNavigation />}
    >
      <section aria-labelledby="dhikr-about-heading" className="policy-block">
        <h2 id="dhikr-about-heading" className="section-label">
          {t("landing.aboutHeading")}
        </h2>
        <p className="type-body">{t("landing.aboutBody1")}</p>
        <p className="type-body">{t("landing.aboutBody2")}</p>
      </section>

      <section aria-labelledby="dhikr-language-heading" className="policy-block">
        <h2 id="dhikr-language-heading" className="section-label">
          {t("landing.languageHeading")}
        </h2>
        <p className="type-body">{t("landing.languageBody1")}</p>
        <p className="type-body">{t("landing.languageBody2")}</p>
      </section>

      {items.length === 0 ? (
        <section aria-labelledby="dhikr-empty-state-heading" className="policy-block">
          <h2 id="dhikr-empty-state-heading" className="section-label">
            {t("emptyState.heading")}
          </h2>
          <p className="type-body">{t("emptyState.body")}</p>
        </section>
      ) : (
        <section aria-labelledby="dhikr-categories-heading" className="policy-block">
          <h2 id="dhikr-categories-heading" className="section-label">
            {t("landing.categoriesHeading")}
          </h2>
          <ul className="pathway-group__list">
            {categories.map((category) => (
              <li key={category.slug}>
                {locale === "da" && category.nameDa ? category.nameDa : category.name}
                <ul>
                  {category.items.map((item) => (
                    <li key={item._id}>
                      {locale === "da" && item.titleDa ? item.titleDa : item.titleEn}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SectionPage>
  );
}
