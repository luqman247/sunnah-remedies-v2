import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { HospitableEmpty } from "@/components/ui/HospitableEmpty";
import { WayForward } from "@/components/ui/WayForward";
import { getInstitutionSettings } from "@/sanity/lib/fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("press", "/press");
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getInstitutionSettings(locale);
  return (
    <article>
      {/* ═══ Hero ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="press-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            THE PUBLISHING HOUSE
          </p>
          <h1 id="press-heading" className="type-display-l grave-block__line">
            The Press
          </h1>
          <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
            Publishing slowly and permanently — building, edition by edition, a canon of trustworthy work on Prophetic Medicine
          </p>
        </div>
      </section>

      <IsnadRule variant="divider" nodePosition={0.5} />

      {/* ═══ The Imprint ═══ */}
      <section className="leaf" aria-labelledby="imprint-heading">
        <div className="measure-wide">
          <p className="section-label">THE IMPRINT</p>
          <h2 id="imprint-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            A single promise
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body-l" style={{ marginBottom: "var(--s4)" }}>
              Nothing is published that the Institute would be unwilling to defend before a scholar of hadith and a physician sitting side by side
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              The Press exists not to generate content but to build a canon — sourced, graded, dated, attributed, and set with full fidelity — Arabic exact and correctly vocalised, citations traceable, colophon complete
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              What bears the Institute's name is meant to still be trustworthy in a century
            </p>
          </div>
        </div>
      </section>

      {/* ═══ What the Press Publishes ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="publishes-heading">
        <div className="measure-wide">
          <p className="section-label">PUBLISHED WORKS</p>
          <h2 id="publishes-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            The programme
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { numeral: "I", title: "Scholarly Editions", description: "Classical manuscripts from the archive — the tradition's texts presented with full scholarly apparatus" },
              { numeral: "II", title: "Research Publications", description: "The Institute's own research — evidence summaries, systematic reviews, laboratory findings" },
              { numeral: "III", title: "Patient Guides", description: "Plain guidance on the tradition's remedies — honest, cited, with limits clearly stated" },
              { numeral: "IV", title: "Practitioner References", description: "Clinical references for qualified practitioners — protocols, materia medica, case precedent" },
              { numeral: "V", title: "Adhkār and Reading", description: "The devotional and reflective works prepared for the community — the sacred calendar's companions" },
              { numeral: "VI", title: "Fine Artefacts", description: "The beautiful objects — bound editions, ceremonial ijāzāt, the readers and inserts that leave the house as ambassadors" },
            ].map((item) => (
              <div key={item.numeral} className="dept-row" style={{ textDecoration: "none" }}>
                <span className="dept-row__numeral">{item.numeral}</span>
                <div className="dept-row__content">
                  <h3 className="type-title">{item.title}</h3>
                  <p className="type-body dept-row__role">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Digital Artefacts ═══ */}
      <section className="leaf" aria-labelledby="artefacts-heading">
        <div className="measure-wide">
          <p className="section-label">DIGITAL ARTEFACTS</p>
          <h2 id="artefacts-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            The estate's ambassadors
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)", marginBottom: "var(--s5)" }}>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              Fine PDFs, readers, and adhkār — the digital equivalents of the bindery's physical works, held to the same editorial standard as the printed imprint
            </p>
          </div>

          <HospitableEmpty
            heading="Publications forthcoming"
            message="The first works of the Press are being prepared with the care the tradition demands — they will be released when they meet the imprint's standard"
          />
        </div>
      </section>

      <IsnadRule variant="footer" nodePosition={0.5} />

      {/* ═══ Closing ═══ */}
      <section className="leaf" aria-label="Closing">
        <div className="editorial-invitation">
          <p className="editorial-invitation__title type-title">
            The Library holds what the Press publishes
          </p>
          <p className="editorial-invitation__body">
            All published works are available through the Knowledge Library — the Institute's open collection of scholarship, graded and cited
          </p>
          <div className="editorial-invitation__actions">
            <Link href="/knowledge-library" className="quiet-link">
              Enter the Knowledge Library
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Way Forward ═══ */}
      <WayForward
        back={{ label: "The Institute", href: "/institute" }}
        forward={[
          { label: "The Research Centre", href: "/research", description: "Honest evidence, built slowly" },
          { label: "The Knowledge Library", href: "/knowledge-library", description: "Published scholarship and patient guides" },
        ]}
      />
    </article>
  );
}
