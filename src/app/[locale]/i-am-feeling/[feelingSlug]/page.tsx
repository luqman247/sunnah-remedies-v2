import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { buildStaticMetadata, localeUrl } from "@/lib/seo/metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { Link } from "@/i18n/navigation";
import { knowledgeLibrary } from "@/lib/navigation/site-structure";
import { getFeelingStatePublic, isFeelingStatePublicationReady } from "@/sanity/lib/feeling-public-fetch";
import { getCanonicalFeelingState, getLaunchFeelingStates } from "@/lib/feeling/taxonomy";
import { DuaDhikrEntryCard } from "@/components/dua-dhikr/DuaDhikrEntryCard";
import { FeelingCard } from "@/components/feeling/FeelingCard";
import { UrgentSupportNotice } from "@/components/feeling/UrgentSupportNotice";
import { FeelingReviewStatusBadge, computeFeelingReviewTags, type FeelingReviewTag } from "@/components/feeling/FeelingReviewStatusBadge";
import "@/components/dua-dhikr/dua-dhikr.css";
import "@/components/feeling/feeling.css";
import "../i-am-feeling-landing.css";

interface PageProps {
  params: Promise<{ feelingSlug: string; locale: AppLocale }>;
}

/**
 * "I am feeling…" — individual feeling page (docs/i-am-feeling/SPEC.md §5).
 *
 * Only launchStatus "launch" taxonomy slugs get a route at all — deferred
 * states (e.g. troubled-by-doubts) 404, never render, regardless of any
 * Sanity document that might exist for them (see the eligibility gate,
 * src/sanity/lib/feeling-publication-gate.ts). A launch slug with no
 * publication-ready Sanity content yet still renders — an honest "being
 * prepared" structural shell, noindex,nofollow — mirroring the same
 * established pattern already used for Duʿā & Dhikr collections rather than
 * shipping a thin page as a hard 404 for content that is genuinely part of
 * the public taxonomy.
 */
