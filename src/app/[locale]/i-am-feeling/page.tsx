import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { SectionPage } from "@/components/ui/SectionPage";
import { knowledgeLibrary } from "@/lib/navigation/site-structure";
import { getFeelingFamiliesPublic, getFeelingStatesPublic, isFeelingStatePublicationReady } from "@/sanity/lib/feeling-public-fetch";
import { selectFeaturedFeelingStates, groupFeelingStatesByFamily } from "@/lib/feeling/landing";
import { FeelingCard } from "@/components/feeling/FeelingCard";
import { FeelingSearch } from "@/components/feeling/FeelingSearch";
import { UrgentSupportNotice } from "@/components/feeling/UrgentSupportNotice";
import "@/components/feeling/feeling.css";
import "./i-am-feeling-landing.css";

/**
 * "I am feeling…" — permanent guided-discovery landing page.
 *
 * Hierarchy: editorial hero + search → featured feelings → grouped
 * families → how to use this → Duʿā & Dhikr library link → safety notice
 * (see docs/i-am-feeling/SPEC.md §3). Top-level route, conceptually part of
 * the Knowledge Library (§2) — department/breadcrumb wiring is explicit,
 * not path-derived.
 */

// Same bounded-ISR rationale as knowledge-library/dua-dhikr/page.tsx: newly
// published/updated feelingState and duaDhikrEntry documents must never
// remain invisible indefinitely.
export const dynamic = "force-static";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("iAmFeeling", "/i-am-feeling", locale);
}

export default async function IAmFeelingLandingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Explicit { locale, namespace } rather than the ambient single-argument
  // form — under this app's force-static + generateStaticParams setup, the
  // single-argument form (relying solely on setRequestLocale) was found to
  // intermittently resolve the wrong locale's body text in production,
  // while explicit-locale calls (as pageMetadata/MastheadServer already use)
  // resolved correctly. See the implementation report for the diagnosis;
  // this mirrors the one call style already proven reliable elsewhere.
  const t = await getTranslations({ locale, namespace: "feeling.landing" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFeeling = await getTranslations({ locale, namespace: "feeling" });

  const [families, states] = await Promise.all([
    getFeelingFamiliesPublic(),
    getFeelingStatesPublic(locale),
  ]);

  const featured = selectFeaturedFeelingStates(states);
  const grouped = groupFeelingStatesByFamily(states);
  const hasAnyLaunchStates = [...grouped.values()].some((list) => list.length > 0);

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="xvii"
      currentHref="/i-am-feeling"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: tFeeling("breadcrumb") },
      ]}
      intro={
        <div className="feeling-hero">
          <p className="type-eyebrow feeling-hero__eyebrow">{t("eyebrow")}</p>
          <h1 className="feeling-hero__heading">{t("heading")}</h1>
          <p className="feeling-hero__lede">{t("lede")}</p>
          <p className="feeling-hero__supporting">{t("supporting")}</p>
          <FeelingSearch locale={locale} />
        </div>
      }
    >
      <div className="feeling-landing">
        {featured.length > 0 && (
          <section aria-labelledby="feeling-featured-heading" className="policy-block feeling-landing__section">
            <h2 id="feeling-featured-heading" className="section-label">
              {t("featuredHeading")}
            </h2>
            <div className="feeling-card-grid">
              {featured.map((state) => (
                <FeelingCard
                  key={state.slug}
                  slug={state.slug}
                  labelEn={state.labelEn}
                  labelDa={state.labelDa}
                  oneLineDescriptionEn={state.oneLineDescriptionEn}
                  oneLineDescriptionDa={state.oneLineDescriptionDa}
                  locale={locale}
                  ready
                />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="feeling-families-heading" className="policy-block feeling-landing__section">
          <h2 id="feeling-families-heading" className="section-label">
            {t("familiesHeading")}
          </h2>
          {hasAnyLaunchStates ? (
            [...grouped.entries()].map(([familyKey, familyStates]) => {
              if (familyStates.length === 0) return null;
              const family = families.find((f) => f.key === familyKey);
              const familyTitle = locale === "da" && family?.titleDa ? family.titleDa : family?.titleEn ?? familyKey;
              return (
                <div key={familyKey} className="feeling-family">
                  <h3 className="feeling-family__heading">{familyTitle}</h3>
                  <div className="feeling-card-grid">
                    {familyStates.map((state) => (
                      <FeelingCard
                        key={state.slug}
                        slug={state.slug}
                        labelEn={state.labelEn}
                        labelDa={state.labelDa}
                        oneLineDescriptionEn={state.oneLineDescriptionEn}
                        oneLineDescriptionDa={state.oneLineDescriptionDa}
                        locale={locale}
                        ready={isFeelingStatePublicationReady(state)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="type-body feeling-landing__note">{t("noStatesYet")}</p>
          )}
        </section>

        <section aria-labelledby="feeling-explanation-heading" className="policy-block feeling-landing__section">
          <h2 id="feeling-explanation-heading" className="section-label">
            {t("explanationHeading")}
          </h2>
          <p className="feeling-landing__explanation">{t("explanationBody")}</p>
        </section>

        <section aria-label={t("libraryLinkCta")} className="policy-block feeling-landing__section feeling-landing__library-link">
          <p className="feeling-landing__note">
            {t("libraryLinkIntro")}{" "}
            <Link href="/knowledge-library/dua-dhikr" className="feeling-landing__inline-link">
              {t("libraryLinkCta")}
            </Link>
            .
          </p>
        </section>

        <section
          aria-labelledby="feeling-safety-heading"
          className="policy-block feeling-landing__section feeling-landing__safety"
        >
          <h2 id="feeling-safety-heading" className="sr-only">
            {t("safetyHeading")}
          </h2>
          <UrgentSupportNotice />
        </section>
      </div>
    </SectionPage>
  );
}
