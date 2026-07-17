import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { DhikrTimeNavigation } from "@/components/dhikr/DhikrTimeNavigation";
import { Link } from "@/i18n/navigation";
import { DhikrTimingIcon } from "@/components/dhikr/DhikrTimingIcon";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { getEveningDhikrItemsPublic, type DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import {
  getPendingEveningReferenceCollection,
  getEveningEligibleTotalCount,
} from "@/lib/dhikr-research/public-reference-projection";
import { EveningDhikrCollection } from "./EveningDhikrCollection";
import "./evening-dhikr.css";

/**
 * Evening Dhikr — public route.
 *
 * Structurally identical two-source model to Morning Dhikr
 * (src/app/[locale]/knowledge/dhikr/morning/page.tsx) but fed by
 * INDEPENDENTLY defined, Evening-specific data functions — never Morning's:
 *  - getEveningDhikrItemsPublic() (src/sanity/lib/dhikr-public-fetch.ts):
 *    the "Editorially reviewed" section. Filters on approved timingLabel
 *    "evening-only" or "morning-and-evening" — never "morning-only".
 *  - getPendingEveningReferenceCollection() (src/lib/dhikr-research/public-
 *    reference-projection.ts): the "Reference collection" section — a
 *    strict, documented-timing-filtered subset of the pending register,
 *    narrowed to the same public-safe projection used by Morning.
 *
 * This route never imports the staff-only internal Sanity read module, and
 * never reads the raw research-register source file or its types module
 * directly — only the two projection modules above. It never fabricates a
 * dua, and never includes a record merely because it appears on Morning —
 * see tests/dhikr/dhikr-evening-eligibility.test.ts.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("dhikrEvening", "/knowledge/dhikr/evening");
}

export default async function EveningDhikrPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dhikrEvening");
  const tNav = await getTranslations("nav");

  let items: DhikrItemPublic[] = [];
  let loadFailed = false;
  try {
    items = await getEveningDhikrItemsPublic();
  } catch {
    loadFailed = true;
  }

  const publishedIds = items.map((item) => item.mdrSourceId).filter((id): id is string => !!id);
  const referenceEntries = loadFailed ? [] : getPendingEveningReferenceCollection(publishedIds);
  const totalCount = getEveningEligibleTotalCount();

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="iv"
      currentHref="/knowledge-library/dhikr"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: t("breadcrumb") },
      ]}
      intro={<DhikrTimeNavigation activeTime="evening" />}
    >
      {loadFailed ? (
        <section aria-labelledby="evening-dhikr-error-heading" className="evening-dhikr-error-state">
          <h2 id="evening-dhikr-error-heading" className="evening-dhikr-error-state__heading">
            {t("errorState.heading")}
          </h2>
          <p className="type-body">{t("errorState.body")}</p>
        </section>
      ) : items.length === 0 && referenceEntries.length === 0 ? (
        <section aria-labelledby="evening-dhikr-empty-heading" className="evening-dhikr-empty-state">
          <h2 id="evening-dhikr-empty-heading" className="evening-dhikr-empty-state__heading">
            {t("emptyState.heading")}
          </h2>
          <p className="type-body">{t("emptyState.body")}</p>
        </section>
      ) : (
        <>
          {/* Literal, launch-specific copy — mirrors Morning's approach:
              intentionally not auto-generated so it can never overstate the
              collection's status. */}
          <div className="evening-dhikr-collection-intro">
            <svg className="evening-dhikr-horizon" viewBox="0 0 220 22" aria-hidden="true" focusable="false">
              <path d="M2 18h216" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              <circle cx="30" cy="7" r="1.4" fill="currentColor" />
              <circle cx="112" cy="4" r="1.1" fill="currentColor" />
              <circle cx="185" cy="9" r="1.6" fill="currentColor" />
            </svg>
            <h2 className="evening-dhikr-collection-intro__heading">
              <DhikrTimingIcon name="evening" />
              {t("collectionIntroHeading")}
            </h2>
            <p className="type-body">{t("collectionIntroBody")}</p>
          </div>

          <EveningDhikrCollection
            locale={locale}
            items={items}
            referenceEntries={referenceEntries}
            reviewedCount={items.length}
            totalCount={totalCount}
          />

          <details className="evening-dhikr-methodology">
            <summary>{t("methodologyHeading")}</summary>
            <p>{t("methodologyBody")}</p>
          </details>

          <nav className="evening-dhikr-related" aria-label={t("relatedCollectionsHeading")}>
            <h2 className="evening-dhikr-related__heading">{t("relatedCollectionsHeading")}</h2>
            <ul className="evening-dhikr-related__list">
              <li>
                <Link href="/knowledge/dhikr/morning">{t("relatedCollectionsMorningLabel")}</Link>
              </li>
              <li>
                <Link href="/knowledge-library/dhikr">{t("relatedCollectionsHubLabel")}</Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </SectionPage>
  );
}
