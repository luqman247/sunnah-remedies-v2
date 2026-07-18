import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { DhikrTimeNavigation } from "@/components/dhikr/DhikrTimeNavigation";
import { Link } from "@/i18n/navigation";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { getDuaDhikrCollectionsPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { PARENT_GROUPS } from "@/lib/dua-dhikr/taxonomy";
import { isDuaDhikrCollectionPublished } from "@/lib/dua-dhikr/publication-status";
import { DuaDhikrCollectionCard } from "@/components/dua-dhikr/DuaDhikrCollectionCard";
import { DuaDhikrSearch } from "@/components/dua-dhikr/DuaDhikrSearch";
import { ContinueReading } from "@/components/dua-dhikr/ContinueReading";
import "@/components/dua-dhikr/dua-dhikr.css";
import "./dua-dhikr-landing.css";

/**
 * Duʿa & Dhikr — landing page.
 *
 * Primary navigation surfaces only collections with gate-passed public entries.
 * Forthcoming collections appear in a restrained, non-interactive
 * “In preparation” section — never as equally prominent empty links.
 * Morning/Evening status uses the Dhikr publication gates, not duaDhikrEntry counts.
 */

const QUICK_ACCESS_FALLBACK_SLUGS = [
  "morning-dhikr",
  "evening-dhikr",
  "after-salah",
  "before-sleep",
  "waking-up",
  "food-and-drink",
  "home",
  "travel",
  "ruqyah-and-illness",
];

const DISCOVERY_ITEMS = [
  { key: "beginningMyDay", slug: "morning-dhikr" },
  { key: "goingToSleep", slug: "before-sleep" },
  { key: "travelling", slug: "travel" },
  { key: "worriedOrUnwell", slug: "difficulties-and-happiness" },
  { key: "seekingForgiveness", slug: "istighfar" },
  { key: "duaForFamily", slug: "marriage-and-children" },
  { key: "preparingForHajjOrUmrah", slug: "hajj-and-umrah" },
] as const;

const LEARNING_GUIDE_KEYS = [
  "whatIsDua",
  "whatIsDhikr",
  "etiquettesOfDua",
  "timesDuaAccepted",
  "rememberingAdhkar",
  "praisingAllahBeforeDua",
  "sendingSalawat",
  "askingThroughNames",
] as const;

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

  const collections = await getDuaDhikrCollectionsPublic(locale);
  const publishedCollections = collections.filter(isDuaDhikrCollectionPublished);
  const forthcomingCollections = collections.filter((c) => !isDuaDhikrCollectionPublished(c));
  const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));

  const quickAccess = QUICK_ACCESS_FALLBACK_SLUGS.map((slug) => collectionBySlug.get(slug)).filter(
    (c): c is NonNullable<typeof c> => !!c && isDuaDhikrCollectionPublished(c),
  );

  const publishedDiscovery = DISCOVERY_ITEMS.filter((item) => {
    const target = collectionBySlug.get(item.slug);
    return target && isDuaDhikrCollectionPublished(target);
  });

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
          <p className="type-eyebrow">{t("eyebrow")}</p>
          <h1 className="sr-only">{t("heading")}</h1>
          <p className="dua-dhikr-hero__lede">{t("lede")}</p>
          <DhikrTimeNavigation suppressOwnHeading />
          <DuaDhikrSearch collections={publishedCollections} locale={locale} />
        </div>
      }
    >
      {quickAccess.length > 0 && (
        <section aria-labelledby="dua-dhikr-quick-access-heading" className="policy-block">
          <h2 id="dua-dhikr-quick-access-heading" className="section-label">
            {t("quickAccessHeading")}
          </h2>
          <div className="dua-dhikr-collection-grid">
            {quickAccess.map((collection) => (
              <DuaDhikrCollectionCard key={collection.slug} collection={collection} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="dua-dhikr-browse-heading" className="policy-block">
        <h2 id="dua-dhikr-browse-heading" className="section-label">
          {t("browseHeading")}
        </h2>
        {PARENT_GROUPS.map((group) => {
          const groupCollections = publishedCollections.filter((c) => c.parentGroup === group.key);
          if (groupCollections.length === 0) return null;
          return (
            <div key={group.key} className="dua-dhikr-parent-group">
              <h3 className="dua-dhikr-parent-group__heading">
                {locale === "da" ? group.titleDa : group.titleEn}
              </h3>
              <div className="dua-dhikr-collection-grid">
                {groupCollections.map((collection) => (
                  <DuaDhikrCollectionCard key={collection.slug} collection={collection} locale={locale} />
                ))}
              </div>
            </div>
          );
        })}
        {publishedCollections.length === 0 && (
          <p className="type-body">{t("noPublishedCollections")}</p>
        )}
      </section>

      {forthcomingCollections.length > 0 && (
        <section aria-labelledby="dua-dhikr-preparing-heading" className="policy-block">
          <h2 id="dua-dhikr-preparing-heading" className="section-label">
            {t("inPreparationHeading")}
          </h2>
          <p className="type-body dua-dhikr-preparing-note">{t("inPreparationLede")}</p>
          <div className="dua-dhikr-collection-grid dua-dhikr-collection-grid--preparing">
            {forthcomingCollections.map((collection) => (
              <DuaDhikrCollectionCard
                key={collection.slug}
                collection={collection}
                locale={locale}
                forcePreparing
              />
            ))}
          </div>
        </section>
      )}

      {publishedDiscovery.length > 0 && (
        <section aria-labelledby="dua-dhikr-discovery-heading" className="policy-block">
          <h2 id="dua-dhikr-discovery-heading" className="section-label">
            {t("discoveryHeading")}
          </h2>
          <ul className="dua-dhikr-discovery-list">
            {publishedDiscovery.map((item) => {
              const target = collectionBySlug.get(item.slug)!;
              const href = target.externalHref ?? `/knowledge-library/dua-dhikr/${item.slug}`;
              return (
                <li key={item.key}>
                  <Link href={href} className="dua-dhikr-discovery-link">
                    {t(`discovery.${item.key}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="dua-dhikr-learning-heading" className="policy-block">
        <h2 id="dua-dhikr-learning-heading" className="section-label">
          {t("learningHeading")}
        </h2>
        <p className="type-body">{t("learningPlaceholderNotice")}</p>
        <ul className="dua-dhikr-learning-list">
          {LEARNING_GUIDE_KEYS.map((key) => (
            <li key={key}>{t(`learningGuides.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section aria-label={t("continueReadingHeading")} className="policy-block">
        <ContinueReading publishedSlugs={publishedCollections.map((c) => c.slug)} />
      </section>
    </SectionPage>
  );
}