export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  return getLaunchFeelingStates().map((s) => ({ feelingSlug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { feelingSlug, locale } = await params;
  const canonical = getCanonicalFeelingState(feelingSlug);
  if (!canonical || canonical.launchStatus !== "launch") return {};

  // Check BOTH locales' own readiness independently — a Danish alternate
  // must never be advertised via hreflang while that locale isn't actually
  // publication-ready (owner-review requirement, 2026-07-19: "do not appear
  // in hreflang when unavailable"). The landing and urgent-support pages
  // don't need this check — they always render full, real content in both
  // locales; only a specific feeling's per-locale readiness is conditional.
  const [enState, daState] = await Promise.all([
    getFeelingStatePublic(feelingSlug, "en"),
    getFeelingStatePublic(feelingSlug, "da"),
  ]);
  const state = locale === "da" ? daState : enState;
  const enReady = enState ? isFeelingStatePublicationReady(enState) : false;
  const daReady = daState ? isFeelingStatePublicationReady(daState) : false;
  const ready = locale === "da" ? daReady : enReady;

  const label = locale === "da" && state?.labelDa ? state.labelDa : canonical.labelEn;
  const description =
    locale === "da" && state?.oneLineDescriptionDa ? state.oneLineDescriptionDa : canonical.oneLineDescriptionEn;
  const path = `/i-am-feeling/${feelingSlug}`;

  const tFeelingMeta = await getTranslations({ locale, namespace: "feeling" });
  const base = buildStaticMetadata(path, `${label} | ${tFeelingMeta("breadcrumb")} | Sunnah Remedies`, description);
  const canonicalUrl = localeUrl(locale, path);

  const languages: Record<string, string> = {};
  if (enReady) {
    languages.en = localeUrl("en", path);
    languages["x-default"] = localeUrl("en", path);
  }
  if (daReady) languages.da = localeUrl("da", path);

  return {
    ...base,
    alternates: {
      canonical: canonicalUrl,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
    robots: ready ? undefined : { index: false, follow: false },
  };
}

export default async function FeelingStatePage({ params }: PageProps) {
  const { feelingSlug, locale } = await params;

  const canonical = getCanonicalFeelingState(feelingSlug);
  // Deferred/not-suitable states never get a route, regardless of Sanity
  // content — this is what keeps "Troubled by Doubts" off the live site
  // (SPEC §4, §6).
  if (!canonical || canonical.launchStatus !== "launch") notFound();

  setRequestLocale(locale);

  // Explicit { locale, namespace } — see i-am-feeling/page.tsx's comment on
  // the same pattern for why the ambient single-argument form is avoided
  // here.
  const t = await getTranslations({ locale, namespace: "feeling.detail" });
  const tLanding = await getTranslations({ locale, namespace: "feeling.landing" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFeeling = await getTranslations({ locale, namespace: "feeling" });

  const state = await getFeelingStatePublic(feelingSlug, locale);
  const ready = state ? isFeelingStatePublicationReady(state) : false;

  // Dev-preview only — see FeelingReviewStatusBadge.tsx. Skipped entirely in
  // production builds (dead-code-eliminated along with the badge itself),
  // so this never adds a fetch to a real visitor's request.
  let reviewTags: FeelingReviewTag[] = [];
  if (process.env.NODE_ENV !== "production") {
    const otherLocale = locale === "da" ? "en" : "da";
    const otherState = await getFeelingStatePublic(feelingSlug, otherLocale);
    const otherReady = otherState ? isFeelingStatePublicationReady(otherState) : false;
    reviewTags = computeFeelingReviewTags(canonical, state, locale, otherReady);
  }

  const label = locale === "da" && state?.labelDa ? state.labelDa : canonical.labelEn;
  const introduction = locale === "da" ? state?.introductionDa : state?.introductionEn;
  const groundingMoment = locale === "da" ? state?.groundingMomentDa : state?.groundingMomentEn;
  const practicalNextStep = locale === "da" ? state?.practicalNextStepDa : state?.practicalNextStepEn;
  const professionalSupportNote =
    locale === "da" ? state?.professionalSupportNoteDa : state?.professionalSupportNoteEn;
  const showProfessionalSupport = canonical.safeguardingLevel !== "standard" && !!professionalSupportNote;

  const relatedStates = (state?.relatedFeelingSlugs ?? canonical.relatedSlugs)
    .map((slug) => getCanonicalFeelingState(slug))
    .filter((s): s is NonNullable<typeof s> => !!s && s.launchStatus === "launch");

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="xvii"
      currentHref="/i-am-feeling"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: tFeeling("breadcrumb"), href: "/i-am-feeling" },
        { label },
      ]}
      intro={
        <div className="feeling-hero">
          <p className="type-eyebrow feeling-hero__eyebrow">{t("eyebrow")}</p>
          <h1 className="feeling-hero__heading">{label}</h1>
          {introduction ? (
            <p className="feeling-hero__lede">{introduction}</p>
          ) : (
            <p className="feeling-hero__lede">
              {locale === "da" && canonical.oneLineDescriptionDa
                ? canonical.oneLineDescriptionDa
                : canonical.oneLineDescriptionEn}
            </p>
          )}
        </div>
      }
    >
      <FeelingReviewStatusBadge tags={reviewTags} />
      {!ready ? (
        <section className="policy-block feeling-landing__section">
          <p className="feeling-landing__note">{tLanding("noStatesYet")}</p>
        </section>
      ) : (
        <>
          {groundingMoment && (
            <section aria-labelledby="feeling-grounding-heading" className="policy-block feeling-landing__section">
              <h2 id="feeling-grounding-heading" className="section-label">
                {t("groundingMomentHeading")}
              </h2>
              <p className="feeling-landing__explanation">{groundingMoment}</p>
            </section>
          )}

          <section aria-labelledby="feeling-featured-entries-heading" className="policy-block feeling-landing__section">
            <h2 id="feeling-featured-entries-heading" className="section-label">
              {t("featuredHeading")}
            </h2>
            <div className="dua-dhikr-entry-collection">
              {state!.featuredEntries.map(({ entry, reflection }) => (
                <div key={entry._id}>
                  <DuaDhikrEntryCard entry={entry} locale={locale} />
                  {reflection && (
                    <div>
                      <h3 className="feeling-family__heading">{t("reflectionHeading")}</h3>
                      <p className="feeling-landing__explanation">{reflection}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {practicalNextStep && (
            <section aria-labelledby="feeling-next-step-heading" className="policy-block feeling-landing__section">
              <h2 id="feeling-next-step-heading" className="section-label">
                {t("nextStepHeading")}
              </h2>
              <p className="feeling-landing__explanation">{practicalNextStep}</p>
            </section>
          )}

          {showProfessionalSupport && (
            <section aria-labelledby="feeling-professional-support-heading" className="policy-block feeling-landing__section">
              <h2 id="feeling-professional-support-heading" className="section-label">
                {t("professionalSupportHeading")}
              </h2>
              <p className="feeling-landing__note">{professionalSupportNote}</p>
              <p className="feeling-landing__safety-text">
                <Link href="/i-am-feeling/urgent-support" className="feeling-landing__inline-link">
                  {tLanding("safetyNoticeUrgentLink")}
                </Link>
              </p>
            </section>
          )}

          {relatedStates.length > 0 && (
            <section aria-labelledby="feeling-related-heading" className="policy-block feeling-landing__section">
              <h2 id="feeling-related-heading" className="section-label">
                {t("relatedFeelingsHeading")}
              </h2>
              <div className="feeling-card-grid">
                {relatedStates.map((related) => (
                  <FeelingCard
                    key={related.slug}
                    slug={related.slug}
                    labelEn={related.labelEn}
                    labelDa={related.labelDa}
                    oneLineDescriptionEn={related.oneLineDescriptionEn}
                    oneLineDescriptionDa={related.oneLineDescriptionDa}
                    locale={locale}
                    ready
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          {state && state.relatedCollections.length > 0 && (
            <section aria-labelledby="feeling-related-collections-heading" className="policy-block feeling-landing__section">
              <h2 id="feeling-related-collections-heading" className="section-label">
                {t("relatedCollectionsHeading")}
              </h2>
              <ul className="feeling-search__results" style={{ margin: 0 }}>
                {state.relatedCollections.map((collection) => {
                  const collectionTitle = locale === "da" && collection.titleDa ? collection.titleDa : collection.titleEn;
                  return (
                    <li key={collection.slug}>
                      <Link href={`/knowledge-library/dua-dhikr/${collection.slug}`} className="feeling-search__result">
                        {t("relatedCollectionsCta", { collection: collectionTitle })}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      <section
        aria-labelledby="feeling-detail-safety-heading"
        className="policy-block feeling-landing__section feeling-landing__safety"
      >
        <h2 id="feeling-detail-safety-heading" className="sr-only">
          {tLanding("safetyHeading")}
        </h2>
        <UrgentSupportNotice />
      </section>
    </SectionPage>
  );
}
