import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { getMorningDhikrItemsPublic, type DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import "./morning-dhikr.css";

/**
 * Morning Dhikr — public route.
 *
 * Data comes exclusively from getMorningDhikrItemsPublic()
 * (src/sanity/lib/dhikr-public-fetch.ts), which itself calls
 * getDhikrItemsPublic() — the same canonical-eligibility-gated query used
 * by the general /knowledge-library/dhikr landing page — and applies one
 * further, additive filter on the approved timingLabel field. This route
 * never imports the staff-only src/sanity/lib/dhikr-fetch.ts and never
 * reads the research register (src/lib/dhikr-research/*) directly —
 * nothing rendered here can be an unreviewed, unapproved, disputed, or
 * research-only record.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("dhikrMorning", "/knowledge/dhikr/morning");
}

const TIMING_KEYS = ["morning-only", "evening-only", "morning-and-evening", "not-time-specific"] as const;

function isKnownTimingKey(value: string | undefined): value is (typeof TIMING_KEYS)[number] {
  return !!value && (TIMING_KEYS as readonly string[]).includes(value);
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

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="iii"
      title={t("heading")}
      lede={t("lede")}
      currentHref="/knowledge/dhikr/morning"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: t("breadcrumb") },
      ]}
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
      ) : items.length === 0 ? (
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
        <ol className="morning-dhikr-list" aria-label={t("heading")}>
          {items.map((item) => {
            const translation = locale === "da" && item.translationDa ? item.translationDa : item.translationEn;
            const primaryReference = item.sourceReferences[0]?.citation;
            const timingKey = isKnownTimingKey(item.timingLabel) ? item.timingLabel : undefined;

            return (
              <li key={item._id}>
                <article
                  className="morning-dhikr-card"
                  aria-labelledby={`morning-dhikr-${item._id}-arabic`}
                >
                  <p
                    id={`morning-dhikr-${item._id}-arabic`}
                    className="type-arabic morning-dhikr-card__arabic"
                    dir="rtl"
                    lang="ar"
                  >
                    {item.arabicText}
                  </p>

                  <p className="type-body morning-dhikr-card__translation" lang={locale}>
                    {translation}
                  </p>

                  {(timingKey || item.recommendedRepetitions) && (
                    <div className="morning-dhikr-card__badges">
                      {timingKey && (
                        <span className="morning-dhikr-card__badge">{t(`timing.${timingKey}`)}</span>
                      )}
                      {item.recommendedRepetitions !== undefined && item.recommendedRepetitions > 0 && (
                        <span className="morning-dhikr-card__badge">
                          {t("repetitionLabel", { count: item.recommendedRepetitions })}
                        </span>
                      )}
                    </div>
                  )}

                  {item.virtueText && (
                    <p className="morning-dhikr-card__virtue" lang={locale}>
                      <span className="morning-dhikr-card__source-label">{t("virtueLabel")}: </span>
                      {item.virtueText}
                    </p>
                  )}

                  {primaryReference && (
                    <>
                      <hr className="morning-dhikr-card__divider" />
                      <div className="morning-dhikr-card__source">
                        <span className="morning-dhikr-card__source-label">{t("sourceLabel")}</span>
                        <span>{primaryReference}</span>
                      </div>
                    </>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </SectionPage>
  );
}
