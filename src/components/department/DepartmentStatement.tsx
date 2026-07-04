import { SectionStamp } from "@/components/arrival/SectionStamp";

interface DepartmentStatementProps {
  numeral: string;
  stamp: string;
  standfirst: string;
  body: string[];
  pullQuote?: {
    text: string;
    attribution?: string;
    source?: string;
  };
}

export function DepartmentStatement({
  numeral,
  stamp,
  standfirst,
  body,
  pullQuote,
}: DepartmentStatementProps) {
  return (
    <section
      className="dept-section dept-band-deep"
      aria-labelledby={`statement-${numeral}`}
    >
      <div className="dept-container">
        <div className="dept-grid">
          <div className="dept-rail">
            <SectionStamp numeral={numeral} />
          </div>
          <div className="dept-measure">
            <div
              className="section-stamp-mobile"
              style={{ marginBlockEnd: "var(--space-6)" }}
            >
              <SectionStamp numeral={numeral} label={stamp} />
            </div>

            <h2
              id={`statement-${numeral}`}
              className="type-eyebrow-v2"
              style={{
                color: "var(--paper-on-deep)",
                marginBlockEnd: "var(--space-8)",
              }}
            >
              {stamp}
            </h2>

            <p
              className="type-standfirst"
              style={{ marginBlockEnd: "var(--space-8)" }}
            >
              {standfirst}
            </p>

            {body.map((paragraph, i) => (
              <p
                key={i}
                className="type-body-v2"
                style={{ marginBlockEnd: "var(--space-5)" }}
              >
                {paragraph}
              </p>
            ))}

            {pullQuote && (
              <div style={{ marginBlockStart: "var(--space-10)" }}>
                <blockquote className="dept-pullquote">
                  <p className="type-pullquote dept-pullquote__text">
                    {pullQuote.text}
                  </p>
                  {(pullQuote.attribution || pullQuote.source) && (
                    <footer className="dept-pullquote__attribution">
                      {pullQuote.attribution && (
                        <span>{pullQuote.attribution}</span>
                      )}
                      {pullQuote.attribution && pullQuote.source && (
                        <span> · </span>
                      )}
                      {pullQuote.source && (
                        <cite style={{ fontStyle: "normal" }}>
                          {pullQuote.source}
                        </cite>
                      )}
                    </footer>
                  )}
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
