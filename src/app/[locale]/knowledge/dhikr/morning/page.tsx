import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { DhikrTimeNavigation } from "@/components/dhikr/DhikrTimeNavigation";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { getMorningDhikrItemsPublic, type DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import {
  getPendingReferenceCollection,
  getSourceRegisterTotalCount,
} from "@/lib/dhikr-research/public-reference-projection";
import { MorningDhikrCollection } from "./MorningDhikrCollection";
import "./morning-dhikr.css";

/**
 * Morning Dhikr — public route.
 *
 * Two data sources, each through its own dedicated public-safe chokepoint
 * module, and never any other way:
 *  - getMorningDhikrItemsPublic() (src/sanity/lib/dhikr-public-fetch.ts):
 *    the "Editorially reviewed" section. Merges two SEPARATE eligibility
 *    pathways (the canonical scholarly-approved gate, unchanged, and the
 *    additive editorial-publication gate), then filters on the approved
 *    timingLabel field. Each item carries a `publicationPathway` tag.
 *  - getPendingReferenceCollection() (src/lib/dhikr-research/public-
 *    reference-projection.ts): the "Reference collection" section — every
 *    source-register record NOT already shown above, narrowed to a
 *    public-safe projection (protected Arabic, sequence, documented source
 *    reference where actually documented, known timing, known repetition
 *    count) that structurally cannot expose internal notes, reviewer
 *    identity, authentication claims, or unsupported virtue text.
 *
 * This route never imports the staff-only src/sanity/lib/dhikr-fetch.ts,
 * and never reads src/lib/dhikr-research/morning-dhikr-register.ts or
 * ./types.ts directly — only the two projection modules above.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("dhikrMorning", "/knowledge/dhikr/morning");
}

export default async function MorningDhikrPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dhikrMorning");
  const tNav = await getTranslations("nav");

  let items: DhikrItemPublic[] = [];
  let loadFailed = false;
  try {
    items = await getMorningDhikrItemsPublic();
  } catch {
    loadFailed = true;
  }

  const publishedIds = items.map((item) => item.mdrSourceId).filter((id): id is string => !!id);
  const referenceEntries = loadFailed ? [] : getPendingReferenceCollection(publishedIds);
  const totalCount = getSourceRegisterTotalCount();

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="iii"
      currentHref="/knowledge-library/dhikr"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: t("breadcrumb") },
      ]}
      intro={<DhikrTimeNavigation activeTime="morning" />}
    >
      {loadFailed ? (
        <section
          aria-labelledby="morning-dhikr-error-heading"
          className="morning-dhikr-error-state"
        >
          <h2 id="morning-dhikr-error-heading" className="section-label">
            {t("errorState.heading")}
          </h2>
          <p className="type-body">{t("errorState.body")}</p>
        </section>
      ) : items.length === 0 && referenceEntries.length === 0 ? (
        <section
          aria-labelledby="morning-dhikr-empty-heading"
          className="morning-dhikr-empty-state"
        >
          <h2 id="morning-dhikr-empty-heading" className="section-label">
            {t("emptyState.heading")}
          </h2>
          <p className="type-body">{t("emptyState.body")}</p>
        </section>
      ) : (
        <>
          {/* Literal, launch-specific copy — states the current 2-of-30
              reviewed status in prose. Revisit this text (and its Danish
              equivalent) when more records complete editorial review; it is
              intentionally not auto-generated so it can never overstate the
              collection's status. */}
          <div className="morning-dhikr-collection-intro">
            <h2 className="morning-dhikr-collection-intro__heading">{t("collectionIntroHeading")}</h2>
            <p className="type-body">{t("collectionIntroBody")}</p>
          </div>
          <MorningDhikrCollection
            locale={locale}
            items={items}
            referenceEntries={referenceEntries}
            reviewedCount={items.length}
            totalCount={totalCount}
          />
        </>
      )}
    </SectionPage>
  );
}
