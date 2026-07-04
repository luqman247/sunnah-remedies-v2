import { Link } from "@/i18n/navigation";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { SectionStamp } from "@/components/arrival/SectionStamp";
import { Eyebrow } from "@/components/arrival/Eyebrow";

interface DepartmentHeroProps {
  numeral: string;
  eyebrow: string;
  nameAr: string;
  nameEn: string;
  standfirst: string;
  enterLabel?: string;
  enterHref?: string;
}

export function DepartmentHero({
  numeral,
  eyebrow,
  nameAr,
  nameEn,
  standfirst,
  enterLabel,
  enterHref,
}: DepartmentHeroProps) {
  return (
    <section className="dept-section" aria-labelledby="dept-heading">
      <div className="dept-container">
        <div className="dept-grid">
          <div className="dept-rail">
            <SectionStamp numeral={numeral} />
          </div>
          <div>
            <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
              <SectionStamp numeral={numeral} />
            </div>

            <Eyebrow>{eyebrow}</Eyebrow>

            <div style={{ marginBlockStart: "var(--space-8)" }}>
              <p
                className="type-arabic-hero"
                lang="ar"
                dir="rtl"
                style={{ margin: 0 }}
              >
                {nameAr}
              </p>
            </div>

            <IsnadRule variant="divider" nodePosition={0.5} />

            <h1
              id="dept-heading"
              className="type-section-title"
              style={{ margin: 0 }}
            >
              {nameEn}
            </h1>

            <p
              className="type-standfirst"
              style={{
                marginBlockStart: "var(--space-6)",
                maxInlineSize: "60ch",
              }}
            >
              {standfirst}
            </p>

            {enterLabel && enterHref && (
              <div style={{ marginBlockStart: "var(--space-6)" }}>
                <Link href={enterHref} className="dept-enter">
                  {enterLabel}{" "}
                  <span className="arrow" aria-hidden="true">
                    ⟶
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
