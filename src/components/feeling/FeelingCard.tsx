import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import "./feeling.css";

interface FeelingCardProps {
  slug: string;
  labelEn: string;
  labelDa?: string;
  oneLineDescriptionEn: string;
  oneLineDescriptionDa?: string;
  locale: AppLocale;
  /** Whether this state currently has publication-ready Sanity content — SPEC §5, §6, §24. */
  ready: boolean;
  compact?: boolean;
}

/**
 * Feeling card for the /i-am-feeling landing grid (featured + family
 * sections) and the compact "Related feelings" row on a feeling detail
 * page. Mirrors DuaDhikrCollectionCard's published/in-preparation pattern
 * exactly: a state without publication-ready content renders a
 * non-interactive surface with an explicit "In preparation" label — never a
 * disabled button, never omitted entirely (docs/i-am-feeling/SPEC.md §3.3,
 * §24).
 */
export function FeelingCard({
  slug,
  labelEn,
  labelDa,
  oneLineDescriptionEn,
  oneLineDescriptionDa,
  locale,
  ready,
  compact = false,
}: FeelingCardProps) {
  const t = useTranslations("feeling.landing");
  const label = locale === "da" && labelDa ? labelDa : labelEn;
  const description = locale === "da" && oneLineDescriptionDa ? oneLineDescriptionDa : oneLineDescriptionEn;
  const titleLang = locale === "da" && !labelDa ? "en" : undefined;
  const className = `feeling-card${compact ? " feeling-card--compact" : ""}`;

  const body = (
    <>
      <h3 className="feeling-card__title" lang={titleLang}>
        {label}
      </h3>
      <p className="feeling-card__description" lang={locale === "da" && !oneLineDescriptionDa ? "en" : undefined}>
        {description}
      </p>
      {!ready && <span className="feeling-card__meta">{t("inPreparationStatus")}</span>}
    </>
  );

  if (!ready) {
    return (
      <div className={`${className} feeling-card--preparing`} aria-label={`${label}. ${t("inPreparationStatus")}`}>
        {body}
      </div>
    );
  }

  return (
    <Link href={`/i-am-feeling/${slug}`} className={className}>
      {body}
    </Link>
  );
}
