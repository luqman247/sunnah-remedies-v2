import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrCollectionPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { DuaDhikrIcon } from "./icons";
import "./dua-dhikr.css";

interface DuaDhikrCollectionCardProps {
  collection: DuaDhikrCollectionPublic;
  locale: AppLocale;
}

/**
 * Category card for the Duʿā & Dhikr landing/browse grid — icon, title,
 * short description, entry count when data exists, and subcategory labels.
 * Server component: no interactivity beyond a native link/focus state.
 */
export function DuaDhikrCollectionCard({ collection, locale }: DuaDhikrCollectionCardProps) {
  const t = useTranslations("duaDhikr.landing");
  const title = locale === "da" && collection.titleDa ? collection.titleDa : collection.titleEn;
  const description =
    locale === "da" && collection.descriptionDa ? collection.descriptionDa : collection.descriptionEn;
  const href = collection.externalHref ?? `/knowledge-library/dua-dhikr/${collection.slug}`;

  return (
    <Link href={href} className="dua-dhikr-collection-card">
      <DuaDhikrIcon iconKey={collection.iconKey} className="dua-dhikr-collection-card__icon" size={28} />
      <h3 className="dua-dhikr-collection-card__title">{title}</h3>
      {description && <p className="dua-dhikr-collection-card__description">{description}</p>}
      <div className="dua-dhikr-collection-card__meta">
        {collection.entryCount > 0 ? (
          <span>{t("entryCount", { count: collection.entryCount })}</span>
        ) : (
          <span>{t("noEntriesYet")}</span>
        )}
        {collection.subcategories?.map((sub) => (
          <span key={sub.slug}>{sub.titleEn}</span>
        ))}
      </div>
    </Link>
  );
}
