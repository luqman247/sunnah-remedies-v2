/**
 * FoundingCovenant — homepage institutional trust section.
 *
 * Placement: after The Departments, before AuthorityBand.
 * Server-rendered for indexable HTML. No reveal animation so
 * essential text is immediately available to assistive tech and
 * prefers-reduced-motion users.
 */

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { SectionStamp } from "./SectionStamp";
import {
  FOUNDING_COVENANT_COMMITMENT_IDS,
  type FoundingCovenantCommitmentId,
} from "@/lib/content/founding-covenant";

interface FoundingCovenantProps {
  locale: AppLocale;
}

export async function FoundingCovenant({ locale }: FoundingCovenantProps) {
  const t = await getTranslations({
    locale,
    namespace: "homepage.foundingCovenant",
  });

  return (
    <section
      className="arrival-section founding-covenant"
      id="founding-covenant"
      aria-labelledby="founding-covenant-heading"
    >
      <div className="arrival-container">
        <div className="arrival-grid">
          <div className="arrival-rail">
            <SectionStamp numeral="§" />
          </div>

          <div className="founding-covenant__inner">
            <div
              className="section-stamp-mobile"
              style={{ marginBlockEnd: "var(--space-6)" }}
            >
              <SectionStamp numeral="§" />
            </div>

            {/* ── Opening ── */}
            <header className="founding-covenant__opening">
              <p className="type-eyebrow-v2 founding-covenant__eyebrow">
                {t("eyebrow")}
              </p>
              <h2
                id="founding-covenant-heading"
                className="type-section-title founding-covenant__title"
              >
                {t("heading")}
              </h2>
              <h3 className="founding-covenant__intro-heading">
                {t("introHeading")}
              </h3>
              <div className="founding-covenant__intro">
                <p className="type-body-v2">{t("intro0")}</p>
                <p className="type-body-v2">{t("intro1")}</p>
                <p className="type-body-v2 founding-covenant__intro-lead">
                  {t("introLead")}
                </p>
              </div>
            </header>

            {/* ── Central covenant triad ── */}
            <blockquote className="founding-covenant__triad">
              <p className="founding-covenant__triad-line">{t("triad0")}</p>
              <p className="founding-covenant__triad-line">{t("triad1")}</p>
              <p className="founding-covenant__triad-line">{t("triad2")}</p>
            </blockquote>

            {/* ── Charter commitments ── */}
            <div
              className="founding-covenant__commitments"
              aria-labelledby="founding-commitments-heading"
            >
              <h3
                id="founding-commitments-heading"
                className="type-eyebrow-v2 founding-covenant__commitments-label"
              >
                {t("commitmentsLabel")}
              </h3>
              <ol className="founding-covenant__register">
                {FOUNDING_COVENANT_COMMITMENT_IDS.map(
                  (id: FoundingCovenantCommitmentId, index) => (
                    <li key={id} className="founding-covenant__item">
                      <span
                        className="founding-covenant__numeral type-folio-v2"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="founding-covenant__item-body">
                        <h4 className="founding-covenant__item-title">
                          {t(`commitments.${id}.title`)}
                        </h4>
                        <p className="type-body-v2 founding-covenant__item-text">
                          {t(`commitments.${id}.body`)}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ol>
            </div>

            {/* ── Closing + CTA ── */}
            <div className="founding-covenant__closing">
              <p className="type-standfirst founding-covenant__closing-text">
                {t("closing")}
              </p>
              <Link href="/charter" className="arrival-enter founding-covenant__cta">
                {t("cta")}
                <span className="arrow" aria-hidden="true">
                  ⟶
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
