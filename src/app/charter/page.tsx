import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "The Founding Charter",
};

export default function CharterPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Institution" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              The Founding Charter
            </h1>
            <p className="type-lede measure" style={{ color: "var(--muted)", fontStyle: "italic", margin: "0 0 var(--s6)" }}>
              The constitution, readable.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <article className="measure" style={{ margin: "0 auto" }}>
          <p className="type-body-l" style={{ marginBottom: "var(--s5)" }}>
            Sunnah Remedies exists to revive, preserve and advance the authentic
            tradition of Prophetic Medicine through scholarship, clinical excellence,
            education and carefully curated natural therapeutics, serving humanity
            with integrity, compassion and evidence-informed practice.
          </p>

          <hr className="hairline" style={{ margin: "var(--s6) 0" }} />

          <section id="covenant" style={{ marginBottom: "var(--s6)" }}>
            <h2 className="type-title" style={{ marginBottom: "var(--s4)" }}>
              Our Covenant
            </h2>
            <ul className="type-body" style={{ paddingLeft: "var(--s4)", display: "flex", flexDirection: "column", gap: "var(--s3)" }}>
              <li>Knowledge before products, service before profit, trust before growth.</li>
              <li>Healing is from Allah; the remedy is a means.</li>
              <li>Nothing is attributed that cannot be traced.</li>
              <li>We do not trade in fear.</li>
              <li>Beauty is an obligation, not an ornament.</li>
              <li>The person precedes the protocol; the human precedes the sale.</li>
              <li>Permanence is built by refusal.</li>
            </ul>
          </section>

          <section id="authenticity" style={{ marginBottom: "var(--s6)" }}>
            <h2 className="type-title" style={{ marginBottom: "var(--s4)" }}>
              On Authenticity
            </h2>
            <p className="type-body">
              Every claim about the tradition is assigned one of three grades:
              Established, Reported, or Tried. A claim with no traceable source is
              not published. The institution corrects without contempt and cites its
              sources openly.
            </p>
          </section>

          <section id="sources">
            <h2 className="type-title" style={{ marginBottom: "var(--s4)" }}>
              Sources
            </h2>
            <p className="type-body">
              The institution draws upon the Qurʾan, the ṣaḥīḥ collections, the Sunan
              works, and the classical texts of <em>Tibb al-Nabawī</em>, graded and
              cited according to the editorial standard.
            </p>
          </section>
        </article>
      </Leaf>

      <Leaf variant="grave">
        <blockquote className="measure" style={{ margin: "0 auto", textAlign: "center" }}>
          <p className="type-display-l" style={{ color: "var(--paper)", margin: "0 0 var(--s4)" }}>
            Built to be inherited
          </p>
          <p className="type-body-l" style={{ color: "var(--paper-dim)", fontStyle: "italic", margin: 0 }}>
            The institution is measured not in revenue but in trust.
          </p>
        </blockquote>
      </Leaf>
    </>
  );
}
