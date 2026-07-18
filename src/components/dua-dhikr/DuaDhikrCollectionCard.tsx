import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrCollectionPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { isDuaDhikrCollectionPublished } from "@/lib/dua-dhikr/publication-status";
import { DuaDhikrIcon } from "./icons";
import "./dua-dhikr.css";

interface DuaDhikrCollectionCardProps {
  collection: DuaDhikrCollectionPublic;
  locale: AppLocale;
  /**
   * When true, force non-interactive presentation even if published.
   * Used by the restrained “In preparation” section.
   */
  forcePreparing?: boolean;
  /** Intentional display title (e.g. Danish message fallback for foundational collections). */
  titleOverride?: string;
  /** When the visible title is English on a Danish page, mark it with lang="en". */
  titleLang?: "en";
}

/**
 * Category card for the Duʿa & Dhikr landing/browse grid.
 * Published collections are links. Forthcoming collections are non-interactive
 * surfaces with an explicit preparation label — never disabled buttons.
 */
export function DuaDhikrCollectionCard({
  collection,
  locale,
  forcePreparing = false,
  titleOverride,
  titleLang,
}: DuaDhikrCollectionCardProps) {
  const t = useTranslations("duaDhikr.landing");
  const title =
    titleOverride ??
    (locale === "da" && collection.titleDa
      ? collection.titleDa
      : collection.titleEn);
  const description =
    locale === "da" && collection.descriptionDa
      ? collection.descriptionDa
      : collection.descriptionEn;
  const href =
    collection.externalHref ??
    `/knowledge-library/dua-dhikr/${collection.slug}`;
  const published =
    !forcePreparing && isDuaDhikrCollectionPublished(collection);
  const resolvedTitleLang =
    titleLang ??
    (locale === "da" && !collection.titleDa && !titleOverride
      ? "en"
      : undefined);

  const body = (
    <>
      <DuaDhikrIcon
        iconKey={collection.iconKey}
        className="dua-dhikr-collection-card__icon"
        size={28}
      />
      <h3 className="dua-dhikr-collection-card__title" lang={resolvedTitleLang}>
        {title}
      </h3>
      {description && (
        <p
          className="dua-dhikr-collection-card__description"
          lang={locale === "da" && !collection.descriptionDa ? "en" : undefined}
        >
          {description}
        </p>
      )}
      <div className="dua-dhikr-collection-card__meta">
        {published ? (
          <span>{t("entryCount", { count: collection.entryCount })}</span>
        ) : (
          <span>{t("inPreparationStatus")}</span>
        )}
      </div>
    </>
  );

  if (!published) {
    return (
      <div
        className="dua-dhikr-collection-card dua-dhikr-collection-card--preparing"
        aria-label={`${title}. ${t("inPreparationStatus")}`}
      >
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className="dua-dhikr-collection-card">
      {body}
    </Link>
  );
}
