import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { SectionStamp } from "@/components/arrival/SectionStamp";
import { LatestAdditionsRail } from "@/components/arrival/LatestAdditionsRail";
import { DuaDhikrIcon } from "@/components/dua-dhikr/icons";
import type { HomepageHighlight } from "@/lib/homepage/highlights";
import { getHomepageHighlights } from "@/lib/homepage/get-homepage-highlights";

interface HomepageLatestAdditionsProps {
  locale: AppLocale;
}

function contentAreaMessageKey(area: string): string {
  switch (area) {
    case "knowledge-library":
      return "contentArea.knowledgeLibrary";
    case "academy":
      return "contentArea.academy";
    case "apothecary":
      return "contentArea.apothecary";
    case "sacred-journeys":
      return "contentArea.sacredJourneys";
    case "institution":
      return "contentArea.institution";
    case "clinical":
      return "contentArea.clinical";
    case "programmes":
      return "contentArea.programmes";
    case "publications":
      return "contentArea.publications";
    default:
      return "contentArea.knowledgeLibrary";
  }
}

function HighlightVisual({ highlight }: { highlight: HomepageHighlight }) {
  if (highlight.imageUrl) {
    return (
      <div className="latest-additions__media">
        <Image
          src={highlight.imageUrl}
          alt={highlight.imageAlt}
          fill
          sizes="(min-width: 1100px) 560px, (min-width: 900px) 520px, (min-width: 768px) 55vw, 90vw"
          className="latest-additions__image"
          style={
            highlight.imageObjectPosition
              ? { objectPosition: highlight.imageObjectPosition }
              : undefined
          }
          loading="lazy"
          // Below-fold editorial feature — must not compete with hero LCP.
          fetchPriority="low"
        />
      </div>
    );
  }

  return (
    <div
      className={`latest-additions__media latest-additions__media--theme latest-additions__media--${highlight.visualTheme}`}
      role="img"
      aria-label={highlight.imageAlt}
    >
      <div className="latest-additions__motif" aria-hidden="true">
        <DuaDhikrIcon
          iconKey="tasbih"
          className="latest-additions__motif-icon"
        />
        <DuaDhikrIcon
          iconKey="open-quran"
          className="latest-additions__motif-icon latest-additions__motif-icon--secondary"
        />
      </div>
    </div>
  );
}

function HighlightCard({
  highlight,
  newLabel,
  defaultCta,
  areaLabel,
}: {
  highlight: HomepageHighlight;
  newLabel: string;
  defaultCta: string;
  areaLabel: string;
}) {
  const cta = highlight.ctaLabel || defaultCta;
  const department = highlight.contentAreaLabel || areaLabel;

  return (
    <li className="latest-additions__item" data-highlight-card>
      <article className="latest-additions__card">
        <HighlightVisual highlight={highlight} />
        <div className="latest-additions__body">
          <div className="latest-additions__meta">
            <p className="type-eyebrow-v2 latest-additions__eyebrow">
              {highlight.eyebrow}
            </p>
            {highlight.showNewMarker ? (
              <span className="latest-additions__new">{newLabel}</span>
            ) : null}
          </div>
          <p className="latest-additions__area">{department}</p>
          <h3 className="type-section-title latest-additions__title">
            <Link
              href={highlight.href}
              className="latest-additions__title-link"
            >
              {highlight.title}
            </Link>
          </h3>
          <p className="type-body-v2 latest-additions__summary">
            {highlight.summary}
          </p>
          <Link href={highlight.href} className="latest-additions__cta">
            {cta} <span aria-hidden="true">⟶</span>
          </Link>
        </div>
      </article>
    </li>
  );
}

/**
 * Server-rendered homepage “Latest additions” section.
 * Omits entirely when no eligible highlights exist.
 */
export async function HomepageLatestAdditions({
  locale,
}: HomepageLatestAdditionsProps) {
  const highlights = await getHomepageHighlights(locale);
  if (highlights.length === 0) return null;

  const t = await getTranslations({
    locale,
    namespace: "homepage.latestAdditions",
  });
  const countClass =
    highlights.length === 1
      ? "latest-additions--one"
      : highlights.length === 2
        ? "latest-additions--two"
        : "latest-additions--many";

  return (
    <section
      className={`arrival-section latest-additions ${countClass}`}
      aria-labelledby="latest-additions-heading"
    >
      <div className="arrival-container">
        <div className="arrival-grid">
          <div className="arrival-rail">
            <SectionStamp numeral="II" />
          </div>
          <div>
            <div
              className="section-stamp-mobile"
              style={{ marginBlockEnd: "var(--space-6)" }}
            >
              <SectionStamp numeral="II" label={t("stamp")} />
            </div>

            <header className="latest-additions__header">
              <h2 id="latest-additions-heading" className="type-eyebrow-v2">
                {t("heading")}
              </h2>
              <p className="type-standfirst latest-additions__lede">
                {t("lede")}
              </p>
            </header>

            <LatestAdditionsRail
              itemCount={highlights.length}
              previousLabel={t("previous")}
              nextLabel={t("next")}
            >
              {highlights.map((highlight) => (
                <HighlightCard
                  key={highlight.id}
                  highlight={highlight}
                  newLabel={t("newMarker")}
                  defaultCta={t("defaultCta")}
                  areaLabel={t(
                    contentAreaMessageKey(
                      highlight.contentArea,
                    ) as "contentArea.knowledgeLibrary",
                  )}
                />
              ))}
            </LatestAdditionsRail>
          </div>
        </div>
      </div>
    </section>
  );
}
