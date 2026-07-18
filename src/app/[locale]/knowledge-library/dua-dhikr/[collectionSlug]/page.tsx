import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { buildStaticMetadata } from "@/lib/seo/metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { Link } from "@/i18n/navigation";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import {
  getDuaDhikrCollectionPublic,
  getDuaDhikrCollectionsPublic,
  getDuaDhikrEntriesForCollection,
} from "@/sanity/lib/dua-dhikr-public-fetch";
import { CANONICAL_COLLECTIONS, PARENT_GROUPS, getCanonicalCollection } from "@/lib/dua-dhikr/taxonomy";
import { isDuaDhikrCollectionPublished } from "@/lib/dua-dhikr/publication-status";
import { DuaDhikrIcon } from "@/components/dua-dhikr/icons";
import { DuaDhikrEntryCollection } from "@/components/dua-dhikr/DuaDhikrEntryCollection";
import { DuaDhikrCollectionCard } from "@/components/dua-dhikr/DuaDhikrCollectionCard";
import { RecordCollectionVisit } from "@/components/dua-dhikr/RecordCollectionVisit";
import "@/components/dua-dhikr/dua-dhikr.css";
import "../dua-dhikr-landing.css";

interface PageProps {
  params: Promise<{ collectionSlug: string; locale: AppLocale }>;
}

/**
 * Duʿa & Dhikr — collection page.
 *
 * Published collections (gate-passed entries) are indexable reading pages.
 * Empty / in-preparation collections remain reachable with honest empty-state
 * copy and robots noindex,nofollow — never fabricated religious content.
 * Morning/Evening slugs redirect to their Dhikr routes.
 */
/**
 * Bounded ISR window — see src/app/[locale]/knowledge-library/dua-dhikr/page.tsx
 * for why this is needed (statically generated at build time via
 * generateStaticParams below, and otherwise never revalidated).
 */
export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  return CANONICAL_COLLECTIONS.filter((c) => !c.externalHref).map((c) => ({ collectionSlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collectionSlug, locale } = await params;
  const canonical = getCanonicalCollection(collectionSlug);
  if (!canonical) return {};

  const collection = await getDuaDhikrCollectionPublic(collectionSlug, locale);
  const title = locale === "da" && canonical.titleDa ? canonical.titleDa : canonical.titleEn;
  const published = collection ? isDuaDhikrCollectionPublished(collection) : false;
  const base = buildStaticMetadata(
    `/knowledge-library/dua-dhikr/${collectionSlug}`,
    `${title} | Duʿa & Dhikr · Sunnah Remedies`,
    canonical.descriptionEn,
  );

  if (!published) {
    return {
      ...base,
      robots: { index: false, follow: false },
    };
  }

  return base;
}

export default async function DuaDhikrCollectionPage({ params }: PageProps) {
  const { collectionSlug, locale } = await params;

  const canonical = getCanonicalCollection(collectionSlug);
  if (!canonical) notFound();
  if (canonical.externalHref) redirect(canonical.externalHref);

  setRequestLocale(locale);

  const t = await getTranslations("duaDhikr.collection");
  const tRoot = await getTranslations("duaDhikr");
  const tNav = await getTranslations("nav");

  const [collection, entries, allCollections] = await Promise.all([
    getDuaDhikrCollectionPublic(collectionSlug, locale),
    getDuaDhikrEntriesForCollection(collectionSlug, locale),
    getDuaDhikrCollectionsPublic(locale),
  ]);

  const resolved =
    collection ?? {
      ...canonical,
      entryCount: entries.length,
      hasPendingUnreviewedCopy: false,
      publicationState: entries.length > 0 ? ("published" as const) : ("in-preparation" as const),
    };

  const title = locale === "da" && resolved.titleDa ? resolved.titleDa : resolved.titleEn;
  const description = locale === "da" && resolved.descriptionDa ? resolved.descriptionDa : resolved.descriptionEn;
  const introduction = locale === "da" && resolved.introductionDa ? resolved.introductionDa : resolved.introductionEn;
  const whenRead = locale === "da" && resolved.whenReadDa ? resolved.whenReadDa : resolved.whenReadEn;
  const parentGroup = PARENT_GROUPS.find((g) => g.key === resolved.parentGroup);

  const related = allCollections.filter(
    (c) => (resolved.relatedGroupSlugs ?? []).includes(c.slug) && isDuaDhikrCollectionPublished(c),
  );

  const siblings = allCollections.filter(
    (c) => c.parentGroup === resolved.parentGroup && isDuaDhikrCollectionPublished(c),
  );
  const currentIndex = siblings.findIndex((c) => c.slug === collectionSlug);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined;

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="vi"
      currentHref="/knowledge-library/dua-dhikr"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: tRoot("breadcrumb"), href: "/knowledge-library/dua-dhikr" },
        { label: title },
      ]}
      intro={
        <div className="dua-dhikr-hero">
          <RecordCollectionVisit slug={collectionSlug} titleEn={resolved.titleEn} />
          <DuaDhikrIcon iconKey={resolved.iconKey} size={36} className="dua-dhikr-collection-card__icon" />
          {parentGroup && (
            <p className="type-eyebrow">{locale === "da" ? parentGroup.titleDa : parentGroup.titleEn}</p>
          )}
          <h1 className="sr-only">{title}</h1>
          {description && <p className="dua-dhikr-hero__lede">{description}</p>}
          {introduction && <p className="type-body">{introduction}</p>}
          {resolved.hasPendingUnreviewedCopy && (
            <span className="dua-dhikr-pending-badge" role="note">
              {t("copyPendingReview")}
            </span>
          )}
          {whenRead && (
            <p className="type-body">
              <strong>{t("whenReadLabel")}: </strong>
              {whenRead}
            </p>
          )}
        </div>
      }
    >
      <section aria-labelledby="dua-dhikr-collection-entries-heading" className="policy-block">
        <h2 id="dua-dhikr-collection-entries-heading" className="section-label">
          {t("entriesHeading")}
        </h2>
        <DuaDhikrEntryCollection entries={entries} subcategories={resolved.subcategories ?? []} locale={locale} />
      </section>

      {related.length > 0 && (
        <section aria-labelledby="dua-dhikr-related-heading" className="policy-block">
          <h2 id="dua-dhikr-related-heading" className="section-label">
            {t("relatedHeading")}
          </h2>
          <div className="dua-dhikr-collection-grid">
            {related.map((relatedCollection) => (
              <DuaDhikrCollectionCard key={relatedCollection.slug} collection={relatedCollection} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {(previous || next) && (
        <nav aria-label={t("prevNextLabel")} className="policy-block dua-dhikr-prev-next">
          {previous && (
            <Link href={`/knowledge-library/dua-dhikr/${previous.slug}`} className="dua-dhikr-discovery-link">
              ← {previous.titleEn}
            </Link>
          )}
          {next && (
            <Link href={`/knowledge-library/dua-dhikr/${next.slug}`} className="dua-dhikr-discovery-link">
              {next.titleEn} →
            </Link>
          )}
        </nav>
      )}
    </SectionPage>
  );
}
