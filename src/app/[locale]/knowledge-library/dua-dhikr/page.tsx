import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { SectionPage } from "@/components/ui/SectionPage";
import { knowledgeLibrary, getAllArticles } from "@/sanity/lib/fetch";
import { getDuaDhikrCollectionsPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { PARENT_GROUPS } from "@/lib/dua-dhikr/taxonomy";
import { isDuaDhikrCollectionPublished } from "@/lib/dua-dhikr/publication-status";
import {
  resolveLandingCollectionTitle,
  selectBeginHereCollections,
  selectBrowseByOccasionCollections,
  selectDuaDhikrGuideArticles,
  shouldRenderBrowseByOccasionSection,
  shouldRenderGuidesAndArticlesSection,
} from "@/lib/dua-dhikr/landing-hub";
import { DuaDhikrCollectionCard } from "@/components/dua-dhikr/DuaDhikrCollectionCard";
import { DuaDhikrSearch } from "@/components/dua-dhikr/DuaDhikrSearch";
import { ContinueReading } from "@/components/dua-dhikr/ContinueReading";
import "@/components/dua-dhikr/dua-dhikr.css";
import "./dua-dhikr-landing.css";

/**
 * Duʿā & Dhikr — permanent knowledge hub landing page.
 *
 * Hierarchy: editorial hero → Begin here → Browse by occasion (when needed) →
 * Guides & Articles (when published articles exist) → editorial assurance.
 * Collection names never appear in the hero; foundational Morning/Evening
 * cards appear once in “Begin here” and are excluded from Browse by occasion.
 */

/**
 * Bounded ISR window so newly published/updated duaDhikrEntry and
 * duaDhikrCollection documents never remain invisible indefinitely — this
 * page has no explicit revalidate config otherwise, so Next.js would cache
 * whatever it first rendered until the next deployment. Mirrors the
 * dynamic/revalidate convention already used for other Sanity-driven static
 * routes (see src/app/llms.txt/route.ts, src/app/feeds/rss.xml/route.ts).
 */
export const dynamic = "force-static";
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("duaDhikr", "/knowledge-library/dua-dhikr");
}

export default async function DuaDhikrLandingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("duaDhikr.landing");
  const tRoot = await getTranslations("duaDhikr");
  const tNav = await getTranslations("nav");

  const [collections, articles] = await Promise.all([
    getDuaDhikrCollectionsPublic(locale),
    getAllArticles(locale),
  ]);

  const publishedCollections = collections.filter(
    isDuaDhikrCollectionPublished,
  );
  const beginHere = selectBeginHereCollections(publishedCollections);
  const browseCollections =
    selectBrowseByOccasionCollections(publishedCollections);
  const showBrowse = shouldRenderBrowseByOccasionSection(browseCollections);
  const guideArticles = selectDuaDhikrGuideArticles(articles);
  const showGuides = shouldRenderGuidesAndArticlesSection(guideArticles);

  const beginHereTitleKey = (slug: string) =>
    slug === "morning-dhikr"
      ? "beginHereTitles.morningDhikr"
      : slug === "evening-dhikr"
        ? "beginHereTitles.eveningDhikr"
        : null;

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="v"
      currentHref="/knowledge-library/dua-dhikr"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: tRoot("breadcrumb") },
      ]}
      intro={
        <div className="dua-dhikr-hero">
          <p className="type-eyebrow dua-dhikr-hero__eyebrow">{t("eyebrow")}</p>
          <h1 className="dua-dhikr-hero__heading">{t("heading")}</h1>
          <p className="dua-dhikr-hero__lede">{t("lede")}</p>
          <p className="dua-dhikr-hero__supporting">{t("supporting")}</p>
          <DuaDhikrSearch collections={publishedCollections} locale={locale} />
        </div>
      }
    >
      <div className="dua-dhikr-landing">
        {beginHere.length > 0 && (
          <section
            aria-labelledby="dua-dhikr-begin-here-heading"
            className="policy-block dua-dhikr-landing__section"
          >
            <h2 id="dua-dhikr-begin-here-heading" className="section-label">
              {t("beginHereHeading")}
            </h2>
            <div className="dua-dhikr-collection-grid dua-dhikr-collection-grid--begin-here">
              {beginHere.map((collection) => {
                const messageKey = beginHereTitleKey(collection.slug);
                const intentionalDa = messageKey ? t(messageKey) : null;
                const resolved = resolveLandingCollectionTitle(
                  collection,
                  locale,
                  intentionalDa,
                );
                return (
                  <DuaDhikrCollectionCard
                    key={collection.slug}
                    collection={collection}
                    locale={locale}
                    titleOverride={resolved.title}
                    titleLang={resolved.lang}
                  />
                );
              })}
            </div>
          </section>
        )}

        <section
          aria-labelledby="dua-dhikr-browse-heading"
          className="policy-block dua-dhikr-landing__section"
        >
          <h2 id="dua-dhikr-browse-heading" className="section-label">
            {t("browseHeading")}
          </h2>
          {showBrowse ? (
            PARENT_GROUPS.map((group) => {
              const groupCollections = browseCollections.filter(
                (c) => c.parentGroup === group.key,
              );
              if (groupCollections.length === 0) return null;
              return (
                <div key={group.key} className="dua-dhikr-parent-group">
                  <h3 className="dua-dhikr-parent-group__heading">
                    {locale === "da" ? group.titleDa : group.titleEn}
                  </h3>
                  <div className="dua-dhikr-collection-grid">
                    {groupCollections.map((collection) => {
                      const resolved = resolveLandingCollectionTitle(
                        collection,
                        locale,
                      );
                      return (
                        <DuaDhikrCollectionCard
                          key={collection.slug}
                          collection={collection}
                          locale={locale}
                          titleOverride={resolved.title}
                          titleLang={resolved.lang}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : publishedCollections.length === 0 ? (
            <p className="type-body dua-dhikr-landing__note">
              {t("noPublishedCollections")}
            </p>
          ) : (
            <p className="type-body dua-dhikr-landing__note">
              {t("browseForthcomingNote")}
            </p>
          )}
        </section>

        {showGuides && (
          <section
            aria-labelledby="dua-dhikr-guides-heading"
            className="policy-block dua-dhikr-landing__section"
          >
            <h2 id="dua-dhikr-guides-heading" className="section-label">
              {t("guidesHeading")}
            </h2>
            <ul className="dua-dhikr-guides-list">
              {guideArticles.map((article) => (
                <li key={article._id}>
                  <Link
                    href={`/knowledge-library/${article.slug.current}`}
                    className="dua-dhikr-guide-card"
                  >
                    <h3 className="dua-dhikr-guide-card__title">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="dua-dhikr-guide-card__excerpt">
                        {article.excerpt}
                      </p>
                    )}
                    {article.readingTime ? (
                      <span className="dua-dhikr-guide-card__meta">
                        {article.readingTime} min
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section
          aria-labelledby="dua-dhikr-assurance-heading"
          className="policy-block dua-dhikr-landing__section dua-dhikr-landing__assurance"
        >
          <h2 id="dua-dhikr-assurance-heading" className="sr-only">
            {t("assuranceHeading")}
          </h2>
          <p className="dua-dhikr-landing__assurance-text">{t("assurance")}</p>
        </section>

        <section
          aria-label={t("continueReadingHeading")}
          className="policy-block dua-dhikr-landing__section"
        >
          <ContinueReading
            publishedSlugs={publishedCollections.map((c) => c.slug)}
          />
        </section>
      </div>
    </SectionPage>
  );
}
