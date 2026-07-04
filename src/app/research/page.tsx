import type { Metadata } from "next";
import Link from "next/link";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { WayForward } from "@/components/ui/WayForward";
import { getInstitutionSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Research Centre",
  description:
    "The Institute's bridge to modern medicine — testing Prophetic Medicine honestly against the best available evidence, neither flattering it nor betraying it.",
  openGraph: {
    title: "Research Centre · Sunnah Remedies",
    description:
      "Honest evidence, stated uncertainty, acknowledged divergence.",
    type: "website",
    siteName: "Sunnah Remedies",
  },
};

export default async function ResearchPage() {
  await getInstitutionSettings();
  return (
    <article>
      {/* ═══ Hero ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="research-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            THE RESEARCH CENTRE
          </p>
          <h1 id="research-heading" className="type-display-l grave-block__line">
            Honest evidence, built slowly
          </h1>
          <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
            Testing the tradition against the best available evidence — neither flattering it with credulous pseudo-science nor betraying it with reflexive dismissal
          </p>
        </div>
      </section>

      <IsnadRule variant="divider" nodePosition={0.5} />

      {/* ═══ Purpose ═══ */}
      <section className="leaf" aria-labelledby="purpose-heading">
        <div className="measure-wide">
          <p className="section-label">PURPOSE</p>
          <h2 id="purpose-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Building the evidence base that does not yet exist
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body-l" style={{ marginBottom: "var(--s4)" }}>
              The Research Centre exists to build, honestly and slowly, the evidence base for Prophetic Medicine that the world currently lacks
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              Its ambition is that, over decades, the serious study of Prophetic Medicine acquires the rigour and respect it has never had — and that the Institute is known as the place that gave it that rigour, honestly, even when honesty was inconvenient
            </p>
          </div>
        </div>
      </section>

      {/* ═══ The Disciplines ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="disciplines-heading">
        <div className="measure-wide">
          <p className="section-label">DISCIPLINES</p>
          <h2 id="disciplines-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            Three areas of rigorous enquiry
          </h2>
          <div className="trust-grid" style={{ gridTemplateColumns: "1fr" }}>
            {[
              {
                numeral: "I",
                title: "Laboratory Analysis",
                text: "Quality assurance of the materia medica — the science behind the Apothecary's quality certificates and remedy isnād. Analysis of constituents and effects of the tradition's preparations",
              },
              {
                numeral: "II",
                title: "Evidence Office",
                text: "Clinical and systematic review — curating modern evidence honestly, stating quality, uncertainty, and the places where tradition and science diverge. This feeds directly into the Library, Academy, and Clinic",
              },
              {
                numeral: "III",
                title: "Collaborative Research",
                text: "Partnerships with universities, hospitals, and research bodies. Visiting fellows and published work through the Press to the highest standard",
              },
            ].map((item) => (
              <div key={item.numeral} className="trust-grid__item">
                <p className="trust-grid__numeral">{item.numeral}</p>
                <h3 className="trust-grid__title type-title">{item.title}</h3>
                <p className="trust-grid__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ The Absolute Rule ═══ */}
      <section className="leaf" aria-labelledby="rule-heading">
        <div className="measure-wide">
          <div className="pull-quote" style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="pull-quote__text">
              The tradition is never oversold, and the evidence is never cherry-picked to flatter it
            </p>
            <p className="pull-quote__attribution">The governing principle of the Research Centre</p>
          </div>
        </div>
      </section>

      {/* ═══ Evidence Grading ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="grading-heading">
        <div className="measure-wide">
          <p className="section-label">EVIDENCE STANDARD</p>
          <h2 id="grading-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Grading with transparency
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
              Every evidence summary published by the Institute carries an honest grade — stating the quality of evidence, the degree of uncertainty, and where tradition and science diverge
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              The Research Centre holds the line the whole Institution depends on: the intellectual honesty that makes it trustworthy to physicians, scholars, and regulators alike
            </p>
          </div>
        </div>
      </section>

      <IsnadRule variant="footer" nodePosition={0.5} />

      {/* ═══ Closing ═══ */}
      <section className="leaf" aria-label="Closing">
        <div className="editorial-invitation">
          <p className="editorial-invitation__title type-title">
            Research holdings
          </p>
          <p className="editorial-invitation__body">
            Evidence summaries and research notes are published in the Knowledge Library as they meet the standard for release
          </p>
          <div className="editorial-invitation__actions">
            <Link href="/knowledge-library" className="quiet-link">
              Browse the Library
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Way Forward ═══ */}
      <WayForward
        back={{ label: "The Institute", href: "/institute" }}
        forward={[
          { label: "The Press", href: "/press", description: "The publishing house and imprint" },
          { label: "The Knowledge Library", href: "/knowledge-library", description: "Published evidence and scholarship" },
        ]}
      />
    </article>
  );
}
