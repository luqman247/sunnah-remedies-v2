import { ThresholdHero } from "@/components/threshold/ThresholdHero";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentCard } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function ThresholdPage() {
  return (
    <>
      <ThresholdHero />

      <Leaf>
        <ScrollReveal>
          <div className="measure-wide">
            <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              The institution
            </p>
            <p className="type-body-l measure">
              Sunnah Remedies exists to revive, preserve and advance the authentic
              tradition of Prophetic Medicine through scholarship, clinical excellence,
              education and carefully curated natural therapeutics, serving humanity
              with integrity, compassion and evidence-informed practice.
            </p>
          </div>
        </ScrollReveal>
      </Leaf>

      <Leaf variant="inset">
        <ScrollReveal>
          <div className="measure-wide">
            <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
              Three departments · one house
            </p>
            <div
              style={{
                display: "grid",
                gap: "var(--s4)",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              <DepartmentCard
                numeral="I"
                name="The Apothecary"
                role="Provision · Hand"
                description="Remedies, traced to their source. The ordered cabinet of natural therapeutics, offered with provenance and honest limits."
                href="/the-apothecary"
                linkLabel="Enter the Apothecary"
              />
              <DepartmentCard
                numeral="II"
                name="The Academy"
                role="Transmission · Mind"
                description="The tradition, handed on whole. Structured study of Prophetic Medicine, grounded in scholarship and the discipline of isnād."
                href="/the-academy"
                linkLabel="Begin in the Academy"
              />
              <DepartmentCard
                numeral="III"
                name="Sacred Journeys"
                role="Embodiment · Soul"
                description="The tradition, lived. A journey, not a holiday — contemplative retreats grounded in practice and honest reality."
                href="/sacred-journeys"
                linkLabel="Read on"
              />
            </div>
          </div>
        </ScrollReveal>
      </Leaf>

      <Leaf variant="grave">
        <ScrollReveal>
          <div className="measure" style={{ textAlign: "center", margin: "0 auto" }}>
            <p className="type-display-l" style={{ color: "var(--paper)", margin: "0 0 var(--s4)" }}>
              Knowledge before commerce
            </p>
            <p
              className="type-body-l"
              style={{ color: "var(--paper-dim)", fontStyle: "italic", margin: 0 }}
            >
              We offer a means, and never sell a miracle. Nothing is attributed that
              cannot be traced. Built to be inherited.
            </p>
          </div>
        </ScrollReveal>
      </Leaf>

      <Leaf>
        <ScrollReveal>
          <div className="measure-wide" style={{ textAlign: "center" }}>
            <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              Clinical care
            </p>
            <p className="type-body measure" style={{ margin: "0 auto var(--s4)" }}>
              Consultations are a cross-cutting clinical relationship — the patient
              received as a guest, with limits stated up front.
            </p>
            <a href="/consultations" className="quiet-link">
              Request a consultation
            </a>
          </div>
        </ScrollReveal>
      </Leaf>
    </>
  );
}
