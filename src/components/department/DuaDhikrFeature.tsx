import { getPathname } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrCollectionPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { DuaDhikrIcon } from "@/components/dua-dhikr/icons";
import { SectionStamp } from "@/components/arrival/SectionStamp";
import {
  resolveDuaDhikrFeatureTileTitle,
  selectDuaDhikrFeaturePreview,
} from "@/components/department/dua-dhikr-feature-utils";
import NextLink from "next/link";

interface DuaDhikrFeatureProps {
  locale: AppLocale;
  numeral: string;
  publishedCollections: DuaDhikrCollectionPublic[];
}

/**
 * Editorial Duʿā & Dhikr destination for the Knowledge Library hub.
 * Server-rendered; collection previews are non-interactive.
 */
export async function DuaDhikrFeature({
  locale,
  numeral,
  publishedCollections,
}: DuaDhikrFeatureProps) {
  const t = await getTranslations({ locale, namespace: "duaDhikr.feature" });
  const preview = selectDuaDhikrFeaturePreview(publishedCollections);
  const tiles = preview.map((collection) => ({
    collection,
    title: resolveDuaDhikrFeatureTileTitle(collection, locale),
  }));
  const showTitles = tiles.some((tile) => Boolean(tile.title));
  const ctaHref = getPathname({
    locale,
    href: "/knowledge-library/dua-dhikr",
  });

  return (
    <section
      className="dept-section dept-dua-feature-section"
      aria-labelledby="dept-dua-dhikr-heading"
    >
      <div className="dept-container">
        <div className="dept-grid">
          <div className="dept-rail">
            <SectionStamp numeral={numeral} />
          </div>
          <div>
            <div
              className="section-stamp-mobile"
              style={{ marginBlockEnd: "var(--space-6)" }}
            >
              <SectionStamp numeral={numeral} label={t("stamp")} />
            </div>

            <div className="dept-dua-feature">
              <div className="dept-dua-feature__editorial">
                <p className="type-eyebrow-v2 dept-dua-feature__eyebrow">
                  {t("eyebrow")}
                </p>
                <h2
                  id="dept-dua-dhikr-heading"
                  className="type-section-title dept-dua-feature__heading"
                >
                  {t("heading")}
                </h2>
                <p className="type-standfirst dept-dua-feature__lede">
                  {t("description")}
                </p>
                <p className="type-body-v2 dept-dua-feature__support">
                  {t("supporting")}
                </p>
                <div className="dept-dua-feature__cta">
                  <NextLink
                    href={ctaHref}
                    className="dept-enter dept-dua-feature__link"
                  >
                    {t("cta")}{" "}
                    <span className="arrow" aria-hidden="true">
                      ⟶
                    </span>
                  </NextLink>
                </div>
              </div>

              <div className="dept-dua-feature__visual" aria-hidden="true">
                {tiles.length > 0 ? (
                  <ul
                    className="dept-dua-feature__mosaic"
                    data-count={tiles.length}
                    data-labels={showTitles ? "text" : "icons"}
                  >
                    {tiles.map(({ collection, title }) => (
                      <li
                        key={collection.slug}
                        className="dept-dua-feature__tile"
                      >
                        <DuaDhikrIcon
                          iconKey={collection.iconKey}
                          size={showTitles ? 32 : 40}
                          className="dept-dua-feature__icon"
                        />
                        {title ? (
                          <span className="dept-dua-feature__tile-title">
                            {title}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="dept-dua-feature__motif">
                    <p
                      className="dept-dua-feature__motif-ar"
                      lang="ar"
                      dir="rtl"
                    >
                      ذِكْر
                    </p>
                    <p className="dept-dua-feature__motif-caption">
                      {t("motifCaption")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
