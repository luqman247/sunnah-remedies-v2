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
 * Duʿa & Dhikr — collection page (docs/dua-dhikr/INFORMATION_ARCHITECTURE.md).
 *
 * Every canonical collection slug (src/lib/dua-dhikr/taxonomy.ts) gets a
 * statically-generated route and renders its structural shell even with
 * zero entries (same "honest empty shell" precedent as Evening Dhikr) — no
 * placeholder Islamic content is ever substituted in. Morning/Evening
 * Dhikr slugs redirect to their existing, unchanged routes rather than
 * rendering a second, competing page for the same content.
 */
export async function generateStaticParams() {
  return CANONICAL_COLLECTIONS.filter((c) => !c.externalHref).map((c) => ({ collectionSlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collectionSlug, locale } = await params;
  const canonical = getCanonicalCollection(collectionSlug);
  if (!canonical) return {};
  const title = locale === "da" && canonical.titleDa ? canonical.titleDa : canonical.titleEn;
  return buildStaticMetadata(
    `/knowledge-library/dua-dhikr/${collectionSlug}`,
    `${title} | Duʿa & Dhikr · Sunnah Remedies`,
    canonical.descriptionEn,
  );
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
    getDuaDhikrCollectionPublic(collectionSlug),
    getDuaDhikrEntriesForCollection(collectionSlug),
    getDuaDhikrCollectionsPublic(),
  ]);

  const resolved =
    collection ?? {
      ...canonical,
      entryCount: entries.length,
      hasPendingUnreviewedCopy: false,
    };

  const title = locale === "da" && resolved.titleDa ? resolved.titleDa : resolved.titleEn;
  const description = locale === "da" && resolved.descriptionDa ? resolved.descriptionDa : resolved.descriptionEn;
  const introduction = locale === "da" && resolved.introductionDa ? resolved.introductionDa : resolved.introductionEn;
  const whenRead = locale === "da" && resolved.whenReadDa ? resolved.whenReadDa : resolved.whenReadEn;
  const parentGroup = PARENT_GROUPS.find((g) => g.key === resolved.parentGroup);

  const related = allCollections.filter((c) => (resolved.relatedGroupSlugs ?? []).includes(c.slug));

  const siblings = allCollections.filter((c) => c.parentGroup === resolved.parentGroup);
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
