/**
 * AuthorityBand — restrained institutional credibility (Ch. 9.6).
 *
 * Graceful-empty rule: every value is nullable. Dormant items show "———".
 * If fewer than 2 values are set, the entire section does not render.
 */

import { getTranslations } from "next-intl/server";
import { SectionStamp } from "./SectionStamp";

interface AuthorityItem {
  label: string;
  value: string | null;
  note?: string;
}

interface AuthorityBandProps {
  items: AuthorityItem[];
}

export async function AuthorityBand({ items }: AuthorityBandProps) {
  const t = await getTranslations("arrival");
  const setCount = items.filter(i => i.value !== null).length;
  if (setCount < 2) return null;

  return (
    <section className="arrival-section authority-band" aria-labelledby="authority-heading">
      <div className="arrival-container">
        <div className="arrival-grid">
          <div className="arrival-rail">
            <SectionStamp numeral="IV" />
          </div>
          <div>
            <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
              <SectionStamp numeral="IV" label={t("authorityStamp")} />
            </div>
            <h2 id="authority-heading" className="sr-only">{t("authorityHeading")}</h2>
            <dl className="authority-dl">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={`authority-item ${item.value === null ? "authority-item--dormant" : ""}`}
                >
                  <dt className="type-eyebrow-v2">{item.label}</dt>
                  <dd
                    className="type-section-title"
                    style={{ margin: 0 }}
                  >
                    {item.value !== null ? (
                      item.value
                    ) : (
                      <span aria-hidden="true" style={{ color: "var(--ink-soft)" }}>———</span>
                    )}
                    {item.value === null && (
                      <span className="sr-only">{t("figurePending")}</span>
                    )}
                  </dd>
                  {item.note && (
                    <span className="type-small-v2" style={{ color: "var(--ink-soft)" }}>
                      {item.note}
                    </span>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
